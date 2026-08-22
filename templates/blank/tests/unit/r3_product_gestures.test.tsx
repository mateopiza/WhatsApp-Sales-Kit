import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GestureGallery } from '../../src/components/product/GestureGallery';
import { ProductInfo } from '../../src/components/product/ProductInfo';
import { ProductViewer } from '../../src/components/product/ProductViewer';
import { AppProvider, useApp } from '../../src/context/AppContext';
import { PRODUCTS } from '../../src/data/products';
import { generateWhatsAppLink } from '../../src/utils/whatsapp';
import { formatPrice } from '../../src/utils/formatters';
import React, { useEffect } from 'react';

const ProductViewerWrapper: React.FC<{ productIndex?: number }> = ({ productIndex = 0 }) => {
  const { openProductViewer } = useApp();

  useEffect(() => {
    openProductViewer(PRODUCTS[productIndex]);
  }, [openProductViewer, productIndex]);

  return <ProductViewer />;
};

describe('Tier 1 - R3: Product Viewer & Gestural Navigation Engine', () => {
  const sampleProduct = PRODUCTS[0];

  it('T1-R3-01: GestureGallery container has height between 65% and 75% VH', () => {
    render(
      <AppProvider>
        <GestureGallery product={sampleProduct} onClose={vi.fn()} />
      </AppProvider>
    );

    const gallery = screen.getByTestId('gesture-gallery-container');
    expect(gallery).toHaveClass('h-[68vh]');
  });

  it('T1-R3-02: ProductInfo renders full luxury metadata, pricing, reference, and specifications', () => {
    render(
      <AppProvider>
        <ProductInfo product={sampleProduct} />
      </AppProvider>
    );

    expect(screen.getByRole('heading', { level: 1, name: new RegExp(sampleProduct.name, 'i') })).toBeInTheDocument();
    expect(screen.getByText(sampleProduct.reference)).toBeInTheDocument();
    expect(screen.getByText(formatPrice(sampleProduct.price, sampleProduct.currency))).toBeInTheDocument();
    expect(screen.getByText(/Especificaciones Técnicas/i)).toBeInTheDocument();
  });

  it('T1-R3-03: GestureGallery advances image on horizontal swipe left', () => {
    render(
      <AppProvider>
        <GestureGallery product={sampleProduct} onClose={vi.fn()} />
      </AppProvider>
    );

    const gallery = screen.getByTestId('gesture-gallery-container');

    // Simulate touch swipe left (deltaX = -100px)
    fireEvent.touchStart(gallery, { touches: [{ clientX: 250, clientY: 150 }] });
    fireEvent.touchMove(gallery, { touches: [{ clientX: 100, clientY: 150 }] });
    fireEvent.touchEnd(gallery);

    expect(screen.getByAltText(new RegExp(`${sampleProduct.name} - Imagen 2`, 'i'))).toBeInTheDocument();
  });

  it('T1-R3-04: GestureGallery triggers next product on swipe left past last image', () => {
    const onNextProduct = vi.fn();
    const multiImageProduct = PRODUCTS.find((p) => p.images.length >= 3)!;

    render(
      <AppProvider>
        <GestureGallery
          product={multiImageProduct}
          onClose={vi.fn()}
          onNextProduct={onNextProduct}
          hasNextProduct={true}
        />
      </AppProvider>
    );

    const gallery = screen.getByTestId('gesture-gallery-container');

    // Advance to the last image of this product
    const lastPhotoBtn = screen.getByRole('button', { name: new RegExp(`Ver foto ${multiImageProduct.images.length}`, 'i') });
    fireEvent.click(lastPhotoBtn);

    // Now at last image: swipe left triggers onNextProduct
    fireEvent.touchStart(gallery, { touches: [{ clientX: 250, clientY: 150 }] });
    fireEvent.touchMove(gallery, { touches: [{ clientX: 100, clientY: 150 }] });
    fireEvent.touchEnd(gallery);

    expect(onNextProduct).toHaveBeenCalled();
  });

  it('T1-R3-05: Double-tap toggles zoom scale to 2.5x', () => {
    render(
      <AppProvider>
        <GestureGallery product={sampleProduct} onClose={vi.fn()} />
      </AppProvider>
    );

    const gallery = screen.getByTestId('gesture-gallery-container');

    // Double tap 1: zoom in
    fireEvent.touchStart(gallery, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchEnd(gallery);

    fireEvent.touchStart(gallery, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchEnd(gallery);

    expect(screen.getByText(/Zoom 2.5x/i)).toBeInTheDocument();
  });

  it('T1-R3-06: generateWhatsAppLink generates valid URL with encoded reference and name', () => {
    const link = generateWhatsAppLink({
      productName: sampleProduct.name,
      reference: sampleProduct.reference,
      price: sampleProduct.price,
      currency: sampleProduct.currency,
      productUrl: 'https://example.com/prod/1',
    });

    expect(link).toContain('https://wa.me/573001234567?text=');
    expect(link).toContain(encodeURIComponent(sampleProduct.name));
    expect(link).toContain(encodeURIComponent(sampleProduct.reference));
  });

  it('T1-R3-07: ProductViewer integrates Modal and closes on ESC key', () => {
    render(
      <AppProvider>
        <ProductViewerWrapper productIndex={0} />
      </AppProvider>
    );

    expect(screen.getByTestId('product-viewer-modal')).toBeInTheDocument();

    // Fire Escape key
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    expect(screen.queryByTestId('product-viewer-modal')).not.toBeInTheDocument();
  });
});
