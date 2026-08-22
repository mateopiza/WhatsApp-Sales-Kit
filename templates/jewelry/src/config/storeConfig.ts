// ─────────────────────────────────────────────────────────────
// src/config/storeConfig.ts
// Single source of truth for this store's business identity:
// name, WhatsApp number, currency, branding colors, admin PIN.
//
// Values come from Docker's runtime injection
// (window.__RUNTIME_CONFIG__, written by docker/entrypoint.sh from
// the STORE_* env vars in .env — see .env.example) so a new store
// can be rebranded without a rebuild. Falls back to the defaults
// below for local dev without Docker.
// ─────────────────────────────────────────────────────────────

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeInjectedConfig;
  }
}

export interface StoreConfig {
  name: string;
  tagline: string;
  /** WhatsApp number in international format, digits only (no + or spaces). */
  whatsapp: string;
  currency: string;
  country: string;
  logo: string;
  adminPin: string;
  theme: {
    primary: string;
    secondary: string;
  };
}

/** Shape written into window.__RUNTIME_CONFIG__ by docker/entrypoint.sh */
interface RuntimeInjectedConfig {
  storeName?: string;
  storeCurrency?: string;
  storeWhatsappPhone?: string;
  storePrimaryColor?: string;
  storeAccentColor?: string;
  storeAdminPin?: string;
  storeLogoUrl?: string;
  storeTagline?: string;
}

const DEFAULTS: StoreConfig = {
  name: 'Empires Jewelry',
  tagline: 'Joyería de Alta Distinción',
  whatsapp: '573001234567',
  currency: 'USD',
  country: 'CO',
  logo: '',
  adminPin: '1879',
  theme: {
    primary: '#D4B48C',
    secondary: '#3A332D',
  },
};

function readStoreConfig(): StoreConfig {
  const injected = typeof window !== 'undefined' ? window.__RUNTIME_CONFIG__ : undefined;
  if (!injected) return DEFAULTS;

  return {
    name: injected.storeName ?? DEFAULTS.name,
    tagline: injected.storeTagline ?? DEFAULTS.tagline,
    whatsapp: injected.storeWhatsappPhone ?? DEFAULTS.whatsapp,
    currency: injected.storeCurrency ?? DEFAULTS.currency,
    country: DEFAULTS.country,
    logo: injected.storeLogoUrl ?? DEFAULTS.logo,
    adminPin: injected.storeAdminPin ?? DEFAULTS.adminPin,
    theme: {
      primary: injected.storePrimaryColor ?? DEFAULTS.theme.primary,
      secondary: injected.storeAccentColor ?? DEFAULTS.theme.secondary,
    },
  };
}

/** Convenience singleton — evaluated once at app init. */
export const storeConfig: StoreConfig = readStoreConfig();
