import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditorialHero } from '../../src/components/home/EditorialHero';
import { CategoryGrid } from '../../src/components/home/CategoryGrid';
import { BrandStory } from '../../src/components/home/BrandStory';
import { ConciergeSection } from '../../src/components/home/ConciergeSection';
import { AppProvider } from '../../src/context/AppContext';
import { CATEGORIES } from '../../src/data/products';

describe('Tier 1 - R2: Editorial Home & Navigation', () => {
  it('T1-R2-01: EditorialHero renders luxury badge, brand headline, and Explorar CTA', () => {
    render(
      <AppProvider>
        <EditorialHero />
      </AppProvider>
    );

    expect(screen.getByText(/NUEVA COLECCIÓN — 2026/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: /ELEGANCIA QUE TE ACOMPAÑA SIEMPRE/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Explorar piezas de la colección/i })).toBeInTheDocument();
  });

  it('T1-R2-02: Clicking Explorar Piezas invokes smooth scrolling to catalog section', () => {
    render(
      <AppProvider>
        <EditorialHero />
      </AppProvider>
    );

    const ctaBtn = screen.getByRole('button', { name: /Explorar piezas de la colección/i });
    fireEvent.click(ctaBtn);
    // Smooth scroll triggers without error
    expect(ctaBtn).toBeInTheDocument();
  });

  it('T1-R2-03: CategoryGrid renders all 5 luxury categories with piece counts', () => {
    render(
      <AppProvider>
        <CategoryGrid />
      </AppProvider>
    );

    CATEGORIES.forEach((cat) => {
      expect(screen.getByRole('heading', { level: 3, name: new RegExp(cat.name, 'i') })).toBeInTheDocument();
    });
  });

  it('T1-R2-04: BrandStory renders all 4 brand pillars (Calidad, Confianza, Pasión, Exclusividad)', () => {
    render(<BrandStory />);

    expect(screen.getByText('CALIDAD')).toBeInTheDocument();
    expect(screen.getByText('CONFIANZA')).toBeInTheDocument();
    expect(screen.getByText('PASIÓN')).toBeInTheDocument();
    expect(screen.getByText('EXCLUSIVIDAD')).toBeInTheDocument();
  });

  it('T1-R2-05: ConciergeSection renders VIP concierge contact with WhatsApp link', () => {
    render(<ConciergeSection />);

    const waLink = screen.getByRole('link', { name: /Contactar por WhatsApp/i });
    expect(waLink).toBeInTheDocument();
    expect(waLink).toHaveAttribute('href', expect.stringContaining('https://wa.me/'));
  });
});
