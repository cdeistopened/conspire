---
title: Visual Inspiration & Design References
date: 2026-04-06
---

# Visual Inspiration for Conspire

## Scratch (erictli/scratch)
- github.com/erictli/scratch — MIT
- Desktop app (Tauri + React + TipTap + Tailwind)
- Beautiful WYSIWYG markdown rendering
- Minimal, not feature-bloated — "not trying to build Obsidian or Notion"
- Slash commands, focus mode, Mermaid diagrams
- **Borrow:** Visual rendering quality, aesthetic restraint, slash command pattern (extend to skills), focus mode
- **Skip:** Desktop wrapper (Tauri), offline-first, local search

## Proof SDK (EveryInc/proof-sdk)
- Our editor foundation
- Milkdown (ProseMirror-based, same family as TipTap)
- Real-time collab via Yjs CRDTs
- Agent bridge API
- Already renders markdown well — Scratch is inspiration for polish, not replacement

## markdown-site (waynesutton/markdown-site)
- Convex-powered markdown publishing
- Real-time sync, themes, search, analytics
- **Borrow:** Convex patterns, MCP server, CLAUDE.md/AGENTS.md conventions

## Design Principles (from Scratch's philosophy)
- Pretty markdown first — it should look like a document, not code
- Minimal feature set, maximum UX quality
- 5-10x lighter than Obsidian/Notion
- Slash commands as the power-user interface
- Focus mode = distraction-free single-document editing

## Platform Decision
Web-only. No desktop app. Runs in browser on any device.
Eventually could be a desktop app (Tauri) but plan on not. The web version must be good enough that nobody asks for native.
