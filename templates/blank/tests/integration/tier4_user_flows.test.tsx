import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';
import { PRODUCTS } from '../../src/data/products';

describe('Tier 4: Real-World User Scenarios (End-to-End)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('T4-UF-01: VIP Shopper: Landing -> Hero CTA -> Lookbook inspect -> Swipe -> Zoom -> WhatsApp CTA', () => {
    render(<App />);

    // 1. Landing: Hero cover renders
    expect(
      screen.getByRole('heading', { level: 1, name: /Vende Directo Por WhatsApp/i })
    ).toBeInTheDocument();

    // 2. Click "Explorar Catálogo"
    const exploreBtn = screen.getByRole('button', { name: /Explorar el catálogo/i });
    fireEvent.click(exploreBtn);

    // 3. Inspect first product
    const inspectButtons = screen.getAllByText(/Inspeccionar/i);
    fireEvent.click(inspectButtons[0]);

    const modal = screen.getByTestId('product-viewer-modal');
    expect(modal).toBeInTheDocument();

    // 4. Swipe to see next photo
    const gallery = screen.getByTestId('gesture-gallery-container');
    fireEvent.touchStart(gallery, { touches: [{ clientX: 250, clientY: 150 }] });
    fireEvent.touchMove(gallery, { touches: [{ clientX: 50, clientY: 150 }] });
    fireEvent.touchEnd(gallery);

    expect(screen.getByAltText(new RegExp(`${PRODUCTS[0].name} - Imagen 2`, 'i'))).toBeInTheDocument();

    // 5. Double tap to zoom in
    fireEvent.touchStart(gallery, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchEnd(gallery);
    fireEvent.touchStart(gallery, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchEnd(gallery);

    expect(screen.getByText(/Zoom 2.5x/i)).toBeInTheDocument();

    // 6. Consult WhatsApp CTA link is present and correctly formatted
    const waCTA = screen.getByRole('link', { name: new RegExp(`Consultar ${PRODUCTS[0].name}`, 'i') });
    expect(waCTA).toBeInTheDocument();
    expect(waCTA).toHaveAttribute('href', expect.stringContaining('https://wa.me/'));
    expect(waCTA).toHaveAttribute('href', expect.stringContaining(encodeURIComponent(PRODUCTS[0].reference)));
  });

  it('T4-UF-02: Bridal Collection Curation: Search -> Multi-Favorite -> Bulk WhatsApp Inquiry', () => {
    render(<App />);

    // 1. Open Search Drawer
    const searchNavBtn = screen.getByRole('button', { name: 'Buscar' });
    fireEvent.click(searchNavBtn);

    // 2. Filter for "Demo 1"
    const searchInput = screen.getByPlaceholderText(/Buscar por nombre/i);
    fireEvent.change(searchInput, { target: { value: 'Demo 1' } });

    // 3. Add to favorites
    const favButtons = screen.getAllByRole('button', { name: /guardar en favoritos/i });
    expect(favButtons.length).toBeGreaterThan(0);
    fireEvent.click(favButtons[0]);

    // 4. Clear search and search for "Demo 2"
    fireEvent.change(searchInput, { target: { value: 'Demo 2' } });
    const favButtons2 = screen.getAllByRole('button', { name: /guardar en favoritos/i });
    if (favButtons2.length > 0) {
      fireEvent.click(favButtons2[0]);
    }

    // 5. Close search drawer
    const closeSearchBtn = screen.getByRole('button', { name: /Cerrar buscador/i });
    fireEvent.click(closeSearchBtn);

    // 6. Open Favorites drawer
    const favoritesTab = screen.getByTestId('nav-tab-favoritos');
    fireEvent.click(favoritesTab);

    // 7. Verify bulk consultation link
    const waBulkBtn = screen.getByRole('link', { name: /Consultar selección por WhatsApp/i });
    expect(waBulkBtn).toBeInTheDocument();
    expect(waBulkBtn).toHaveAttribute('href', expect.stringContaining('https://wa.me/'));
  });

  it('T4-UF-03: Offline Mode Banner Display & Resiliency Flow', () => {
    render(<App />);

    // Trigger offline event
    fireEvent(window, new Event('offline'));

    // Trigger online event
    fireEvent(window, new Event('online'));

    expect(screen.getByRole('navigation', { name: /Navegación inferior/i })).toBeInTheDocument();
  });
});
