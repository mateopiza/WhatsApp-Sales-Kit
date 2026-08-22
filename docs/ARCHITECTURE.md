# Architecture

## Templates are independent, not a monorepo

Each folder under `templates/` (`jewelry`, `clothing`, `blank`) is a
self-contained Vite + React app with its own `package.json`,
`node_modules`, and test suite. There is no shared `packages/` or
`core/` workspace. This is a deliberate choice, not an oversight —
see below.

## Why no shared `packages/commerce-core`

The three templates were evaluated for extractable shared logic:
WhatsApp link generation, currency formatting, favorites, cart/selection,
product types, hooks, and utilities.

**What's genuinely duplicated** (same logic, copy-pasted):
- WhatsApp link generation (`generateWhatsAppLink`, bulk quotation
  messages) — near-identical between `jewelry` and `blank` (`blank` was
  forked from `jewelry`), reimplemented inline per-component in
  `clothing`.
- Currency formatting (`formatPrice`, `formatCOPApprox`) — same pattern
  in `jewelry`/`blank`, absent in `clothing`.
- The `Product` / `Category` / `Material` type shapes — structurally
  similar across all three, but independently defined (and, before this
  refactor, `jewelry`'s version used closed-union types locked to
  jewelry vocabulary that wouldn't fit other verticals).
- The `storeConfig` pattern (name, WhatsApp, currency, theme) — now
  present in all three templates, each with its own file since the
  runtime-injection mechanism differs (`jewelry`/`blank` support Docker
  env-var injection via `window.__RUNTIME_CONFIG__`; `clothing` is a
  static, build-time-only config).

**What's genuinely different** (not just differently named):
- `clothing` has no `hooks/`, `services/`, `context/`, `utils/`, `ui/`,
  or `search/` directories that `jewelry`/`blank` have. It's a lighter,
  purely client-side build with no admin CMS backend, no PWA, no
  Cloudflare Functions API, no persistent storage layer.
- `jewelry`/`blank` include a full Cloudflare Workers API
  (`functions/`) with three interchangeable storage engines (D1, KV,
  in-memory) that `clothing` has no equivalent of.
- Gesture handling, product viewer, and admin CMS components exist only
  in `jewelry`/`blank`.

### The call

Extracting a shared package now would mean either (a) backfilling
`clothing` with hooks/services/CMS it doesn't currently have just to fit
a common interface — a feature addition disguised as a refactor — or
(b) extracting only the thin slice that's actually common (WhatsApp
links, currency formatting), which saves maybe 100 lines of
near-duplicate code at the cost of introducing a workspace/package
manager setup (npm workspaces or similar), cross-package versioning,
and an extra build step in every template.

Given the kit's goal — a developer copies one template and owns it
independently, with no dependency on a shared package that could change
underneath them — that tradeoff isn't worth it today. **Recommendation
for future work**: if a fourth template is added and needs the same
WhatsApp/currency logic as `jewelry`/`blank`, extract
`packages/commerce-core` at that point, covering exactly
`utils/whatsapp.ts` and `utils/formatters.ts` (the two modules that are
already byte-for-byte portable), and migrate `clothing` onto it only if
that migration doesn't require adding functionality it doesn't have
today.

## `storeConfig` pattern

Both `jewelry` and `blank` centralize business identity in
`src/config/storeConfig.ts`:

```ts
export interface StoreConfig {
  name: string;
  tagline: string;
  whatsapp: string;
  currency: string;
  country: string;
  logo: string;
  adminPin: string;
  theme: { primary: string; secondary: string };
}
```

At runtime, Docker's `entrypoint.sh` writes `STORE_*` environment
variables into `window.__RUNTIME_CONFIG__` before the app loads (see
`docker/entrypoint.sh` and `.env.example` in each template), so a
deployed store can be rebranded by changing env vars and restarting the
container — no rebuild required.

`clothing` uses the same interface shape but as a plain static object
(no runtime injection), since it has no Docker/Cloudflare deployment
path — see `templates/clothing/README.md`.

## Cloudflare Functions layer (`jewelry`, `blank`)

`functions/` implements a REST API (`/api/products`, `/api/auth`) with
three swappable storage backends behind one interface
(`functions/lib/storage/interface.ts`):

- **D1** (`d1-engine.ts`) — SQLite via Cloudflare D1, for production.
- **KV** (`kv-engine.ts`) — Cloudflare KV, a lighter-weight alternative.
- **Memory** (`memory-engine.ts`) — in-process, used by the local dev
  server and the Vitest suite (no Cloudflare bindings required to
  develop or test).

The client (`src/services/api.ts`) calls this API and falls back to a
`localStorage`-backed cache when the network is unavailable, so the
storefront and admin CMS keep working offline.
