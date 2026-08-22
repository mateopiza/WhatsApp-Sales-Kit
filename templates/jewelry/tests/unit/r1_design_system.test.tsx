import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../../src/components/layout/Header';
import { BottomNav } from '../../src/components/layout/BottomNav';
import { Badge } from '../../src/components/ui/Badge';
import { AppProvider } from '../../src/context/AppContext';
import { PRODUCTS } from '../../src/data/products';

describe('Tier 1 - R1: Design System Compliance & Visual Identity', () => {
  it('T1-R1-01: Header renders official brand logo lockup with correct accessible label', () => {
    render(
      <AppProvider>
        <Header />
      </AppProvider>
    );

    const logoImg = screen.getByAltText(/Empires Jewelry/i);
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute('src', expect.stringContaining('logo-lockup-cream.png'));
  });

  it('T1-R1-02: Badge component supports luxury brand token variants', () => {
    const { rerender } = render(<Badge variant="gold">Edición Limitada</Badge>);
    expect(screen.getByText('Edición Limitada')).toHaveClass('bg-gold/20');

    rerender(<Badge variant="ink">Pieza Exclusiva</Badge>);
    expect(screen.getByText('Pieza Exclusiva')).toHaveClass('bg-ink');

    rerender(<Badge variant="success">Disponible</Badge>);
    expect(screen.getByText('Disponible')).toHaveClass('bg-status-success/15');
  });

  it('T1-R1-03: Bottom navigation incorporates safe-area-inset bottom class', () => {
    render(
      <AppProvider>
        <BottomNav />
      </AppProvider>
    );

    const nav = screen.getByRole('navigation', { name: /Navegación inferior/i });
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('pb-safe');
  });

  it('T1-R1-04: Header includes safe-area-inset top class', () => {
    const { container } = render(
      <AppProvider>
        <Header />
      </AppProvider>
    );

    const header = container.querySelector('header');
    expect(header).toHaveClass('pt-safe');
  });

  it('T1-R1-05: Product catalog data complies with brand schema and pricing conventions', () => {
    expect(PRODUCTS.length).toBe(13);
    PRODUCTS.forEach((product) => {
      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.reference).toMatch(/^REF-EMP-/);
      expect(product.price).toBeGreaterThan(0);
      expect(product.currency).toBe('USD');
      expect(product.cover_image).toBeDefined();
      expect(product.images.length).toBeGreaterThan(0);
      expect(product.material).toBeDefined();
    });
  });
});
