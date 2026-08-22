# Clothing Template

This is a **reference demo** included with [WhatsApp Sales Kit](../../README.md) —
a fashion/streetwear storefront example ("Empires Urban"), not a
standalone product. It's a lighter build than the [jewelry template](../jewelry):
frontend-only, no admin CMS backend, no Docker/Cloudflare setup — useful
as a reference for a simpler, purely client-side store.

If you're starting a **new** store, copy [`templates/blank`](../blank)
instead — this template is meant to be read and explored, not forked
directly.

## Run it locally

```bash
cd templates/clothing
npm install
npm run dev       # http://localhost:5173 (or next available port)
npm test
```

There's no `docker/` or `functions/` folder here — build and deploy it
as a static site (`npm run build` outputs to `dist/`).

## Where things live

| What | Where |
|---|---|
| Business config (name, WhatsApp number, colors) | `src/config/storeConfig.ts` |
| Product catalog | `src/data/products.ts` |
| WhatsApp CTAs | inline in `App.tsx` and each component (`OutfitStudioModal.tsx`, `ProductViewerModal.tsx`, `FavoritesDrawer.tsx`), all reading from `storeConfig` |
| Design tokens (colors, fonts) | `tailwind.config.js`, `src/index.css` |
| "Add garment" panel | `src/components/admin/AdminGarmentModal.tsx` — in-memory only, no PIN, no persistence; items you add here reset on reload |

## Change the branding

Edit `src/config/storeConfig.ts` directly and rebuild — this template
doesn't have Docker's runtime env-var injection that `templates/jewelry`
and `templates/blank` have, so branding changes require a rebuild
(`npm run build`) and redeploy.

## Load your own products

Edit `src/data/products.ts`. There's no CMS backend or persistent storage
here — for a store where non-technical staff need to manage products
without editing code, start from `templates/jewelry` or `templates/blank`
instead, both of which include a full admin CMS.

## Deploy

Build a static bundle and host it anywhere that serves static files
(Cloudflare Pages, Netlify, Vercel, S3 + CDN, etc.):

```bash
npm run build
# deploy the dist/ folder to your static host of choice
```
