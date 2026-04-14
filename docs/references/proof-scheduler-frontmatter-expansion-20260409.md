---
title: "Proof social media scheduler — frontmatter + per-platform master skill"
date: 2026-04-09
source: 20260409-100247-B0CA527E.m4a
type: architecture-note
status: captured
project: conspire
tags: [conspire, proof, social-scheduler, frontmatter, skills]
---

# Proof social scheduler — expand frontmatter + master skill

Captured from voice memo 2026-04-09.

## Context

Current Proof social media scheduler is limited on images. The agent side has all the HTTP endpoints wired and knows where they are. Charlie has been extending that logic and wants to make sure it's reached **all the other pieces of front matter**.

## The direction

- **Master skill** with per-platform references
- Each platform reference tells the agent how to **edit and write** for that platform
- Expand the per-platform **checklist** for different content types
- YouTube specifically: podcast episodes need two thumbnails + 3-combo AB test (see `OpenEd Vault/tasks/opened-omnichannel-repurpose-20260409.md`)

## Next actions

- [ ] Audit current Proof scheduler frontmatter fields — what's in, what's missing
- [ ] Inventory per-platform quirks (X, LinkedIn, IG, TikTok, YouTube)
- [ ] Spec the master skill structure: skill → platform refs → checklists
- [ ] Add YouTube-specific fields: two thumbnail slots, AB combo slots
- [ ] Verify agent endpoint coverage matches new frontmatter
