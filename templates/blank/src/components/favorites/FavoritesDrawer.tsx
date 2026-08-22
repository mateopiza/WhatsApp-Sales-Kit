import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';
import { generateBulkWhatsAppLink, DEFAULT_WHATSAPP_PHONE } from '../../utils/whatsapp';
import { SkeletonImage } from '../ui/SkeletonImage';
import { BulkInquiryModal } from './BulkInquiryModal';
import { X, Trash2, Heart, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export const FavoritesDrawer: React.FC = () => {
  const {
    isFavoritesOpen,
    setIsFavoritesOpen,
    favoriteProducts,
    removeFavorite,
    clearFavorites,
    openProductViewer,
    setActiveTab,
    currency,
  } = useApp();

  if (!isFavoritesOpen) return null;

  const totalPrice = favoriteProducts.reduce((sum, p) => sum + p.price, 0);
  const bulkWhatsappUrl = generateBulkWhatsAppLink(
    favoriteProducts,
    typeof window !== 'undefined' ? window.location.origin : '',
    DEFAULT_WHATSAPP_PHONE
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Selección privada de productos guardados"
      className="fixed inset-0 z-50 overflow-hidden flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsFavoritesOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-cream shadow-2xl flex flex-col z-10 border-l border-taupe/20 animate-slide-up">
        {/* Header */}
        <div className="p-5 border-b border-taupe/15 flex items-center justify-between pt-safe bg-cream/95 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-gold fill-gold/20" />
            <div>
              <h2 className="font-display text-base sm:text-lg uppercase text-ink font-semibold tracking-wide">
                Mi Selección Privada
              </h2>
              <span className="text-[11px] text-taupe-contrast tracking-wider uppercase font-medium">
                {favoriteProducts.length} {favoriteProducts.length === 1 ? 'Producto Guardado' : 'Productos Guardados'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {favoriteProducts.length > 0 && (
              <button
                onClick={clearFavorites}
                aria-label="Vaciar lista de favoritos"
                className="text-[11px] text-taupe-contrast hover:text-status-error uppercase tracking-wider transition-colors mr-1 cursor-pointer"
              >
                Limpiar
              </button>
            )}
            <button
              onClick={() => setIsFavoritesOpen(false)}
              aria-label="Cerrar selección de favoritos"
              className="p-1.5 text-ink hover:text-taupe-contrast transition-colors rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {favoriteProducts.length === 0 ? (
            <div className="py-20 text-center max-w-xs mx-auto">
              <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mx-auto mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg text-ink uppercase mb-2">
                Tu Selección está Vacía
              </h3>
              <p className="text-xs text-taupe-contrast font-light mb-6 leading-relaxed">
                Guarda tus productos preferidos tocando el icono de corazón en cada producto para compararlos o solicitar una cotización conjunta.
              </p>
              <button
                onClick={() => {
                  setIsFavoritesOpen(false);
                  setActiveTab('colecciones');
                  const catalog = document.getElementById('catalog-section');
                  if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3 px-4 bg-ink text-cream text-xs uppercase tracking-wider rounded-sm font-medium hover:bg-ink-light transition-all cursor-pointer"
              >
                Explorar Colección
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3.5 p-3 rounded-sm bg-cream-100/70 border border-taupe/15 items-center justify-between group hover:border-gold/40 transition-colors"
                >
                  {/* Thumbnail */}
                  <div
                    className="w-16 h-20 rounded-sm bg-stone/20 overflow-hidden shrink-0 cursor-pointer"
                    onClick={() => {
                      openProductViewer(product);
                      setIsFavoritesOpen(false);
                    }}
                  >
                    <SkeletonImage
                      src={product.cover_image}
                      alt={product.name}
                      aspectRatio="portrait"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-taupe-contrast uppercase font-mono tracking-wider">
                      {product.reference}
                    </span>
                    <h4
                      onClick={() => {
                        openProductViewer(product);
                        setIsFavoritesOpen(false);
                      }}
                      className="font-display text-sm text-ink font-medium uppercase tracking-wide truncate hover:text-gold transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h4>
                    <p className="text-xs text-taupe-contrast font-light truncate">
                      {product.material}
                    </p>
                    <p className="font-display text-sm font-semibold text-ink mt-1">
                      {formatPrice(product.price, currency || product.currency)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFavorite(product.id)}
                      aria-label={`Eliminar ${product.name} de favoritos`}
                      className="p-1.5 text-taupe-contrast hover:text-status-error transition-colors rounded-full cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        openProductViewer(product);
                        setIsFavoritesOpen(false);
                      }}
                      aria-label={`Ver ${product.name}`}
                      className="p-1 text-xs uppercase text-taupe-contrast hover:text-ink flex items-center gap-0.5 cursor-pointer font-medium"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {favoriteProducts.length > 0 && (
          <div className="p-5 border-t border-taupe/15 bg-cream-200/50 pb-safe space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-taupe-contrast font-medium">
                  Total Estimado ({favoriteProducts.length} productos)
                </span>
                <p className="font-display text-xl font-bold text-ink">
                  {formatPrice(totalPrice, currency || 'USD')}
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-gold/20 text-ink text-[11px] font-medium">
                <Sparkles className="w-3 h-3 text-gold-dark" />
                Asesoría VIP
              </div>
            </div>

            {/* WhatsApp Link button */}
            <a
              href={bulkWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Consultar selección por WhatsApp"
              className="w-full py-3.5 px-4 rounded-sm bg-ink text-cream text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 hover:bg-ink-light transition-all shadow-md active:scale-98 cursor-pointer btn-cta-luxury"
            >
              <MessageCircle className="w-4 h-4 text-gold" />
              Consultar Selección por WhatsApp
            </a>
          </div>
        )}
      </div>

      <BulkInquiryModal />
    </div>
  );
};
