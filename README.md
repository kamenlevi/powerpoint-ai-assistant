# PowerPoint AI Assistant

A private, local AI assistant for Microsoft PowerPoint — built as an Office Task Pane add-in. Ask in plain English to add slides, change themes, write speaker notes, or generate an entire deck. The AI emits Office JavaScript that runs directly inside your presentation.

## What it does

- **Talk to your deck.** "Make slide 2's title bold and 48pt." "Apply a corporate blue theme." "Write speaker notes for the current slide." The AI writes and executes Office JS so changes appear instantly.
- **Generate full decks from a prompt.** "Create a 10-slide pitch about climate change for a board audience." A guided dialog (topic / slides / audience / tone) produces a slide-by-slide deck in front of you.
- **Theme & color scheme designer.** Pick from 8 built-in themes (Corporate Blue, Modern Mono, Warm Sunset, Midnight, Pastel, High Contrast, Terracotta, Forest) or ask the AI to design a custom palette and recolor the whole deck.
- **Presenter coach.** Click "🎤 Coach me" on any slide. Get feedback on clarity, timing, an engagement hook, and ready-to-read speaker notes you can apply with one click.
- **Local image asset pack.** Download a curated CC0 image library (~800 images across 14 categories — people, technology, finance, nature, healthcare, etc.). When the AI needs to insert an image, it picks the best match from your local pack. **No AI image generation, ever.**
- **Web search on demand.** When the AI needs live data (today's stock prices, current weather, recent news), it tells you it can't reach the web and offers a one-time search you can approve. Or set web search to always-on in Settings if you don't need fully-local operation. **Google Custom Search** is the default provider; Brave Search is a drop-in alternative.
- **Transitions and animations on new slides.** Pass `{transition:"fade"}` or `{animation:"fadeIn"}` to `addSlide` and the AI bakes the OOXML animation/transition timing into the slide on creation. (Live edits to animations on *existing* slides aren't possible — PowerPoint Office.js doesn't expose that — but the AI will offer to recreate the slide for you.)
- **Slide reordering.** The AI uses a `moveSlide(from, to)` helper that copies a slide's content + notes + layout, inserts it at the target, then deletes the original. Works around the fact that PowerPoint Office.js has no native reorder API.

## Features at a glance

- **CODE_JS protocol**: AI emits `CODE_JS::...::END_CODE` blocks; the task pane wraps them in `PowerPoint.run(...)`.
- **Multi-provider AI**: OpenRouter (default — Llama 3.3 70B), Groq, Ollama (local), MLX (Mac).
- **Chat history** with auto-summarization after 10 messages.
- **Model picker** with filter/sort/search; AI-recommended model based on your hardware.
- **Cost limits** per-prompt or per-session with running session-cost display.
- **Advanced options**: Deep Think · Dynamic Depth · Auto Model · Plan First · Slide-by-slide preview.
- **Auto-retry** when generated code fails; AI rewrites and re-executes.
- **Eval framework** with LLM-as-judge scoring and auto-improvement via GitHub Actions every 8 hours.

## Requirements

- **Node.js 18+**
- **Microsoft PowerPoint** (desktop or web — desktop works most reliably)
- An **OpenRouter API key** (free tier available at openrouter.ai)
- Optional: **Groq API key** for ultra-fast inference
- Optional: a **web search provider**:
  - **Google Custom Search** (default, recommended) — 100 free queries/day. Set `GOOGLE_KEY` + `GOOGLE_CX`. Create a key at console.cloud.google.com and a search engine at programmablesearchengine.google.com (toggle "Search the entire web" on).
  - **OR Brave Search** — 2,000 free queries/month at brave.com/search/api. Set `BRAVE_KEY`.
  - Pick one with `WEB_SEARCH_PROVIDER=google` (or `brave`) in `.env`.

## Setup

1. Clone this repo and install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and add your API keys:
   ```
   OPENROUTER_KEY=sk-or-v1-...
   GROQ_KEY=gsk_...               # optional
   GOOGLE_KEY=...                  # optional, enables web search (Google Custom Search)
   GOOGLE_CX=...                   # the Custom Search Engine ID
   BRAVE_KEY=...                   # optional, alternative web-search provider
   WEB_SEARCH_PROVIDER=google      # or 'brave'
   ```

3. Generate the icon PNGs (one time):
   ```
   node create-icons.js
   ```

4. Start the local HTTPS server:
   ```
   npm start
   ```
   The first run generates a self-signed cert. In PowerPoint desktop you may need to install the dev cert once (`npx office-addin-dev-certs install`).

5. Sideload the add-in in PowerPoint:
   - **Desktop**: Insert → My Add-ins → Upload My Add-in → choose `manifest.xml`
   - **Web**: Insert → Add-ins → Upload My Add-in

6. Click the "PowerPoint AI" button on the Home tab to open the task pane.

## First-time use

- **Image asset pack**: Go to Settings → Data → click "Download asset pack". This pulls ~20 CC0 starter images. The maintainer can run `npm run build-pack` with Pexels/Unsplash/Pixabay API keys to expand to the full ~800-image library.
- **Web search**: By default the AI will *ask before searching*. To enable always-on web access, go to Settings → Data → Web Search → "Always on".

## Example prompts

- "Create a 10-slide pitch deck about renewable energy for investors"
- "Apply the midnight theme"
- "Make all body text on every slide use Inter at 18pt"
- "Add a CONFIDENTIAL watermark to every slide"
- "Write speaker notes for slide 3 explaining the chart"
- "Add a finance growth image to slide 2 on the right"
- "How many slides do I have?"
- "What's the title of slide 5?"
- "Design a calm trustworthy theme for a healthcare startup and apply it"

## What the AI can do — even the "hard" stuff

Office.js doesn't expose certain APIs, but the assistant works around them where it can:

| Capability | How |
|---|---|
| **Add transitions to new slides** (fade / push / wipe / zoom / cut) | OOXML `<p:transition>` baked into the slide template |
| **Add fade-in animation to new slides** | OOXML `<p:timing>` block with the fade-in preset |
| **Reorder slides** (`moveSlide(from, to)`) | Copy content + delete original, then rotate via repeated moves |
| **Insert images** (no AI gen) | Picks from local CC0 asset pack via `insertImage` |
| **Live web data** | One-time Google or Brave search with user permission |

## What the AI still can't do (and will say so)

These have no Office.js API and no reasonable OOXML workaround. The AI refuses cleanly:

- **Editing animations or transitions on EXISTING slides** — only applicable at creation time. The AI will offer to recreate the slide with the desired animation.
- **Export to PDF / image** — no JS API.
- **Chart creation** on slides — no JS API. Workaround: AI uses `insertImage` with category `charts-diagrams` for a generic chart image.
- **SmartArt creation** — no JS API.
- **Slideshow control** (start/stop presenter mode) — no JS API.
- **AI image generation** — by design (use the local asset pack instead).

## Project structure

```
powerpoint-ai-assistant/
├── server.js                       # Express backend (~900 lines)
├── manifest.xml                    # Office add-in manifest (Host=Presentation)
├── create-icons.js                 # Icon PNG generator
├── package.json
├── .env.example
├── public/
│   ├── index.html                  # Task pane SPA (~1400 lines)
│   ├── helpers.js                  # Themes + runtime PPTX builder (JSZip)
│   ├── commands.html
│   └── icon-{16,32,80}.png
├── assets/pack/
│   └── manifest.json               # Image pack index (per-image tags, license, sha256)
├── scripts/
│   └── build-pack.js               # Maintainer script for expanding the image pack
├── eval/
│   ├── run.js                      # Eval runner with LLM-as-judge
│   ├── cases.json                  # 31 test cases across 13 categories
│   ├── generated-cases.json        # Auto-generated harder/easier cases
│   ├── progress.json               # Per-category mastery tracking
│   ├── improvements.txt            # Auto-patched system prompt additions
│   ├── watchdog.js                 # Fallback runner if CI misses its window
│   ├── RESULTS.md                  # Latest eval scoreboard
│   └── results/                    # JSON history of every run
└── .github/workflows/
    └── eval.yml                    # Runs every 8 hours, commits improvements
```

## How it works

1. **You type a request.** The task pane snapshots the current deck (slide titles, body text, speaker notes — up to 30 slides) and sends it plus your message to `/api/chat`.
2. **The AI plans and emits code.** Backed by a 250-line system prompt that knows the PowerPoint Office.js surface, available helpers (`addSlide`, `applyTheme`, `recolorDeck`, `addSpeakerNote`, `insertImage`, etc.), and the forbidden APIs. The response includes a `CODE_JS::...::END_CODE` block.
3. **The task pane executes the code.** Wraps it in `PowerPoint.run(async ctx => { /* helpers in scope */ /* AI code */ })`. Helpers like `addSlide` build a minimal one-slide PPTX in-browser with JSZip and call `presentation.insertSlidesFromBase64`.
4. **Auto-retry on failure.** If the code throws, the error is fed back to the AI which rewrites and re-runs.
5. **Auto-improvement loop.** Every 8 hours, GitHub Actions runs `npm run eval` against 31 test cases. Failing cases (<70/100) trigger an LLM-generated patch to `eval/improvements.txt` which is appended to the system prompt on next start. Mastered categories (≥95) auto-generate harder cases. Stuck categories auto-generate easier ones.

## Web-search permission model

| Mode (Settings → Data → Web Search) | AI behavior |
|---|---|
| **Off** (default) | AI emits `NEEDS_WEB_SEARCH::{...}::END`. Task pane shows a permission card with the suggested query and an "Allow this search" button. After approval, the AI gets the results and continues. |
| **On** | Searches happen automatically. A small pill appears on the message showing the query and result count; click to expand and see the sources. |
| **Disabled** | AI never searches. If you ask something time-sensitive, it tells you to enable web search in Settings. |

The web search uses Brave Search API. If `BRAVE_KEY` isn't set, the feature is disabled cleanly in the UI.

## Image asset pack

The pack lives at `assets/pack/`. The manifest (`assets/pack/manifest.json`) is checked into git; the actual image files are downloaded on demand via Settings → Data → "Download asset pack". All images are CC0 from Pexels, Unsplash, and Pixabay — free for personal and commercial use.

To build a fuller pack, set API keys and run:
```
PEXELS_KEY=xxx UNSPLASH_KEY=yyy PIXABAY_KEY=zzz npm run build-pack
```
This downloads ~50-80 images per category × 14 categories ≈ 800 images, computes SHA-256 hashes, and rewrites the manifest. Then commit the updated manifest and bundle the images as a GitHub Release tarball.

## Configuration

In `server.js`:
- `DEFAULT_MODEL` — defaults to `meta-llama/llama-3.3-70b-instruct`
- `USE_OPENROUTER` / `USE_GROQ` / `USE_MLX` flags
- `MACBOOK_IP` — for MLX/Ollama on a separate Mac
- All API keys are read from `.env` (never logged)

## Acknowledgments

This is a sister project to excel-ai-assistant, which uses the same architecture for Excel.
