# Conspire

*Latin: conspirare — "to breathe together"*

An agentic creative IDE. Visual layer over markdown + skills. Your agent edits alongside you because it's linked to your terminal. Extensible to co-work with anyone. BYOAI.

## What This Is

Conspire is a platform for building **curated context environments** — purpose-built visual workspaces where an agent and a human collaborate on creative work. Each environment combines a visual template, a skill bundle, a file structure, and publishing bridges.

**The thesis:** Skills over scripts. The future of software is capability packages that agents can combine and adapt, not rigid automation workflows that break when APIs change.

## Project Structure

```
conspire/
├── CLAUDE.md          ← This file
├── PLAN.md            ← Full architecture + phased build plan
├── VISION.md          ← Product thinking, marketing seeds, app ideas
├── references/        ← Research, competitive intel, inspiration
└── (future: packages/, skills/, etc.)
```

## Key Documents

- **PLAN.md** — Architecture, Convex schema, implementation phases, tech stack
- **VISION.md** — Charlie's product thinking, app catalog, marketing angles
- **PRD (live)** — https://www.proofeditor.ai/d/x5mrnxjh?token=8f771653-5341-4f81-b114-0c8a109115b0

## Stack

| Layer | Technology |
|-------|-----------|
| Editor | Proof SDK (Milkdown, Yjs, ProseMirror) — self-hosted |
| Backend | Convex (real-time, TypeScript-native) — dashboard uses DEV deployment `usable-pheasant-901`, not prod |
| Dashboard | React 18 + Vite + Convex client |
| Skills | Claude Code skill format |
| Hosting | Railway (dashboard + self-hosted Proof) + Convex cloud |

## Current State (2026-04-09)

Both Railway services verified healthy:
- **Dashboard** — Railway
- **Self-hosted Proof editor** — `proof-editor-production.up.railway.app`. Cmd+Alt+M comment shortcut shipped.

**11 Proof docs flagged for restoration** — originals intact on proofeditor.ai. Montessori article (13.8K chars) and OED #097 mock (3.3K chars) confirmed recoverable. Restoration handoff prepped. See `.claude/plans/iterative-scribbling-puzzle.md` and memory `reference_proof_migration_playbook.md`.

**Factory architecture:** Conspire is a template app producing per-creator workspaces — not one app for everyone.

## Build Sequence

Start humble. Scheduler first. Prove the architecture.

1. **App 1: Social Scheduler** — Kanban + Proof + Zernio. Build first.
2. **App 2: Research Desk** — Crux evolution. Visual triage + KB pipeline.
3. **App 3+:** Blog, newsletter, book, scanner, client deliverables, Zillow/real estate.

## Related Projects

| Project | Path | Relationship |
|---------|------|-------------|
| Crux (intelligence desk) | `crux/` | Becomes Research Desk app on Conspire. Top CIA priority. |
| Crux Reader | `crux/reader/` | Visual research/RSS layer → Conspire app |
| Crux Scanner | `crux/scanner/` | Document scanning → Conspire app. Live on Railway. |
| Plugin Builder | `.claude/skills/plugin-builder/` | Wiki compilation → Conspire skill bundle |
| Proof SDK | self-hosted at `proof-editor-production.up.railway.app` | Editor foundation |
| markdown-site | github.com/waynesutton/markdown-site | Convex patterns to borrow |
