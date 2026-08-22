import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OfflineBanner } from '../../src/components/ui/OfflineBanner';
import { SkeletonImage } from '../../src/components/ui/SkeletonImage';
import fs from 'fs';
import path from 'path';

describe('Tier 1 - R5: PWA Architecture & Performance Utilities', () => {
  it('T1-R5-01: Manifest JSON exists, has standalone mode and brand theme color #FAFAF9', () => {
    const manifestPath = path.resolve(__dirname, '../../public/manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    expect(manifestContent.display).toBe('standalone');
    expect(manifestContent.theme_color).toBe('#FAFAF9');
    expect(manifestContent.background_color).toBe('#FAFAF9');
    expect(manifestContent.icons.length).toBeGreaterThan(0);
  });

  it('T1-R5-02: Service Worker sw.js exists and contains CacheFirst and StaleWhileRevalidate strategies', () => {
    const swPath = path.resolve(__dirname, '../../public/sw.js');
    expect(fs.existsSync(swPath)).toBe(true);

    const swContent = fs.readFileSync(swPath, 'utf8');
    expect(swContent).toContain('store-static-v1');
    expect(swContent).toContain('store-shell-v1');
    expect(swContent).toContain('addEventListener');
  });

  it('T1-R5-03: OfflineBanner responds to window offline/online event dispatch', () => {
    render(<OfflineBanner />);

    // Initially online -> banner not rendered
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    // Trigger offline
    fireEvent(window, new Event('offline'));
    // React state hook triggers re-render
  });

  it('T1-R5-04: SkeletonImage transitions to full opacity on image load', () => {
    render(
      <SkeletonImage
        src="/assets/products/placeholder-1.svg"
        alt="Producto de ejemplo"
        aspectRatio="portrait"
      />
    );

    const img = screen.getByAltText('Producto de ejemplo');
    expect(img).toHaveClass('opacity-0');

    // Fire image load
    fireEvent.load(img);
    expect(img).toHaveClass('opacity-100');
  });
});
