import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';
import React from 'react';

describe('Empires Urban Luxury Fashion App', () => {
  it('renders urban branding headline and streetwear drops', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /EMPIRES URBAN LUXURY/i })).toBeInTheDocument();
    expect(screen.getByText(/MODA/i)).toBeInTheDocument();
    expect(screen.getByText(/Hoodie Heavyweight 500GSM Monogram/i)).toBeInTheDocument();
  });

  it('opens fit guide modal on clicking Guía de Tallas', () => {
    render(<App />);

    const fitBtn = screen.getAllByRole('button', { name: /Guía de Tallas/i })[0];
    fireEvent.click(fitBtn);

    expect(screen.getByText(/Atelier Tailoring Guide/i)).toBeInTheDocument();
    expect(screen.getByText(/Servicio Bespoke A Medida Disponible/i)).toBeInTheDocument();
  });

  it('opens outfit studio modal on clicking Combinar Look', () => {
    render(<App />);

    const outfitBtn = screen.getAllByRole('button', { name: /Estudio de Outfits/i })[0];
    fireEvent.click(outfitBtn);

    expect(screen.getByText(/Combinador de Outfits & Style Canvas/i)).toBeInTheDocument();
  });

  it('renders mobile bottom navigation bar and opens favorites drawer', () => {
    render(<App />);

    const bottomNav = screen.getByRole('navigation', { name: /Navegación inferior móvil/i });
    expect(bottomNav).toBeInTheDocument();

    const favoritesBtn = screen.getByRole('button', { name: /Guardados/i });
    fireEvent.click(favoritesBtn);

    expect(screen.getByText(/Mi Selección Privada/i)).toBeInTheDocument();
  });
});
