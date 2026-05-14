require('dotenv').config();
const express = require('express');
const https   = require('https');
const path    = require('path');
const fs      = require('fs');
const crypto  = require('crypto');
const selfsigned = require('selfsigned');
const fetch   = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── SSL cert — use office-addin-dev-certs (trusted by PowerPoint desktop) ──
const DEV_CERTS_DIR = path.join(process.env.USERPROFILE || process.env.HOME, '.office-addin-dev-certs');
let pems;
try {
  pems = {
    cert:    fs.readFileSync(path.join(DEV_CERTS_DIR, 'localhost.crt'), 'utf8'),
    private: fs.readFileSync(path.join(DEV_CERTS_DIR, 'localhost.key'), 'utf8'),
  };
} catch {
  // Fallback: generate a self-signed cert in memory
  const attrs = [{ name: 'commonName', value: 'localhost' }];
  const gen = selfsigned.generate(attrs, { days: 365 });
  pems = { cert: gen.cert, private: gen.private };
  console.warn('[server] office-addin-dev-certs not found — using ephemeral self-signed cert.');
}

// ── Data dir for chat persistence ─────────────────────────────────────────────
const DATA_DIR    = path.join(__dirname, 'data');
const CHATS_FILE  = path.join(DATA_DIR, 'chats.json');
const WEB_LOG     = path.join(DATA_DIR, 'web-search-log.json');
fs.mkdirSync(DATA_DIR, { recursive: true });
function readChats() {
  try { return JSON.parse(fs.readFileSync(CHATS_FILE, 'utf8')); } catch { return {}; }
}
function writeChats(chats) { fs.writeFileSync(CHATS_FILE, JSON.stringify(chats, null, 2), 'utf8'); }

// ── Asset pack dir ────────────────────────────────────────────────────────────
const ASSETS_DIR  = path.join(__dirname, 'assets');
const PACK_DIR    = path.join(ASSETS_DIR, 'pack');
const MANIFEST_FILE = path.join(PACK_DIR, 'manifest.json');
fs.mkdirSync(PACK_DIR, { recursive: true });

// ── CONFIG ────────────────────────────────────────────────────────────────────
const MACBOOK_IP     = '192.168.1.206';
const MLX_PORT       = '8080';
const OLLAMA_PORT    = '11434';

const USE_OPENROUTER = true;
const USE_MLX        = false;
const USE_GROQ       = false;

const OPENROUTER_KEY = process.env.OPENROUTER_KEY;
const GROQ_KEY       = process.env.GROQ_KEY;
const BRAVE_KEY      = process.env.BRAVE_KEY;

const DEFAULT_MODEL = USE_OPENROUTER
  ? 'meta-llama/llama-3.3-70b-instruct'
  : USE_MLX
    ? 'mlx-community/Qwen3-32B-4bit'
    : 'qwen3:32b';
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an AI assistant built directly into Microsoft PowerPoint. You have complete read/write access to the entire deck.

CRITICAL RULE — HOW YOU MAKE CHANGES:
When the user asks you to do ANYTHING to the deck, you MUST output a CODE_JS block containing valid Office JavaScript API code. This code runs inside PowerPoint.run(async (context) => { ... }). You have access to "context", "presentation" (= context.presentation), the full "PowerPoint" namespace, and these injected helpers: addSlide, addTextBox, applyTheme, recolorDeck, addSpeakerNote, getCurrentSlide, getSlideByIndex, findShapeByName, listSlides, insertImage, BUILT_IN_THEMES.

FORMAT:
CODE_JS::
// your Office JS code here
::END_CODE

RULES FOR YOUR CODE:
- You write the BODY of an async function that receives (context, presentation, PowerPoint, addSlide, addTextBox, applyTheme, recolorDeck, addSpeakerNote, getCurrentSlide, getSlideByIndex, findShapeByName, listSlides, insertImage, BUILT_IN_THEMES).
- Always call "await context.sync();" after .load() and after writes.
- Use ApiVersion 1.1–1.8 only (PowerPoint Online compatible).
- NEVER use console.log. Throw errors with throw new Error("...").

NEVER USE THESE — they DO NOT EXIST in PowerPoint Office.js:
- presentation.theme.* (no theme API — use applyTheme/recolorDeck helpers instead)
- slide.background.image = ...
- slide.animations.*, slide.transition.* (no animation/transition API)
- presentation.exportToPdf(), presentation.export*() (no export API)
- slide.charts.add() (no chart creation API on slides)
- shape.smartArt.* (no SmartArt API)
- presentation.runSlideShow() (no slideshow control)
- presentation.slides.add() (does not exist — use addSlide helper)
- slides.move(), slide.move() (no reorder API)

HOW TO ADD A NEW SLIDE — ALWAYS use the addSlide helper:
  await addSlide(layout, title, body, notes);
    layout: "title" | "title-content" | "two-content" | "blank" | "section"
    title:  string
    body:   string (use \\n for line breaks; bullets auto-applied)
    notes:  optional string for speaker notes

HOW TO EDIT EXISTING SLIDES — use the direct API:
  shape.textFrame.textRange.text = "New text";
  shape.textFrame.textRange.font.bold = true;
  shape.textFrame.textRange.font.color = "#FF0000";
  shape.textFrame.textRange.font.size = 24;
  shape.textFrame.textRange.font.name = "Inter";
  shape.fill.setSolidColor("#003366");
  shape.lineFormat.color = "#000000";
  shape.left = 100; shape.top = 50; shape.width = 400; shape.height = 200;
  shape.delete();
  slide.delete();

HELPER FUNCTIONS:

  addSlide(layout, title, body?, notes?)
    Inserts a new slide at end. body uses \\n for bullet rows.
    Example: await addSlide("title-content", "Q4 Highlights", "Revenue up 23%\\nNew customers: 142");

  addTextBox(slideIndex, text, opts?)
    opts: { left, top, width, height, fontSize, bold, color }
    Example: await addTextBox(2, "DRAFT", { left: 50, top: 50, color: "#FF0000", bold: true });

  applyTheme(themeName)
    themeName ∈ "corporate-blue", "modern-mono", "warm-sunset", "midnight",
    "pastel", "high-contrast", "terracotta", "forest".
    Walks every slide & shape, reassigns fill, font color, font name.

  recolorDeck(palette)
    palette = { primary, secondary, accent, bg, text } — any 5 hex colors.
    Returns a summary string ("Recolored N of M shapes; X skipped.")

  addSpeakerNote(slideIndex, text, append=true)
    slideIndex = -1 means current slide.

  getCurrentSlide()  → returns the slide the user has selected (throws if none).
  getSlideByIndex(i) → 0-based; supports negative (-1 = last).
  findShapeByName(slide, name) → shape with matching .name (throws if not found).
  listSlides() → array of {index, id, title, layout}.

  insertImage(slideIndex, category, keywordOrTags, position?)
    Picks an image from the local asset pack and inserts it.
    category ∈ injected ASSET_PACK_READY categories (see below).
    keywordOrTags: string OR array of tag strings.
    position: { left, top, width, height } in points; defaults to center area.
    Example: await insertImage(2, "finance", ["growth","chart"], { left:400, top:120, width:320, height:240 });

EXAMPLES:

User: "make slide 2's title bold and 48pt"
Response:
Bolding slide 2's title at 48pt.
CODE_JS::
const slide = await getSlideByIndex(1);
slide.shapes.load("items/placeholderFormat/type, items/textFrame/textRange");
await context.sync();
const title = slide.shapes.items.find(s => s.placeholderFormat.type === "title");
if (!title) throw new Error("No title shape on slide 2.");
title.textFrame.textRange.font.bold = true;
title.textFrame.textRange.font.size = 48;
await context.sync();
::END_CODE

User: "add a slide titled Conclusion with bullets Recap, Next Steps, Q&A"
Response:
Adding the Conclusion slide.
CODE_JS::
await addSlide("title-content", "Conclusion", "Recap\\nNext Steps\\nQ&A");
::END_CODE

User: "apply a corporate blue theme"
Response:
Applying the corporate-blue theme.
CODE_JS::
await applyTheme("corporate-blue");
::END_CODE

User: "recolor every slide using #003366 as primary and #F0F4F8 as bg"
Response:
Recoloring the deck.
CODE_JS::
await recolorDeck({ primary:"#003366", secondary:"#0066CC", accent:"#FFA500", bg:"#F0F4F8", text:"#1A1A1A" });
::END_CODE

User: "write speaker notes for slide 3 explaining the chart"
Response:
Writing speaker notes for slide 3.
CODE_JS::
await addSpeakerNote(2, "This chart compares Q3 vs Q4 revenue. Highlight the 23% jump in the SaaS line, then pause for questions before transitioning to the product roadmap.");
::END_CODE

User: "delete slide 5"
Response:
Deleting slide 5.
CODE_JS::
const s = await getSlideByIndex(4);
s.delete();
await context.sync();
::END_CODE

User: "make all body text on every slide use Inter at 18pt"
Response:
Setting every body shape to Inter 18pt.
CODE_JS::
presentation.slides.load("items/id");
await context.sync();
for (const slide of presentation.slides.items) {
  slide.shapes.load("items/textFrame, items/placeholderFormat/type");
  await context.sync();
  for (const shape of slide.shapes.items) {
    try {
      if (shape.placeholderFormat.type === "title") continue;
      shape.textFrame.textRange.font.name = "Inter";
      shape.textFrame.textRange.font.size = 18;
    } catch (e) {}
  }
  await context.sync();
}
::END_CODE

User: "add CONFIDENTIAL watermark to every slide"
Response:
Adding watermark to every slide.
CODE_JS::
presentation.slides.load("items/id");
await context.sync();
const n = presentation.slides.items.length;
for (let i = 0; i < n; i++) {
  await addTextBox(i, "CONFIDENTIAL", { left: 350, top: 20, width: 220, height: 40, fontSize: 14, bold: true, color: "#888888" });
}
::END_CODE

User: "add a finance growth chart image to slide 2"
Response:
Inserting a finance image on slide 2.
CODE_JS::
await insertImage(1, "finance", ["growth","chart"], { left: 400, top: 120, width: 320, height: 240 });
::END_CODE

READING DATA — only "return" when the user wants to KNOW something:

User: "how many slides do I have?"
Response:
Counting slides.
CODE_JS::
presentation.slides.load("items/id");
await context.sync();
return "You have " + presentation.slides.items.length + " slides.";
::END_CODE

User: "what's the title of slide 3?"
Response:
Reading slide 3's title.
CODE_JS::
const slide = await getSlideByIndex(2);
slide.shapes.load("items/placeholderFormat/type, items/textFrame/textRange/text");
await context.sync();
const t = slide.shapes.items.find(s => s.placeholderFormat.type === "title");
return t ? "Slide 3 title: " + t.textFrame.textRange.text : "Slide 3 has no title.";
::END_CODE

IMAGE INSERTION RULES:
- NEVER generate, hallucinate, or describe AI-generated images.
- NEVER call addImage() with a remote URL. The ONLY sanctioned image path is insertImage(...).
- The available pack categories will be injected at runtime as <ASSET_PACK_READY categories="..."/>.
  Pick the most specific category and pass 2–4 keyword tags.
- If <ASSET_PACK_MISSING/> is present, do NOT call insertImage. Instead insert a placeholder text box reading "[image: <description>]" and tell the user to download the asset pack from Settings.

WEB ACCESS RULES:
You do NOT have direct internet access. You cannot fetch live prices, weather, news, sports scores, or anything that changes after your training cutoff.

The current web-search mode will be injected as <WEB_SEARCH_MODE value="off|on|disabled"/>:

- mode=off (DEFAULT — ASK each time):
    If a request needs live real-world data, emit ONE block on its own lines exactly:
        NEEDS_WEB_SEARCH::{"query": "<best search query>", "reason": "<one short sentence>"}::END
    Then STOP. Do NOT also emit CODE_JS in the same turn. Wait for the host to provide results.

- mode=on (ALWAYS-ON):
    The host will run searches automatically. Proceed as if you have web access. If you need data, emit the same NEEDS_WEB_SEARCH block — the host will silently intercept and re-prompt with results.

- mode=disabled (NEVER):
    Do NOT emit NEEDS_WEB_SEARCH. Tell the user clearly: "I can't get this without web access, and you have web search disabled in Settings. Enable it in Settings → Web search if you'd like me to look this up."

NEVER make up current values, prices, dates, or news under any circumstance.
When you DO receive <WEB_SEARCH_RESULTS query="..."> in the conversation, use those facts in your reply and continue normally (with CODE_JS if needed).

OTHER RULES:
- Be concise. One short sentence explaining what you're doing, then the CODE_JS block.
- If asked for an unsupported feature (animation/transition/export/chart/SmartArt/slideshow/reorder), respond cleanly: "PowerPoint Office.js doesn't expose <X>. As a workaround you can <Y>." and DO NOT emit fabricated CODE_JS.
- For VBA macros: write complete code in triple backtick vba blocks and tell the user to press Alt+F11.
- Only skip CODE_JS if the user is purely asking a question with no changes needed.`
+ (DEFAULT_MODEL.toLowerCase().includes('qwen') ? '\n/no_think' : '')
+ (() => {
    try {
      const imp = fs.readFileSync(path.join(__dirname, 'eval/improvements.txt'), 'utf8').trim();
      return imp ? '\n\nADDITIONAL RULES FROM EVAL:\n' + imp : '';
    } catch { return ''; }
  })();

// ── Call the AI ───────────────────────────────────────────────────────────────
async function callAI(messages, maxTokens = 4096, model = null, useOllama = false, useGroq = false, apiKey = null, groqKey = null) {
  const effectiveModel = model || DEFAULT_MODEL;
  const orKey  = apiKey  || OPENROUTER_KEY;
  const gKey   = groqKey || GROQ_KEY;

  if (useOllama) {
    const res = await fetch(`http://localhost:${OLLAMA_PORT}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: effectiveModel, messages, stream: false,
        options: { num_ctx: 4096, temperature: 0.15, top_p: 0.9, repeat_penalty: 1.1 }
      })
    });
    const data = await res.json();
    return { text: data.message.content, usage: null };
  }

  if (useGroq || USE_GROQ) {
    const groqModel = (useGroq && model) ? model : 'llama-3.3-70b-versatile';
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${gKey}` },
      body: JSON.stringify({
        model: groqModel, messages, max_tokens: maxTokens, temperature: 0.15, top_p: 0.9
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return { text: data.choices[0].message.content, usage: data.usage || null };
  }

  if (USE_OPENROUTER || orKey) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${orKey}`,
        'HTTP-Referer': 'https://localhost:3000',
        'X-Title': 'PowerPoint AI Assistant'
      },
      body: JSON.stringify({
        model: effectiveModel, messages, max_tokens: maxTokens, temperature: 0.15, top_p: 0.9
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(JSON.stringify(data.error));
    return { text: data.choices[0].message.content, usage: data.usage || null };
  }

  if (USE_MLX) {
    const res = await fetch(`http://${MACBOOK_IP}:${MLX_PORT}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: effectiveModel, messages, max_tokens: maxTokens, temperature: 0.15, top_p: 0.9
      })
    });
    const data = await res.json();
    return { text: data.choices[0].message.content, usage: data.usage || null };
  }

  // Fallback: Ollama on MacBook
  const res = await fetch(`http://${MACBOOK_IP}:${OLLAMA_PORT}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen3:32b', messages, stream: false,
      options: { num_ctx: 4096, temperature: 0.15, top_p: 0.9, repeat_penalty: 1.1 }
    })
  });
  const data = await res.json();
  return { text: data.message.content, usage: null };
}

// ── Parse code from response ─────────────────────────────────────────────────
function parseResponse(text) {
  let code = null;
  const codeMatch = text.match(/CODE_JS::([\s\S]*?)::END_CODE/);
  if (codeMatch) code = codeMatch[1].trim();

  const cleaned = text
    .replace(/CODE_JS::[\s\S]*?::END_CODE/g, '')
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .trim();

  return { code, cleaned };
}

function parseWebSearchRequest(text) {
  const m = text.match(/NEEDS_WEB_SEARCH::([\s\S]*?)::END/);
  if (!m) return null;
  try { return JSON.parse(m[1].trim()); } catch { return null; }
}

// ── Detect if model forgot to include code for an action request ─────────────
function isQuestion(userMessage) {
  const s = userMessage.toLowerCase().trim();
  const dataQueryWords = ['how many slides', 'how many shapes', 'how long', 'count', 'list all', 'find all', 'which slide', 'what does slide', 'what is in slide', 'what is on slide', 'what color', 'what font'];
  if (dataQueryWords.some(q => s.includes(q))) return false;
  const questionStarters = ['why ', 'explain', 'tell me', 'describe', 'can you explain', 'can you tell', 'what does', 'what is a ', 'what are the', 'how do i', 'how does', 'is there ', 'are there ', 'does powerpoint', 'what is a smartart', 'what is a master slide', 'what is a placeholder'];
  return questionStarters.some(q => s.startsWith(q));
}

function modelForgotCode(responseText, userMessage) {
  if (responseText.includes('CODE_JS::')) return false;
  if (responseText.includes('NEEDS_WEB_SEARCH::')) return false;
  if (/doesn't expose|does not expose|not supported|no JS API/i.test(responseText)) return false;
  return !isQuestion(userMessage);
}

// ── Chat history endpoints ────────────────────────────────────────────────────
app.get('/api/chats', (req, res) => {
  const chats = readChats();
  const list = Object.values(chats)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .map(({ id, title, updatedAt, messageCount, totalTokens }) => ({ id, title, updatedAt, messageCount, totalTokens }));
  res.json(list);
});

app.post('/api/chats', (req, res) => {
  const chats = readChats();
  const id = uuidv4();
  const now = new Date().toISOString();
  chats[id] = { id, title: req.body.title || 'New Chat', messages: req.body.messages || [], summary: null, totalTokens: 0, messageCount: 0, createdAt: now, updatedAt: now };
  writeChats(chats);
  res.json(chats[id]);
});

app.get('/api/chats/:id', (req, res) => {
  const chats = readChats();
  const chat = chats[req.params.id];
  if (!chat) return res.status(404).json({ error: 'Not found' });
  res.json(chat);
});

app.patch('/api/chats/:id', (req, res) => {
  const chats = readChats();
  const chat = chats[req.params.id];
  if (!chat) return res.status(404).json({ error: 'Not found' });
  const { title, messages, summary, totalTokens } = req.body;
  if (title !== undefined) chat.title = title;
  if (messages !== undefined) { chat.messages = messages; chat.messageCount = messages.length; }
  if (summary !== undefined) chat.summary = summary;
  if (totalTokens !== undefined) chat.totalTokens = totalTokens;
  chat.updatedAt = new Date().toISOString();
  writeChats(chats);
  res.json(chat);
});

app.delete('/api/chats/:id', (req, res) => {
  const chats = readChats();
  delete chats[req.params.id];
  writeChats(chats);
  res.json({ ok: true });
});

// ── OpenRouter model catalog (cached 1 h) ─────────────────────────────────────
let catalogCache = null, catalogCacheAt = 0;
app.get('/api/models/catalog', async (req, res) => {
  if (catalogCache && Date.now() - catalogCacheAt < 3600_000) return res.json(catalogCache);
  try {
    const r = await fetch('https://openrouter.ai/api/v1/models', {
      headers: OPENROUTER_KEY ? { 'Authorization': `Bearer ${OPENROUTER_KEY}` } : {}
    });
    const data = await r.json();
    catalogCache = (data.data || []).map(m => ({
      id:      m.id,
      name:    m.name || m.id,
      in:      m.pricing?.prompt     ? Math.round(parseFloat(m.pricing.prompt)     * 1e6 * 100) / 100 : 0,
      out:     m.pricing?.completion ? Math.round(parseFloat(m.pricing.completion) * 1e6 * 100) / 100 : 0,
      context: m.context_length || null,
    })).sort((a, b) => a.name.localeCompare(b.name));
    catalogCacheAt = Date.now();
    res.json(catalogCache);
  } catch (err) {
    res.status(500).json({ error: 'Catalog fetch failed' });
  }
});

// ── Local model detection (Ollama) ────────────────────────────────────────────
app.get('/api/models/local', async (req, res) => {
  try {
    const r = await fetch(`http://localhost:${OLLAMA_PORT}/api/tags`, { timeout: 2000 });
    const data = await r.json();
    const models = (data.models || []).map(m => ({ id: m.name, name: m.name }));
    res.json(models);
  } catch {
    res.json([]);
  }
});

// ── Model recommendation ─────────────────────────────────────────────────────
app.post('/api/recommend-model', async (req, res) => {
  const { specs, modelUsage, preferences, availableModels, apiKey } = req.body;
  const orKey = apiKey || OPENROUTER_KEY;
  if (!orKey) return res.status(400).json({ error: 'No OpenRouter API key configured.' });

  const modelList = (availableModels || []).map(m =>
    `${m.id} | ${m.name} | $${m.in}/$${m.out} per 1M tok${(m.tags||[]).includes('free') ? ' [FREE]' : ''}`
  ).join('\n');
  const usageStr = Object.entries(modelUsage || {}).sort((a,b)=>b[1]-a[1]).slice(0,5)
    .map(([id,n])=>`${id}: used ${n}x`).join('\n') || 'No history yet';

  try {
    const { text } = await callAI([
      { role: 'system', content: 'You are an expert in AI model selection. Respond ONLY with valid JSON: {"modelId":"exact-id","reason":"2-3 sentence explanation"}. No markdown. No extra text.' },
      { role: 'user', content: `A user runs a PowerPoint AI Assistant. Recommend the single best model.

PC SPECS:
- CPU cores: ${specs?.cores || 'unknown'}
- RAM: ${specs?.memory || 'unknown'} GB
- GPU: ${specs?.gpu || 'unknown'}
- GPU Vendor: ${specs?.gpuVendor || 'unknown'}
- Platform: ${specs?.platform || 'unknown'}

USAGE HISTORY (most used first):
${usageStr}

USER PREFERENCES: ${preferences || 'None stated'}

AVAILABLE MODELS (id | name | price in/out per 1M):
${modelList}

Consider: code generation quality for PowerPoint tasks (slide manipulation, theming, speaker notes, deck generation), cost, speed. GPU/RAM only matter for local Ollama models.

Respond with ONLY this JSON: {"modelId":"exact-id-from-list","reason":"2-3 sentences explaining why"}` }
    ], 400, 'meta-llama/llama-3.3-70b-instruct', false, false, orKey, null);

    const clean = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    let parsed = null;
    try { parsed = JSON.parse(clean); } catch {}
    if (!parsed) {
      const match = clean.match(/\{[\s\S]*\}/);
      if (match) try { parsed = JSON.parse(match[0]); } catch {}
    }
    if (parsed?.modelId) {
      console.log('[recommend] →', parsed.modelId);
      return res.json(parsed);
    }
    res.json({ modelId: null, reason: 'Could not parse recommendation.' });
  } catch (err) {
    console.error('[recommend] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Feedback endpoint ────────────────────────────────────────────────────────
app.post('/api/feedback', (req, res) => {
  const entry = req.body;
  const filePath = path.join(__dirname, 'feedback.jsonl');
  fs.appendFileSync(filePath, JSON.stringify(entry) + '\n');
  console.log('[feedback] Saved entry for prompt:', entry.prompt?.slice(0, 60));
  res.json({ ok: true });
});

// ── Title generation endpoint ────────────────────────────────────────────────
app.post('/api/title', async (req, res) => {
  const { userMsg, aiReply, apiKey } = req.body;
  try {
    const { text } = await callAI([
      { role: 'system', content: 'Write a chat title: 4-6 words, no quotes, no punctuation at the end. Summarise what the user asked.' },
      { role: 'user', content: `User: ${String(userMsg).slice(0, 200)}\nAssistant: ${String(aiReply).slice(0, 200)}` }
    ], 30, null, false, false, apiKey || null);
    const title = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim().replace(/^["'`]|["'`]$/g, '').slice(0, 60);
    res.json({ title });
  } catch { res.status(500).json({ error: 'Title generation failed' }); }
});

// ── Summarize endpoint ───────────────────────────────────────────────────────
app.post('/api/summarize', async (req, res) => {
  const { messages, previousSummary, apiKey } = req.body;
  try {
    const prevContext = previousSummary ? `Previous context (already summarised):\n${previousSummary}\n\nNew messages to incorporate:\n` : 'Summarise:\n';
    const { text } = await callAI([
      {
        role: 'system',
        content: 'You summarise PowerPoint assistant conversations. Write one short paragraph (max 100 words) covering: how many slides, what each slide contains, what theme/colors were applied, what changes were made, key shape names or slide IDs. If given a previous summary, merge it with the new messages into one updated summary. Be specific. No fluff.'
      },
      {
        role: 'user',
        content: `${prevContext}\n${messages.map(m => `${m.role}: ${m.content}`).join('\n\n')}`
      }
    ], 250, null, false, false, apiKey || null);
    res.json({ summary: text.replace(/<think>[\s\S]*?<\/think>/g, '').trim() });
  } catch (err) {
    res.status(500).json({ error: 'Summarization failed' });
  }
});

// ───────────────────── ASSET PACK ENDPOINTS ──────────────────────────────────
function readManifest() {
  try { return JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8')); } catch { return null; }
}

function packStatus() {
  const manifest = readManifest();
  if (!manifest) return { downloaded: false, sizeBytes: 0, imageCount: 0, version: null, categories: [] };
  let count = 0, size = 0;
  for (const img of manifest.images || []) {
    const p = path.join(PACK_DIR, img.id + (img.ext || '.jpg'));
    if (fs.existsSync(p)) { count++; size += fs.statSync(p).size; }
  }
  const categories = [...new Set((manifest.images || []).map(i => i.category))];
  return {
    downloaded: count > 0 && count >= (manifest.images || []).length * 0.9,
    sizeBytes: size,
    imageCount: count,
    totalImages: (manifest.images || []).length,
    version: manifest.version,
    categories,
  };
}

app.get('/api/assets/manifest', (req, res) => {
  const m = readManifest();
  if (!m) return res.json({ version: null, images: [], categories: [] });
  res.json(m);
});

app.get('/api/assets/status', (req, res) => res.json(packStatus()));

// SSE progress stream
let downloadState = { active: false, total: 0, done: 0, errors: [] };
app.get('/api/assets/download-pack/progress', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  const send = () => res.write(`data: ${JSON.stringify(downloadState)}\n\n`);
  send();
  const t = setInterval(send, 1000);
  req.on('close', () => clearInterval(t));
});

app.post('/api/assets/download-pack', async (req, res) => {
  const manifest = readManifest();
  if (!manifest) return res.status(400).json({ error: 'No pack manifest. Run npm run build-pack or download manifest.json first.' });
  if (downloadState.active) return res.status(409).json({ error: 'Download already in progress.' });

  res.json({ started: true, total: (manifest.images || []).length });

  downloadState = { active: true, total: (manifest.images || []).length, done: 0, errors: [] };
  (async () => {
    for (const img of manifest.images || []) {
      const ext = img.ext || '.jpg';
      const dest = path.join(PACK_DIR, img.id + ext);
      try {
        if (fs.existsSync(dest)) {
          const buf = fs.readFileSync(dest);
          const sha = crypto.createHash('sha256').update(buf).digest('hex');
          if (!img.sha256 || sha === img.sha256) { downloadState.done++; continue; }
        }
        const r = await fetch(img.source);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const buf = Buffer.from(await r.arrayBuffer());
        if (img.sha256) {
          const sha = crypto.createHash('sha256').update(buf).digest('hex');
          if (sha !== img.sha256) throw new Error('checksum mismatch');
        }
        fs.writeFileSync(dest, buf);
        downloadState.done++;
      } catch (err) {
        downloadState.errors.push({ id: img.id, error: err.message });
        downloadState.done++;
      }
    }
    downloadState.active = false;
  })();
});

app.get('/api/assets/pick', (req, res) => {
  const manifest = readManifest();
  if (!manifest) return res.status(404).json({ error: 'No pack manifest.' });
  const status = packStatus();
  if (!status.downloaded && status.imageCount === 0) {
    return res.status(404).json({ error: 'Pack not downloaded.' });
  }
  const category = String(req.query.category || '').toLowerCase();
  const keywords = String(req.query.keywords || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
  const aspect = parseFloat(req.query.aspect || '0');
  const styleHint = String(req.query.style || '').toLowerCase();

  const candidates = (manifest.images || [])
    .filter(img => !category || img.category === category)
    .filter(img => fs.existsSync(path.join(PACK_DIR, img.id + (img.ext || '.jpg'))));
  if (!candidates.length) return res.status(404).json({ error: 'No matching image found.' });

  const score = (img) => {
    const tagSet = new Set((img.tags || []).map(t => t.toLowerCase()));
    let s = keywords.reduce((acc, k) => acc + (tagSet.has(k) ? 3 : 0), 0);
    if (styleHint && img.style === styleHint) s += 2;
    if (aspect && img.w && img.h) {
      const a = img.w / img.h;
      if (Math.abs(a - aspect) < 0.2) s += 1;
    }
    s += Math.random() * 0.5;
    return s;
  };

  const picked = candidates.slice().sort((a, b) => score(b) - score(a))[0];
  const filePath = path.join(PACK_DIR, picked.id + (picked.ext || '.jpg'));
  const buf = fs.readFileSync(filePath);
  const base64 = buf.toString('base64');

  res.json({
    id: picked.id,
    base64,
    width: picked.w,
    height: picked.h,
    license: picked.license,
    attribution: picked.attribution || null,
    source: picked.source || null,
  });
});

app.get('/api/assets/image/:id', (req, res) => {
  const manifest = readManifest();
  if (!manifest) return res.status(404).end();
  const img = (manifest.images || []).find(i => i.id === req.params.id);
  if (!img) return res.status(404).end();
  const filePath = path.join(PACK_DIR, img.id + (img.ext || '.jpg'));
  if (!fs.existsSync(filePath)) return res.status(404).end();
  res.set('Content-Type', img.ext === '.png' ? 'image/png' : 'image/jpeg');
  res.send(fs.readFileSync(filePath));
});

// ───────────────────── THEMES ENDPOINT ───────────────────────────────────────
const BUILT_IN_THEMES = {
  'corporate-blue': { name: 'Corporate Blue', primary: '#003366', secondary: '#0066CC', accent: '#FF9900', bg: '#FFFFFF', text: '#1A1A1A', font: 'Calibri' },
  'modern-mono':    { name: 'Modern Mono',    primary: '#1A1A1A', secondary: '#404040', accent: '#FF3366', bg: '#FAFAFA', text: '#1A1A1A', font: 'Inter' },
  'warm-sunset':    { name: 'Warm Sunset',    primary: '#D3634B', secondary: '#F2A65A', accent: '#5C374C', bg: '#FFF8F0', text: '#2A1810', font: 'Georgia' },
  'midnight':       { name: 'Midnight',       primary: '#0D1B2A', secondary: '#1B263B', accent: '#E0E1DD', bg: '#0D1B2A', text: '#E0E1DD', font: 'Inter' },
  'pastel':         { name: 'Pastel',         primary: '#FFB5A7', secondary: '#FCD5CE', accent: '#A8DADC', bg: '#FFF1E6', text: '#3D405B', font: 'Quicksand' },
  'high-contrast':  { name: 'High Contrast',  primary: '#000000', secondary: '#444444', accent: '#FFFF00', bg: '#FFFFFF', text: '#000000', font: 'Arial' },
  'terracotta':     { name: 'Terracotta',     primary: '#A04E36', secondary: '#D87A60', accent: '#5B5040', bg: '#F5EBDD', text: '#2A1A12', font: 'Lora' },
  'forest':         { name: 'Forest',         primary: '#2D5016', secondary: '#73A942', accent: '#FBE7C6', bg: '#FAF7F0', text: '#1B2D0E', font: 'Source Sans Pro' },
};

app.get('/api/themes', (req, res) => {
  res.json(BUILT_IN_THEMES);
});

// ───────────────────── WEB SEARCH ENDPOINT ───────────────────────────────────
let webSearchBucket = { tokens: 10, last: Date.now() };
function takeWebToken() {
  const now = Date.now();
  const refill = (now - webSearchBucket.last) / 6000; // 10/min = 1 per 6s
  webSearchBucket.tokens = Math.min(10, webSearchBucket.tokens + refill);
  webSearchBucket.last = now;
  if (webSearchBucket.tokens < 1) return false;
  webSearchBucket.tokens -= 1;
  return true;
}

app.get('/api/web-search/status', (req, res) => {
  res.json({ provider: 'brave', configured: !!BRAVE_KEY });
});

app.post('/api/web-search', async (req, res) => {
  if (!BRAVE_KEY) return res.status(503).json({ error: 'no_provider_configured' });
  if (!takeWebToken()) return res.status(429).json({ error: 'rate_limited' });

  const query = String(req.body.query || '').trim();
  const count = Math.max(1, Math.min(10, parseInt(req.body.count || 5, 10)));
  if (!query) return res.status(400).json({ error: 'missing_query' });

  try {
    const url = 'https://api.search.brave.com/res/v1/web/search?q=' + encodeURIComponent(query) + '&count=' + count;
    const r = await fetch(url, {
      headers: { 'X-Subscription-Token': BRAVE_KEY, 'Accept': 'application/json' }
    });
    const data = await r.json();
    const results = (data.web?.results || []).slice(0, count).map(x => ({
      title: x.title || '',
      url: x.url || '',
      snippet: (x.description || '').replace(/<[^>]+>/g, '').slice(0, 400),
      age: x.age || null,
    }));
    const out = { query, provider: 'brave', results, fetchedAt: new Date().toISOString() };
    try {
      const log = fs.existsSync(WEB_LOG) ? JSON.parse(fs.readFileSync(WEB_LOG, 'utf8')) : [];
      log.push({ query, count: results.length, fetchedAt: out.fetchedAt });
      fs.writeFileSync(WEB_LOG, JSON.stringify(log.slice(-200), null, 2));
    } catch {}
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: 'search_failed', detail: err.message });
  }
});

// ───────────────────── DECK GENERATION ENDPOINT ──────────────────────────────
app.post('/api/generate-deck', async (req, res) => {
  const { topic, slideCount = 10, audience = 'general', tone = 'pitch', model, useOllama, useGroq, apiKey, groqKey } = req.body;
  if (!topic) return res.status(400).json({ error: 'missing_topic' });
  const n = Math.max(3, Math.min(30, parseInt(slideCount, 10)));

  const sys = `You design slide decks. Output ONLY a JSON array of slide specs. NO markdown, NO prose, NO code fences. Each spec: {"title": "...", "body": "...", "notes": "...", "layout": "title"|"title-content"|"two-content"|"section"|"blank"}.

Rules:
- The FIRST slide must use layout="title" (the cover).
- Insert one layout="section" divider every ~4 content slides.
- The LAST slide should be a conclusion or call-to-action with layout="title-content".
- "body" uses literal \\n between bullet points (no leading dash or bullet character).
- "notes" is one-paragraph speaker notes (~2-4 sentences) for the presenter.
- Be specific to the topic. No filler.`;

  const usr = `Generate a ${tone} ${n}-slide deck about: ${topic}
Audience: ${audience}

Return ONLY the JSON array. No backticks, no preamble.`;

  try {
    const { text, usage } = await callAI([
      { role: 'system', content: sys },
      { role: 'user', content: usr }
    ], 4096, model || null, useOllama || false, useGroq || false, apiKey || null, groqKey || null);
    const clean = text.replace(/<think>[\s\S]*?<\/think>/g, '').replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
    let outline;
    try { outline = JSON.parse(clean); } catch {
      const m = clean.match(/\[[\s\S]*\]/);
      if (m) outline = JSON.parse(m[0]);
    }
    if (!Array.isArray(outline)) throw new Error('Outline was not an array.');
    outline = outline.map(s => ({
      title:  String(s.title || '').slice(0, 200),
      body:   String(s.body  || '').slice(0, 1500),
      notes:  String(s.notes || '').slice(0, 1500),
      layout: ['title','title-content','two-content','section','blank'].includes(s.layout) ? s.layout : 'title-content',
    }));
    res.json({ outline, usage });
  } catch (err) {
    console.error('[generate-deck] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ───────────────────── PRESENTER COACH ENDPOINT ──────────────────────────────
app.post('/api/coach', async (req, res) => {
  const { slideText = '', slideNotes = '', focus = 'all', model, useOllama, useGroq, apiKey, groqKey } = req.body;

  const sys = `You are a presentation coach. Given a slide's content and current speaker notes, give feedback in this EXACT structure:

CLARITY: 2 sentences on whether the slide's message is clear.
TIMING: estimate seconds to present this slide; flag if too dense.
ENGAGEMENT HOOK: suggest one rhetorical question or story opener (1-2 sentences).
SUGGESTED NOTES: rewritten speaker notes the user can copy-paste (3-5 sentences, ready to read aloud).

Rules:
- Total response under 220 words.
- NEVER output CODE_JS or any code.
- Do not use markdown headers — use the labels above on their own lines.
- Be specific to the slide content.`;

  const usr = `FOCUS: ${focus}

SLIDE CONTENT:
${slideText || '(empty)'}

CURRENT SPEAKER NOTES:
${slideNotes || '(none yet)'}`;

  try {
    const { text, usage } = await callAI([
      { role: 'system', content: sys },
      { role: 'user', content: usr }
    ], 600, model || null, useOllama || false, useGroq || false, apiKey || null, groqKey || null);
    const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, '').replace(/CODE_JS::[\s\S]*?::END_CODE/g, '').trim();
    res.json({ feedback: cleaned, usage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ───────────────────── MAIN CHAT ROUTE ───────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { messages, deckData, currentSlide, summary, model, useOllama, useGroq, apiKey, groqKey, options, settings, webSearchResults } = req.body;

  const preferences   = options?.preferences   || '';
  const deepThink     = options?.deepThink     || false;
  const dynamicDepth  = options?.dynamicDepth  || false;
  const autoModel     = options?.autoModel     || false;
  const planFirst     = options?.plan          || false;
  const slideByStep   = options?.slideByStep   || false;
  const webSearchMode = (settings?.allowWebSearch || 'off').toLowerCase(); // 'off' | 'on' | 'disabled'

  let maxTokens = 4096;
  let effectiveModel = model || null;
  let selectedModel = null;

  const rawUserMessage = messages[messages.length - 1]?.content || '';
  const recentMessages = messages.slice(-6).map(m => ({ ...m }));

  // ── Auto Model ──────────────────────────────────────────────────────────
  if (autoModel && options?.availableModels?.length) {
    try {
      const { text: choice } = await callAI([
        { role: 'system', content: 'Select the best AI model for this task. JSON only: {"modelId":"id"}' },
        { role: 'user', content: `Task: "${rawUserMessage.slice(0, 300)}"\nPreferences: ${preferences || 'none'}\nCost limit: $${options.costLimit || 'unlimited'} per prompt\nModels:\n${options.availableModels.map(m=>`${m.id} $${m.in}/$${m.out}`).join('\n')}` }
      ], 60, null, false, false, apiKey || null, groqKey || null);
      const m = choice.replace(/<think>[\s\S]*?<\/think>/g,'').trim().match(/\{[\s\S]*?\}/);
      if (m) {
        const parsed = JSON.parse(m[0]);
        if (parsed.modelId && options.availableModels.find(x => x.id === parsed.modelId)) {
          effectiveModel = parsed.modelId;
          selectedModel  = parsed.modelId;
        }
      }
    } catch {}
  }

  // ── Dynamic Depth ───────────────────────────────────────────────────────
  if (dynamicDepth) {
    try {
      const { text: assess } = await callAI([
        { role: 'system', content: 'Rate complexity 1-3: 1=simple, 2=moderate, 3=complex. JSON: {"level":1|2|3}' },
        { role: 'user', content: rawUserMessage.slice(0, 300) }
      ], 30, null, false, false, apiKey || null, groqKey || null);
      const m = assess.match(/\{[\s\S]*?\}/);
      const level = m ? (JSON.parse(m[0]).level || 2) : 2;
      maxTokens = level >= 3 ? 8192 : level === 1 ? 2048 : 4096;
    } catch {}
  }

  // ── Deep Think ──────────────────────────────────────────────────────────
  if (deepThink) {
    const lastUserIdx = recentMessages.map(m=>m.role).lastIndexOf('user');
    if (lastUserIdx !== -1) {
      try {
        const orig = recentMessages[lastUserIdx].content;
        const { text: enhanced } = await callAI([
          { role: 'system', content: 'You are a prompt engineer for a PowerPoint AI assistant. Rewrite the user\'s request to be maximally clear, precise, and complete. Preserve intent exactly. Add explicit handling for edge cases (no slide selected, missing title placeholder, slide index out of range). Reference specific slide numbers or shape names if visible in context. Output ONLY the rewritten prompt.' },
          { role: 'user', content: `Deck context (slide titles + body + notes excerpt):\n${(deckData||'').slice(0,2000)}\n\nOriginal request: ${orig}` }
        ], 700, null, false, false, apiKey || null, groqKey || null);
        const enhancedText = enhanced.replace(/<think>[\s\S]*?<\/think>/g,'').trim();
        recentMessages[lastUserIdx] = { ...recentMessages[lastUserIdx], content: enhancedText };
        maxTokens = Math.max(maxTokens, 8192);
      } catch {}
    }
  }

  // ── Plan First ──────────────────────────────────────────────────────────
  let planText = null;
  if (planFirst && !isQuestion(rawUserMessage)) {
    try {
      const prefsSection_ = preferences ? `\n\nUSER PREFERENCES:\n${preferences}` : '';
      const contextMessages_ = deckData ? [
        { role: 'user', content: `Here is the current state of the presentation.\n\nCurrent slide: ${currentSlide || '(none selected)'}\n\n${deckData}` },
        { role: 'assistant', content: 'I can see the entire deck. What would you like me to do?' }
      ] : [];
      const { text: planReply } = await callAI([
        { role: 'system', content: SYSTEM_PROMPT + prefsSection_ + '\n\nIMPORTANT: The user has requested a plan. Do NOT output any CODE_JS block. Instead, write a short numbered plan (3-5 steps max) describing what you will do. Be concise.' },
        ...contextMessages_,
        { role: 'user', content: `Before executing, give me a brief plan for: ${rawUserMessage}` }
      ], 512, effectiveModel, useOllama || false, useGroq || false, apiKey || null, groqKey || null);
      planText = planReply.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    } catch {}
  }

  // ── Code reminder + slide-by-slide preview hint ─────────────────────────
  const lastIdx = recentMessages.map(m=>m.role).lastIndexOf('user');
  if (lastIdx !== -1) {
    let extra = '\n\n[REMINDER: If making changes, output a CODE_JS block with Office JS code. Do not skip it.]';
    if (slideByStep) extra += '\n[If your change spans more than one slide, FIRST list the slides you will modify as a numbered preview, then emit the CODE_JS block.]';
    recentMessages[lastIdx] = {
      ...recentMessages[lastIdx],
      content: recentMessages[lastIdx].content + extra
    };
  }

  // ── Inject runtime hints (asset pack + web search mode) ─────────────────
  const status = packStatus();
  const assetTag = status.downloaded
    ? `<ASSET_PACK_READY categories="${status.categories.join(',')}"/>`
    : `<ASSET_PACK_MISSING/>`;
  const webTag = `<WEB_SEARCH_MODE value="${webSearchMode}"/>`;
  const runtimeHints = `\n\nRUNTIME STATE:\n${assetTag}\n${webTag}`;

  const prefsSection = preferences ? `\n\nUSER PREFERENCES (always follow these):\n${preferences}` : '';

  const contextMessages = deckData ? [
    { role: 'user', content: `Here is the current state of the presentation (last synced before this message).\n\nCurrent slide: ${currentSlide || '(none selected)'}\n\n${deckData}` },
    { role: 'assistant', content: 'I can see the entire deck. What would you like me to do?' }
  ] : [];

  const summaryMessages = summary ? [
    { role: 'user', content: `Earlier in this session: ${summary}` },
    { role: 'assistant', content: 'Got it, I have the context of what we did earlier.' }
  ] : [];

  const webResultsMessages = (Array.isArray(webSearchResults) && webSearchResults.length) ? [{
    role: 'user',
    content: webSearchResults.map(wr =>
      `<WEB_SEARCH_RESULTS query="${(wr.query||'').replace(/"/g,'&quot;')}">\n` +
      (wr.results || []).map((r, i) => `${i+1}. ${r.title} — ${r.url}\n   ${r.snippet}`).join('\n') +
      `\n</WEB_SEARCH_RESULTS>`
    ).join('\n\n')
  }] : [];

  const allMessages = [
    { role: 'system', content: SYSTEM_PROMPT + prefsSection + runtimeHints },
    ...contextMessages,
    ...summaryMessages,
    ...webResultsMessages,
    ...recentMessages
  ];

  try {
    let { text: responseText, usage } = await callAI(allMessages, maxTokens, effectiveModel, useOllama || false, useGroq || false, apiKey || null, groqKey || null);
    responseText = responseText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    // ── Web search interception ─────────────────────────────────────────
    let webSearchUsed = null;
    const wsReq = parseWebSearchRequest(responseText);
    if (wsReq && webSearchMode === 'on' && BRAVE_KEY) {
      try {
        const url = 'https://api.search.brave.com/res/v1/web/search?q=' + encodeURIComponent(wsReq.query) + '&count=5';
        const r = await fetch(url, { headers: { 'X-Subscription-Token': BRAVE_KEY, 'Accept': 'application/json' } });
        const data = await r.json();
        const results = (data.web?.results || []).slice(0, 5).map(x => ({
          title: x.title || '',
          url: x.url || '',
          snippet: (x.description || '').replace(/<[^>]+>/g, '').slice(0, 400),
          age: x.age || null,
        }));
        webSearchUsed = { query: wsReq.query, provider: 'brave', results, fetchedAt: new Date().toISOString() };
        // Re-prompt the model with results
        const followup = [
          ...allMessages,
          { role: 'assistant', content: responseText },
          { role: 'user', content:
            `<WEB_SEARCH_RESULTS query="${wsReq.query.replace(/"/g,'&quot;')}">\n` +
            results.map((r, i) => `${i+1}. ${r.title} — ${r.url}\n   ${r.snippet}`).join('\n') +
            `\n</WEB_SEARCH_RESULTS>\n\nNow proceed with the original request using these facts. Emit CODE_JS if changes are needed.`
          }
        ];
        const second = await callAI(followup, maxTokens, effectiveModel, useOllama || false, useGroq || false, apiKey || null, groqKey || null);
        responseText = second.text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        usage = second.usage;
      } catch (err) {
        console.error('[web-search] auto-mode failed:', err.message);
      }
    } else if (wsReq && webSearchMode === 'off') {
      // Pass through to client for permission card
      const { cleaned } = parseResponse(responseText);
      return res.json({
        response: cleaned,
        code: null,
        webSearchRequest: wsReq,
        usage,
        selectedModel,
        plan: planText
      });
    }

    if (modelForgotCode(responseText, rawUserMessage)) {
      console.log('[server] Model forgot CODE_JS — retrying...');
      const { text: retryText } = await callAI([
        ...allMessages,
        { role: 'assistant', content: responseText },
        { role: 'user', content: 'You forgot the CODE_JS block. Output ONLY the CODE_JS block now. Start with CODE_JS:: and end with ::END_CODE.' }
      ], 2048, effectiveModel, useOllama || false, useGroq || false, apiKey || null, groqKey || null);
      const retryClean = retryText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      const { code: retryCode } = parseResponse(retryClean);
      if (retryCode) {
        const { cleaned } = parseResponse(responseText);
        return res.json({ response: cleaned, code: retryCode, usage, selectedModel, webSearchUsed });
      }
    }

    const { code, cleaned } = parseResponse(responseText);
    if (code) console.log('[server] Code to execute:\n' + code);
    res.json({ response: cleaned, code, usage, selectedModel, plan: planText, webSearchUsed });

  } catch (err) {
    console.error('AI error:', err);
    res.status(500).json({ error: `AI error: ${err.message}` });
  }
});

const server = https.createServer({ key: pems.private, cert: pems.cert }, app);
server.listen(3000, () => {
  console.log('PowerPoint AI Assistant running at https://localhost:3000');
  console.log(`Mode: ${USE_OPENROUTER ? 'OpenRouter' : USE_MLX ? 'MLX' : USE_GROQ ? 'Groq' : 'Ollama'}`);
  console.log(`Default model: ${DEFAULT_MODEL}`);
  console.log(`Brave Search: ${BRAVE_KEY ? 'configured' : 'not configured'}`);
  console.log(`Asset pack: ${packStatus().downloaded ? `${packStatus().imageCount} images` : 'not downloaded'}`);
});
