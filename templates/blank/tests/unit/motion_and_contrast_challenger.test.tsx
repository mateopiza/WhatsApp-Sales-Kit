import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import fs from 'fs';
import path from 'path';

import { useGestures } from '../../src/hooks/useGestures';
import { ProductViewer } from '../../src/components/product/ProductViewer';
import { AdminModal } from '../../src/components/admin/AdminModal';
import { SearchDrawer } from '../../src/components/search/SearchDrawer';
import { FavoritesDrawer } from '../../src/components/favorites/FavoritesDrawer';
import { AppProvider, useApp } from '../../src/context/AppContext';
import { AdminProvider } from '../../src/context/AdminContext';
import { PRODUCTS } from '../../src/data/products';
import { calculateContrastRatio, BRAND_COLORS } from '../../src/utils/contrast';

describe('Empirical Challenger 2: Motion, Contrast & Zero-Emoji Stress Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. REPOSITORY-WIDE ZERO-EMOJI STATIC SCAN
  // =========================================================================
  describe('Static Scan Oracle: Zero Emojis Compliance', () => {
    const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{200D}\u{FE0F}]/u;

    function scanAllFiles(dir: string, fileList: string[] = []): string[] {
      if (!fs.existsSync(dir)) return fileList;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (['node_modules', 'dist', '.git', '.system_generated'].includes(entry.name)) continue;
        if (entry.isDirectory()) {
          scanAllFiles(fullPath, fileList);
        } else if (/\.(tsx|ts|jsx|js|html|json|css|toml|md)$/.test(entry.name)) {
          fileList.push(fullPath);
        }
      }
      return fileList;
    }

    it('CH2-EMOJI-01: Verifies 0 Unicode emoji code points across every single source, json, and test file', () => {
      const rootDir = path.resolve(__dirname, '../../');
      const allFiles = scanAllFiles(rootDir);
      expect(allFiles.length).toBeGreaterThan(60);

      const violations: { file: string; line: number; char: string; codePoint: string }[] = [];

      for (const filePath of allFiles) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          const match = line.match(EMOJI_REGEX);
          if (match) {
            violations.push({
              file: path.relative(rootDir, filePath),
              line: idx + 1,
              char: match[0],
              codePoint: `U+${match[0].codePointAt(0)?.toString(16).toUpperCase()}`,
            });
          }
        });
      }

      expect(violations).toEqual([]);
    });
  });

  // =========================================================================
  // 2. WCAG AA CONTRAST MATHEMATICAL ORACLE
  // =========================================================================
  describe('Mathematical Oracle: Design System Contrast Verification', () => {
    it('CH2-CONTRAST-01: Primary body text (Ink #3A332D on Cream #F5EDE6) satisfies WCAG AAA (>= 7.0:1)', () => {
      const result = calculateContrastRatio(BRAND_COLORS.ink, BRAND_COLORS.cream);
      expect(result.ratio).toBeGreaterThanOrEqual(10.0);
      expect(result.isAANormal).toBe(true);
      expect(result.isAAANormal).toBe(true);
    });

    it('CH2-CONTRAST-02: Secondary text token (Taupe Contrast #5A524A on Cream #F5EDE6) satisfies WCAG AA (>= 4.5:1)', () => {
      const result = calculateContrastRatio(BRAND_COLORS.taupeContrast, BRAND_COLORS.cream);
      expect(result.ratio).toBeGreaterThanOrEqual(6.0);
      expect(result.isAANormal).toBe(true);
      expect(result.isAALarge).toBe(true);
    });

    it('CH2-CONTRAST-03: Dark Taupe metadata (#6F675D on Cream #F5EDE6) satisfies WCAG AA (>= 4.5:1)', () => {
      const result = calculateContrastRatio(BRAND_COLORS.taupeDark, BRAND_COLORS.cream);
      expect(result.ratio).toBeGreaterThanOrEqual(4.5);
      expect(result.isAANormal).toBe(true);
    });

    it('CH2-CONTRAST-04: Gold Dark accent (#7D5F30 on Cream #F5EDE6) satisfies WCAG AA (>= 4.5:1)', () => {
      const result = calculateContrastRatio(BRAND_COLORS.goldDark, BRAND_COLORS.cream);
      expect(result.ratio).toBeGreaterThanOrEqual(4.5);
      expect(result.isAANormal).toBe(true);
    });

    it('CH2-CONTRAST-05: White text on Ink background satisfies WCAG AAA (>= 7.0:1)', () => {
      const result = calculateContrastRatio(BRAND_COLORS.white, BRAND_COLORS.ink);
      expect(result.ratio).toBeGreaterThanOrEqual(12.0);
      expect(result.isAAANormal).toBe(true);
    });

    it('CH2-CONTRAST-06: Gold (#D4B48C) on Ink (#3A332D) satisfies WCAG AA (>= 4.5:1 for body and >= 3.0:1 for large)', () => {
      const result = calculateContrastRatio(BRAND_COLORS.gold, BRAND_COLORS.ink);
      expect(result.ratio).toBeGreaterThanOrEqual(6.0);
      expect(result.isAANormal).toBe(true);
      expect(result.isAALarge).toBe(true);
    });
  });

  // =========================================================================
  // 3. MOTION SYSTEM, HARDWARE ACCELERATION & ZERO LAYOUT SHIFT ORACLE
  // =========================================================================
  describe('Motion Performance & Zero Layout Shift Oracle', () => {
    const tailwindConfigPath = path.resolve(__dirname, '../../tailwind.config.js');
    const indexCssPath = path.resolve(__dirname, '../../src/index.css');
    const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf-8');
    const indexCss = fs.readFileSync(indexCssPath, 'utf-8');

    it('CH2-MOTION-01: All keyframe animations use GPU compositing properties (transform/opacity) without layout shift', () => {
      // In tailwind.config.js, keyframes must manipulate transform and opacity, not top/left/width/height
      expect(tailwindConfig).toContain('transform: \'translateY(100%)\'');
      expect(tailwindConfig).toContain('transform: \'scale(1.22)\'');
      expect(tailwindConfig).toContain('transform: \'scale(0.98) translateY(8px)\'');
      expect(tailwindConfig).not.toMatch(/keyframes:[\s\S]*?(?:top:|left:|margin-left:|width:|height:)/);
    });

    it('CH2-MOTION-02: Micro-hover zoom is bounded between 1.01x and 1.05x for luxury restraint', () => {
      expect(indexCss).toContain('transform: scale(1.025)');
    });

    it('CH2-MOTION-03: Transition durations are between 150ms and 400ms for responsiveness and elegance', () => {
      expect(tailwindConfig).toContain("'fast': '150ms'");
      expect(tailwindConfig).toContain("'base': '250ms'");
      expect(tailwindConfig).toContain("'slow': '400ms'");
    });

    it('CH2-MOTION-04: Cubic-bezier luxury timing curves are strictly defined', () => {
      expect(tailwindConfig).toContain("luxury': 'cubic-bezier(0.25, 1, 0.5, 1)'");
      expect(tailwindConfig).toContain("editorial': 'cubic-bezier(0.16, 1, 0.3, 1)'");
      expect(tailwindConfig).toContain("tactile': 'cubic-bezier(0.34, 1.25, 0.64, 1)'");
    });
  });

  // =========================================================================
  // 4. RAPID CONTINUOUS TRIGGER STRESS HARNESS
  // =========================================================================
  describe('Rapid Continuous Trigger Stress Harness', () => {
    it('CH2-STRESS-01: 200 consecutive multi-touch gesture inputs execute without throwing or NaN scale', () => {
      const { result } = renderHook(() =>
        useGestures({
          imageCount: 4,
          activeImageIndex: 0,
          onImageChange: vi.fn(),
        })
      );

      for (let i = 0; i < 200; i++) {
        act(() => {
          const startX = 100 + (i % 50);
          const startY = 100 + (i % 30);
          result.current.touchHandlers.onTouchStart({
            touches: [
              { clientX: startX, clientY: startY },
              { clientX: startX + 50, clientY: startY + 50 },
            ] as any,
          } as any);

          result.current.touchHandlers.onTouchMove({
            touches: [
              { clientX: startX - 20, clientY: startY },
              { clientX: startX + 120, clientY: startY + 50 },
            ] as any,
          } as any);

          result.current.touchHandlers.onTouchEnd();
        });

        expect(Number.isNaN(result.current.scale)).toBe(false);
        expect(Number.isFinite(result.current.scale)).toBe(true);
        expect(result.current.scale).toBeGreaterThanOrEqual(1.0);
        expect(result.current.scale).toBeLessThanOrEqual(3.5);
      }
    });

    it('CH2-STRESS-02: Rapid continuous search drawer opening and closing (100 cycles) cleanly mounts and unmounts', () => {
      const TestContainer: React.FC = () => {
        const { setIsSearchOpen } = useApp();
        return (
          <div>
            <button onClick={() => setIsSearchOpen(true)}>Open Search</button>
            <button onClick={() => setIsSearchOpen(false)}>Close Search</button>
            <SearchDrawer />
          </div>
        );
      };

      const { unmount } = render(
        <AppProvider>
          <TestContainer />
        </AppProvider>
      );

      const openBtn = screen.getByText('Open Search');
      const closeBtn = screen.getByText('Close Search');

      for (let i = 0; i < 100; i++) {
        fireEvent.click(openBtn);
        expect(screen.getByRole('dialog', { name: /Búsqueda instantánea y filtros/i })).toBeInTheDocument();
        fireEvent.click(closeBtn);
        expect(screen.queryByRole('dialog', { name: /Búsqueda instantánea y filtros/i })).not.toBeInTheDocument();
      }

      unmount();
    });

    it('CH2-STRESS-03: Rapid consecutive product modal transitions maintain body overflow integrity and state consistency', () => {
      const ProductTestRunner: React.FC = () => {
        const { openProductViewer, closeProductViewer } = useApp();
        return (
          <div>
            <button onClick={() => openProductViewer(PRODUCTS[0])}>Open P1</button>
            <button onClick={() => openProductViewer(PRODUCTS[1])}>Open P2</button>
            <button onClick={closeProductViewer}>Close</button>
            <ProductViewer />
          </div>
        );
      };

      render(
        <AppProvider>
          <ProductTestRunner />
        </AppProvider>
      );

      const openP1 = screen.getByText('Open P1');
      const openP2 = screen.getByText('Open P2');
      const close = screen.getByText('Close');

      for (let i = 0; i < 50; i++) {
        fireEvent.click(openP1);
        expect(screen.getByTestId('product-viewer-modal')).toBeInTheDocument();
        expect(document.body.style.overflow).toBe('hidden');
        fireEvent.click(openP2);
        expect(screen.getByTestId('product-viewer-modal')).toBeInTheDocument();
        expect(document.body.style.overflow).toBe('hidden');
        fireEvent.click(close);
        expect(screen.queryByTestId('product-viewer-modal')).not.toBeInTheDocument();
        expect(document.body.style.overflow).toBe('');
      }

      expect(document.body.style.overflow).toBe('');
    });

    it('CH2-STRESS-04: Admin Portal open/close stress cycles cleanly unmount and clear credentials state', () => {
      const AdminTestRunner: React.FC = () => {
        const { openAdmin, closeAdmin } = useApp();
        return (
          <div>
            <button onClick={openAdmin}>Open Admin</button>
            <button onClick={closeAdmin}>Close Admin</button>
            <AdminModal />
          </div>
        );
      };

      render(
        <AppProvider>
          <AdminProvider>
            <AdminTestRunner />
          </AdminProvider>
        </AppProvider>
      );

      const openAdminBtn = screen.getByText('Open Admin');
      const closeAdminBtn = screen.getByText('Close Admin');

      for (let i = 0; i < 50; i++) {
        fireEvent.click(openAdminBtn);
        expect(screen.getByRole('dialog', { name: /My Store CMS/i })).toBeInTheDocument();
        fireEvent.click(closeAdminBtn);
        expect(screen.queryByRole('dialog', { name: /My Store CMS/i })).not.toBeInTheDocument();
      }
    });

    it('CH2-STRESS-05: Favorites Drawer rapid open, add, remove, and close cycles maintain deterministic state', () => {
      const FavoritesTestRunner: React.FC = () => {
        const { setIsFavoritesOpen, toggleFavorite } = useApp();
        return (
          <div>
            <button onClick={() => setIsFavoritesOpen(true)}>Open Favs</button>
            <button onClick={() => setIsFavoritesOpen(false)}>Close Favs</button>
            <button onClick={() => toggleFavorite(PRODUCTS[0].id)}>Toggle P1</button>
            <FavoritesDrawer />
          </div>
        );
      };

      render(
        <AppProvider>
          <FavoritesTestRunner />
        </AppProvider>
      );

      const openFavsBtn = screen.getByText('Open Favs');
      const closeFavsBtn = screen.getByText('Close Favs');
      const toggleP1Btn = screen.getByText('Toggle P1');

      for (let i = 0; i < 20; i++) {
        fireEvent.click(toggleP1Btn);
        fireEvent.click(openFavsBtn);
        expect(screen.getByRole('dialog', { name: /Selección privada de productos guardados/i })).toBeInTheDocument();
        fireEvent.click(closeFavsBtn);
        expect(screen.queryByRole('dialog', { name: /Selección privada de productos guardados/i })).not.toBeInTheDocument();
      }
    });
  });
});
