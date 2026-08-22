import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../../src/App';
import { FAVORITES_STORAGE_KEY } from '../../src/hooks/useFavorites';
import { PRODUCTS } from '../../src/data/products';

describe('Tier 3: Cross-Feature Combinations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('T3-CF-01: executes Search -> Filter -> Favorite -> Bulk WhatsApp creation', () => {
    render(<App />);

    // 1. Open Search Drawer via Bottom Nav
    const searchNavBtn = screen.getByRole('button', { name: 'Buscar' });
    fireEvent.click(searchNavBtn);

    // 2. Type "Oro Blanco"
    const searchInput = screen.getByPlaceholderText(/Buscar por joya/i);
    fireEvent.change(searchInput, { target: { value: 'Oro Blanco' } });

    // 3. Favorite first search result
    const favButtons = screen.getAllByRole('button', { name: /guardar en favoritos/i });
    expect(favButtons.length).toBeGreaterThan(0);
    fireEvent.click(favButtons[0]);

    // 4. Open Favorites Drawer via Bottom Nav
    const favNavBtn = screen.getByTestId('nav-tab-favoritos');
    fireEvent.click(favNavBtn);

    // 5. Verify item appears in drawer and bulk WhatsApp link exists
    const waLink = screen.getByRole('link', { name: /Consultar selección por WhatsApp/i });
    expect(waLink).toBeInTheDocument();
    expect(waLink).toHaveAttribute('href', expect.stringContaining('https://wa.me/'));
  });

  it('T3-CF-02: Product Modal open -> Gallery Swipe -> Double-Tap Zoom -> Native Share', async () => {
    render(<App />);

    // 1. Click first product to open viewer
    const productCards = screen.getAllByText(/Inspeccionar/i);
    fireEvent.click(productCards[0]);

    const modal = screen.getByTestId('product-viewer-modal');
    expect(modal).toBeInTheDocument();

    const gallery = screen.getByTestId('gesture-gallery-container');

    // 2. Swipe photo
    fireEvent.touchStart(gallery, { touches: [{ clientX: 250, clientY: 150 }] });
    fireEvent.touchMove(gallery, { touches: [{ clientX: 50, clientY: 150 }] });
    fireEvent.touchEnd(gallery);

    // 3. Double-tap to zoom
    fireEvent.touchStart(gallery, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchEnd(gallery);
    fireEvent.touchStart(gallery, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchEnd(gallery);

    expect(screen.getByText(/Zoom 2.5x/i)).toBeInTheDocument();

    // 4. Share button
    const shareBtn = screen.getAllByRole('button', { name: /Compartir/i })[0];
    await act(async () => {
      fireEvent.click(shareBtn);
    });
    expect(shareBtn).toBeInTheDocument();
  });

  it('T3-CF-03: Category Navigation in Lookbook -> Filter Reset -> Bottom Nav Sync', () => {
    render(<App />);

    // 1. Click 'Aretes' category button
    const aretesBtn = screen.getByRole('button', { name: 'Aretes' });
    fireEvent.click(aretesBtn);

    // Lookbook displays filtered count
    expect(screen.getByText(/Todas \(2\)/i)).toBeInTheDocument();

    // 2. Click 'Todas' to reset category
    const todasBtn = screen.getByRole('button', { name: /Todas \(2\)/i });
    fireEvent.click(todasBtn);

    expect(screen.getByText(/Todas \(13\)/i)).toBeInTheDocument();
  });

  it('T3-CF-04: LocalStorage Hydration -> Product Modal Toggle -> Header Badge Sync', () => {
    // Preload localStorage with 2 items
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify([PRODUCTS[0].id, PRODUCTS[1].id])
    );

    render(<App />);

    // Header badge reflects 2 items
    const badge = screen.getByTestId('favorites-badge');
    expect(badge).toHaveTextContent('2');

    // Open first product
    const productCards = screen.getAllByText(/Inspeccionar/i);
    fireEvent.click(productCards[0]);

    // Unfavorite from modal
    const favHeartBtn = screen.getByRole('button', {
      name: new RegExp(`Guardar ${PRODUCTS[0].name} en favoritos`, 'i'),
    });
    fireEvent.click(favHeartBtn);

    // Close modal
    const closeBtn = screen.getByRole('button', { name: /Cerrar visor de producto/i });
    fireEvent.click(closeBtn);

    // Badge updates to 1
    expect(badge).toHaveTextContent('1');
  });
});
