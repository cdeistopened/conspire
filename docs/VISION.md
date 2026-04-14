# Conspire — Product Vision & Marketing Seeds

*Captured from Charlie Deist's thinking, April 6 2026*

---

## The Core Insight

We've been stuck in two modes:

1. **Terminal mode** — powerful agents that do amazing work nobody can see. You're staring at a CLI while your agent rewrites an entire book chapter. Your teammate has no idea what's happening.

2. **App mode** — beautiful interfaces where agents are bolted-on afterthoughts. Notion has "AI" but it's just a text box that autocompletes. The agent can't see the kanban. It can't drag a card. It can't read the context of what you're doing.

**Conspire is visual-first, agent-native.** The interface exists for humans. The files exist for agents. Skills bridge them. Every visual action has a file-system equivalent. Every agent action has a visual representation.

## Skills Over Scripts

This is the future of software.

A Python script does one thing rigidly. When the API changes, it breaks. When the use case shifts slightly, you rewrite it.

A skill gives the agent intent and context. The agent figures out execution. It reads the error and adapts. It combines tools based on what the job actually needs, not what a developer hardcoded six months ago.

Conspire skill bundles aren't automation workflows. They're capability packages. Install `conspire:research-desk` and your agent gains the ability to poll feeds, transcribe podcasts, decompose content, detect frameworks, propose wiki updates. HOW it does each of those things depends on what tools are available, what APIs you've configured, what model you're running.

BYOAI means the skills work with any agent. Claude Code, Cursor, Goose, local Llama — if it can POST to an API, it can participate.

## Curated Context Environments

Every Conspire project is a curated context environment:

```
Visual Template (what the user sees)
  + Skill Bundle (what the agent can do)
  + File Structure (what's on disk — always markdown)
  + Bridges (what it connects to — APIs, platforms, services)
```

The visual layer makes it feel like a purpose-built app. Underneath, it's always portable markdown files. You can open any Conspire project in Obsidian, VS Code, or a plain text editor. Nothing proprietary.

## The App Catalog

Each of these is a thin visual layer over markdown + skills. They share the Conspire platform — Proof for editing, Convex for state, skills for capability.

### App 1: Social Scheduler (building first)
**What it replaces:** Notion content calendar (abandoned), GitHub markdown review workflow, manual Zernio scheduling.
**Visual:** Kanban board (Draft → Review → Approved → Scheduled → Posted)
**Skills:** newsletter-to-social, crux-to-draft, hook-optimizer, quality-loop
**Files:** Posts as markdown with status/platform/schedule frontmatter
**Bridges:** Zernio (scheduling), Beehiiv (newsletter), platform APIs
**Team:** Kovid drafts, Charlie approves, Claude enriches, Linda monitors

### App 2: Research Desk (Crux Intelligence Desk evolution)
**What it replaces:** Crux Dashboard (localhost:8003), manual RSS triage, X bookmark processing
**Visual:** Feed reader + triage pipeline + processing bay + knowledge base health dashboard
**Skills:** RSS polling, web scraping, podcast transcription, X bookmark sync, decomposition, framework detection, wiki health checks
**Files:** Tracking items as markdown, output as processed markdown
**Bridges:** Gemini (transcription/OCR), Crux CLI (ingestion), Quartz (wiki deploy), Enzyme/Napkin (search)
**Key feature:** Bring your own API keys. Hook up your own scraping tools, your own transcription service, your own search index. The skills know the intent — the agent figures out which tool to call.

### App 3: Doodle Scanner (ScanDoc 9000)
**What it is:** A scanning utility that boils documents down to markdown. The interface is for the user to thumb through pages and snap pictures. The actual processing uses Claude Code as the engine — the harness drives the work according to skills.
**Visual:** Camera interface + page gallery + OCR preview + processed output
**Skills:** recipe-scan, pdf-vision, document OCR pipeline, handwriting preservation
**Files:** Scans as markdown + images
**Bridges:** Gemini OCR API
**Revenue model:** Lightweight API key gate — users bring their own Gemini key, or pay for a hosted key. The scanning interface is free; the processing costs tokens.
**Already built:** `crux/scanner/` on Railway. Needs visual upgrade + skill integration.

### App 4: Doodle Reader (RSS + Podcast Consumer)
**What it is:** The consumer-facing version of the Research Desk. Subscribe to feeds, transcribe podcasts, build personal knowledge bases. The CIA audit tool ("you have 7 books in your podcast archive") lives here.
**Visual:** Magazine-style feed reader + transcription button + wiki builder
**Skills:** RSS ingestion, podcast transcription, knowledge base compilation
**Files:** Feed items + transcripts as markdown
**Bridges:** iTunes API (podcast discovery), Gemini (transcription), Quartz (wiki hosting)
**Already built:** `crux/reader/` — React 19 + Vite, working locally at localhost:3333.

### App 5: Book Project (Scrivener replacement)
**Visual:** Chapter sidebar + manuscript editor + word count + export preview
**Skills:** book-writer (chapter agents), quality-loop (5-judge gate), voice-dna (consistency), gemini-writer (large-context rewrites)
**Files:** Chapters as numbered markdown files, front/back matter, notes
**Bridges:** Vellum export, KDP upload, Proof for beta reader collaboration
**Already building:** Benedict Challenge (47K words), RLM pocket guides, CLM Publishing

### App 6: Website Builder
**Visual:** Page preview + component palette + Webflow field mapper. Thumbnails map clearly from markdown to CMS fields.
**Skills:** webflow-publish, seo-content-production, clone-website
**Files:** Pages as markdown with CMS field frontmatter
**Bridges:** Webflow CMS API, Cloudflare R2 for media
**Already building:** CIA website (creativeintel.agency), OpenEd blog

### App 7: Wiki / Knowledge Base
**Visual:** Knowledge graph + article editor + health dashboard + coverage map
**Skills:** plugin-builder, archive-decomposer, interlink, wiki-health
**Files:** Standard Quartz wiki structure — content/{slug}.md with backlinks
**Bridges:** Quartz build → Vercel deploy, QMD/Enzyme search
**Already built:** 12 wiki plugins, 11 deployed Quartz sites

### App 8: Real Estate / Zillow Tool
**Details TBD** — Charlie has ideas here. A Conspire environment for real estate research, property analysis, or listing management. The same pattern: visual template + skill bundle + markdown files + bridges to Zillow/MLS APIs.

### App 9: Client Deliverables Dashboard
**What it is:** CIA Ring 1. The client sees their content pipeline in a Conspire dashboard. CIA drafts, client approves. White-label Conspire for service delivery.
**Visual:** Client-facing kanban with simplified status
**Skills:** Whatever the engagement requires — plugin-builder, book-writer, content-repurposer
**Bridges:** Whatever the client uses — Webflow, Beehiiv, YouTube, podcast hosting

## The Widget System

Like Notion blocks but agent-aware:

- **Text block** → markdown paragraph
- **Image** → `![alt](path)` in markdown, visual preview in editor
- **Embed** → iframe or API-rendered preview (YouTube, tweet, chart)
- **Status pill** → frontmatter `status:` field, draggable in kanban
- **Kanban card** → one markdown file, shown as a card
- **Chapter item** → one markdown file in a numbered folder
- **Scan page** → one image + OCR output, shown in a flipbook
- **Metrics widget** → reads from Convex, displays chart
- **Skill button** → triggers a Claude Code skill from the UI ("Run quality check")
- **API key field** → user configures their own keys for BYOAI tools

All widgets render visually but serialize to markdown + frontmatter. Nothing proprietary.

## Existing Assets That Become Conspire Apps

Charlie has already built the components. Conspire is the unified visual layer:

| Asset | Current State | Conspire Future |
|-------|--------------|----------------|
| **Crux CLI** (`doodle`) | 7 commands, 120 RSS feeds, 6 source types | Research Desk backend |
| **Crux Dashboard** | localhost:8003, single HTML file | Research Desk app |
| **Doodle Reader** | React 19 + Vite, localhost:3333 | Consumer reader app |
| **Doodle Scanner** | Flask, Railway | Scanner app |
| **12 wiki plugins** | Quartz sites on Vercel | Wiki app template |
| **Plugin Builder** | Claude Code skill | Wiki compilation skill bundle |
| **250+ skills** | Scattered across .claude/skills/ | Conspire skill marketplace |
| **Voice memo pipeline** | Bun script + Gemini | Research Desk ingestion |
| **Processing bay** | Standalone HTML | Research Desk triage view |
| **Proof SDK** | Cloned, tested, LAN configured | Conspire editor |
| **Social media queue** | Markdown files in OpenEd Vault | Scheduler app |
| **Content calendar eval** | Airtable chosen, not built | Superseded by scheduler app |

## Marketing Angles

### "The missing layer"
Every agent tool today is stuck in the terminal. Every collaboration tool today bolts AI on as an afterthought. Conspire is the layer between them — where your agent and your team actually work together.

### "Skills, not scripts"
Software used to be: hire a developer to write code. Then it became: subscribe to a SaaS. Next: install a skill. One click, your agent gains a new capability. The skill adapts. The script breaks.

### "Breathe together"
The name carries the message. Conspire = conspirare = to breathe together. Your agent isn't a tool you use. It's a collaborator you breathe with. You see its edits appear in real time. It sees your approvals. You're co-authoring.

### "Curated context environments"
Not apps. Environments. You don't install a "social media scheduler." You set up a workspace where your agent knows how to draft posts, your team knows where to approve them, and the whole thing publishes automatically. The environment is the product.

### "BYOAI"
Bring your own AI. Conspire doesn't care if you use Claude, GPT, Gemini, Llama, or something that doesn't exist yet. If your agent can make HTTP calls, it can participate. No lock-in. Ever.

### The WHO Economy connection
Conspire + wiki knowledge bases = the WHO Economy infrastructure. Every creator owns their knowledge base (markdown files, local-first). Conspire gives them the visual layer to manage it. CIA helps them set it up. The trust is in the WHO — the curator — not in the platform.

---

*These are seeds, not finished copy. Capture the thinking now. Polish when it's time to ship.*
