// ─────────────────────────────────────────────────────────────
// src/utils/runtimeConfig.ts
// Reads per-store runtime configuration injected by Docker
// entrypoint at /runtime-config.js — no rebuild needed.
// Falls back to safe defaults for local dev without Docker.
// ─────────────────────────────────────────────────────────────

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

export interface RuntimeConfig {
  storeName: string;
  storeCurrency: string;
  storeWhatsappPhone: string;
  storePrimaryColor: string;
  storeAccentColor: string;
  storeAdminPin: string;
  storeLogoUrl: string;
  storeTagline: string;
}

const DEFAULTS: RuntimeConfig = {
  storeName: 'Empires Jewelry',
  storeCurrency: 'USD',
  storeWhatsappPhone: '+1234567890',
  storePrimaryColor: '#D4B48C',
  storeAccentColor: '#3A332D',
  storeAdminPin: '1879',
  storeLogoUrl: '',
  storeTagline: 'Joyería de Alta Distinción',
};

/**
 * Returns the runtime configuration for the current store instance.
 * Merges Docker-injected values over defaults to support local dev transparently.
 */
export function getRuntimeConfig(): RuntimeConfig {
  const injected = typeof window !== 'undefined' ? window.__RUNTIME_CONFIG__ : undefined;
  return { ...DEFAULTS, ...(injected ?? {}) };
}

/**
 * Convenience singleton — call once at app init
 */
export const runtimeConfig: RuntimeConfig = getRuntimeConfig();
