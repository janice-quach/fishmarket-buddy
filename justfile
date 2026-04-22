default: ci

install:
    pnpm install

lint:
    pnpm biome lint .

format:
    pnpm biome format . --write

check:
    pnpm biome check .

ci: check

deploy:
    pnpm wrangler deploy
