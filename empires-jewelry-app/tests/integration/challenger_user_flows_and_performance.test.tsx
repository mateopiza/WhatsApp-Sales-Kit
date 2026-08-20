import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act, within } from '@testing-library/react';
import fs from 'fs';
import path from 'path';

import App from '../../src/App';
import { PRODUCTS, CATEGORIES } from '../../src/data/products';
import { generateBulkWhatsAppLink, DEFAULT_WHATSAPP_PHONE } from '../../src/utils/whatsapp';
import { shareProduct } from '../../src/utils/share';
import { usePWAInstall } from '../../src/hooks/usePWAInstall';
import { useGestures } from '../../src/hooks/useGestures';
import { FAVORITES_STORAGE_KEY } from '../../src/hooks/useFavorites';
import { AppProvider } from '../../src/context/AppContext';
import { GestureGallery } from '../../src/components/product/GestureGallery';

describe('Empirical Challenger 2: User Flow & Performance Adversarial Harness', () => {
  beforeEach(() => {
    localStorage.clear();
    // Ensure matchMedia mock is preserved
    if (!window.matchMedia || typeof window.matchMedia !== 'function') {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    }
  });

  /* ------------------------------------------------------------------
   * 1. 100% Asset Path Resolution Verification (Zero 404s)
   * ------------------------------------------------------------------ */
  describe('Dimension 1: Asset Path Resolution Oracle', () => {
    const publicDir = path.resolve(__dirname, '../../public');

    it('CH-ASSET-01: Every product cover_image and gallery image physically exists on disk', () => {
      const allProductImagePaths = new Set<string>();

      PRODUCTS.forEach((prod) => {
        expect(prod.cover_image).toBeDefined();
        allProductImagePaths.add(prod.cover_image);

        expect(Array.isArray(prod.images)).toBe(true);
        expect(prod.images.length).toBeGreaterThan(0);
        prod.images.forEach((img) => allProductImagePaths.add(img));
      });

      expect(allProductImagePaths.size).toBeGreaterThan(0);

      allProductImagePaths.forEach((assetPath) => {
        const relativePath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
        const fullDiskPath = path.join(publicDir, relativePath);
        const exists = fs.existsSync(fullDiskPath);
        expect(
          exists,
          `Asset path "${assetPath}" referenced in products.ts does NOT exist at "${fullDiskPath}"`
        ).toBe(true);
      });
    });

    it('CH-ASSET-02: Every category cover physically exists on disk', () => {
      CATEGORIES.forEach((cat) => {
        expect(cat.cover).toBeDefined();
        const relativePath = cat.cover.startsWith('/') ? cat.cover.slice(1) : cat.cover;
        const fullDiskPath = path.join(publicDir, relativePath);
        expect(
          fs.existsSync(fullDiskPath),
          `Category cover "${cat.cover}" for category "${cat.name}" does NOT exist at "${fullDiskPath}"`
        ).toBe(true);
      });
    });

    it('CH-ASSET-03: All PWA manifest icons & shortcuts physically exist on disk', () => {
      const manifestPath = path.join(publicDir, 'manifest.json');
      expect(fs.existsSync(manifestPath)).toBe(true);
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

      manifest.icons.forEach((icon: { src: string }) => {
        const rel = icon.src.startsWith('/') ? icon.src.slice(1) : icon.src;
        expect(fs.existsSync(path.join(publicDir, rel)), `Manifest icon ${icon.src} not found`).toBe(true);
      });

      manifest.shortcuts.forEach((sc: { icons?: { src: string }[] }) => {
        if (sc.icons) {
          sc.icons.forEach((icon) => {
            const rel = icon.src.startsWith('/') ? icon.src.slice(1) : icon.src;
            expect(fs.existsSync(path.join(publicDir, rel)), `Shortcut icon ${icon.src} not found`).toBe(true);
          });
        }
      });
    });

    it('CH-ASSET-04: Service Worker precache assets all physically exist on disk', () => {
      const swPath = path.join(publicDir, 'sw.js');
      const swContent = fs.readFileSync(swPath, 'utf8');

      const match = swContent.match(/const PRECACHE_SHELL_ASSETS = \[([\s\S]*?)\];/);
      expect(match).toBeTruthy();

      const arrayString = `[${match![1]}]`;
      const precacheList: string[] = eval(arrayString);

      precacheList.forEach((assetPath) => {
        if (assetPath === '/' || assetPath === '/index.html') {
          expect(fs.existsSync(path.resolve(__dirname, '../../index.html'))).toBe(true);
        } else {
          const rel = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
          const fullDiskPath = path.join(publicDir, rel);
          expect(fs.existsSync(fullDiskPath), `Precache asset "${assetPath}" does not exist`).toBe(true);
        }
      });
    });
  });

  /* ------------------------------------------------------------------
   * 2. End-to-End Luxury User Journey Stress Testing
   * ------------------------------------------------------------------ */
  describe('Dimension 2: Full Luxury User Journey Simulation', () => {
    it('CH-FLOW-01: Hero Cover -> Explore CTA -> Category Navigation -> Product Inspection -> Gestures -> WhatsApp link', async () => {
      render(<App />);

      // Step 1: Hero Cover Verification
      const heroHeading = screen.getByRole('heading', {
        level: 1,
        name: /ELEGANCIA QUE TE ACOMPAÑA SIEMPRE/i,
      });
      expect(heroHeading).toBeInTheDocument();

      const heroBadge = screen.getByText(/NUEVA COLECCIÓN — 2026/i);
      expect(heroBadge).toBeInTheDocument();

      // Step 2: Explore CTA click
      const exploreBtn = screen.getByRole('button', { name: /Explorar piezas de la colección/i });
      fireEvent.click(exploreBtn);

      // Step 3: Category Filtering (Select 'Alta Joyería')
      const altaJoyeriaFilter = screen.getByRole('button', { name: 'Alta Joyería' });
      fireEvent.click(altaJoyeriaFilter);

      // Verify filtered catalog shows only 2 alta joyeria pieces
      expect(screen.getByText(/Todas \(2\)/i)).toBeInTheDocument();

      // Step 4: Open Product Viewer for Solitario Geometría Esmeralda (emp-07)
      const inspectButtons = screen.getAllByText(/Inspeccionar/i);
      expect(inspectButtons.length).toBe(2);
      fireEvent.click(inspectButtons[0]);

      const modal = screen.getByTestId('product-viewer-modal');
      expect(modal).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1, name: /Solitario Geometría Esmeralda/i })).toBeInTheDocument();

      // Step 5: Gesture Gallery Swipe (horizontal drag left)
      const gallery = screen.getByTestId('gesture-gallery-container');
      fireEvent.touchStart(gallery, { touches: [{ clientX: 300, clientY: 200 }] });
      fireEvent.touchMove(gallery, { touches: [{ clientX: 100, clientY: 200 }] });
      fireEvent.touchEnd(gallery);

      expect(screen.getByAltText(/Solitario Geometría Esmeralda - Imagen 2/i)).toBeInTheDocument();

      // Step 6: Double-tap zoom verification
      fireEvent.touchStart(gallery, { touches: [{ clientX: 200, clientY: 200 }] });
      fireEvent.touchEnd(gallery);
      fireEvent.touchStart(gallery, { touches: [{ clientX: 200, clientY: 200 }] });
      fireEvent.touchEnd(gallery);

      expect(screen.getByText(/Zoom 2.5x/i)).toBeInTheDocument();

      // Second double-tap resets zoom
      fireEvent.touchStart(gallery, { touches: [{ clientX: 200, clientY: 200 }] });
      fireEvent.touchEnd(gallery);
      fireEvent.touchStart(gallery, { touches: [{ clientX: 200, clientY: 200 }] });
      fireEvent.touchEnd(gallery);

      expect(screen.queryByText(/Zoom 2.5x/i)).not.toBeInTheDocument();

      // Step 7: WhatsApp link verification
      const waLink = screen.getByRole('link', {
        name: /Consultar pieza Solitario Geometría Esmeralda por WhatsApp/i,
      });
      expect(waLink).toBeInTheDocument();

      const href = waLink.getAttribute('href') || '';
      expect(href).toMatch(/^https:\/\/wa\.me\/573001234567\?text=/);
      const decodedText = decodeURIComponent(href.split('?text=')[1]);
      expect(decodedText).toContain('Solitario Geometría Esmeralda');
      expect(decodedText).toContain('REF-EMP-0201');
      expect(decodedText).toContain('$4,500');
    });
  });

  /* ------------------------------------------------------------------
   * 3. Multi-Item Curation & Bulk WhatsApp Message Encoding
   * ------------------------------------------------------------------ */
  describe('Dimension 3: Multi-Item Curation & Bulk WhatsApp Generator', () => {
    it('CH-CURATION-01: Multi-item curation across multiple categories generates robust bulk WhatsApp payload', () => {
      const selectedProducts = [PRODUCTS[0], PRODUCTS[3], PRODUCTS[6], PRODUCTS[11]]; // emp-01, emp-04, emp-07, emp-12

      const bulkUrl = generateBulkWhatsAppLink(
        selectedProducts,
        'https://empiresjewelry.com',
        DEFAULT_WHATSAPP_PHONE
      );

      expect(bulkUrl).toMatch(/^https:\/\/wa\.me\/573001234567\?text=/);

      const message = decodeURIComponent(bulkUrl.split('?text=')[1]);

      // Verify products are listed
      expect(message).toContain(`1. *${PRODUCTS[0].name}*`);
      expect(message).toContain(`2. *${PRODUCTS[3].name}*`);
      expect(message).toContain(`3. *${PRODUCTS[6].name}*`);
      expect(message).toContain(`4. *${PRODUCTS[11].name}*`);

      // Total expected: 1250 + 1100 + 1350 + 2800 = $6,500
      expect(message).toContain('Total estimado: $6,500 (4 piezas)');
    });

    it('CH-CURATION-02: Favorites Drawer renders curated items, updates total dynamically, and supports removal', () => {
      localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify([PRODUCTS[0].id, PRODUCTS[1].id, PRODUCTS[4].id])
      );

      render(<App />);

      // Open favorites drawer
      const favTab = screen.getByTestId('nav-tab-favoritos');
      fireEvent.click(favTab);

      const drawer = screen.getByRole('dialog', { name: /Selección privada de joyas guardadas/i });
      expect(drawer).toBeInTheDocument();

      // Verify items present inside the drawer
      expect(within(drawer).getByText('3 Piezas Guardadas')).toBeInTheDocument();
      expect(within(drawer).getByText(PRODUCTS[0].name)).toBeInTheDocument();
      expect(within(drawer).getByText(PRODUCTS[1].name)).toBeInTheDocument();
      expect(within(drawer).getByText(PRODUCTS[4].name)).toBeInTheDocument();

      // Total: 1250 + 1850 + 2200 = $5,300
      expect(within(drawer).getByText('$5,300')).toBeInTheDocument();

      // Remove product 0
      const removeBtn = within(drawer).getByRole('button', {
        name: `Eliminar ${PRODUCTS[0].name} de favoritos`,
      });
      fireEvent.click(removeBtn);

      // Now 2 items left, total: 1850 + 2200 = $4,050
      expect(within(drawer).getByText('2 Piezas Guardadas')).toBeInTheDocument();
      expect(within(drawer).getByText('$4,050')).toBeInTheDocument();
    });
  });

  /* ------------------------------------------------------------------
   * 4. Web Share API & Clipboard Fallback Adversarial Matrix
   * ------------------------------------------------------------------ */
  describe('Dimension 4: Web Share & Clipboard Fallback Oracle', () => {
    const testShareData = {
      title: 'Solitario Geometría Esmeralda — Empires Jewelry',
      text: 'Descubre Solitario Geometría Esmeralda (REF-EMP-0107) en Empires Jewelry.',
      url: 'https://empiresjewelry.com/#anillo-solitario-geometria-esmeralda',
    };

    it('CH-SHARE-01: Uses navigator.share when available and supported', async () => {
      const shareMock = vi.fn().mockResolvedValue(undefined);
      const canShareMock = vi.fn().mockReturnValue(true);

      const origShare = navigator.share;
      const origCanShare = (navigator as any).canShare;
      try {
        (navigator as any).share = shareMock;
        (navigator as any).canShare = canShareMock;

        const result = await shareProduct(testShareData);

        expect(shareMock).toHaveBeenCalledWith(testShareData);
        expect(result).toEqual({ success: true, method: 'native' });
      } finally {
        (navigator as any).share = origShare;
        (navigator as any).canShare = origCanShare;
      }
    });

    it('CH-SHARE-02: Handles user cancellation (AbortError) without falling back to clipboard error', async () => {
      const abortError = new Error('Share canceled');
      abortError.name = 'AbortError';
      const shareMock = vi.fn().mockRejectedValue(abortError);
      const canShareMock = vi.fn().mockReturnValue(true);

      const origShare = navigator.share;
      const origCanShare = (navigator as any).canShare;
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');

      try {
        (navigator as any).share = shareMock;
        (navigator as any).canShare = canShareMock;

        const result = await shareProduct(testShareData);

        expect(shareMock).toHaveBeenCalled();
        expect(writeTextSpy).not.toHaveBeenCalled();
        expect(result).toEqual({ success: false, method: 'native' });
      } finally {
        (navigator as any).share = origShare;
        (navigator as any).canShare = origCanShare;
        writeTextSpy.mockRestore();
      }
    });

    it('CH-SHARE-03: Falls back smoothly to navigator.clipboard when navigator.share is missing', async () => {
      const origShare = navigator.share;
      const origCanShare = (navigator as any).canShare;
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      try {
        (navigator as any).share = undefined;
        (navigator as any).canShare = undefined;

        const result = await shareProduct(testShareData);

        expect(writeTextSpy).toHaveBeenCalledWith(`${testShareData.title}\n${testShareData.url}`);
        expect(result).toEqual({ success: true, method: 'clipboard' });
      } finally {
        (navigator as any).share = origShare;
        (navigator as any).canShare = origCanShare;
        writeTextSpy.mockRestore();
      }
    });

    it('CH-SHARE-04: Returns { success: false, method: "failed" } gracefully when clipboard throws error', async () => {
      const origShare = navigator.share;
      const origCanShare = (navigator as any).canShare;
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Permission denied'));

      try {
        (navigator as any).share = undefined;
        (navigator as any).canShare = undefined;

        const result = await shareProduct(testShareData);
        expect(result).toEqual({ success: false, method: 'failed' });
      } finally {
        (navigator as any).share = origShare;
        (navigator as any).canShare = origCanShare;
        writeTextSpy.mockRestore();
      }
    });
  });

  /* ------------------------------------------------------------------
   * 5. PWA Installation Hook & Offline Shell Verification
   * ------------------------------------------------------------------ */
  describe('Dimension 5: PWA Install Hook & Offline Shell Integrity', () => {
    it('CH-PWA-01: usePWAInstall captures beforeinstallprompt and triggers installation prompt correctly', async () => {
      const { result } = renderHook(() => usePWAInstall());

      expect(result.current.isInstallable).toBe(false);
      expect(result.current.isInstalled).toBe(false);

      const promptMock = vi.fn().mockResolvedValue(undefined);
      const fakeEvent = new Event('beforeinstallprompt') as any;
      fakeEvent.prompt = promptMock;
      fakeEvent.userChoice = Promise.resolve({ outcome: 'accepted' });

      // Dispatch beforeinstallprompt
      act(() => {
        window.dispatchEvent(fakeEvent);
      });

      expect(result.current.isInstallable).toBe(true);

      // Trigger installation
      let installResult: boolean = false;
      await act(async () => {
        installResult = await result.current.triggerInstall();
      });

      expect(promptMock).toHaveBeenCalledTimes(1);
      expect(installResult).toBe(true);
      expect(result.current.isInstalled).toBe(true);
      expect(result.current.isInstallable).toBe(false);
    });

    it('CH-PWA-02: sw.js defines cache headers and responds with fallback image SVG on offline network error', () => {
      const swPath = path.resolve(__dirname, '../../public/sw.js');
      const swSource = fs.readFileSync(swPath, 'utf8');

      expect(swSource).toContain('empires-static-v1');
      expect(swSource).toContain('empires-shell-v1');
      expect(swSource).toContain('MAX_IMAGE_CACHE_ENTRIES = 60');
      expect(swSource).toContain('image/svg+xml');
      expect(swSource).toContain('EMPIRES JEWELRY');
    });
  });

  /* ------------------------------------------------------------------
   * 6. Multi-Touch Gestures & Boundary Transitions
   * ------------------------------------------------------------------ */
  describe('Dimension 6: Gestural Engine Edge & Boundary Tests', () => {
    it('CH-GESTURE-01: GestureGallery horizontal swipe triggers image index update in DOM', () => {
      render(
        <AppProvider>
          <GestureGallery product={PRODUCTS[0]} onClose={vi.fn()} />
        </AppProvider>
      );

      const gallery = screen.getByTestId('gesture-gallery-container');
      expect(screen.getByAltText(`${PRODUCTS[0].name} - Imagen 1`)).toBeInTheDocument();

      // Swipe Left
      fireEvent.touchStart(gallery, { touches: [{ clientX: 250, clientY: 100 }] });
      fireEvent.touchMove(gallery, { touches: [{ clientX: 100, clientY: 100 }] });
      fireEvent.touchEnd(gallery);

      expect(screen.getByAltText(`${PRODUCTS[0].name} - Imagen 2`)).toBeInTheDocument();
    });

    it('CH-GESTURE-02: Pinch-zoom calculate distance and scales image smoothly', () => {
      const { result } = renderHook(() =>
        useGestures({
          imageCount: 3,
          activeImageIndex: 0,
          onImageChange: vi.fn(),
        })
      );

      // Start 2-finger touch distance = 100px
      act(() => {
        result.current.touchHandlers.onTouchStart({
          touches: [
            { clientX: 100, clientY: 100 },
            { clientX: 200, clientY: 100 },
          ],
        } as any);
      });

      // Move 2-finger touch distance = 200px (2x scale expansion)
      act(() => {
        result.current.touchHandlers.onTouchMove({
          touches: [
            { clientX: 50, clientY: 100 },
            { clientX: 250, clientY: 100 },
          ],
        } as any);
      });

      expect(result.current.scale).toBeGreaterThan(1.5);
      expect(result.current.scale).toBeLessThanOrEqual(4);

      // End touch
      act(() => {
        result.current.touchHandlers.onTouchEnd();
      });

      // Reset zoom function restores baseline
      act(() => {
        result.current.resetZoom();
      });

      expect(result.current.scale).toBe(1);
    });
  });
});
