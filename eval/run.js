#!/usr/bin/env node
/**
 * PowerPointAI Eval Runner
 *
 * - Scores AI responses 0–100 using an LLM judge
 * - Tracks per-category levels in progress.json
 * - When a category averages >= 95, auto-generates harder cases for it
 * - When overall avg >= 95, also generates a brand-new PowerPoint domain category
 * - When overall avg >= 90, generates a level-2 category (easier threshold)
 * - When a category is stuck on the same level for too long, generates easier cases
 * - Hard budget limit: $0.50 per session
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const fs   = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const OPENROUTER_KEY   = process.env.OPENROUTER_KEY;
const MODEL            = 'meta-llama/llama-3.3-70b-instruct';
const JUDGE_MODEL      = 'meta-llama/llama-3.3-70b-instruct';
const COST_PER_1M_IN   = 0.07;
const COST_PER_1M_OUT  = 0.30;
const BUDGET_USD       = 0.50;
const MASTERY_THRESHOLD      = 95;
// Only promote a category if EVERY OTHER category is also performing well —
// otherwise we balloon the suite while the model is still failing basics.
const PROMOTION_GATE_OTHERS  = 85;
const HARDER_CASES_PER_GEN   = 2;     // was 4 — user requested 1-2
const EASIER_CASES_PER_GEN   = 2;     // was 3
const NEW_CAT_CASES_PER_GEN  = 1;     // was 2 — only a tiny seed
const NEW_CAT_THRESHOLD      = 95;
const NEW_CAT_L2_THRESHOLD   = 90;
const STUCK_RUNS_THRESHOLD   = 3;

const PATHS = {
  cases:     path.join(__dirname, 'cases.json'),
  generated: path.join(__dirname, 'generated-cases.json'),
  progress:  path.join(__dirname, 'progress.json'),
  results:   path.join(__dirname, 'results'),
};

// ── Hallucination blacklist ──────────────────────────────────────────────────
// Patterns that must NEVER appear in generated test cases (requiredPatterns) or
// in auto-patched system-prompt rules. These are APIs that DO NOT EXIST in
// PowerPoint Office.js — letting them slip in would poison the eval loop.
const HALLUCINATION_BLACKLIST = [
  // wrong-namespace from Excel/Word
  /\bworkbook\./i, /\bworksheet\./i, /\bsheet\.autoFilter/i, /\bsheet\.charts\.add/i,
  /\bdocument\.body/i, /\bdocument\.paragraphs/i,
  // PowerPoint methods that don't exist
  /\bpresentation\.theme\b/i, /\bpresentation\.slides\.add\b/i, /\bpresentation\.sildes/i,
  /\bpresentation\.exportToPdf/i, /\bpresentation\.export(?!.*Base64)/i,
  /\bpresentation\.runSlideShow/i,
  /\bslide\.master\b/i, /\bslide\.theme\b/i,
  /\bslide\.transitions\b/i, /\bslide\.transition\.add/i,
  /\bslide\.animations\.add/i,
  /\bslide\.speakerNotes\b/i,
  /\bslide\.title\.(?!text)/i,         // slides have no .title property; titles live in placeholder shapes
  /\bslide\.body\b/i,
  /\bslide\.charts\.add/i,
  /\bshape\.smartArt/i,
  /\bOffice\.PowerPoint\.TransitionType/i,
  // helpers that DO NOT exist in our environment
  /\bapplyAnimation\b/i, /\bapplyTransition\b/i,
];

// Whitelist of strings that CAN appear in requiredPatterns — used as guidance
// when prompting the generator. Not enforced as an allowlist (would be too
// strict) but printed in the prompt so the model has a menu.
const PATTERN_WHITELIST_HINT = [
  // helpers (preferred)
  'addSlide', 'addTextBox', 'applyTheme', 'recolorDeck', 'addSpeakerNote',
  'getCurrentSlide', 'getSlideByIndex', 'findShapeByName', 'listSlides',
  'insertImage', 'moveSlide', 'BUILT_IN_THEMES',
  // real native APIs
  'PowerPoint.run', 'presentation.slides', 'slide.shapes', 'slide.delete()',
  'shape.textFrame.textRange', 'shape.textFrame.textRange.font.bold',
  'shape.textFrame.textRange.font.size', 'shape.textFrame.textRange.font.color',
  'shape.textFrame.textRange.font.name',
  'shape.fill.setSolidColor', 'shape.lineFormat.color',
  'slide.notesPage.notesTextFrame.textRange.text',
  'presentation.insertSlidesFromBase64', 'presentation.getSelectedSlides',
  '.load(', 'context.sync', 'return',
  // option keys
  'fadeIn', 'transition', 'fade', 'push', 'wipe', 'zoom', 'cut',
];

function isHallucinated(text) {
  if (typeof text !== 'string') return false;
  return HALLUCINATION_BLACKLIST.some(p => p.test(text));
}

function validateGeneratedCase(c) {
  if (!c || typeof c !== 'object') return { ok: false, reason: 'not an object' };
  if (!c.id || !c.prompt || !c.category) return { ok: false, reason: 'missing id/prompt/category' };
  const reqs = Array.isArray(c.requiredPatterns) ? c.requiredPatterns : [];
  for (const r of reqs) {
    if (isHallucinated(r)) return { ok: false, reason: `requiredPattern uses hallucinated API: ${r}` };
  }
  if (isHallucinated(c.prompt)) return { ok: false, reason: 'prompt references hallucinated API' };
  if (isHallucinated(c.note || '')) return { ok: false, reason: 'note references hallucinated API' };
  return { ok: true };
}

function validateImprovement(text) {
  const issues = [];
  for (const p of HALLUCINATION_BLACKLIST) {
    if (p.test(text)) issues.push(p.toString());
  }
  return { ok: issues.length === 0, issues };
}

if (!fs.existsSync(PATHS.results)) fs.mkdirSync(PATHS.results, { recursive: true });

// ── Cost tracking ─────────────────────────────────────────────────────────────
let totalCostUSD = 0;
function trackCost(inTok, outTok) {
  const c = (inTok / 1e6) * COST_PER_1M_IN + (outTok / 1e6) * COST_PER_1M_OUT;
  totalCostUSD += c;
  if (totalCostUSD > BUDGET_USD) throw new Error(`BUDGET_EXCEEDED: $${totalCostUSD.toFixed(4)} > $${BUDGET_USD}`);
}

// ── OpenRouter call ───────────────────────────────────────────────────────────
async function callLLM(messages, model = MODEL, maxTokens = 1024) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'HTTP-Referer':  'https://localhost:3000',
      'X-Title':       'PowerPointAI Eval',
    },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature: 0.1 }),
  });
  const data = await res.json();
  if (data.error) throw new Error(JSON.stringify(data.error));
  const u = data.usage || {};
  trackCost(u.prompt_tokens || 600, u.completion_tokens || 250);
  return data.choices[0].message.content;
}

// ── Load files ────────────────────────────────────────────────────────────────
function loadCases() {
  const base = JSON.parse(fs.readFileSync(PATHS.cases, 'utf8'));
  const gen  = fs.existsSync(PATHS.generated)
    ? JSON.parse(fs.readFileSync(PATHS.generated, 'utf8'))
    : [];
  return [...base, ...gen];
}
function loadProgress() {
  if (!fs.existsSync(PATHS.progress)) return {};
  return JSON.parse(fs.readFileSync(PATHS.progress, 'utf8'));
}
function saveProgress(p) { fs.writeFileSync(PATHS.progress, JSON.stringify(p, null, 2)); }
function loadLastResults() {
  const files = fs.readdirSync(PATHS.results).filter(f => f.endsWith('.json')).sort();
  if (!files.length) return null;
  return JSON.parse(fs.readFileSync(path.join(PATHS.results, files[files.length - 1]), 'utf8'));
}

// ── System prompt extractor ───────────────────────────────────────────────────
function loadSystemPrompt() {
  const src       = fs.readFileSync(path.join(__dirname, '../server.js'), 'utf8');
  const startMark = 'const SYSTEM_PROMPT = `';
  const startIdx  = src.indexOf(startMark);
  if (startIdx === -1) throw new Error('Cannot find SYSTEM_PROMPT in server.js');
  const from = startIdx + startMark.length;
  let i = from;
  while (i < src.length) {
    i = src.indexOf('`', i);
    if (i === -1) throw new Error('Cannot find end of SYSTEM_PROMPT');
    const after = src.slice(i + 1).trimStart();
    if (after.startsWith('+') || after.startsWith(';')) break;
    i++;
  }
  return src.slice(from, i);
}

// ── Extract code / web-search blocks ──────────────────────────────────────────
function extractCode(text) {
  const m = text.match(/CODE_JS::([\s\S]*?)::END_CODE/);
  return m ? m[1].trim() : null;
}
function extractWebSearch(text) {
  const m = text.match(/NEEDS_WEB_SEARCH::([\s\S]*?)::END/);
  if (!m) return null;
  try { return JSON.parse(m[1].trim()); } catch { return { raw: m[1].trim() }; }
}

// ── Pattern checks ────────────────────────────────────────────────────────────
function checkPatterns(text, code, required, forbidden) {
  const haystack = (code || '') + '\n' + (text || '');
  const missing  = (required || []).filter(p => !haystack.includes(p));
  const badFound = (forbidden || []).filter(p => haystack.includes(p));
  return { passed: !missing.length && !badFound.length, missing, badFound };
}

// ── LLM judge ────────────────────────────────────────────────────────────────
async function judge(tc, aiResponse, code) {
  const isQuestion = tc.mustHaveCode === false;
  const resp = await callLLM([
    { role: 'system', content: 'You are a strict expert evaluator of Office JavaScript API code for PowerPoint. You score precisely — never give round multiples of 10 unless exactly right.\n\nIMPORTANT — the code runs inside a wrapper that injects these HELPER FUNCTIONS into scope. Treat ALL of them as VALID, not as hallucinations:\n  addSlide(layout, title, body?, notes?, options?)  — options accepts {transition: "fade"|"push"|"wipe"|"zoom"|"cut", animation: "fadeIn"|"none", transitionSpeed: "slow"|"med"|"fast"}\n  addTextBox(slideIndex, text, opts?)\n  applyTheme(themeName)               — themeName ∈ corporate-blue / modern-mono / warm-sunset / midnight / pastel / high-contrast / terracotta / forest\n  recolorDeck(palette)\n  addSpeakerNote(slideIndex, text, append?)   — slideIndex=-1 means current slide\n  getCurrentSlide()\n  getSlideByIndex(i)\n  findShapeByName(slide, name)\n  listSlides()\n  insertImage(slideIndex, category, keywordOrTags, position?)\n  moveSlide(fromIndex, toIndex)\n  BUILT_IN_THEMES                     — object of theme palettes\nALSO injected: context, presentation (= context.presentation), PowerPoint namespace. Code is the body of an async function inside PowerPoint.run(async (context) => { ... }).' },
    {
      role: 'user',
      content: `Score this AI assistant response on FOUR dimensions, each out of 25 points.

USER REQUEST: "${tc.prompt}"
DECK CONTEXT: ${tc.workbook}
${tc.note ? `SPECIAL NOTE: ${tc.note}` : ''}

AI RESPONSE:
${aiResponse}

${code ? `GENERATED CODE:\n${code}` : 'NO CODE WAS GENERATED.'}

${isQuestion
  ? `This is a QUESTION OR REFUSAL — no code expected. Score:
A) ACCURACY (0-25): Is the answer factually correct and complete? For refusals, does it correctly identify what PowerPoint Office.js cannot do? Genuinely-impossible operations (refuse cleanly): PDF/image export, chart creation on slides, SmartArt creation, slideshow control (runSlideShow), editing animations/transitions on EXISTING slides. Possible (do NOT refuse): adding NEW slides with transitions/animations via addSlide options, reordering via moveSlide, recoloring via recolorDeck/applyTheme.
B) CLARITY (0-25): Is it clear and easy to understand?
C) RELEVANCE (0-25): Does it directly address the question without padding?
D) BONUS (0-25): Extra credit for offering workarounds (e.g. "recreate the slide with the animation" or "insertImage with charts-diagrams category as a chart workaround"), suggesting Settings options (e.g. "enable web search"), or noting PowerPoint-specific caveats.`
  : `Score each dimension carefully. Deduct proportionally for each flaw:

A) API_CORRECTNESS (0-25): Does the code use real PowerPoint Office.js APIs OR the injected helpers listed in your instructions?
   HEAVILY penalise hallucinated methods that DO NOT EXIST:
     presentation.theme.* (no theme API), slide.animations.* / slide.transition.* (no LIVE animation/transition API — only via addSlide options on NEW slides), presentation.exportToPdf() / presentation.export*(), slide.charts.add(), shape.smartArt.*, presentation.runSlideShow(), presentation.slides.add() (use addSlide helper instead), slides.move() / slide.move() (use moveSlide helper instead), slide.background.image=, worksheet.* (that's Excel — wrong namespace), workbook.*, document.* (that's Word — wrong namespace).
   Real native APIs: PowerPoint.run, ctx.presentation, presentation.slides, slide.shapes, slide.shapes.addTextBox, slide.shapes.addImage, slide.shapes.addGeometricShape, slide.shapes.addLine, shape.textFrame.textRange, shape.textFrame.textRange.font.{bold,size,color,name,italic,underline}, shape.fill.setSolidColor, shape.lineFormat.color, shape.{left,top,width,height}, shape.delete(), slide.delete(), slide.notesPage.notesTextFrame.textRange.text, presentation.insertSlidesFromBase64, presentation.getSelectedSlides, presentation.setSelectedSlides.
   DO NOT penalize the injected helpers (addSlide, addTextBox, applyTheme, recolorDeck, addSpeakerNote, getCurrentSlide, getSlideByIndex, findShapeByName, listSlides, insertImage, moveSlide, BUILT_IN_THEMES) — they are VALID in this environment.
B) COMPLETENESS (0-25): Does the code fully address the request? Partial solutions lose points.
C) WOULD_IT_WORK (0-25): Would this code actually execute in PowerPoint without runtime errors? Check load/sync order, variable scope, correct method signatures, proper await on all helper calls.
D) APPROACH (0-25): Does it use best practices and the available helpers instead of re-implementing them manually? For image insertion, MUST use insertImage helper — never addImage with a URL string. For new slides, MUST use addSlide helper. For reordering, MUST use moveSlide helper. For theming, prefer applyTheme/recolorDeck over manual per-shape recoloring.`}

Deduct points specifically for each issue you identify. Do NOT round to multiples of 5 — use precise values like 18, 22, 7.

Reply with exactly this format:
A: <number>
B: <number>
C: <number>
D: <number>
REASON: <one sentence summarising the main flaw or strength>`,
    },
  ], JUDGE_MODEL, 150);

  const aM = resp.match(/^A:\s*(\d+)/im);
  const bM = resp.match(/^B:\s*(\d+)/im);
  const cM = resp.match(/^C:\s*(\d+)/im);
  const dM = resp.match(/^D:\s*(\d+)/im);
  const reasonM = resp.match(/REASON:\s*(.+)/i);

  const a = aM ? Math.min(25, parseInt(aM[1])) : 0;
  const b = bM ? Math.min(25, parseInt(bM[1])) : 0;
  const c = cM ? Math.min(25, parseInt(cM[1])) : 0;
  const d = dM ? Math.min(25, parseInt(dM[1])) : 0;

  return {
    score:  a + b + c + d,
    reason: reasonM ? reasonM[1].trim() : resp.slice(0, 120),
    breakdown: { a, b, c, d },
  };
}

// ── Auto-patch: generate system prompt improvements ────────────────────────────
async function generateFix(failingResults, currentImprovements) {
  const cases = failingResults.map(r =>
    `  [${r.id}] score=${r.score}/100\n  prompt: "${r.prompt}"\n  reason: ${r.reason}\n  code:\n${(r.generatedCode || 'NONE').split('\n').map(l => '    ' + l).join('\n')}`
  ).join('\n\n');

  const resp = await callLLM([
    { role: 'system', content: 'You are an expert at improving system prompts for a PowerPoint AI assistant that generates Office JavaScript code. You only use real PowerPoint Office.js APIs or listed helpers — never invent APIs.' },
    {
      role: 'user',
      content: `The following test cases are FAILING (score < 70). Analyse the errors and generate new rules or examples to add to the system prompt so the AI handles these cases correctly.

FAILING CASES:
${cases}

EXISTING IMPROVEMENTS ALREADY IN PROMPT:
${currentImprovements || '(none)'}

Constraints:
- Only add rules or examples that would fix the specific failures above
- Use the same format as the existing prompt (plain text rules or CODE_JS examples)
- ONLY use these injected helpers: addSlide(layout,title,body?,notes?,options?), addTextBox, applyTheme, recolorDeck, addSpeakerNote, getCurrentSlide, getSlideByIndex, findShapeByName, listSlides, insertImage, moveSlide.
- ONLY use these real Office.js patterns:
    PowerPoint.run, presentation.slides, slide.shapes, shape.textFrame.textRange.text,
    shape.textFrame.textRange.font.{bold,size,color,name},
    shape.fill.setSolidColor, shape.lineFormat.color,
    shape.{left,top,width,height}, slide.delete(), shape.delete(),
    slide.notesPage.notesTextFrame.textRange.text,
    presentation.insertSlidesFromBase64, presentation.getSelectedSlides
- NEVER propose APIs that do not exist. Specifically forbidden:
    presentation.theme.*, presentation.slides.add, presentation.exportToPdf,
    presentation.runSlideShow, slide.master, slide.theme, slide.transitions,
    slide.animations.add, slide.speakerNotes, slide.title.<x>, slide.body,
    slide.charts.add, shape.smartArt, Office.PowerPoint.TransitionType,
    workbook.*, worksheet.*, document.*, applyAnimation, applyTransition.
- Be concise — 3–8 lines max
- Do NOT duplicate existing rules

Return ONLY the new text to add. No explanation, no preamble.`,
    },
  ], MODEL, 512);

  return resp.trim();
}

function applyImprovements(newText) {
  // Validate the new improvement text against the hallucination blacklist
  // BEFORE writing it. A bad patch poisons every subsequent server start by
  // appending hallucinated rules to the system prompt.
  const v = validateImprovement(newText);
  if (!v.ok) {
    console.warn('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.warn('  SYSTEM PROMPT PATCH REJECTED (hallucinated APIs)');
    console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.warn('  Issues:', v.issues.join(', '));
    console.warn('  Proposed patch (NOT applied):');
    for (const line of newText.split('\n')) console.warn(`  ! ${line}`);
    console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return false;
  }
  const impFile = path.join(__dirname, 'improvements.txt');
  const oldText = fs.existsSync(impFile) ? fs.readFileSync(impFile, 'utf8').trim() : '';
  fs.writeFileSync(impFile, newText + '\n');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  SYSTEM PROMPT PATCHED (eval/improvements.txt)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (oldText) for (const line of oldText.split('\n')) console.log(`  - ${line}`);
  else console.log('  BEFORE: (empty)');
  console.log('AFTER:');
  for (const line of newText.split('\n')) console.log(`  + ${line}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  return true;
}

async function generateNewCategory(existingCategories) {
  const knownList = existingCategories.join(', ');
  const resp = await callLLM([
    { role: 'system', content: 'You generate JSON test cases for a PowerPoint AI assistant evaluation suite. Return only valid JSON. Only use real PowerPoint Office.js APIs or listed helpers.' },
    {
      role: 'user',
      content: `The eval suite already covers: ${knownList}.

Pick ONE new PowerPoint feature category not in that list (e.g. shape positioning, font-pairing, agenda-slide, conclusion-slide, table-add, hyperlink, alignment, image-grid, gradient-fill, slide-number, footer, etc.).

Generate exactly ${NEW_CAT_CASES_PER_GEN} level-1 test case(s) for it — simple, realistic prompts a real user would ask.
Each case must be solvable via real PowerPoint Office JavaScript API + the available helpers.

VALID PATTERNS for "requiredPatterns" (pick from this list):
${PATTERN_WHITELIST_HINT.map(p => '  - ' + p).join('\n')}

NEVER use these (DO NOT EXIST): presentation.theme, presentation.slides.add, slide.master,
slide.transitions, slide.animations.add, slide.speakerNotes, slide.title.*, slide.body,
slide.charts.add, shape.smartArt, Office.PowerPoint.TransitionType, workbook.*,
worksheet.*, document.*, applyAnimation, applyTransition.

Return ONLY a valid JSON object with this shape:
{
  "category": "<new category name>",
  "cases": [
    {
      "id": "gen-L1-<category-slug>-001",
      "level": 1,
      "category": "<new category name>",
      "prompt": "...",
      "workbook": "Slide 1 (id=256): TITLE=\\"...\\" | BODY=\\"...\\" | NOTES=\\"\\"\\nSlide 2 ...",
      "mustHaveCode": true,
      "requiredPatterns": ["one string from the VALID list above"],
      "forbiddenPatterns": []
    }
  ]
}`,
    },
  ], MODEL, 1024);

  try {
    const jsonMatch = resp.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.category || !Array.isArray(parsed.cases)) throw new Error('Bad shape');
    const validated = [];
    for (const c of parsed.cases) {
      const v = validateGeneratedCase(c);
      if (v.ok) validated.push(c);
      else console.warn(`  Rejected new-category case ${c?.id || '(no id)'}: ${v.reason}`);
    }
    if (!validated.length) {
      console.warn(`  All ${parsed.cases.length} new-category cases referenced hallucinated APIs — skipping.`);
      return null;
    }
    parsed.cases = validated.slice(0, NEW_CAT_CASES_PER_GEN);
    return parsed;
  } catch (err) {
    console.warn(`  Failed to parse new category: ${err.message}`);
    return null;
  }
}

// ── Run one test ──────────────────────────────────────────────────────────────
async function runCase(tc, systemPrompt) {
  const messages = [
    { role: 'system', content: systemPrompt + '\n\nRUNTIME STATE:\n<ASSET_PACK_READY categories="people,technology,finance,nature,charts-diagrams,abstract-backgrounds,transport,food,education,healthcare,cities,office-workplace,travel,sports"/>\n<WEB_SEARCH_MODE value="off"/>' },
    { role: 'user',      content: `Deck state:\n\n${tc.workbook}` },
    { role: 'assistant', content: 'I can see the deck. What would you like me to do?' },
    { role: 'user',      content: tc.prompt + '\n\n[REMINDER: If making changes, output a CODE_JS block. Do not skip it.]' },
  ];

  let aiResponse, code, patterns, verdict;
  try {
    aiResponse = await callLLM(messages, MODEL, 1024);
    code       = extractCode(aiResponse);
    patterns   = checkPatterns(aiResponse, code, tc.requiredPatterns, tc.forbiddenPatterns);
    verdict    = await judge(tc, aiResponse, code);
  } catch (err) {
    if (err.message.startsWith('BUDGET_EXCEEDED')) throw err;
    aiResponse = `ERROR: ${err.message}`;
    code       = null;
    patterns   = { passed: false, missing: tc.requiredPatterns || [], badFound: [] };
    verdict    = { score: 0, reason: `Runtime error: ${err.message}` };
  }

  return {
    id:              tc.id,
    level:           tc.level,
    category:        tc.category,
    prompt:          tc.prompt,
    score:           verdict.score,
    reason:          verdict.reason,
    hasCode:         code !== null,
    codeExpected:    tc.mustHaveCode !== false,
    patternPass:     patterns.passed,
    missingPatterns: patterns.missing,
    badFound:        patterns.badFound,
    generatedCode:   code,
  };
}

async function generateHarderCases(category, currentLevel, existingCases, allCategories) {
  const nextLevel     = currentLevel + 1;
  const masteredCases = existingCases
    .filter(c => c.category === category)
    .map(c => `  - [${c.id}] "${c.prompt}"`)
    .join('\n');

  const prompt = `You generate test cases for a PowerPoint AI assistant evaluation suite.

The AI just scored 95+/100 on ALL these level ${currentLevel} "${category}" cases:
${masteredCases}

Generate exactly ${HARDER_CASES_PER_GEN} NEW test cases at level ${nextLevel} for the "${category}" category that are SIGNIFICANTLY HARDER. They must:
1. Be in the same category but test more complex, realistic, or edge-case scenarios
2. Not repeat any existing test idea
3. Be solvable via real PowerPoint Office JavaScript APIs + the injected helpers
4. Include realistic deck state

VALID PATTERNS for "requiredPatterns" (pick from this list — anything else is hallucinated):
${PATTERN_WHITELIST_HINT.map(p => '  - ' + p).join('\n')}

NEVER use these in requiredPatterns or in the prompt (they DO NOT EXIST):
  presentation.theme, presentation.slides.add, presentation.exportToPdf,
  presentation.runSlideShow, slide.master, slide.theme, slide.transitions,
  slide.animations.add, slide.speakerNotes, slide.title.<x>, slide.body,
  slide.charts.add, shape.smartArt, Office.PowerPoint.TransitionType,
  workbook.*, worksheet.*, document.*, applyAnimation, applyTransition.

Return ONLY a valid JSON array, no explanation. Each object must have:
{
  "id": "gen-L${nextLevel}-${category.replace(/\s+/g, '-')}-NNN",
  "level": ${nextLevel},
  "category": "${category}",
  "prompt": "...",
  "workbook": "Slide 1 (id=256): TITLE=\\"...\\" | BODY=\\"...\\" | NOTES=\\"\\"",
  "mustHaveCode": true,
  "requiredPatterns": ["one or two strings from the VALID list above"],
  "forbiddenPatterns": []
}`;

  console.log(`\n  Generating up to ${HARDER_CASES_PER_GEN} level ${nextLevel} cases for "${category}"...`);
  const raw = await callLLM([
    { role: 'system', content: 'You generate JSON test cases. Return only valid JSON arrays. Only use real PowerPoint Office.js APIs or the listed injected helpers — never invent APIs.' },
    { role: 'user',   content: prompt },
  ], MODEL, 2048);

  try {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found in response');
    const newCases = JSON.parse(jsonMatch[0]);
    const validated = [];
    for (const c of newCases) {
      const v = validateGeneratedCase(c);
      if (v.ok) validated.push(c);
      else console.warn(`  Rejected ${c?.id || '(no id)'}: ${v.reason}`);
    }
    if (!validated.length) {
      console.warn(`  All ${newCases.length} generated cases for "${category}" referenced hallucinated APIs — skipping promotion.`);
      return [];
    }
    console.log(`  Accepted ${validated.length}/${newCases.length} generated cases for "${category}" at level ${nextLevel}`);
    return validated.slice(0, HARDER_CASES_PER_GEN);
  } catch (err) {
    console.warn(`  Failed to parse generated cases for "${category}": ${err.message}`);
    return [];
  }
}

async function generateEasierCases(category, currentLevel, existingCases) {
  const stuckCases = existingCases
    .filter(c => c.category === category && c.level === currentLevel)
    .map(c => `  - [${c.id}] "${c.prompt}"`)
    .join('\n');

  const prompt = `You generate test cases for a PowerPoint AI assistant evaluation suite.

The AI has been STUCK on level ${currentLevel} of the "${category}" category across multiple runs.
These are the current cases it keeps failing:
${stuckCases}

Generate exactly ${EASIER_CASES_PER_GEN} NEW test cases at level ${currentLevel} for "${category}" that are EASIER and more approachable. They must:
1. Test the same core category skill but with simpler scenarios
2. Avoid the tricky edge-cases the AI is clearly struggling with
3. Be solvable via real PowerPoint Office JavaScript APIs + injected helpers
4. Include simple, realistic deck state

VALID PATTERNS for "requiredPatterns" (pick from this list):
${PATTERN_WHITELIST_HINT.map(p => '  - ' + p).join('\n')}

NEVER use these (they DO NOT EXIST):
  presentation.theme, presentation.slides.add, slide.master, slide.transitions,
  slide.animations.add, slide.speakerNotes, slide.title.<x>, slide.body,
  slide.charts.add, shape.smartArt, Office.PowerPoint.TransitionType,
  workbook.*, worksheet.*, document.*, applyAnimation, applyTransition.

Return ONLY a valid JSON array, no explanation. Each object must have:
{
  "id": "gen-L${currentLevel}-${category.replace(/\s+/g, '-')}-easy-NNN",
  "level": ${currentLevel},
  "category": "${category}",
  "prompt": "...",
  "workbook": "Slide 1 (id=256): TITLE=\\"...\\" | BODY=\\"...\\" | NOTES=\\"\\"",
  "mustHaveCode": true,
  "requiredPatterns": ["one string from the VALID list above"],
  "forbiddenPatterns": []
}`;

  console.log(`\n  Generating up to ${EASIER_CASES_PER_GEN} easier cases for stuck category "${category}" (level ${currentLevel})...`);
  const raw = await callLLM([
    { role: 'system', content: 'You generate JSON test cases. Return only valid JSON arrays. Only use real PowerPoint APIs or listed helpers.' },
    { role: 'user',   content: prompt },
  ], MODEL, 2048);

  try {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found in response');
    const newCases = JSON.parse(jsonMatch[0]);
    const validated = [];
    for (const c of newCases) {
      const v = validateGeneratedCase(c);
      if (v.ok) validated.push(c);
      else console.warn(`  Rejected ${c?.id || '(no id)'}: ${v.reason}`);
    }
    console.log(`  Accepted ${validated.length}/${newCases.length} easier cases for "${category}"`);
    return validated.slice(0, EASIER_CASES_PER_GEN);
  } catch (err) {
    console.warn(`  Failed to parse easier cases for "${category}": ${err.message}`);
    return [];
  }
}

function writeMarkdownSummary(results, prev, timestamp) {
  const prevById = {};
  if (prev) for (const r of prev.results) prevById[r.id] = r;

  const byCategory = {};
  for (const r of results) {
    if (!byCategory[r.category]) byCategory[r.category] = [];
    byCategory[r.category].push(r);
  }
  const overall = results.reduce((s, r) => s + r.score, 0) / results.length;
  const prevOverall = prev ? prev.results.reduce((s, r) => s + r.score, 0) / prev.results.length : null;

  const lines = [];
  lines.push(`# PowerPoint AI — Eval Results`);
  lines.push(`**Last run:** ${timestamp.replace('T', ' ').replace(/-/g, (m, o) => o < 10 ? '-' : ':')}  `);
  lines.push(`**Overall: ${overall.toFixed(1)}/100**${prevOverall !== null ? `  (prev: ${prevOverall.toFixed(1)})` : ''}  `);
  lines.push(`**Model:** ${MODEL}\n`);
  lines.push(`## Scores by category\n`);
  lines.push(`| Category | Score | Trend | Cases |`);
  lines.push(`|---|---|---|---|`);
  for (const [cat, items] of Object.entries(byCategory)) {
    const avg = items.reduce((s, r) => s + r.score, 0) / items.length;
    const prevAvg = prev ? items.map(r => prevById[r.id]?.score ?? r.score).reduce((a, b) => a + b, 0) / items.length : null;
    const delta = prevAvg !== null ? avg - prevAvg : null;
    const trend = delta === null ? '—' : delta > 2 ? `↑ +${delta.toFixed(1)}` : delta < -2 ? `↓ ${delta.toFixed(1)}` : `→`;
    const mastMark = avg >= MASTERY_THRESHOLD ? ' ✓' : '';
    lines.push(`| ${cat}${mastMark} | ${avg.toFixed(1)}/100 | ${trend} | ${items.length} |`);
  }
  lines.push(`\n## All test cases\n`);
  lines.push(`| ID | Score | Pass | Reason |`);
  lines.push(`|---|---|---|---|`);
  for (const r of results) {
    const prevR = prevById[r.id];
    const delta = prevR ? r.score - prevR.score : null;
    const deltaStr = delta !== null && Math.abs(delta) >= 1 ? ` (${delta > 0 ? '+' : ''}${delta})` : '';
    const warn = r.score < 60 ? ' ⚠️' : r.score >= 95 ? ' ✅' : '';
    lines.push(`| ${r.id} | ${r.score}${deltaStr}${warn} | ${r.patternPass ? '✓' : '✗'} | ${r.reason} |`);
  }
  const failing = results.filter(r => r.score < 60);
  if (failing.length) {
    lines.push(`\n## ⚠️ Needs attention\n`);
    for (const r of failing) {
      lines.push(`**[${r.id}]** score=${r.score} — ${r.reason}`);
      if (r.missingPatterns.length) lines.push(`- missing patterns: \`${r.missingPatterns.join('`, `')}\``);
      if (r.badFound?.length) lines.push(`- forbidden patterns found: \`${r.badFound.join('`, `')}\``);
      lines.push('');
    }
  }
  fs.writeFileSync(path.join(__dirname, 'RESULTS.md'), lines.join('\n'));
}

function printResults(results, prev) {
  const prevById = {};
  if (prev) for (const r of prev.results) prevById[r.id] = r;
  const byCategory = {};
  for (const r of results) {
    if (!byCategory[r.category]) byCategory[r.category] = [];
    byCategory[r.category].push(r);
  }
  console.log('\n════════════════════════════════════════════════════');
  console.log('  POWERPOINT AI EVAL RESULTS');
  console.log('════════════════════════════════════════════════════\n');
  for (const [cat, items] of Object.entries(byCategory)) {
    const avg     = items.reduce((s, r) => s + r.score, 0) / items.length;
    const prevAvg = prev ? items.map(r => prevById[r.id]?.score ?? r.score).reduce((a, b) => a + b, 0) / items.length : null;
    const delta   = prevAvg !== null ? avg - prevAvg : null;
    const trend   = delta === null ? '' : delta > 2 ? ' ↑' : delta < -2 ? ' ↓' : ' →';
    const mastMark = avg >= MASTERY_THRESHOLD ? ' ✓ MASTERED' : '';
    console.log(`${cat.toUpperCase()} — ${avg.toFixed(1)}/100${trend}${mastMark}`);
    for (const r of items) {
      const d    = prevById[r.id] ? r.score - prevById[r.id].score : null;
      const diff = d !== null && Math.abs(d) >= 1 ? ` (${d > 0 ? '+' : ''}${d})` : '';
      const warn = r.score < 60 ? ' ⚠' : '';
      const bar  = '█'.repeat(Math.round(r.score / 10)) + '░'.repeat(10 - Math.round(r.score / 10));
      console.log(`  ${r.id.padEnd(36)} ${bar} ${String(r.score).padStart(3)}${diff}${warn}`);
      if (r.score < 70) console.log(`    → ${r.reason}`);
      if (r.missingPatterns.length) console.log(`    missing: ${r.missingPatterns.join(', ')}`);
    }
    console.log();
  }
  const overall     = results.reduce((s, r) => s + r.score, 0) / results.length;
  const prevOverall = prev ? prev.results.reduce((s, r) => s + r.score, 0) / prev.results.length : null;
  console.log(`OVERALL: ${overall.toFixed(1)}/100${prevOverall !== null ? `  (prev: ${prevOverall.toFixed(1)})` : ''}`);
  console.log(`SESSION COST: $${totalCostUSD.toFixed(4)}`);
  console.log('════════════════════════════════════════════════════\n');
}

// ── Main ──────────────────────────────────────────────────────────────────────
function writeDiagnosticResults(title, body) {
  try {
    const ts = new Date().toISOString();
    const md = `# PowerPoint AI — Eval Results\n**Last run:** ${ts}  \n**Status:** ${title}\n\n${body}\n`;
    fs.writeFileSync(path.join(__dirname, 'RESULTS.md'), md);
  } catch {}
}

async function main() {
  if (!OPENROUTER_KEY) {
    const body = [
      'The OPENROUTER_KEY environment variable is not set, so the eval cannot run.',
      '',
      '**Fix:** in GitHub repo Settings → Secrets and variables → Actions, add a repository secret named `OPENROUTER_KEY` with your OpenRouter API key (https://openrouter.ai/keys).',
      '',
      'Optional (for the web-search test cases): also add `BRAVE_KEY` or `GOOGLE_KEY`/`GOOGLE_CX`.',
    ].join('\n');
    writeDiagnosticResults('missing OPENROUTER_KEY', body);
    console.error('OPENROUTER_KEY not set — wrote diagnostic to eval/RESULTS.md');
    process.exit(1);
  }
  const allCases     = loadCases();
  const systemPrompt = loadSystemPrompt();
  const prev         = loadLastResults();
  const progress     = loadProgress();
  console.log(`\nRunning ${allCases.length} PowerPoint eval cases  |  model: ${MODEL}  |  budget: $${BUDGET_USD}\n`);

  const results = [];
  for (const tc of allCases) {
    process.stdout.write(`  ${tc.id.padEnd(36)} `);
    try {
      const r = await runCase(tc, systemPrompt);
      results.push(r);
      const bar = '█'.repeat(Math.round(r.score / 10)) + '░'.repeat(10 - Math.round(r.score / 10));
      console.log(`${bar} ${r.score}/100`);
    } catch (err) {
      if (err.message.startsWith('BUDGET_EXCEEDED')) {
        console.log('\n⚠ Budget limit hit — saving partial results and stopping.');
        break;
      }
      console.log(`ERROR: ${err.message}`);
    }
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outPath   = path.join(PATHS.results, `${timestamp}.json`);
  fs.writeFileSync(outPath, JSON.stringify({ timestamp, model: MODEL, totalCostUSD, results }, null, 2));
  printResults(results, prev);
  writeMarkdownSummary(results, prev, timestamp);

  // Per-category mastery + generation
  const byCategory = {};
  for (const r of results) {
    if (!byCategory[r.category]) byCategory[r.category] = [];
    byCategory[r.category].push(r);
  }
  let newCasesGenerated = [];
  const categoryStatus  = Object.entries(byCategory).map(([cat, items]) => {
    const currentLevel = progress[cat]?.level ?? 1;
    const currentItems = items.filter(r => r.level === currentLevel);
    const avg          = currentItems.length ? currentItems.reduce((s, r) => s + r.score, 0) / currentItems.length : 0;
    return { cat, avg, currentLevel, mastered: avg >= MASTERY_THRESHOLD };
  });
  // Promotion gate: only generate harder cases for a mastered category if
  // EVERY OTHER category is also performing well (>= PROMOTION_GATE_OTHERS).
  // Without this gate, a strong category balloons while weak ones stall —
  // and the auto-generator was creating hallucinated cases that poisoned
  // the suite.
  function otherCategoriesPass(targetCat) {
    const others = categoryStatus.filter(c => c.cat !== targetCat);
    if (!others.length) return true;
    const weakest = Math.min(...others.map(c => c.avg));
    return weakest >= PROMOTION_GATE_OTHERS;
  }

  for (const { cat, avg, currentLevel, mastered } of categoryStatus) {
    if (!progress[cat]) progress[cat] = { level: 1, masteredAt: null, runsAtLevel: 0 };
    progress[cat].lastScore  = Math.round(avg * 10) / 10;
    progress[cat].lastRun    = timestamp;
    if (mastered) {
      if (!otherCategoriesPass(cat)) {
        const others = categoryStatus.filter(c => c.cat !== cat);
        const weakest = others.length ? Math.min(...others.map(c => c.avg)) : 0;
        console.log(`✓ "${cat}" reached ${avg.toFixed(1)}/100 but holding promotion — other categories' weakest score is ${weakest.toFixed(1)} (need >= ${PROMOTION_GATE_OTHERS}).`);
        // Still mark the mastery on this run, but don't promote yet.
        continue;
      }
      console.log(`✓ "${cat}" mastered at level ${currentLevel} (avg ${avg.toFixed(1)}) and all other categories pass (>= ${PROMOTION_GATE_OTHERS}) — generating up to ${HARDER_CASES_PER_GEN} harder cases.`);
      try {
        const newCases = await generateHarderCases(cat, currentLevel, allCases, categoryStatus);
        if (newCases.length) {
          newCasesGenerated = [...newCasesGenerated, ...newCases];
          progress[cat].level       = currentLevel + 1;
          progress[cat].masteredAt  = timestamp;
          progress[cat].runsAtLevel = 0;
        } else {
          console.log(`  No valid harder cases produced — keeping "${cat}" at level ${currentLevel} for now.`);
        }
      } catch (err) {
        if (err.message.startsWith('BUDGET_EXCEEDED')) { console.log('Budget hit — skipping.'); break; }
        console.warn(`Generation failed for "${cat}": ${err.message}`);
      }
    } else {
      progress[cat].runsAtLevel = (progress[cat].runsAtLevel ?? 0) + 1;
      if (progress[cat].runsAtLevel >= STUCK_RUNS_THRESHOLD) {
        console.log(`⚠ "${cat}" stuck at level ${currentLevel} for ${progress[cat].runsAtLevel} runs — generating up to ${EASIER_CASES_PER_GEN} easier cases`);
        try {
          const easierCases = await generateEasierCases(cat, currentLevel, allCases);
          newCasesGenerated = [...newCasesGenerated, ...easierCases];
          progress[cat].runsAtLevel = 0;
        } catch (err) {
          if (err.message.startsWith('BUDGET_EXCEEDED')) { console.log('Budget hit — skipping.'); break; }
          console.warn(`Easier case generation failed: ${err.message}`);
        }
      }
    }
  }

  const overallAvg = results.length ? results.reduce((s, r) => s + r.score, 0) / results.length : 0;
  const existingCategories = Object.keys(byCategory);
  if (overallAvg >= NEW_CAT_THRESHOLD) {
    console.log(`\n📂 Overall avg ${overallAvg.toFixed(1)} >= ${NEW_CAT_THRESHOLD} — generating a new category...`);
    try {
      const newCat = await generateNewCategory(existingCategories);
      if (newCat) {
        newCasesGenerated = [...newCasesGenerated, ...newCat.cases];
        if (!progress[newCat.category]) progress[newCat.category] = { level: 1, masteredAt: null };
        console.log(`  Added new category: "${newCat.category}" (${newCat.cases.length} cases)`);
      }
    } catch (err) {
      if (err.message.startsWith('BUDGET_EXCEEDED')) console.log('Budget hit — skipping.');
      else console.warn(`New category generation failed: ${err.message}`);
    }
  } else if (overallAvg >= NEW_CAT_L2_THRESHOLD) {
    console.log(`\n📂 Overall avg ${overallAvg.toFixed(1)} >= ${NEW_CAT_L2_THRESHOLD} — generating a level-2 category...`);
    try {
      const newCat = await generateNewCategory(existingCategories);
      if (newCat) {
        newCasesGenerated = [...newCasesGenerated, ...newCat.cases];
        if (!progress[newCat.category]) progress[newCat.category] = { level: 1, masteredAt: null, runsAtLevel: 0 };
        console.log(`  Added new category: "${newCat.category}" (${newCat.cases.length} cases)`);
      }
    } catch (err) {
      if (err.message.startsWith('BUDGET_EXCEEDED')) console.log('Budget hit — skipping.');
      else console.warn(`New category generation failed: ${err.message}`);
    }
  }

  if (newCasesGenerated.length > 0) {
    const existing  = fs.existsSync(PATHS.generated) ? JSON.parse(fs.readFileSync(PATHS.generated, 'utf8')) : [];
    fs.writeFileSync(PATHS.generated, JSON.stringify([...existing, ...newCasesGenerated], null, 2));
    console.log(`\nSaved ${newCasesGenerated.length} new generated cases to eval/generated-cases.json`);
  }
  saveProgress(progress);

  const failingResults = results.filter(r => r.score < 70);
  if (failingResults.length > 0) {
    console.log(`\n⚡ ${failingResults.length} test(s) failed (<70) — generating system prompt patch...`);
    try {
      const impFile = path.join(__dirname, 'improvements.txt');
      const currentImprovements = fs.existsSync(impFile) ? fs.readFileSync(impFile, 'utf8').trim() : '';
      const fix = await generateFix(failingResults, currentImprovements);
      applyImprovements(fix);
    } catch (err) {
      if (err.message.startsWith('BUDGET_EXCEEDED')) console.log('Budget hit — skipping.');
      else console.warn(`Auto-patch failed: ${err.message}`);
    }
  } else {
    console.log('\n✓ All tests passed (>=70) — no system prompt patch needed.');
  }
  console.log(`\nResults → eval/results/${timestamp}.json`);
  console.log(`Total cost: $${totalCostUSD.toFixed(4)}\n`);
}

main().catch(err => {
  console.error('FATAL:', err.message);
  console.error(err.stack);
  try {
    const body = [
      'The eval script crashed with an uncaught exception.',
      '',
      '```',
      String(err.stack || err.message || err),
      '```',
      '',
      'Check the GitHub Actions log for details. Common causes:',
      '- API rate limit or transient network failure (try again next run)',
      '- BUDGET_EXCEEDED — the $0.50 per-run cap was reached',
      '- JSON parse error in cases.json or generated-cases.json',
    ].join('\n');
    writeDiagnosticResults('crashed', body);
  } catch {}
  process.exit(1);
});
