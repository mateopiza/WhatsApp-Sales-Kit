/**
 * Safe localStorage wrapper with in-memory fallback
 */

const inMemoryStore: Record<string, string> = {};

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      // Access denied or private browsing
    }
    return inMemoryStore[key] ?? null;
  },

  setItem(key: string, value: string): boolean {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return true;
      }
    } catch (e) {
      // QuotaExceededError or security block
    }
    inMemoryStore[key] = value;
    return true;
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      // Storage error
    }
    delete inMemoryStore[key];
  },

  clear(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (e) {
      // Storage error
    }
    Object.keys(inMemoryStore).forEach((k) => delete inMemoryStore[k]);
  },
};
