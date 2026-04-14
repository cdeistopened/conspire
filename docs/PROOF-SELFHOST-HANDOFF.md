---
title: "Self-Hosted Proof Editor — Deploy + Fork Handoff"
date: 2026-04-09
status: DEPLOYED ✓
owner: Charlie
priority: done
---

# Self-Hosted Proof Editor — Full Context Handoff

## Resolution (2026-04-09)

Three issues fixed (each found by looking at actual error output, not guessing):

1. **Build failure (all 7 attempts):** `package-lock.json` was in `.gitignore`. Dockerfile `COPY` failed.
   Fix: removed from `.gitignore`, committed lock file.

2. **Editor blank ("Loading editor..."):** Express only served `public/` static, not `dist/` where Vite-built assets live.
   Fix: added `express.static(path.join(__dirname, '..', 'dist'))` in `server/index.ts`.

3. **WebSocket "Connecting" forever:** Two sub-issues:
   - Frontend connected to PORT+1 (separate collab port), but Railway exposes one port.
     Fix: `COLLAB_EMBEDDED_WS=true` tells the URL resolver to keep same port.
   - URL was `ws://` instead of `wss://` (Railway TLS termination).
     Fix: `COLLAB_PUBLIC_BASE_URL=wss://proof-editor-production.up.railway.app/ws`
   - Non-local collab requires signing secret.
     Fix: `PROOF_COLLAB_SIGNING_SECRET` set to random 32-byte hex.

**What's now live (browser-verified with screenshots):**
- Proof editor: `https://proof-editor-production.up.railway.app` — full editing, green dot connected, real-time collab
- Railway volume at `/app/data` for SQLite persistence
- Conspire dashboard `VITE_PROOF_URL` pointed at self-hosted instance (via Docker ARG)
- `Cmd+Alt+M` comment shortcut (Google Docs-style) shipped
- Conspire service connected to GitHub repo for auto-deploy

**Railway env vars (proof-editor service):**
- `PORT=4000`
- `DATABASE_PATH=/app/data/proof-share.db`
- `PROOF_CORS_ALLOW_ORIGINS=*`
- `COLLAB_EMBEDDED_WS=true`
- `COLLAB_PUBLIC_BASE_URL=wss://proof-editor-production.up.railway.app/ws`
- `PROOF_PUBLIC_BASE_URL=https://proof-editor-production.up.railway.app`
- `PROOF_COLLAB_SIGNING_SECRET=<random-hex>`

**Remaining feature work:**
- Tablet-first CSS (18-20px font, 44px touch targets, floating format bar)
- Convex backend swap (replace SQLite with Convex for unified data layer)

---

## What This Is

Proof is an open-source collaborative markdown editor by Every Inc. We're forking it to self-host on Railway as part of Conspire (our social media scheduling / content production dashboard). The self-hosted version unlocks: custom keybindings (Google Docs comment shortcuts), tablet-optimized CSS, Convex backend swap (later), and no dependency on proofeditor.ai.

## Architecture

**Proof SDK stack:**
- **Editor:** Milkdown v7 (built on ProseMirror) — rich markdown editing
- **Collab:** Yjs CRDTs via Hocuspocus (@hocuspocus/server + @hocuspocus/provider) — real-time multiplayer
- **Server:** Express 5 + better-sqlite3 (C++ native module) — doc storage, agent bridge, WebSocket collab
- **Agent bridge:** Full HTTP API at `/api/agent/{slug}/ops` for programmatic read/comment/suggest/rewrite
- **Frontend build:** Vite — produces ~3MB dist (editor.js is 2.8MB)
- **Runtime:** `npx tsx server/index.ts` — TypeScript execution via tsx

**Key files:**
- `server/index.ts` — Express app entry, sets up routes + WebSocket
- `server/db.ts` — SQLite layer, line 352: `DATABASE_PATH` env var or defaults to `./proof-share.db`
- `server/agent-routes.ts` — Agent bridge endpoints
- `server/collab.ts` — Hocuspocus/Yjs collab runtime
- `server/ws.ts` — WebSocket setup
- `src/` — Frontend (Milkdown editor, UI components)
- `AGENT_CONTRACT.md` — Full agent API documentation

**The editor works perfectly locally:**
```bash
cd ~/project-temp/proof-sdk
PORT=4444 npx tsx server/index.ts
# Serves at http://localhost:4444 — confirmed working
```

## Repo

- **GitHub:** `cdeistopened/conspire-proof` (forked from EveryInc/proof-sdk, MIT license)
- **Local clone:** `~/project-temp/proof-sdk/`
- **Current branch:** `main` (3 commits ahead of upstream)

## Railway Setup

- **Project:** conspire (`b2f4cd43-1658-44a2-b8eb-418c6ab279a4`)
- **Service:** proof-editor (`34b589b5-008f-411c-bec6-c654be935fc1`)
- **Domain:** `https://proof-editor-production.up.railway.app`
- **Environment:** production (`c1f2a7ee-cee4-46f7-b0b7-72fef083b6fb`)
- **Service is connected to GitHub repo** — pushes to main trigger deploys automatically

**Env vars already set:**
- `PORT=4000`
- `PROOF_CORS_ALLOW_ORIGINS=*`
- `DATABASE_PATH=/app/data/proof-share.db`

## What I Tried (All Failed)

### Attempt 1-3: Dockerfile with `npm run build`
The original Dockerfile runs `npm ci` then `npm run build` (Vite). All three attempts showed status FAILED. Build logs via Railway GraphQL API returned empty arrays — the failures happened before logs were captured, likely during the Docker build step itself. Probable cause: Vite build OOM (the editor.js bundle is 2.8MB, build probably needs 1-2GB RAM).

### Attempt 4-5: Nixpacks (auto-detect Node.js)
Removed Dockerfile, added `nixpacks.toml`. Build succeeded but service CRASHED at runtime. Probable cause: `better-sqlite3` native bindings compiled on Nixpacks' build environment but failed at runtime (architecture mismatch or missing shared libs).

### Attempt 6: Dockerfile with pre-built dist (skip Vite build)
Built frontend locally, committed `dist/` to repo, Dockerfile just does `npm ci` + copies files. `railway up` upload timed out twice (repo too large with dist assets). Switched to GitHub-connected deploy — build status: FAILED again.

### Attempt 7: GitHub-connected deploy
Connected service to `cdeistopened/conspire-proof` repo via Railway GraphQL API. Deploy triggered from push. Status: FAILED. No build logs available via API.

## The Debugging Bottleneck

**I cannot see the actual build/runtime error.** Railway's `deploymentLogs` GraphQL query returns empty arrays for all failed deployments. The build logs ARE visible in the Railway web dashboard at:

**https://railway.com/project/b2f4cd43-1658-44a2-b8eb-418c6ab279a4/service/34b589b5-008f-411c-bec6-c654be935fc1**

Someone needs to check that URL and read the actual error message. Once the error is known, the fix is likely straightforward.

## Most Likely Issues (Ranked)

1. **Vite build OOM** — Railway free/hobby tier has limited build memory. The Proof frontend is large. Fix: pre-build locally, commit dist, skip build in Dockerfile.
2. **better-sqlite3 native compilation fails** — Needs python3, make, g++ (Dockerfile has these). But if npm ci runs before COPY (which it does, for layer caching), the native module compiles against the base image but then the rest of the code expects a different path. Fix: ensure `npm rebuild better-sqlite3` after COPY.
3. **Missing runtime dependency** — tsx or some other devDependency pruned in production. The current Dockerfile uses `npm ci` (not `npm ci --production`), so all deps should be there.
4. **Railway volume needed for SQLite** — Not the build failure cause, but needed for persistence. Without a volume, the SQLite DB resets on every deploy. Railway volumes: `railway volume add --service proof-editor`.

## Current Dockerfile (in repo)

```dockerfile
FROM node:22-slim
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN mkdir -p /app/data
ENV PORT=4000
ENV DATABASE_PATH=/app/data/proof-share.db
ENV PROOF_CORS_ALLOW_ORIGINS=*
EXPOSE 4000
CMD ["npx", "tsx", "server/index.ts"]
```

Note: The Vite `npm run build` step was REMOVED from this Dockerfile. The `dist/` directory is committed to the repo (pre-built locally). The `.dockerignore` was updated to NOT exclude `dist/`. The `.gitignore` was also updated.

## Recommended Next Steps

1. **Check Railway build logs** at the URL above — read the actual error
2. **If OOM:** Add `--max-old-space-size=4096` to the build, or confirm dist/ is being shipped pre-built
3. **If native module:** Add `RUN npm rebuild better-sqlite3` after the COPY step
4. **If runtime crash:** Run locally in Docker to reproduce: `docker build -t proof-test . && docker run -p 4000:4000 proof-test`
5. **Once running:** Add Railway volume for SQLite persistence
6. **Then:** Update Conspire dashboard's `VITE_PROOF_URL` env var to point at the self-hosted instance

## After Deploy: Feature Roadmap

### Comment Shortcut (Quick Win)
Add Google Docs-style `Cmd+Alt+M` comment shortcut to the ProseMirror editor. This is a keybinding in the Milkdown plugin configuration — probably in `src/editor/` somewhere. The agent bridge already supports `comment.add` operations; this just needs a keyboard shortcut that triggers the comment UI.

### Tablet-First Editor (Layer 3)
Research: iA Writer, Bear, Ulysses iPad apps for design patterns. Key CSS changes:
- 18-20px base font size (not 14-16px)
- 44px minimum touch targets
- Full-width editing, no sidebar chrome
- Floating format bar near selection
- Bottom-anchored toolbar (thumb-reachable)
- Larger selection handles
All achievable via Milkdown theme CSS, no editor core changes needed.

### Convex Backend Swap (Layer 2)
Replace SQLite with Convex. Pragmatic path: keep Yjs for real-time CRDT, but persist doc snapshots to Convex table instead of SQLite. Agent bridge reads/writes via Convex mutations. This unifies the data layer with the Conspire kanban.

## Integration Points

**Conspire dashboard** (`cdeistopened/conspire`, Railway service `conspire`):
- Currently embeds Proof via iframe: `<iframe src="${PROOF_BASE}/d/${slug}?token=${token}" />`
- `VITE_PROOF_URL` env var controls the base URL (currently `https://www.proofeditor.ai`)
- Documents are created via `proof.linkExisting` Convex action which calls the Proof `/share/markdown` API
- Once self-hosted, change `VITE_PROOF_URL` to `https://proof-editor-production.up.railway.app`

**Convex backend** (usable-pheasant-901.convex.cloud):
- `proof.ts` has `linkExisting` action that creates Proof docs and stores slug/token
- Documents table has `proof_slug` and `proof_token` fields

## Railway CLI Reference

```bash
# Auth
/opt/homebrew/bin/railway whoami

# Link to project
cd ~/project-temp/proof-sdk
/opt/homebrew/bin/railway link -p b2f4cd43-1658-44a2-b8eb-418c6ab279a4

# Deploy
/opt/homebrew/bin/railway up --service proof-editor --detach

# Logs
/opt/homebrew/bin/railway logs --service proof-editor

# Variables
/opt/homebrew/bin/railway variables --service proof-editor --kv

# Domain
/opt/homebrew/bin/railway domain --service proof-editor

# Add volume (needed for SQLite persistence)
/opt/homebrew/bin/railway volume add --service proof-editor
```

## API Token

Railway token is in `~/.railway/config.json` under `user.token`. Use for GraphQL API at `https://backboard.railway.com/graphql/v2`.
