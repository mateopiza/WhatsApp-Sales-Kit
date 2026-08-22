# Blank Template

The clean starting point for [WhatsApp Sales Kit](../../README.md). Copy
this folder, configure your business, load your products, and deploy —
no branding to strip out, no demo content to delete.

It has the same full architecture as the [jewelry demo](../jewelry) (the
kit's most complete template): mobile-first storefront, admin CMS,
Cloudflare Workers API with D1/KV/local-storage fallback, PWA/offline
support, WhatsApp inquiries and bulk quotation — just with neutral
branding and 6 generic example products instead of a themed catalog.

## Quick start

```bash
cp -r templates/blank my-store
cd my-store
npm install
npm run dev        # http://localhost:5173
```

## 1. Configure your business

Edit **`src/config/storeConfig.ts`** — this is the single file that
controls your store's identity:

```ts
export const DEFAULTS: StoreConfig = {
  name: 'My Store',
  tagline: 'Powered by WhatsApp Sales Kit',
  whatsapp: '573001234567',   // digits only, country code + number
  currency: 'USD',
  country: 'CO',
  logo: '/assets/logos/logo.svg',
  adminPin: '1879',
  theme: {
    primary: '#111111',
    secondary: '#818CF8',
  },
};
```

For a Docker deployment, you don't need to edit this file at all — every
field can be overridden at runtime via `STORE_*` environment variables
(see `.env.template`), injected by `docker/entrypoint.sh` into
`window.__RUNTIME_CONFIG__` on container start. That means you can
rebrand a running instance by changing env vars and restarting, without
a rebuild.

To change the color theme beyond the two accent colors in `storeConfig`,
edit the Tailwind tokens in `tailwind.config.js` and `src/index.css` —
they're documented inline.

## 2. Load your products

Edit **`src/data/products.ts`**. Each product follows the `Product` type
in `src/types/catalog.ts` — `category` and `material` are free text, so
define whatever categories make sense for your catalog:

```ts
{
  id: 'prod-01',
  slug: 'my-product',
  name: 'My Product',
  reference: 'REF-0101',
  category: 'my-category',      // any string you choose
  collection: 'My Collection',
  price: 49,
  currency: 'USD',
  short_description: '...',
  description: '...',
  material: 'Standard',          // any string you choose
  cover_image: '/assets/products/my-image.svg',
  images: ['/assets/products/my-image.svg'],
  availability: 'disponible',    // disponible | bajo-pedido | pieza-unica | agotado
  featured: true,
  specifications: { weight: '250 g', dimensions: '20 x 10 x 5 cm' },
}
```

Replace the placeholder SVGs in `public/assets/` with real product
photos, then update `cover_image`/`images` to match.

Once the app is running, you can also manage products through the admin
CMS at `/admin` (PIN-protected — default `1879`, change it via
`storeConfig.adminPin` or `STORE_ADMIN_PIN`).

## 3. Run tests

```bash
npm test
```

## 4. Deploy

- **Docker / Dokploy**: from the repo root, `docker compose up -d --build`
  (the root `docker-compose.yml` builds `templates/blank` when
  `STORE_TEMPLATE=blank` is set — see `.env.example`), or run it
  standalone: `docker compose -f docker/docker-compose.yml up -d --build`.
  See [`docs/DOKPLOY_DEPLOYMENT.md`](../../docs/DOKPLOY_DEPLOYMENT.md) and
  [`docs/DOCKER_GUIDE.md`](../../docs/DOCKER_GUIDE.md).
- **Cloudflare Pages**: `npm run build && npm run deploy` (uses
  `wrangler.toml` — update the `name` and database/KV bindings there
  first).

## What's included

| Feature | Where |
|---|---|
| Mobile-first storefront with gestures | `src/components/product/GestureGallery.tsx` |
| Admin CMS (product CRUD) | `src/components/admin/` |
| Cloudflare Workers API (D1 / KV / memory fallback) | `functions/` |
| WhatsApp single & bulk inquiry links | `src/utils/whatsapp.ts` |
| PWA / offline shell | `public/manifest.json`, `public/sw.js` |
| Automated tests (163) | `tests/` |
| Docker deploy | `docker/` |

## What's deliberately not here

No jewelry/clothing-specific components (size guides, material
swatchers) — those live only in `templates/jewelry` and
`templates/clothing` as vertical-specific examples. Add back whatever
your business needs.
