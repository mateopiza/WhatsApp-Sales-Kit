import { useEffect, useRef } from 'react';
import { Product } from '../types/catalog';

export function usePreloadImages(
  currentProduct: Product | null,
  adjacentProducts: { prev: Product | null; next: Product | null }
) {
  const loadedCache = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!currentProduct) return;

    const urlsToPreload: string[] = [];

    // 1. Preload current product additional gallery images
    currentProduct.images?.forEach((img) => {
      if (img) urlsToPreload.push(img);
    });

    // 2. Preload next product cover + primary gallery image
    if (adjacentProducts.next) {
      if (adjacentProducts.next.cover_image) urlsToPreload.push(adjacentProducts.next.cover_image);
      if (adjacentProducts.next.images?.[0]) urlsToPreload.push(adjacentProducts.next.images[0]);
    }

    // 3. Preload prev product cover + primary gallery image
    if (adjacentProducts.prev) {
      if (adjacentProducts.prev.cover_image) urlsToPreload.push(adjacentProducts.prev.cover_image);
      if (adjacentProducts.prev.images?.[0]) urlsToPreload.push(adjacentProducts.prev.images[0]);
    }

    // Execute background prefetch
    urlsToPreload.forEach((url) => {
      if (url && typeof Image !== 'undefined' && !loadedCache.current.has(url)) {
        try {
          const img = new Image();
          img.src = url;
          img.onload = () => loadedCache.current.add(url);
        } catch (e) {
          // Ignore prefetch error in non-browser or test environments
        }
      }
    });
  }, [currentProduct?.id, adjacentProducts.prev?.id, adjacentProducts.next?.id]);
}
