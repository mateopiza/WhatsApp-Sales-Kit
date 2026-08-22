// ─────────────────────────────────────────────────────────────
// src/config/storeConfig.ts
// Single source of truth for this store's business identity.
// Change the values below to rebrand this template — no need to
// hunt for hardcoded strings across components.
// ─────────────────────────────────────────────────────────────

export interface StoreConfig {
  name: string;
  tagline: string;
  /** WhatsApp number in international format, digits only (no + or spaces). */
  whatsapp: string;
  currency: string;
  country: string;
  logo: string;
  theme: {
    primary: string;
    secondary: string;
  };
}

export const storeConfig: StoreConfig = {
  name: 'Empires Urban',
  tagline: 'Moda Urbana de Alta Gama',
  whatsapp: '573001234567',
  currency: 'USD',
  country: 'CO',
  logo: '/assets/logos/mark-only-taupe.png',
  theme: {
    primary: '#EAB308',
    secondary: '#090B0E',
  },
};
