import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { SearchDrawer } from '../../src/components/search/SearchDrawer';
import { FavoritesDrawer } from '../../src/components/favorites/FavoritesDrawer';
import { BottomNav } from '../../src/components/layout/BottomNav';
import { AppProvider, useApp } from '../../src/context/AppContext';
import { useFavorites, FAVORITES_STORAGE_KEY } from '../../src/hooks/useFavorites';
import { PRODUCTS } from '../../src/data/products';
import { generateBulkWhatsAppLink } from '../../src/utils/whatsapp';
import React, { useEffect } from 'react';

const SearchDrawerWrapper: React.FC = () => {
  const { setIsSearchOpen } = useApp();
  useEffect(() => {
    setIsSearchOpen(true);
  }, [setIsSearchOpen]);
  return <SearchDrawer />;
};

const FavoritesDrawerWrapper: React.FC = () => {
  const { setIsFavoritesOpen } = useApp();
  useEffect(() => {
    setIsFavoritesOpen(true);
  }, [setIsFavoritesOpen]);
  return <FavoritesDrawer />;
};

describe('Tier 1 - R4: Instant Search, Live Filters, Favorites & Bottom Nav', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('T1-R4-01: Search input dynamically filters catalog pieces instantaneously', () => {
    render(
      <AppProvider>
        <SearchDrawerWrapper />
      </AppProvider>
    );

    const input = screen.getByPlaceholderText(/Buscar por joya/i);
    fireEvent.change(input, { target: { value: 'Esmeralda' } });

    // Should find the Solitario Geometría Esmeralda
    expect(screen.getByText(/Solitario Geometría Esmeralda/i)).toBeInTheDocument();
  });

  it('T1-R4-02: Multi-attribute category filter restricts search output', () => {
    render(
      <AppProvider>
        <SearchDrawerWrapper />
      </AppProvider>
    );

    // Open filters
    const filterToggleBtn = screen.getByRole('button', { name: /Alternar filtros/i });
    fireEvent.click(filterToggleBtn);

    // Click 'Aretes' filter pill
    const aretesBtn = screen.getByRole('button', { name: 'Aretes' });
    fireEvent.click(aretesBtn);

    expect(screen.getByText(/2 piezas encontradas/i)).toBeInTheDocument();
  });

  it('T1-R4-03: useFavorites persists saved items in localStorage under empires_jewelry_favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite('emp-01');
    });

    expect(result.current.isFavorite('emp-01')).toBe(true);
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    expect(stored).toContain('emp-01');

    act(() => {
      result.current.toggleFavorite('emp-01');
    });

    expect(result.current.isFavorite('emp-01')).toBe(false);
  });

  it('T1-R4-04: FavoritesDrawer displays favorited items and handles removal', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([PRODUCTS[0].id]));

    render(
      <AppProvider>
        <FavoritesDrawerWrapper />
      </AppProvider>
    );

    expect(screen.getByText(PRODUCTS[0].name)).toBeInTheDocument();

    const deleteBtn = screen.getByRole('button', {
      name: new RegExp(`Eliminar ${PRODUCTS[0].name} de favoritos`, 'i'),
    });
    fireEvent.click(deleteBtn);

    expect(screen.queryByText(PRODUCTS[0].name)).not.toBeInTheDocument();
    expect(screen.getByText(/Tu Selección está Vacía/i)).toBeInTheDocument();
  });

  it('T1-R4-05: generateBulkWhatsAppLink compiles multiple products into structured summary', () => {
    const items = [PRODUCTS[0], PRODUCTS[1]];
    const link = generateBulkWhatsAppLink(items);

    expect(link).toContain('https://wa.me/573001234567?text=');
    expect(link).toContain(encodeURIComponent(PRODUCTS[0].name));
    expect(link).toContain(encodeURIComponent(PRODUCTS[1].name));
    expect(link).toContain(encodeURIComponent('Total estimado:'));
  });

  it('T1-R4-06: BottomNav highlights active tab and switches between views', () => {
    render(
      <AppProvider>
        <BottomNav />
      </AppProvider>
    );

    const coleccionesTab = screen.getByTestId('nav-tab-colecciones');
    fireEvent.click(coleccionesTab);

    expect(coleccionesTab).toHaveClass('text-ink');
  });
});
