import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { SearchDrawer } from '../../src/components/search/SearchDrawer';
import { FavoritesDrawer } from '../../src/components/favorites/FavoritesDrawer';
import { GestureGallery } from '../../src/components/product/GestureGallery';
import { SkeletonImage } from '../../src/components/ui/SkeletonImage';
import { AppProvider, useApp } from '../../src/context/AppContext';
import { useFavorites } from '../../src/hooks/useFavorites';
import { useSearchFilter } from '../../src/hooks/useSearchFilter';
import { usePWAInstall } from '../../src/hooks/usePWAInstall';
import { useGestures } from '../../src/hooks/useGestures';
import { PRODUCTS } from '../../src/data/products';
import { safeStorage } from '../../src/utils/storage';
import React, { useEffect } from 'react';

const SearchDrawerOpen: React.FC = () => {
  const { setIsSearchOpen } = useApp();
  useEffect(() => {
    setIsSearchOpen(true);
  }, [setIsSearchOpen]);
  return <SearchDrawer />;
};

const FavoritesDrawerOpen: React.FC = () => {
  const { setIsFavoritesOpen } = useApp();
  useEffect(() => {
    setIsFavoritesOpen(true);
  }, [setIsFavoritesOpen]);
  return <FavoritesDrawer />;
};

describe('Tier 2: Boundary & Corner Cases', () => {
  beforeEach(() => {
    localStorage.clear();
    safeStorage.clear();
  });

  it('T2-BC-01: Handles whitespace-only search query without error, returning full catalog', () => {
    render(
      <AppProvider>
        <SearchDrawerOpen />
      </AppProvider>
    );

    const input = screen.getByPlaceholderText(/Buscar por joya/i);
    fireEvent.change(input, { target: { value: '     ' } });

    // Displays 12 pieces found
    expect(screen.getByText(/13 piezas encontradas/i)).toBeInTheDocument();
  });

  it('T2-BC-02: Zero-match filter combination displays elegant empty state with reset button', () => {
    render(
      <AppProvider>
        <SearchDrawerOpen />
      </AppProvider>
    );

    const input = screen.getByPlaceholderText(/Buscar por joya/i);
    fireEvent.change(input, { target: { value: 'NonExistentJewelryItemXYZ' } });

    expect(screen.getByText(/0 piezas encontradas/i)).toBeInTheDocument();
    expect(screen.getByText(/No se encontraron piezas/i)).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /Ver Todo el Catálogo/i });
    fireEvent.click(resetBtn);

    expect(screen.getByText(/13 piezas encontradas/i)).toBeInTheDocument();
  });

  it('T2-BC-03: Inverted price range clamps min/max safely', () => {
    const { result } = renderHook(() => useSearchFilter(PRODUCTS));

    act(() => {
      // Pass inverted price range [5000, 1000]
      result.current.setPriceRange([5000, 1000]);
    });

    expect(result.current.filters.priceRange[0]).toBe(1000);
    expect(result.current.filters.priceRange[1]).toBe(5000);
  });

  it('T2-BC-04: Rapid touch swipe spamming executes safely without out-of-bounds error', () => {
    const onNextProduct = vi.fn();
    render(
      <AppProvider>
        <GestureGallery
          product={PRODUCTS[0]}
          onClose={vi.fn()}
          onNextProduct={onNextProduct}
          hasNextProduct={true}
        />
      </AppProvider>
    );

    const gallery = screen.getByTestId('gesture-gallery-container');

    // Fire 6 rapid touch swipes
    for (let i = 0; i < 6; i++) {
      fireEvent.touchStart(gallery, { touches: [{ clientX: 250, clientY: 150 }] });
      fireEvent.touchMove(gallery, { touches: [{ clientX: 50, clientY: 150 }] });
      fireEvent.touchEnd(gallery);
    }

    // Component remains stable
    expect(gallery).toBeInTheDocument();
  });

  it('T2-BC-05: Empty favorites drawer displays helpful message and button to explore', () => {
    render(
      <AppProvider>
        <FavoritesDrawerOpen />
      </AppProvider>
    );

    expect(screen.getByText(/Tu Selección está Vacía/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Explorar Colección/i })).toBeInTheDocument();
  });

  it('T2-BC-06: LocalStorage quota exceeded caught safely with in-memory store fallback', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError', 'QuotaExceededError');
    });

    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite('emp-01');
    });

    expect(result.current.isFavorite('emp-01')).toBe(true);
    setItemSpy.mockRestore();
  });

  it('T2-BC-07: SkeletonImage renders fallback text on image error', () => {
    render(
      <SkeletonImage
        src="/invalid-image-path.jpg"
        alt="Invalid Image"
        fallbackText="EMPIRES LUXURY"
      />
    );

    const img = screen.getByAltText('Invalid Image');
    fireEvent.error(img);

    expect(screen.getByText('EMPIRES LUXURY')).toBeInTheDocument();
  });

  it('T2-BC-08: Swiping right on first image of first product with no prevProduct clamps delta', () => {
    const onPrevProduct = vi.fn();
    render(
      <AppProvider>
        <GestureGallery
          product={PRODUCTS[0]}
          onClose={vi.fn()}
          onPrevProduct={onPrevProduct}
          hasPrevProduct={false}
        />
      </AppProvider>
    );

    const gallery = screen.getByTestId('gesture-gallery-container');

    // Swipe right (deltaX = +100px) on image 0
    fireEvent.touchStart(gallery, { touches: [{ clientX: 100, clientY: 150 }] });
    fireEvent.touchMove(gallery, { touches: [{ clientX: 250, clientY: 150 }] });
    fireEvent.touchEnd(gallery);

    expect(onPrevProduct).not.toHaveBeenCalled();
  });

  it('T2-BC-09: Diacritic-insensitive search matches accented words using unaccented query and vice versa', () => {
    const { result } = renderHook(() => useSearchFilter(PRODUCTS));

    // Unaccented "geometria" matches "Solitario Geometría Esmeralda"
    act(() => {
      result.current.setSearchQuery('geometria');
    });
    expect(result.current.filteredProducts.some((p) => p.name.includes('Geometría'))).toBe(true);

    // Unaccented "pave" matches "Alianza Eternity Pavé Diamantes"
    act(() => {
      result.current.setSearchQuery('pave');
    });
    expect(result.current.filteredProducts.some((p) => p.name.includes('Pavé'))).toBe(true);

    // Accented query "Colección" matches "Colección Imperial"
    act(() => {
      result.current.setSearchQuery('Colección');
    });
    expect(result.current.filteredProducts.length).toBeGreaterThan(0);

    // Unaccented query "Coleccion" matches "Colección Imperial"
    act(() => {
      result.current.setSearchQuery('Coleccion');
    });
    expect(result.current.filteredProducts.length).toBeGreaterThan(0);
  });

  it('T2-BC-10: Inverted price range safely orders bounds [Math.min, Math.max]', () => {
    const { result } = renderHook(() => useSearchFilter(PRODUCTS));

    act(() => {
      result.current.setPriceRange([12000, 3000]);
    });
    expect(result.current.filters.priceRange).toEqual([3000, 12000]);

    // Clamps negative lower bounds to 0
    act(() => {
      result.current.setPriceRange([5000, -200]);
    });
    expect(result.current.filters.priceRange).toEqual([0, 5000]);
  });

  it('T2-BC-11: usePWAInstall handles environments where window.matchMedia is undefined without crashing', () => {
    const originalMatchMedia = window.matchMedia;
    try {
      (window as any).matchMedia = undefined;
      const { result } = renderHook(() => usePWAInstall());
      expect(result.current.isInstalled).toBe(false);
      expect(result.current.isInstallable).toBe(false);
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it('T2-BC-12: useGestures actively dragging > 10px resets tap timer to prevent false double-tap', () => {
    const { result } = renderHook(() =>
      useGestures({
        imageCount: 3,
        activeImageIndex: 0,
        onImageChange: vi.fn(),
      })
    );

    // Initial touch at (100, 100)
    act(() => {
      result.current.touchHandlers.onTouchStart({
        touches: [{ clientX: 100, clientY: 100 } as any],
      } as any);
    });

    // Touch move > 10px (e.g. to 125, 100)
    act(() => {
      result.current.touchHandlers.onTouchMove({
        touches: [{ clientX: 125, clientY: 100 } as any],
      } as any);
    });

    act(() => {
      result.current.touchHandlers.onTouchEnd();
    });

    // Second touch shortly after at (105, 100) (within 30px of first touch)
    act(() => {
      result.current.touchHandlers.onTouchStart({
        touches: [{ clientX: 105, clientY: 100 } as any],
      } as any);
    });

    // Scale should remain at 1.0 (no double-tap zoom because first touch moved > 10px)
    expect(result.current.scale).toBe(1.0);
  });
});
