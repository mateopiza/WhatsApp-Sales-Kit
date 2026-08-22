# Jewelry Template

This is a **reference demo** included with [WhatsApp Sales Kit](../../README.md) —
a fully working example of a premium jewelry storefront, not a standalone
product. It shows what the kit can do: editorial storefront, gestural
product viewer, admin CMS, PWA/offline support, and a Cloudflare Workers
API backend.

Branding ("Empires Jewelry") is kept intentionally so the demo reads like
a real store. If you're starting a **new** store, copy
[`templates/blank`](../blank) instead — this template is meant to be
read and explored, not forked directly.

## Run it locally

```bash
cd templates/jewelry
npm install
npm run dev       # http://localhost:5173
npm test          # 163 automated tests (Vitest)
```

## Where things live

| What | Where |
|---|---|
| Business config (name, WhatsApp, colors, admin PIN) | `src/config/storeConfig.ts` — also overridable at runtime via env vars, see below |
| Product catalog | `src/data/products.ts` |
| WhatsApp message templates | `src/utils/whatsapp.ts` |
| Design tokens (colors, fonts) | `tailwind.config.js`, `src/index.css` |
| Admin CMS (product CRUD) | `src/components/admin/`, guarded by `STORE_ADMIN_PIN` (default `1879`) |
| Cloudflare Workers API (D1/KV/memory storage) | `functions/` |

## Change the branding without rebuilding

This template supports **runtime configuration**: Docker injects `STORE_*`
environment variables into `window.__RUNTIME_CONFIG__` on container start
(see `docker/entrypoint.sh`), so you can rebrand a deployed instance by
changing env vars and restarting — no rebuild needed.

```bash
STORE_NAME="My Store" \
STORE_WHATSAPP_PHONE=573001234567 \
STORE_CURRENCY=COP \
STORE_PRIMARY_COLOR="#D4B48C" \
STORE_ADMIN_PIN=1234 \
docker compose -f docker/docker-compose.yml up -d --build
```

See `.env.template` for the full list of variables.

## Load your own products

Either edit `src/data/products.ts` directly and rebuild, or use the admin
CMS at `/admin` (PIN-protected, default `1879`) once the app is running —
changes there sync to the Cloudflare D1/KV backend when deployed, or to a
local cache when running without Cloudflare.

## Deploy

- **Docker / Dokploy**: `docker compose -f docker/docker-compose.yml up -d --build`, or connect the repo to Dokploy — see [`docs/DOKPLOY_DEPLOYMENT.md`](../../docs/DOKPLOY_DEPLOYMENT.md) and [`docs/DOCKER_GUIDE.md`](../../docs/DOCKER_GUIDE.md).
- **Cloudflare Pages**: `npm run build && npm run deploy` (uses `wrangler.toml`).

## Design reference

`design-system/` bundles the full Empires Jewelry brand system (colors,
type, imagery, UI kit) used to build this demo — useful as a reference if
you want to see how the visual language was put together, not required to
run the app.
