# fishmarket

Fish Market Buddy — food dating profile app with pixel avatars.

See `~/space/CLAUDE.md` for universal operating principles.

## Architecture

```
frontend/           # React + Vite + TypeScript SPA
├── src/
│   ├── components/ # One component per screen + shared UI
│   ├── hooks/      # Custom React hooks
│   ├── lib/        # Pure logic (api, avatar, foods, storage, types)
│   └── styles/     # Global CSS (pixel aesthetic, no CSS-in-JS)
worker.js           # Cloudflare Worker REST API
schema.sql          # D1 database schema
wrangler.toml       # Cloudflare config
```

## Stack

- **Frontend:** React 19, Vite, TypeScript (strict mode)
- **Backend:** Cloudflare Workers (vanilla JS), D1 (SQLite)
- **Tooling:** Biome (lint + format), pnpm, justfile

## Commands

```bash
# Frontend (run from frontend/)
just ci            # biome check + typecheck (gate before commits)
just dev           # vite dev server
just build         # production build

# Backend (run from root)
just deploy        # wrangler deploy worker
```
