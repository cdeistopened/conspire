---
title: "feat: Conspire — Agentic Creative IDE"
type: feat
status: active
date: 2026-04-06
scope: full-build
prd: https://www.proofeditor.ai/d/x5mrnxjh?token=8f771653-5341-4f81-b114-0c8a109115b0
supersedes: 2026-04-06-002-feat-proof-convex-social-scheduler-plan.md
---

# Conspire

*Latin: conspirare — "to breathe together"*

A hybrid local/cloud agentic creative IDE. Your agent edits alongside you because it's linked to your terminal. Extensible to co-work with anyone. BYOAI. One-skill installs. Built on Proof + Convex.

---

## What Is This

Conspire is the creative workspace where context engineering happens. It connects three things that don't talk to each other today:

1. **Your terminal** (where your agent lives — Claude Code, Cursor, Goose, whatever)
2. **Your editor** (where you actually write — real-time, collaborative, rich markdown)
3. **Your team** (where approval, scheduling, and publishing happen)

The terminal gives the agent power. The editor gives humans comfort. Conspire bridges them.

## Why This Exists

Every agent tool today forces you to choose:
- **Terminal-only** (Claude Code, Cursor) — powerful but no collaboration, no visual editing, teammates can't see your work
- **Editor-only** (Notion, Google Docs) — collaborative but agents can't participate meaningfully
- **Platform-only** (Airtable, Linear) — structured but no authoring, no agent integration

Conspire doesn't choose. Your agent operates from the terminal. You write in a real editor. Your team sees a kanban. Everything syncs in real time.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CONSPIRE                           │
│                                                       │
│  ┌──────────┐    ┌──────────────┐    ┌────────────┐ │
│  │ Terminal  │    │   Editor     │    │  Dashboard  │ │
│  │          │    │              │    │             │ │
│  │ Claude   │◄──►│  Proof SDK   │◄──►│  Kanban +   │ │
│  │ Code     │    │  (Milkdown/  │    │  Calendar + │ │
│  │ Cursor   │    │   Yjs CRDTs) │    │  Pipeline   │ │
│  │ Goose    │    │              │    │             │ │
│  │ Any agent│    │  Agent Bridge│    │  Team views  │ │
│  └────┬─────┘    └──────┬───────┘    └──────┬──────┘ │
│       │                 │                    │        │
│       └────────┬────────┴────────┬───────────┘        │
│                │                 │                     │
│         ┌──────▼──────┐  ┌──────▼──────┐             │
│         │   Convex    │  │   Skills    │             │
│         │  (real-time │  │  (one-click │             │
│         │   database) │  │   install)  │             │
│         └──────┬──────┘  └─────────────┘             │
│                │                                      │
│         ┌──────▼──────┐                              │
│         │  Bridges    │                              │
│         │  Zernio     │                              │
│         │  Beehiiv    │                              │
│         │  Webflow    │                              │
│         │  GitHub     │                              │
│         └─────────────┘                              │
└─────────────────────────────────────────────────────┘
```

### The Three Interfaces

**Terminal (agent's home)**
- Your agent lives here. Claude Code, Cursor, Goose — whatever.
- Agent creates/edits Conspire documents via HTTP API (Proof's agent bridge)
- Agent reads project state via Convex queries (MCP server or direct API)
- Agent installs skills that extend Conspire's capabilities
- No new tooling needed — if you have a terminal and an agent, you have Conspire

**Editor (human's home)**
- Proof SDK: Milkdown (ProseMirror), Yjs CRDTs, real-time collaboration
- Rich markdown editing with suggestions, comments, track changes
- Presence indicators (see who's editing — human or agent)
- Opens in browser — desktop, tablet, phone
- Agent edits appear live as you watch

**Dashboard (team's home)**
- Kanban board: documents flow through status columns
- Calendar view: scheduled content by date
- Pipeline view: content from source → draft → review → approved → published
- Built on Convex reactive queries — updates in real time, no refresh
- Click any card → opens in Proof editor

### The Backend

**Convex (real-time database)**
- Source of truth for document metadata (status, platform, author, schedule)
- Reactive queries power the dashboard — no polling
- Actions handle integrations (Zernio, Beehiiv, Webflow)
- File storage for media (images, video thumbnails)
- Auth via Clerk or GitHub OAuth
- Free tier: 0.5GB database, sufficient for thousands of posts

**Proof (document server)**
- Source of truth for document content (the actual writing)
- Real-time collaboration via Yjs
- Agent bridge for programmatic access
- Either hosted (proofeditor.ai) or self-hosted (MIT)
- Linked to Convex via `proof_slug` field

### The Skill System

One-click installs that extend what Conspire can do:

```
/install conspire:newsletter-to-social
/install conspire:crux-to-draft
/install conspire:voice-memo-to-post
/install conspire:seo-article-pipeline
/install conspire:podcast-to-spokes
```

Each skill is a Claude Code skill that knows how to:
1. Read from a source (Crux, vault, RSS, voice memo)
2. Create Conspire documents via Proof API
3. Set metadata via Convex mutations
4. Optionally enrich (add images, optimize hooks, check quality)

Skills are the extensibility layer. The platform ships with a few. Anyone can build more. This is the CIA skill marketplace applied to collaborative authoring.

### BYOAI (Bring Your Own AI)

Conspire doesn't care which agent you use. The interfaces are:
- **Proof Agent Bridge**: HTTP REST API. Any agent that can make HTTP calls can edit, comment, suggest.
- **Convex API**: TypeScript client or REST. Any agent can query/mutate the database.
- **MCP Server**: For agents that speak MCP (Claude Code, Cursor). Exposes Convex tables + Proof docs as tools.

You use Claude Code? Great. Cursor? Fine. Goose? Sure. Local Llama? If it can POST to an API, it can participate.

## Convex Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    // Core
    title: v.string(),
    proof_slug: v.string(),
    proof_token: v.optional(v.string()),
    doc_type: v.union(
      v.literal("social_post"),
      v.literal("blog_draft"),
      v.literal("newsletter"),
      v.literal("note"),
    ),

    // Status pipeline
    status: v.union(
      v.literal("draft"),
      v.literal("review"),
      v.literal("approved"),
      v.literal("scheduled"),
      v.literal("posted"),
      v.literal("archived"),
    ),

    // Metadata
    platform: v.optional(v.union(
      v.literal("x"), v.literal("linkedin"), v.literal("instagram"),
      v.literal("facebook"), v.literal("tiktok"), v.literal("substack"),
      v.literal("webflow"), v.literal("beehiiv"),
    )),
    author: v.string(),
    scheduled_date: v.optional(v.number()),
    published_date: v.optional(v.number()),
    campaign: v.optional(v.id("campaigns")),
    source: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),

    // Publishing
    external_id: v.optional(v.string()),  // Zernio, Beehiiv, Webflow ID
    external_url: v.optional(v.string()), // Published URL

    // Media
    media: v.optional(v.array(v.id("_storage"))),

    // Performance (filled post-publish)
    performance: v.optional(v.object({
      likes: v.optional(v.number()),
      comments: v.optional(v.number()),
      impressions: v.optional(v.number()),
      clicks: v.optional(v.number()),
    })),
  })
    .index("by_status", ["status"])
    .index("by_type", ["doc_type"])
    .index("by_platform", ["platform"])
    .index("by_author", ["author"])
    .index("by_campaign", ["campaign"])
    .index("by_scheduled", ["scheduled_date"]),

  campaigns: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    start_date: v.optional(v.number()),
    end_date: v.optional(v.number()),
  }),

  team: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("viewer")),
    avatar_url: v.optional(v.string()),
  }),

  activity: defineTable({
    document: v.id("documents"),
    actor: v.string(),
    action: v.string(),  // "created", "status_changed", "commented", "scheduled", "published"
    details: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_document", ["document"])
    .index("by_timestamp", ["timestamp"]),
});
```

## Implementation Phases

### Phase 1: Foundation (Week 1)

- [ ] **1.1 Repo setup**
  - Create `cdeistopened/conspire` repo
  - Monorepo: `packages/dashboard`, `packages/convex`, `packages/skills`
  - Fork Proof SDK or use hosted proofeditor.ai initially

- [ ] **1.2 Convex backend**
  - `npx convex init` in `packages/convex`
  - Define schema (documents, campaigns, team, activity)
  - Write core functions: createDocument, updateStatus, listByStatus, listByType
  - Write Proof bridge: createDocument mutation that calls Proof API → stores slug
  - Deploy to Convex cloud (free tier)

- [ ] **1.3 Kanban MVP**
  - React + Vite + Convex client in `packages/dashboard`
  - 5-column board reading from Convex
  - Drag-and-drop status changes
  - Card click → opens Proof editor in new tab
  - "New Post" → creates Proof doc + Convex record
  - Deploy to Railway

### Phase 2: Publishing Bridges (Week 2)

- [ ] **2.1 Zernio bridge**
  - Convex action: on status → "approved", fetch content from Proof, POST to Zernio
  - Handle multi-platform (one doc → multiple Zernio posts)
  - Update status to "scheduled", store external_id

- [ ] **2.2 Activity feed**
  - Log every status change, comment, edit to activity table
  - Display as timeline on document detail view
  - "Charlie approved this 2h ago" / "Claude drafted this from newsletter-04-07"

- [ ] **2.3 Migrate existing queue**
  - Import `OpenEd Vault/Studio/Social Media/queue/*.md` as Conspire documents
  - Import Kovid's tweet drafts
  - Kill the GitHub markdown workflow

### Phase 3: Agent Integration (Week 3)

- [ ] **3.1 MCP server**
  - Expose Convex tables as MCP tools
  - `conspire:list_documents`, `conspire:create_document`, `conspire:update_status`
  - `conspire:get_content` (reads from Proof via API)
  - Install in `.mcp.json`

- [ ] **3.2 Core skills**
  - `newsletter-to-conspire` — reads Beehiiv/vault newsletter → creates N social post docs
  - `crux-to-conspire` — takes a Crux item → drafts a post in Conspire
  - `voice-memo-to-conspire` — routes voice memo sub-items as Conspire drafts

- [ ] **3.3 Claude workflow integration**
  - From terminal: "draft 5 tweets from this week's newsletter" → skill creates 5 Conspire docs
  - Claude edits each via Proof agent bridge
  - Charlie sees 5 new cards in Draft column
  - Reviews, drags to Approved → auto-schedules

### Phase 4: Polish + Extend (Week 4)

- [ ] **4.1 Dashboard views**
  - Calendar view (scheduled content by date)
  - Pipeline view (source → draft → published, with conversion stats)
  - Filter by: platform, author, campaign, date range

- [ ] **4.2 Media handling**
  - Image upload to Convex file storage
  - Thumbnail preview on kanban cards
  - Nano Banana / Gemini image gen integration via skill

- [ ] **4.3 Performance tracking**
  - Scheduled Convex function: pull engagement stats from Zernio after 48hrs
  - Display on card: likes, comments, impressions
  - Campaign-level roll-up

- [ ] **4.4 Self-hosted Proof option**
  - Fork Proof SDK, swap ephemeral store for doc-store-sqlite
  - Deploy alongside kanban on Railway
  - Migrate from proofeditor.ai when ready

## What Ships When

**Start humble. Scheduler first. Prove the architecture. Then expand.**

| Phase | What ships | Timeline |
|-------|-----------|----------|
| Phase 1 | Kanban + Proof editor + Convex backend. Team can see, write, and move posts. | Week 1 |
| Phase 2 | Auto-scheduling via Zernio. Activity feed. Existing content migrated. | Week 2 |
| Phase 3 | Claude creates posts from terminal. MCP access. Skills. | Week 3 |
| Phase 4 | Calendar, media, performance tracking, self-hosted option. | Week 4 |

## App Roadmap

### App 1: Social Scheduler (BUILD FIRST)
The Proof + Convex scheduler. Kanban, Zernio bridge, team collaboration. This proves the architecture works — Proof for editing, Convex for state, skills for automation, agent for drafting.

### App 2: Research Desk (Doodle Reader / Crux evolution)
This is where the Karpathy knowledge base pipeline connects. A visual research environment where you:
- **Hook up your sources** — RSS feeds, podcast subscriptions, X bookmarks, newsletters, YouTube channels. Bring your own API keys for scraping tools, Gemini for transcription, whatever.
- **Track your research** — Items flow through a triage pipeline: New → Reading → Processing → Routed → Archived. Same kanban pattern as the scheduler but for information, not posts.
- **Curate into knowledge bases** — The processing step decomposes items into framework candidates, routes them to wiki projects, flags contradictions with existing knowledge. This is the "living knowledge base pipeline" from the design doc, but with a visual layer.
- **Skill bundle:** RSS polling, web scraping, podcast transcription, X bookmark sync, decomposition, framework detection, wiki health checks.
- **Bridges:** Gemini (transcription/OCR), Crux CLI (ingestion), Quartz (wiki deploy), Enzyme/Napkin (search).

This is basically Crux Dashboard v3 — rebuilt on the Conspire architecture instead of a standalone Bun server + HTML file.

### App 3: Blog/SEO Pipeline
Same kanban, long-form. Publish to Webflow. Linda reviews in dashboard, Claude drafts in terminal.

### App 4: Newsletter Production
Beehiiv integration. Draft in Proof, schedule in Convex, send via API.

### App 5: Book Project
Scrivener-like chapter sidebar. Quality loop. Vellum export.

### App 6: Client Deliverables
CIA Ring 1. Client sees their content pipeline in a Conspire dashboard. We draft, they approve.

Each app = a `doc_type` + a visual template + a skill bundle + bridges. The platform is the same.

## Skills Over Scripts

This is the future of software. A Python script does one thing rigidly — when the API changes, it breaks. A skill gives the agent intent and context, and the agent figures out the execution. It reads the error and adapts. It combines tools based on what the job needs, not what the developer hardcoded.

The Conspire skill bundles are not automation workflows. They're capability packages. Install `conspire:research-desk` and your agent gains the ability to poll feeds, transcribe podcasts, decompose content, detect frameworks, propose wiki updates. HOW it does each of those things depends on what tools are available, what APIs you've configured, what model you're running. BYOAI means the skills work with any agent.

This is why "curated context environment" is the right frame. You're not installing an app. You're giving your agent a workspace with the right tools, the right file structure, and the right visual interface for a particular job. The agent does the work. The interface shows you what's happening. The skills tell the agent what's possible.

## The Core Idea: Curated Context Environments

Conspire is not one app. It's a visual layer over markdown + skills that can present itself as many apps.

Every Conspire project follows the same pattern:

```
CURATED CONTEXT ENVIRONMENT
  = Visual Template (what the user sees — kanban, chapter sidebar, scanner, wiki graph)
  + Skill Bundle (what the agent can do — publish, scan, format, check quality)
  + File Structure (what's actually on disk — markdown files with frontmatter)
  + Bridges (what it connects to — Zernio, Beehiiv, Webflow, Vellum, iTunes)
```

The visual layer makes it feel like a purpose-built app. But underneath, it's always markdown files that are portable, agent-accessible, and readable without Conspire.

### Example Environments

**Social Scheduler**
- Visual: Kanban board + calendar + Proof editor
- Skills: newsletter-to-social, crux-to-draft, hook-optimizer
- Files: `posts/{platform}-{slug}-{date}.md` with status/platform/schedule frontmatter
- Bridges: Zernio (scheduling), Beehiiv (newsletter), platform APIs

**Book Project**
- Visual: Scrivener-like chapter sidebar + manuscript editor + word count tracker
- Skills: quality-loop (5-judge gate), book-writer (chapter agents), voice-dna (consistency)
- Files: `chapters/01-{title}.md`, `front-matter/`, `back-matter/`, `notes/`
- Bridges: Vellum export, KDP upload, Proof for beta reader collaboration

**Scanner / Document Processing**
- Visual: Camera interface + page gallery + OCR preview
- Skills: recipe-scan, pdf-vision, document OCR pipeline
- Files: `scans/{date}-{title}.md` + `images/`
- Bridges: Gemini OCR API. Maybe a lightweight API key gate for paid usage.

**Wiki / Knowledge Base**
- Visual: Knowledge graph + article editor + health dashboard + coverage map
- Skills: plugin-builder, archive-decomposer, interlink, wiki-health
- Files: Standard Quartz wiki structure — `content/{slug}.md` with backlinks
- Bridges: Quartz build → Vercel deploy, QMD/Enzyme search

**Website Builder**
- Visual: Page preview pane + component palette + Webflow field mapper
- Skills: webflow-publish, seo-content-production, thumbnail mapping
- Files: `pages/{slug}.md` with CMS field frontmatter
- Bridges: Webflow CMS API, Cloudflare R2 for media

**Podcast Production**
- Visual: Episode timeline + transcript viewer + clip selector
- Skills: podcast-production, youtube-clip-extractor, cold-open-creator
- Files: `episodes/{number}-{guest}.md`, `clips/`, `transcripts/`
- Bridges: Descript API, YouTube, podcast RSS

### The Widget System

Like Notion blocks but agent-aware. Each widget is a visual element that maps to a markdown structure or an API call:

- **Text block** → markdown paragraph
- **Image** → `![alt](path)` in markdown, visual preview in editor
- **Embed** → iframe or API-rendered preview (YouTube, tweet, chart)
- **Status pill** → frontmatter `status:` field, draggable
- **Kanban card** → one markdown file, shown as a card
- **Chapter item** → one markdown file in a numbered folder
- **Scan page** → one image + OCR output, shown as a page in a flipbook
- **Metrics widget** → reads from Convex performance table, displays chart
- **Skill button** → triggers a Claude Code skill from the UI ("Run quality check")

Widgets render visually but serialize to markdown + frontmatter. Nothing proprietary. If you open the project in Obsidian or VS Code, it's just files.

### Why This Matters

The current agent ecosystem is stuck in two modes:
1. **Terminal mode** — powerful but invisible. Your agent does amazing work that nobody can see or interact with visually.
2. **App mode** — beautiful but rigid. Notion, Linear, Airtable — great UI but agents are second-class citizens bolted on via API.

Conspire is **visual-first, agent-native**. The interface exists for humans. The files exist for agents. The skills bridge them. Every visual action has a file-system equivalent. Every agent action has a visual representation.

This is the layer that's been missing. Not another terminal. Not another database. A visual creative environment where the agent is a co-author, not a tool.

## Design Principles

1. **Terminal is the agent's home.** Never ask the agent to use a browser. HTTP APIs for everything.
2. **Editor is the human's home.** Never ask the human to use a terminal to write prose. Proof handles this.
3. **Dashboard is the team's home.** Never ask the team to understand git or markdown frontmatter. Kanban handles this.
4. **BYOAI.** If it can make HTTP calls, it can participate. No Claude lock-in.
5. **Skills are the extension mechanism.** New capability = new skill. One install, immediately available.
6. **Local-first authoring, cloud-first collaboration.** Your files stay local. Shared state lives in Convex. Proof bridges the two.
7. **Conspire means "breathe together."** The agent and the human are co-authors, not tool and user.

## Tech Stack Summary

| Layer | Technology | Why |
|-------|-----------|-----|
| Editor | Proof SDK (Milkdown, Yjs, ProseMirror) | Best-in-class collaborative markdown. MIT. Agent bridge built in. |
| Database | Convex | Real-time reactive queries. TypeScript-native. Free tier. Self-hostable. |
| Dashboard | React 18 + Vite + Convex client | Same stack as Proof and markdown-site. Reactive by default. |
| Auth | Clerk (via Convex) or GitHub OAuth | Convex-native. Team roles. |
| Scheduling | Zernio API | Already in use at OpenEd. |
| Newsletter | Beehiiv API | Already in use at OpenEd. |
| CMS | Webflow API | Already in use for OpenEd blog. |
| Agent access | Proof Agent Bridge + Convex MCP server | Any agent, any terminal. |
| Skills | Claude Code skill format | One-click install. Proven across 250+ skills. |
| Hosting | Railway (dashboard) + Convex cloud (backend) + proofeditor.ai or Railway (editor) | Existing deploy targets. |

## Domain Candidates (check availability)

- conspire.dev
- conspire.io
- conspire.so
- conspire.app
- getconspire.com
- conspire.tools

## References

- PRD: https://www.proofeditor.ai/d/x5mrnxjh?token=8f771653-5341-4f81-b114-0c8a109115b0
- Proof SDK: github.com/EveryInc/proof-sdk
- markdown-site: github.com/waynesutton/markdown-site (Convex patterns)
- Airtable eval: OpenEd Vault/Studio/content-calendar-tool-evaluation-20260401.md
- Existing queue: OpenEd Vault/Studio/Social Media/queue/
- Living KB pipeline: crux/docs/plans/2026-04-06-001-feat-living-knowledge-base-pipeline-plan.md
- Brand audit: session git note 2026-04-06

---

*conspirare — to breathe together*
