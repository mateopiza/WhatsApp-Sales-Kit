import { useState, useEffect, useCallback } from 'react';
import { safeStorage } from '../utils/storage';

export const FAVORITES_STORAGE_KEY = 'store_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = safeStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      // Parsing failed
    }
    return [];
  });

  // Sync to safeStorage
  useEffect(() => {
    try {
      safeStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      // Quota exceeded
    }
  }, [favorites]);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites]
  );

  const removeFavorite = useCallback((productId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    removeFavorite,
    clearFavorites,
  };
}
