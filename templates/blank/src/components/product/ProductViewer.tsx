import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GestureGallery } from './GestureGallery';
import { ProductInfo } from './ProductInfo';

export const ProductViewer: React.FC = () => {
  const {
    selectedProduct,
    closeProductViewer,
    activeSequence,
    currentProductIndex,
    nextProduct,
    prevProduct,
    hasAdjacent,
  } = useApp();

  // Handle ESC key and arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeProductViewer();
      } else if (e.key === 'ArrowRight' && hasAdjacent.hasNext) {
        nextProduct();
      } else if (e.key === 'ArrowLeft' && hasAdjacent.hasPrev) {
        prevProduct();
      }
    };

    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProduct, closeProductViewer, nextProduct, prevProduct, hasAdjacent]);

  if (!selectedProduct) return null;

  const prevProd =
    currentProductIndex > 0 ? activeSequence[currentProductIndex - 1] : null;
  const nextProd =
    currentProductIndex < activeSequence.length - 1
      ? activeSequence[currentProductIndex + 1]
      : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Detalles de ${selectedProduct.name}`}
      data-testid="product-viewer-modal"
      className="fixed inset-0 z-50 overflow-hidden flex flex-col md:flex-row bg-cream md:bg-ink/80 md:backdrop-blur-md md:items-center md:justify-center md:p-6 lg:p-10 animate-fade-in"
      onClick={(e) => {
        // Close when clicking modal backdrop on desktop
        if (e.target === e.currentTarget) {
          closeProductViewer();
        }
      }}
    >
      {/* Desktop / Tablet Luxury Modal Card */}
      <div className="w-full h-full md:h-[90vh] md:max-h-[820px] md:max-w-5xl md:bg-cream md:rounded-sm md:border md:border-gold/30 md:shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Photo Gallery Stage: Mobile (65-75% VH) / Desktop (Left Column 52%) */}
        <div className="shrink-0 md:w-[52%] md:h-full bg-stone/20 relative flex flex-col justify-center">
          <GestureGallery
            product={selectedProduct}
            onClose={closeProductViewer}
            onNextProduct={nextProduct}
            onPrevProduct={prevProduct}
            hasPrevProduct={hasAdjacent.hasPrev}
            hasNextProduct={hasAdjacent.hasNext}
            prevProduct={prevProd}
            nextProduct={nextProd}
          />
        </div>

        {/* Product Details Sheet: Mobile (Bottom Sheet) / Desktop (Right Column 48%) */}
        <div className="flex-1 overflow-y-auto bg-cream border-t md:border-t-0 md:border-l border-taupe/15 pb-safe">
          <ProductInfo product={selectedProduct} />
        </div>
      </div>
    </div>
  );
};

