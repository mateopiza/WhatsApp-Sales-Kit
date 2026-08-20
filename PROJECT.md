# Project: Empires Jewelry Mobile-First Web Application (Cloudflare & CMS Evolution)

## Architecture
- **Tech Stack**: React 18/19, TypeScript, Vite, Tailwind CSS, Lucide React (zero emojis), Vitest, Cloudflare Pages & Cloudflare Workers (Functions / REST API).
- **Backend & Storage**: Cloudflare Pages Functions (`functions/api/[[route]].ts` / `functions/api/products.ts`, `functions/api/auth.ts`) & Cloudflare Workers compatible architecture with `wrangler.toml`. Multi-tier storage layer: Cloudflare D1 SQL database + Cloudflare KV caching + Local persistent JSON fallback for robust dev and production resilience.
- **Admin CMS**: Dedicated secure Admin Portal (`/admin` and in-app modal with PIN/password auth), complete product CRUD (add, edit, delete with confirmation), category & collection management, instant optimistic frontend update and asynchronous backend synchronization.
- **Visual Design & Design System**: Strictly adhering to Empires Jewelry Design System:
  - Fonts: Cinzel (display & titles) + Montserrat (body, prices, labels).
  - Colors: Cream `#F5EDE6`, Taupe `#8A8176`, Stone `#CFC7BE`, Gold `#D4B48C`, Ink `#3A332D`, High-Contrast Taupe `#5A524A`/`#6B6359`.
  - Contrast: WCAG AA compliant (≥ 4.5:1 for normal body text, ≥ 3.0:1 for large display text/headings).
  - Zero Emojis: 100% SVG luxury icons (Lucide React), zero Unicode emoji glyphs.
- **Motion & Micro-Interactions**:
  - Smooth 200-350ms reveals for hero, category grid, and lookbook sections.
  - Ambient elevation shadows and micro-hover states (subtle 1.02x scale image zoom on card hover, soft translucent cream/ink backdrop blurs).
  - Elegant modal entrance/exit transitions (250-350ms ease-out).
  - Tactile visual feedback on heart favorite toggle, WhatsApp CTA click, and filter tab switching.
- **Mobile Gestures & Features**: 65-75% VH photo viewer, touch swipe between products/photos, pinch zoom, double-tap zoom, adjacent preloading, WhatsApp consultation deep links, localStorage favorites, PWA offline shell.

## Code Layout
```
/mnt/nvme/004 - B2B/MIguel/empires-jewelry-app/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── wrangler.toml
├── functions/
│   ├── api/
│   │   ├── [[route]].ts
│   │   ├── auth.ts
│   │   └── products.ts
│   └── _middleware.ts
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── assets/
│   │   ├── logos/
│   │   ├── products/
│   │   └── hero/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   ├── catalog.ts
│   │   ├── api.ts
│   │   └── admin.ts
│   ├── data/
│   │   └── products.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── storage.ts
│   ├── hooks/
│   │   ├── useFavorites.ts
│   │   ├── useGestures.ts
│   │   ├── usePreloadImages.ts
│   │   ├── useSearchFilter.ts
│   │   └── useCatalog.ts
│   ├── context/
│   │   ├── AppContext.tsx
│   │   └── AdminContext.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── MagazineShell.tsx
│   │   ├── home/
│   │   │   ├── EditorialHero.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── FeaturedLookbook.tsx
│   │   │   └── BrandStory.tsx
│   │   ├── product/
│   │   │   ├── ProductViewer.tsx
│   │   │   ├── GestureGallery.tsx
│   │   │   ├── ProductInfo.tsx
│   │   │   └── WhatsAppCTA.tsx
│   │   ├── search/
│   │   │   ├── SearchDrawer.tsx
│   │   │   └── FilterPills.tsx
│   │   ├── favorites/
│   │   │   ├── FavoritesDrawer.tsx
│   │   │   └── BulkInquiryModal.tsx
│   │   ├── admin/
│   │   │   ├── AdminModal.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductTable.tsx
│   │   │   ├── DeleteConfirmModal.tsx
│   │   │   └── CategoryManager.tsx
│   │   └── ui/
│   │       ├── SkeletonImage.tsx
│   │       ├── Badge.tsx
│   │       └── Toast.tsx
│   └── utils/
│       ├── whatsapp.ts
│       ├── formatters.ts
│       ├── share.ts
│       ├── contrast.ts
│       └── motion.ts
└── tests/
    ├── setup.ts
    ├── unit/
    │   ├── api.test.ts
    │   ├── admin.test.ts
    │   ├── catalog.test.ts
    │   ├── contrast.test.ts
    │   └── motion.test.ts
    └── integration/
        ├── admin-crud.test.tsx
        ├── cf-workers-api.test.ts
        └── gestures.test.tsx
```

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Exploration & Blueprinting | Deep analysis of CF Workers, Admin CMS, Design/Motion audit | None | COMPLETED |
| 2 | Cloudflare Workers API & Storage Layer | `/api/products` CRUD, `/api/auth`, D1/KV/fallback, `wrangler.toml` | M1 | COMPLETED |
| 3 | Admin CMS Portal & Synchronization | `/admin` modal/portal, PIN auth, product CRUD, category/collection mgmt, instant sync | M1, M2 | COMPLETED |
| 4 | Design System & Contrast Optimization | Zero emojis cleanup, WCAG AA compliance (≥4.5:1), token enforcement | M1 | COMPLETED |
| 5 | Premium Animations & Motion System | 200-350ms reveals, 1.02x card hover zoom, elevation shadows, tactile feedback | M1 | COMPLETED |
| 6 | Comprehensive Testing & Verification | 100% test pass rate (163 tests passed), Vitest verification | M2-M5 | COMPLETED |
| 7 | Responsive Optimization & Desktop Experience | Dual-mode ProductViewer (2-col desktop / gesture mobile), Header navbar, dynamic currency | M1-M6 | COMPLETED |
| 8 | Docker Compose & Dokploy Deployment | Multi-stage Dockerfile, root compose with Traefik labels, healthchecks, complete docs | M7 | COMPLETED |


## Interface Contracts

### Product Catalog Contract (`src/types/catalog.ts`)
```typescript
export type Category = 'anillos' | 'collares' | 'pulseras' | 'aretes' | 'alta-joyeria';
export type Material = 'Oro Amarillo 18k' | 'Oro Blanco 18k' | 'Oro Rosa 18k' | 'Plata Esterlina 925' | 'Platino' | 'Diamantes';
export type Availability = 'disponible' | 'bajo-pedido' | 'pieza-unica' | 'agotado';

export interface Product {
  id: string;
  slug: string;
  name: string;
  reference: string;
  category: Category;
  collection: string;
  price: number;
  currency: 'USD' | 'COP' | 'EUR';
  description: string;
  short_description: string;
  material: Material;
  images: string[];
  cover_image: string;
  availability: Availability;
  featured: boolean;
  specifications?: {
    carats?: string;
    weight?: string;
    dimensions?: string;
    stone?: string;
  };
}
```

### Cloudflare Workers API Contract (`src/types/api.ts` / `functions/api/products.ts`)
```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    timestamp: string;
  };
}

// GET /api/products -> ApiResponse<Product[]>
// POST /api/products -> ApiResponse<Product>
// PUT /api/products/:id -> ApiResponse<Product>
// DELETE /api/products/:id -> ApiResponse<{ deletedId: string }>
// POST /api/auth/login -> ApiResponse<{ token: string; authenticated: boolean }>
```

### Admin CMS Contract (`src/types/admin.ts`)
```typescript
export interface AdminAuthState {
  isAuthenticated: boolean;
  token: string | null;
  login: (pinOrPassword: string) => Promise<boolean>;
  logout: () => void;
}

export interface AdminProductPayload extends Omit<Product, 'id'> {
  id?: string;
}
```
