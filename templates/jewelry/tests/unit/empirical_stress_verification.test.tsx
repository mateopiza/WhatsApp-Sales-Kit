import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { useGestures } from '../../src/hooks/useGestures';
import { GestureGallery } from '../../src/components/product/GestureGallery';
import { useSearchFilter } from '../../src/hooks/useSearchFilter';
import { useFavorites, FAVORITES_STORAGE_KEY } from '../../src/hooks/useFavorites';
import { safeStorage } from '../../src/utils/storage';
import { PRODUCTS } from '../../src/data/products';
import { AppProvider } from '../../src/context/AppContext';

describe('Empirical Stress & Boundary Challenger Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    safeStorage.clear();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. TOUCH GESTURE ENGINE STRESS TESTS
  // =========================================================================
  describe('1. Touch Gesture Engine Mathematical Stability & Stress', () => {
    it('GEST-01: Zero displacement touch (instant tap) does not trigger swipe or zoom', () => {
      const onImageChange = vi.fn();
      const onNextProduct = vi.fn();
      const onPrevProduct = vi.fn();

      render(
        <AppProvider>
          <GestureGallery
            product={PRODUCTS[0]}
            onClose={vi.fn()}
            onNextProduct={onNextProduct}
            onPrevProduct={onPrevProduct}
          />
        </AppProvider>
      );

      const gallery = screen.getByTestId('gesture-gallery-container');

      // Tap without movement
      fireEvent.touchStart(gallery, { touches: [{ clientX: 200, clientY: 200 }] });
      fireEvent.touchEnd(gallery);

      expect(onImageChange).not.toHaveBeenCalled();
      expect(onNextProduct).not.toHaveBeenCalled();
      expect(onPrevProduct).not.toHaveBeenCalled();
      // Should show initial image (Imagen 1)
      expect(screen.getByAltText(new RegExp(`${PRODUCTS[0].name} - Imagen 1`, 'i'))).toBeInTheDocument();
    });

    it('GEST-02: Rapid touch spamming (100 rapid cycles with fireEvent) executes safely without crashing', () => {
      render(
        <AppProvider>
          <GestureGallery
            product={PRODUCTS[0]}
            onClose={vi.fn()}
          />
        </AppProvider>
      );

      const gallery = screen.getByTestId('gesture-gallery-container');

      // Rapidly fire 100 touch sequences
      for (let i = 0; i < 100; i++) {
        const startX = 100 + (i % 50);
        const moveX = startX + (i % 2 === 0 ? 80 : -80);
        fireEvent.touchStart(gallery, { touches: [{ clientX: startX, clientY: 150 }] });
        fireEvent.touchMove(gallery, { touches: [{ clientX: moveX, clientY: 150 }] });
        fireEvent.touchEnd(gallery);
      }

      // Container remains intact and responsive
      expect(gallery).toBeInTheDocument();
    });

    it('GEST-02-B: Synchronous unbatched touch events reveal state-closure latency in useGestures', () => {
      const { result } = renderHook(() =>
        useGestures({
          imageCount: 4,
          activeImageIndex: 0,
          onImageChange: vi.fn(),
        })
      );

      // When touchStart and touchEnd are called in a single synchronous block without intermediate re-render
      act(() => {
        result.current.touchHandlers.onTouchStart({
          touches: [{ clientX: 100, clientY: 150 } as any],
        } as any);
        // Note: isDragging in handleTouchEnd closure is still false before re-render
        result.current.touchHandlers.onTouchEnd();
      });

      // Verification of React state batching behavior: isDragging was scheduled to true by touchStart,
      // while touchEnd skipped setIsDragging(false) because `isDragging` was false in closure.
      // After act() completes, isDragging resolved to true:
      expect(result.current.isDragging).toBe(true);

      // Re-triggering touchEnd in the next tick clears it:
      act(() => {
        result.current.touchHandlers.onTouchEnd();
      });
      expect(result.current.isDragging).toBe(false);
    });

    it('GEST-03: Multi-touch pinch: scale clamping between minScale (1.0) and maxScale (3.5)', () => {
      const { result } = renderHook(() =>
        useGestures({
          imageCount: 3,
          activeImageIndex: 0,
          onImageChange: vi.fn(),
          minScale: 1.0,
          maxScale: 3.5,
        })
      );

      // Start pinch with distance = 100px
      act(() => {
        result.current.touchHandlers.onTouchStart({
          touches: [
            { clientX: 100, clientY: 100 } as any,
            { clientX: 200, clientY: 100 } as any,
          ],
        } as any);
      });

      expect(result.current.isPinching).toBe(true);
      expect(result.current.isDragging).toBe(false);

      // Expand to 500px distance (factor = 5.0 -> scale should clamp to maxScale 3.5)
      act(() => {
        result.current.touchHandlers.onTouchMove({
          touches: [
            { clientX: 0, clientY: 100 } as any,
            { clientX: 500, clientY: 100 } as any,
          ],
        } as any);
      });

      expect(result.current.scale).toBe(3.5);

      // Contract to 20px distance (factor = 0.2 -> scale should clamp to minScale 1.0)
      act(() => {
        result.current.touchHandlers.onTouchMove({
          touches: [
            { clientX: 100, clientY: 100 } as any,
            { clientX: 120, clientY: 100 } as any,
          ],
        } as any);
      });

      expect(result.current.scale).toBe(1.0);

      // Touch end
      act(() => {
        result.current.touchHandlers.onTouchEnd();
      });

      expect(result.current.isPinching).toBe(false);
      expect(result.current.scale).toBe(1.0);
    });

    it('GEST-04: Multi-touch pinch with 0 initial distance avoids division by zero / NaN', () => {
      const { result } = renderHook(() =>
        useGestures({
          imageCount: 3,
          activeImageIndex: 0,
          onImageChange: vi.fn(),
        })
      );

      // Start pinch with both fingers at the EXACT same point (distance = 0)
      act(() => {
        result.current.touchHandlers.onTouchStart({
          touches: [
            { clientX: 150, clientY: 150 } as any,
            { clientX: 150, clientY: 150 } as any,
          ],
        } as any);
      });

      // Move fingers apart
      act(() => {
        result.current.touchHandlers.onTouchMove({
          touches: [
            { clientX: 100, clientY: 150 } as any,
            { clientX: 250, clientY: 150 } as any,
          ],
        } as any);
      });

      // Scale should remain valid number (not NaN or Infinity)
      expect(Number.isNaN(result.current.scale)).toBe(false);
      expect(Number.isFinite(result.current.scale)).toBe(true);
      expect(result.current.scale).toBe(1.0);
    });

    it('GEST-05: Transition from 1 finger drag to 2 finger pinch smoothly switches modes', () => {
      const { result } = renderHook(() =>
        useGestures({
          imageCount: 3,
          activeImageIndex: 0,
          onImageChange: vi.fn(),
        })
      );

      // 1-finger start
      act(() => {
        result.current.touchHandlers.onTouchStart({
          touches: [{ clientX: 100, clientY: 100 } as any],
        } as any);
      });
      expect(result.current.isDragging).toBe(true);
      expect(result.current.isPinching).toBe(false);

      // Put second finger down (start pinch)
      act(() => {
        result.current.touchHandlers.onTouchStart({
          touches: [
            { clientX: 100, clientY: 100 } as any,
            { clientX: 200, clientY: 100 } as any,
          ],
        } as any);
      });
      expect(result.current.isDragging).toBe(false);
      expect(result.current.isPinching).toBe(true);

      // Pinch zoom in to 2x
      act(() => {
        result.current.touchHandlers.onTouchMove({
          touches: [
            { clientX: 50, clientY: 100 } as any,
            { clientX: 250, clientY: 100 } as any,
          ],
        } as any);
      });
      expect(result.current.scale).toBe(2.0);

      // End pinch
      act(() => {
        result.current.touchHandlers.onTouchEnd();
      });
      expect(result.current.isPinching).toBe(false);
      expect(result.current.scale).toBe(2.0);
    });

    it('GEST-06: Pan clamping when zoomed in keeps offsets within container boundaries', () => {
      const { result } = renderHook(() =>
        useGestures({
          imageCount: 3,
          activeImageIndex: 0,
          onImageChange: vi.fn(),
        })
      );

      // Attach a mock container element with 400x600 dimensions
      const mockContainer = document.createElement('div');
      vi.spyOn(mockContainer, 'getBoundingClientRect').mockReturnValue({
        width: 400,
        height: 600,
        top: 0,
        left: 0,
        bottom: 600,
        right: 400,
        x: 0,
        y: 0,
        toJSON: () => {},
      });
      result.current.containerRef.current = mockContainer;

      // Double tap to zoom in to 2.5x
      act(() => {
        result.current.toggleZoom();
      });
      expect(result.current.scale).toBe(2.5);

      // maxPanX = (400 * (2.5 - 1)) / 2 = (400 * 1.5) / 2 = 300px
      // maxPanY = (600 * (2.5 - 1)) / 2 = (600 * 1.5) / 2 = 450px

      // Try extreme panning to the right (+1000px)
      act(() => {
        result.current.touchHandlers.onTouchStart({
          touches: [{ clientX: 100, clientY: 100 } as any],
        } as any);
      });
      act(() => {
        result.current.touchHandlers.onTouchMove({
          touches: [{ clientX: 2000, clientY: 2000 } as any],
        } as any);
      });
      act(() => {
        result.current.touchHandlers.onTouchEnd();
      });

      // Offsets must be clamped to <= maxPan
      expect(result.current.offsetX).toBeLessThanOrEqual(300);
      expect(result.current.offsetX).toBeGreaterThanOrEqual(-300);
      expect(result.current.offsetY).toBeLessThanOrEqual(450);
      expect(result.current.offsetY).toBeGreaterThanOrEqual(-450);
    });

    it('GEST-07: Boundary product navigation on first/last photos with hasPrev/hasNext flags', () => {
      const onNextProduct = vi.fn();
      const onPrevProduct = vi.fn();

      // Case A: First image (0), swiping right, hasPrevProduct = false -> onPrevProduct must NOT be called
      const { unmount: unmountA } = render(
        <AppProvider>
          <GestureGallery
            product={PRODUCTS[0]}
            onClose={vi.fn()}
            onNextProduct={onNextProduct}
            onPrevProduct={onPrevProduct}
            hasPrevProduct={false}
            hasNextProduct={true}
          />
        </AppProvider>
      );

      const galleryA = screen.getByTestId('gesture-gallery-container');
      fireEvent.touchStart(galleryA, { touches: [{ clientX: 100, clientY: 150 }] });
      fireEvent.touchMove(galleryA, { touches: [{ clientX: 300, clientY: 150 }] });
      fireEvent.touchEnd(galleryA);

      expect(onPrevProduct).not.toHaveBeenCalled();
      unmountA();

      // Case B: First image (0), swiping right, hasPrevProduct = true -> onPrevProduct MUST be called
      const { unmount: unmountB } = render(
        <AppProvider>
          <GestureGallery
            product={PRODUCTS[0]}
            onClose={vi.fn()}
            onNextProduct={onNextProduct}
            onPrevProduct={onPrevProduct}
            hasPrevProduct={true}
            hasNextProduct={true}
          />
        </AppProvider>
      );

      const galleryB = screen.getByTestId('gesture-gallery-container');
      fireEvent.touchStart(galleryB, { touches: [{ clientX: 100, clientY: 150 }] });
      fireEvent.touchMove(galleryB, { touches: [{ clientX: 300, clientY: 150 }] });
      fireEvent.touchEnd(galleryB);

      expect(onPrevProduct).toHaveBeenCalledTimes(1);
      unmountB();

      // Case C: Last image (3), swiping left, hasNextProduct = false -> onNextProduct must NOT be called
      const { unmount: unmountC } = render(
        <AppProvider>
          <GestureGallery
            product={PRODUCTS[0]}
            onClose={vi.fn()}
            onNextProduct={onNextProduct}
            onPrevProduct={onPrevProduct}
            hasPrevProduct={true}
            hasNextProduct={false}
          />
        </AppProvider>
      );

      const galleryC = screen.getByTestId('gesture-gallery-container');
      // Go to photo 4 (last image)
      const photo4 = screen.getByRole('button', { name: /Ver foto 4/i });
      fireEvent.click(photo4);

      fireEvent.touchStart(galleryC, { touches: [{ clientX: 300, clientY: 150 }] });
      fireEvent.touchMove(galleryC, { touches: [{ clientX: 100, clientY: 150 }] });
      fireEvent.touchEnd(galleryC);

      expect(onNextProduct).not.toHaveBeenCalled();
      unmountC();

      // Case D: Last image (3), swiping left, hasNextProduct = true -> onNextProduct MUST be called
      render(
        <AppProvider>
          <GestureGallery
            product={PRODUCTS[0]}
            onClose={vi.fn()}
            onNextProduct={onNextProduct}
            onPrevProduct={onPrevProduct}
            hasPrevProduct={true}
            hasNextProduct={true}
          />
        </AppProvider>
      );

      const galleryD = screen.getByTestId('gesture-gallery-container');
      const photo4D = screen.getByRole('button', { name: /Ver foto 4/i });
      fireEvent.click(photo4D);

      fireEvent.touchStart(galleryD, { touches: [{ clientX: 300, clientY: 150 }] });
      fireEvent.touchMove(galleryD, { touches: [{ clientX: 100, clientY: 150 }] });
      fireEvent.touchEnd(galleryD);

      expect(onNextProduct).toHaveBeenCalledTimes(1);
    });

    it('GEST-08: Double tap timeout window and distance window boundaries', () => {
      const { result } = renderHook(() =>
        useGestures({
          imageCount: 3,
          activeImageIndex: 0,
          onImageChange: vi.fn(),
        })
      );

      // Tap 1
      act(() => {
        result.current.touchHandlers.onTouchStart({
          touches: [{ clientX: 100, clientY: 100 } as any],
        } as any);
      });
      act(() => {
        result.current.touchHandlers.onTouchEnd();
      });
      expect(result.current.scale).toBe(1.0);

      // Tap 2 with excessive distance (> 30px, e.g. 150, 150 -> distance ~70px)
      act(() => {
        result.current.touchHandlers.onTouchStart({
          touches: [{ clientX: 150, clientY: 150 } as any],
        } as any);
      });
      act(() => {
        result.current.touchHandlers.onTouchEnd();
      });
      // Should NOT zoom
      expect(result.current.scale).toBe(1.0);

      // Tap 3 close in distance (< 30px, e.g. 155, 155) within 300ms
      act(() => {
        result.current.touchHandlers.onTouchStart({
          touches: [{ clientX: 155, clientY: 155 } as any],
        } as any);
      });
      act(() => {
        result.current.touchHandlers.onTouchEnd();
      });
      // Should zoom to 2.5x
      expect(result.current.scale).toBe(2.5);
    });

    it('GEST-09: Successive quick swipes starting at similar coordinates do NOT trigger false-positive double-tap zoom', () => {
      render(
        <AppProvider>
          <GestureGallery
            product={PRODUCTS[0]}
            onClose={vi.fn()}
          />
        </AppProvider>
      );

      const gallery = screen.getByTestId('gesture-gallery-container');

      // Swipe 1: starts at (150, 200), drags to (50, 200) -> advances image
      fireEvent.touchStart(gallery, { touches: [{ clientX: 150, clientY: 200 }] });
      fireEvent.touchMove(gallery, { touches: [{ clientX: 50, clientY: 200 }] });
      fireEvent.touchEnd(gallery);

      // Swipe 2: within 200ms, starts at (155, 200) (distance 5px < 30px from previous start pos)
      // Because lastTapTime was reset when a drag occurred in Swipe 1, this second swipe start does not trigger double-tap zoom
      fireEvent.touchStart(gallery, { touches: [{ clientX: 155, clientY: 200 }] });

      // Scale remains normal (no false-positive double-tap zoom)
      expect(screen.queryByText(/Zoom 2.5x/i)).not.toBeInTheDocument();
    });
  });

  // =========================================================================
  // 2. LIVE SEARCH & FILTER ENGINE STRESS TESTS
  // =========================================================================
  describe('2. Live Search & Filter Engine Edge Cases & Stability', () => {
    it('SRCH-01: Empty, whitespace, newline, and tab queries return all products', () => {
      const { result } = renderHook(() => useSearchFilter(PRODUCTS));

      const whitespaceQueries = ['', ' ', '   ', '\t', '\n', '  \t\n  '];
      whitespaceQueries.forEach((q) => {
        act(() => {
          result.current.setSearchQuery(q);
        });
        expect(result.current.filteredProducts.length).toBe(PRODUCTS.length);
        expect(result.current.activeFilterCount).toBe(0);
      });
    });

    it('SRCH-02: Regex injection characters in search query do NOT crash or throw syntax errors', () => {
      const { result } = renderHook(() => useSearchFilter(PRODUCTS));

      const maliciousPatterns = [
        '.*',
        '[a-z]+',
        '(.*?)',
        '\\d+',
        '+',
        '?',
        '((((((',
        '[*+?^${}()|[\\]\\\\]',
        '<script>alert("xss")</script>',
        '${7*7}',
        '{{constructor.constructor("alert(1)")()}}',
      ];

      maliciousPatterns.forEach((pattern) => {
        expect(() => {
          act(() => {
            result.current.setSearchQuery(pattern);
          });
        }).not.toThrow();

        // Must return an array without crashing
        expect(Array.isArray(result.current.filteredProducts)).toBe(true);
      });
    });

    it('SRCH-03: Extreme query length (10,000 characters) processes gracefully', () => {
      const { result } = renderHook(() => useSearchFilter(PRODUCTS));
      const hugeQuery = 'A'.repeat(10000);

      act(() => {
        result.current.setSearchQuery(hugeQuery);
      });

      expect(result.current.filteredProducts.length).toBe(0);
      expect(result.current.activeFilterCount).toBe(1);
    });

    it('SRCH-04: Case-insensitivity across exact reference, material, and full metadata', () => {
      const { result } = renderHook(() => useSearchFilter(PRODUCTS));

      // Exact full reference lookup
      act(() => {
        result.current.setSearchQuery('REF-EMP-0101');
      });
      expect(result.current.filteredProducts.length).toBe(1);
      expect(result.current.filteredProducts[0].id).toBe('emp-01');

      // Lowercase exact reference lookup
      act(() => {
        result.current.setSearchQuery('ref-emp-0101');
      });
      expect(result.current.filteredProducts.length).toBe(1);

      // Substring shared reference lookup 'REF-EMP-01' matches all 8 macrame bracelet products
      act(() => {
        result.current.setSearchQuery('REF-EMP-01');
      });
      expect(result.current.filteredProducts.length).toBe(8);

      // Material / metadata lookup in text search
      act(() => {
        result.current.setSearchQuery('platino');
      });
      expect(result.current.filteredProducts.length).toBeGreaterThan(0);
      expect(
        result.current.filteredProducts.every(
          (p) =>
            p.material.toLowerCase().includes('platino') ||
            p.description.toLowerCase().includes('platino') ||
            p.short_description.toLowerCase().includes('platino') ||
            p.name.toLowerCase().includes('platino')
        )
      ).toBe(true);
    });

    it('SRCH-05: Accent sensitivity / normalization behavior check', () => {
      const { result } = renderHook(() => useSearchFilter(PRODUCTS));

      // Search with exact accent 'Geometría' matches emp-09
      act(() => {
        result.current.setSearchQuery('Geometría');
      });
      const accentedCount = result.current.filteredProducts.length;
      expect(accentedCount).toBe(1);
      expect(result.current.filteredProducts.map((p) => p.id)).toEqual(['emp-09']);

      // Search without accent 'Geometria' also matches emp-09 via diacritic normalizer
      act(() => {
        result.current.setSearchQuery('Geometria');
      });
      const unaccentedCount = result.current.filteredProducts.length;

      expect(unaccentedCount).toBe(1);
      expect(result.current.filteredProducts.map((p) => p.id)).toEqual(['emp-09']);
    });

    it('SRCH-06: Extreme price ranges, inverted values, and boundary clamping', () => {
      const { result } = renderHook(() => useSearchFilter(PRODUCTS));

      // Case 1: Inverted range [5000, 1000] is safely ordered to [1000, 5000]
      act(() => {
        result.current.setPriceRange([5000, 1000]);
      });
      expect(result.current.filters.priceRange[0]).toBe(1000);
      expect(result.current.filters.priceRange[1]).toBe(5000);

      // Case 2: Negative range [-1000, -500]
      act(() => {
        result.current.setPriceRange([-1000, -500]);
      });
      expect(result.current.filters.priceRange[0]).toBe(0);
      expect(result.current.filters.priceRange[1]).toBe(0);

      // Case 3: Price range above all catalog items [100000, 200000]
      act(() => {
        result.current.setPriceRange([100000, 200000]);
      });
      expect(result.current.filteredProducts.length).toBe(0);

      // Case 4: Reset filters returns default full catalog
      act(() => {
        result.current.resetFilters();
      });
      expect(result.current.filteredProducts.length).toBe(PRODUCTS.length);
      expect(result.current.filters.priceRange).toEqual([0, 20000]);
    });

    it('SRCH-07: Non-matching multi-filter combination produces empty result without error', () => {
      const { result } = renderHook(() => useSearchFilter(PRODUCTS));

      act(() => {
        result.current.setCategory('collares');
        result.current.setMaterial('Oro Rosa 18k');
        result.current.setCollection('NoCollection');
      });

      expect(result.current.filteredProducts.length).toBe(0);
      expect(result.current.activeFilterCount).toBe(3);
    });

    it('SRCH-08: Array immutability check: filtering does NOT mutate input PRODUCTS array', () => {
      const originalProductsSnapshot = JSON.stringify(PRODUCTS);
      const { result } = renderHook(() => useSearchFilter(PRODUCTS));

      act(() => {
        result.current.setSearchQuery('Diamante');
        result.current.setCategory('anillos');
        result.current.setPriceRange([1000, 5000]);
      });

      expect(JSON.stringify(PRODUCTS)).toBe(originalProductsSnapshot);
      expect(PRODUCTS.length).toBe(13);
    });
  });

  // =========================================================================
  // 3. FAVORITES SYSTEM STRESS TESTS
  // =========================================================================
  describe('3. Favorites System Robustness & LocalStorage Resilience', () => {
    it('FAV-01: Corrupted / invalid JSON in localStorage does not crash and defaults to empty array', () => {
      const invalidPayloads = [
        '{ invalid json string',
        'null',
        '12345',
        '{"id": "emp-01"}', // Object instead of Array
        'undefined',
        'NaN',
        '<html><body>error</body></html>',
      ];

      invalidPayloads.forEach((payload) => {
        localStorage.setItem(FAVORITES_STORAGE_KEY, payload);

        const { result, unmount } = renderHook(() => useFavorites());
        expect(Array.isArray(result.current.favorites)).toBe(true);
        expect(result.current.favorites.length).toBe(0);
        unmount();
      });
    });

    it('FAV-02: Rapid toggle spamming on same ID (100 times) maintains deterministic state', () => {
      const { result } = renderHook(() => useFavorites());

      // 100 consecutive synchronous toggles
      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.toggleFavorite('emp-01');
        }
      });

      // Even number of toggles -> should be not favorited
      expect(result.current.isFavorite('emp-01')).toBe(false);
      expect(result.current.favorites.includes('emp-01')).toBe(false);

      // 101st toggle -> should be favorited
      act(() => {
        result.current.toggleFavorite('emp-01');
      });
      expect(result.current.isFavorite('emp-01')).toBe(true);
      expect(result.current.favorites.includes('emp-01')).toBe(true);
    });

    it('FAV-03: Concurrent toggling across multiple distinct IDs maintains all unique favorites', () => {
      const { result } = renderHook(() => useFavorites());

      const productIds = ['emp-01', 'emp-02', 'emp-03', 'emp-04', 'emp-05'];

      act(() => {
        productIds.forEach((id) => result.current.toggleFavorite(id));
      });

      expect(result.current.favorites.length).toBe(5);
      productIds.forEach((id) => {
        expect(result.current.isFavorite(id)).toBe(true);
      });

      // Remove 2 items
      act(() => {
        result.current.removeFavorite('emp-02');
        result.current.removeFavorite('emp-04');
      });

      expect(result.current.favorites.length).toBe(3);
      expect(result.current.isFavorite('emp-02')).toBe(false);
      expect(result.current.isFavorite('emp-04')).toBe(false);
      expect(result.current.isFavorite('emp-01')).toBe(true);
    });

    it('FAV-04: clearFavorites empties state and synchronizes with storage', () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite('emp-01');
        result.current.toggleFavorite('emp-02');
      });
      expect(result.current.favorites.length).toBe(2);

      act(() => {
        result.current.clearFavorites();
      });

      expect(result.current.favorites.length).toBe(0);
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      expect(stored).toBe('[]');
    });

    it('FAV-05: safeStorage handles QuotaExceededError and private browsing fallback smoothly', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      });

      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.toggleFavorite('emp-99');
      });

      // In-memory state remains functional
      expect(result.current.isFavorite('emp-99')).toBe(true);
      expect(result.current.favorites).toContain('emp-99');

      setItemSpy.mockRestore();
    });
  });
});
