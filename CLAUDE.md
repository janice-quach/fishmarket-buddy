# fishmarket

Cloudflare Worker powering fishmarket-buddy. Biome for lint/format.

See `~/space/CLAUDE.md` for universal operating principles.

## Stack

- Cloudflare Workers (vanilla JS)
- Biome for lint/format
- pnpm

## Commands

```bash
just ci        # biome check (gate before commits)
just deploy    # wrangler deploy
```
