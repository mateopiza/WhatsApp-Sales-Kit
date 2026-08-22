import React from 'react';
import { X, Trash2, Heart, Send, Layers, ArrowRight } from 'lucide-react';
import { UrbanGarment } from '../../types/catalog';
import { storeConfig } from '../../config/storeConfig';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: UrbanGarment[];
  onRemoveFavorite: (id: string) => void;
  onClearAll: () => void;
  onOpenGarmentModal: (garment: UrbanGarment) => void;
  onOpenOutfitStudio: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onClearAll,
  onOpenGarmentModal,
  onOpenOutfitStudio,
}) => {
  if (!isOpen) return null;

  const totalPrice = favorites.reduce((sum, item) => sum + item.price, 0);

  const handleBulkWhatsApp = () => {
    if (favorites.length === 0) return;
    const itemsList = favorites
      .map((item, idx) => `${idx + 1}. *${item.name}* (Ref: ${item.reference}) — $${item.price} USD`)
      .join('\n');

    const text = `Hola ${storeConfig.name}, deseo cotizar y ordenar las prendas guardadas en mi selección privada:\n\n${itemsList}\n\n💰 *Total Estimado*: *$${totalPrice} USD* (${favorites.length} prendas)\n\n¿Me confirman disponibilidad y guía de despacho?`;
    window.open(`https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Selección privada de prendas guardadas"
      className="fixed inset-0 z-50 overflow-hidden flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-slate-900 shadow-2xl flex flex-col z-10 border-l border-slate-800 animate-slide-up">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <div>
              <h2 className="font-display text-base sm:text-lg uppercase text-white font-bold tracking-wide">
                Mi Selección Privada
              </h2>
              <span className="text-[11px] text-slate-400 uppercase font-mono">
                {favorites.length} {favorites.length === 1 ? 'Prenda Guardada' : 'Prendas Guardadas'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {favorites.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] text-slate-400 hover:text-red-400 uppercase tracking-wider transition-colors mr-1 cursor-pointer"
              >
                Limpiar
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {favorites.length === 0 ? (
            <div className="py-20 text-center max-w-xs mx-auto space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-yellow-400 mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-display text-base text-white font-bold uppercase">
                Tu Selección está Vacía
              </h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Guarda tus prendas favoritas tocando el icono de corazón en cada ítem para cotizarlas juntas.
              </p>
            </div>
          ) : (
            favorites.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onClose();
                  onOpenGarmentModal(item);
                }}
                className="flex gap-3.5 p-3 rounded-lg bg-slate-950 border border-slate-800 items-center justify-between group hover:border-yellow-400/50 transition-all cursor-pointer"
              >
                <img
                  src={item.cover_image}
                  alt={item.name}
                  className="w-16 h-20 rounded object-cover shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-yellow-400 uppercase font-mono tracking-wider font-bold block">
                    {item.reference}
                  </span>
                  <h4 className="font-display text-sm text-white font-bold uppercase truncate group-hover:text-yellow-400 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-light truncate">
                    {item.gsm || item.fit_type}
                  </p>
                  <p className="font-display text-sm font-extrabold text-white font-mono mt-1">
                    ${item.price} USD
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(item.id);
                  }}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-full"
                  title="Eliminar de favoritos"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/90 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 uppercase font-bold">Total Estimado ({favorites.length} prendas):</span>
              <span className="font-display text-lg font-extrabold text-yellow-400 font-mono">
                ${totalPrice} USD
              </span>
            </div>

            <button
              onClick={handleBulkWhatsApp}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-slate-950" />
              Cotizar Selección Completa en WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
