import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Luxury Motion & Micro-Interactions System', () => {
  const indexCss = fs.readFileSync(path.resolve(__dirname, '../../src/index.css'), 'utf-8');
  const tailwindConfig = fs.readFileSync(path.resolve(__dirname, '../../tailwind.config.js'), 'utf-8');

  it('defines custom luxury cubic-bezier easing curves in tailwind.config.js', () => {
    expect(tailwindConfig).toContain("luxury': 'cubic-bezier(0.25, 1, 0.5, 1)'");
    expect(tailwindConfig).toContain("editorial': 'cubic-bezier(0.16, 1, 0.3, 1)'");
    expect(tailwindConfig).toContain("tactile': 'cubic-bezier(0.34, 1.25, 0.64, 1)'");
  });

  it('defines multi-layer luxury elevation shadows in CSS variables', () => {
    expect(indexCss).toContain('--shadow-luxury-card:');
    expect(indexCss).toContain('--shadow-luxury-hover:');
    expect(indexCss).toContain('--shadow-luxury-modal:');
  });

  it('contains luxury micro-interaction classes in src/index.css', () => {
    expect(indexCss).toContain('.card-luxury');
    expect(indexCss).toContain('.img-luxury-zoom');
    expect(indexCss).toContain('.btn-favorite-active');
    expect(indexCss).toContain('.btn-cta-luxury');
    expect(indexCss).toContain('.pill-tab-switch');
  });

  it('configures restrained 1.025x micro-hover zoom scaling', () => {
    expect(indexCss).toContain('transform: scale(1.025)');
  });

  it('defines tactile heart favorite pulse keyframes', () => {
    expect(tailwindConfig).toContain('heartPulse');
    expect(tailwindConfig).toContain('scale(1.22)');
  });
});
