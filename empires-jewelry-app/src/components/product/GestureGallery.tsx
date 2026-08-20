import React, { useState } from 'react';
import { Product } from '../../types/catalog';
import { useGestures } from '../../hooks/useGestures';
import { usePreloadImages } from '../../hooks/usePreloadImages';
import { useApp } from '../../context/AppContext';
import { shareProduct } from '../../utils/share';
import { PageIndicators } from './PageIndicators';
import { X, Heart, Share2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface GestureGalleryProps {
  product: Product;
  onClose: () => void;
  onNextProduct?: () => void;
  onPrevProduct?: () => void;
  hasPrevProduct?: boolean;
  hasNextProduct?: boolean;
  prevProduct?: Product | null;
  nextProduct?: Product | null;
}

export const GestureGallery: React.FC<GestureGalleryProps> = ({
  product,
  onClose,
  onNextProduct,
  onPrevProduct,
  hasPrevProduct = false,
  hasNextProduct = false,
  prevProduct = null,
  nextProduct = null,
}) => {
  const { toggleFavorite, isFavorite, showToast } = useApp();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.cover_image];

  // Preload adjacent images in memory for zero lag
  usePreloadImages(product, { prev: prevProduct, next: nextProduct });

  const {
    scale,
    offsetX,
    offsetY,
    swipeDeltaX,
    containerRef,
    resetZoom,
    toggleZoom,
    touchHandlers,
  } = useGestures({
    imageCount: images.length,
    activeImageIndex,
    onImageChange: (idx) => setActiveImageIndex(idx),
    onNextProduct,
    onPrevProduct,
    hasPrevProduct,
    hasNextProduct,
  });

  const favorited = isFavorite(product.id);

  const handleShare = async () => {
    const res = await shareProduct({
      title: `${product.name} — Empires Jewelry`,
      text: `Descubre ${product.name} (${product.reference}) en Empires Jewelry.`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    });
    if (res.method === 'clipboard') {
      showToast('Enlace de la joya copiado al portapapeles', 'success');
    }
  };

  return (
    <div
      ref={containerRef}
      data-testid="gesture-gallery-container"
      className="relative w-full h-[68vh] sm:h-[72vh] md:h-full md:min-h-[520px] max-h-[780px] bg-stone/20 overflow-hidden select-none touch-pan-y"
      {...touchHandlers}
    >
      {/* Photo Stage */}
      <div
        className="w-full h-full flex items-center justify-center relative cursor-grab active:cursor-grabbing"
        style={{
          touchAction: scale > 1.05 ? 'none' : 'pan-y',
        }}
      >
        <img
          src={images[activeImageIndex]}
          alt={`${product.name} - Imagen ${activeImageIndex + 1}`}
          draggable={false}
          className="max-w-full max-h-full object-contain pointer-events-none transition-transform duration-100 ease-out will-change-transform"
          style={{
            transform: `translate3d(${offsetX + (scale <= 1.05 ? swipeDeltaX : 0)}px, ${offsetY}px, 0px) scale(${scale})`,
          }}
        />
      </div>

      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Cerrar visor de producto"
          className="p-2.5 rounded-full bg-cream/80 backdrop-blur-md text-ink hover:text-taupe transition-all shadow-md pointer-events-auto active:scale-95 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Right Action Icons: Zoom Toggle, Favorite, Share */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Zoom In/Out Toggle */}
          <button
            onClick={toggleZoom}
            aria-label={scale > 1.05 ? 'Restablecer zoom' : 'Ampliar imagen'}
            className="p-2.5 rounded-full bg-cream/80 backdrop-blur-md text-ink hover:text-gold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {scale > 1.05 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            aria-label={`Compartir ${product.name}`}
            className="p-2.5 rounded-full bg-cream/80 backdrop-blur-md text-ink hover:text-gold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(product.id)}
            aria-label={`Guardar ${product.name} en favoritos`}
            className="p-2.5 rounded-full bg-cream/80 backdrop-blur-md text-ink hover:text-gold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                favorited ? 'text-gold fill-gold stroke-gold' : 'text-ink'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Desktop Chevron Navigation Overlays */}
      {images.length > 1 && (
        <>
          {activeImageIndex > 0 && (
            <button
              onClick={() => setActiveImageIndex((prev) => prev - 1)}
              aria-label="Imagen anterior"
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-cream/80 backdrop-blur-md text-ink items-center justify-center hover:bg-cream transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {activeImageIndex < images.length - 1 && (
            <button
              onClick={() => setActiveImageIndex((prev) => prev + 1)}
              aria-label="Siguiente imagen"
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-cream/80 backdrop-blur-md text-ink items-center justify-center hover:bg-cream transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </>
      )}

      {/* Adjacent Product Transition Buttons (Desktop / Quick Jump) */}
      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
        {hasPrevProduct && onPrevProduct && (
          <button
            onClick={onPrevProduct}
            aria-label="Pieza anterior"
            className="p-2 ml-1 rounded-r-md bg-ink/20 text-cream backdrop-blur-sm pointer-events-auto hover:bg-ink/60 transition-colors hidden sm:block"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
        {hasNextProduct && onNextProduct && (
          <button
            onClick={onNextProduct}
            aria-label="Siguiente pieza"
            className="p-2 mr-1 rounded-l-md bg-ink/20 text-cream backdrop-blur-sm pointer-events-auto hover:bg-ink/60 transition-colors hidden sm:block"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bottom Center: Page Indicators & Zoom Badge */}
      <div className="absolute bottom-4 inset-x-0 z-20 flex flex-col items-center gap-1 pointer-events-none">
        {scale > 1.05 && (
          <span className="px-2 py-0.5 rounded-pill bg-ink/80 text-gold text-[10px] uppercase font-mono tracking-wider backdrop-blur-md mb-1 animate-fade-in pointer-events-auto">
            Zoom {scale.toFixed(1)}x · Doble toque para restablecer
          </span>
        )}

        <div className="pointer-events-auto">
          <PageIndicators
            total={images.length}
            current={activeImageIndex}
            onSelect={(idx) => {
              setActiveImageIndex(idx);
              resetZoom();
            }}
          />
        </div>
      </div>
    </div>
  );
};
