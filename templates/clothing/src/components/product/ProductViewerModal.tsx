import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Send, Layers, ShieldCheck, Heart, Sparkles, Check, Info } from 'lucide-react';
import { UrbanGarment, UrbanSize } from '../../types/catalog';

interface ProductViewerModalProps {
  garment: UrbanGarment | null;
  allGarments: UrbanGarment[];
  onClose: () => void;
  onSelectGarment: (garment: UrbanGarment) => void;
  onOpenOutfitStudio: () => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}

export const ProductViewerModal: React.FC<ProductViewerModalProps> = ({
  garment,
  allGarments,
  onClose,
  onSelectGarment,
  onOpenOutfitStudio,
  onToggleFavorite,
  isFavorite,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<UrbanSize>('L');
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    if (garment) {
      setSelectedImageIndex(0);
      setSelectedSize(garment.available_sizes[0] || 'L');
      setSelectedColor(garment.colors[0] || '');
    }
  }, [garment]);

  // Keyboard navigation
  useEffect(() => {
    if (!garment) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      const currentIndex = allGarments.findIndex((g) => g.id === garment.id);
      if (e.key === 'ArrowRight' && currentIndex < allGarments.length - 1) {
        onSelectGarment(allGarments[currentIndex + 1]);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onSelectGarment(allGarments[currentIndex - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [garment, allGarments, onClose, onSelectGarment]);

  if (!garment) return null;

  const currentIndex = allGarments.findIndex((g) => g.id === garment.id);
  const prevGarment = currentIndex > 0 ? allGarments[currentIndex - 1] : null;
  const nextGarment = currentIndex < allGarments.length - 1 ? allGarments[currentIndex + 1] : null;

  const images = garment.images.length > 0 ? garment.images : [garment.cover_image];

  const handleWhatsAppConsultation = () => {
    const text = `Hola Empires Urban, deseo ordenar/consultar la prenda:\n\n*${garment.name}*\nRef: ${garment.reference}\nTalla: ${selectedSize}\nColor: ${selectedColor || garment.colors[0]}\nDensidad: ${garment.gsm || garment.fit_type}\nPrecio: $${garment.price} USD\n\n¿Me confirman disponibilidad inmediata?`;
    window.open(`https://wa.me/573001234567?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Detalles de ${garment.name}`}
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row my-6 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Mobile & Desktop) */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(garment.id)}
            className="p-2.5 rounded-full bg-slate-950/80 text-white hover:text-yellow-400 border border-slate-700 transition-all cursor-pointer backdrop-blur-sm"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'text-yellow-400 fill-yellow-400' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-950/80 text-white hover:text-yellow-400 border border-slate-700 transition-all cursor-pointer backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Left Column: High-Res Media Stage ── */}
        <div className="w-full lg:w-1/2 bg-slate-950 relative flex flex-col justify-between p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-800 shrink-0 min-h-[350px] lg:min-h-[500px]">
          {/* Main Image Stage */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-slate-900 flex items-center justify-center">
            <img
              src={images[selectedImageIndex] || garment.cover_image}
              alt={garment.name}
              className="w-full h-full object-cover rounded-lg transition-all duration-300"
            />

            {/* Badge overlay */}
            <span className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 text-yellow-400 text-[10px] uppercase font-bold tracking-widest rounded border border-yellow-500/30 backdrop-blur-sm">
              {garment.badge || garment.gsm || 'Heavyweight'}
            </span>

            {/* Navigation Arrows */}
            {prevGarment && (
              <button
                onClick={() => onSelectGarment(prevGarment)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 text-white hover:text-yellow-400 border border-slate-800 transition-all cursor-pointer"
                title={`Anterior: ${prevGarment.name}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {nextGarment && (
              <button
                onClick={() => onSelectGarment(nextGarment)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 text-white hover:text-yellow-400 border border-slate-800 transition-all cursor-pointer"
                title={`Siguiente: ${nextGarment.name}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-12 h-14 rounded overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImageIndex === idx ? 'border-yellow-400 scale-105' : 'border-slate-800 opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right Column: Garment Specs & WhatsApp Ordering ── */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[500px] lg:max-h-none">
          <div className="space-y-4">
            {/* Header info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] text-yellow-400 uppercase tracking-widest font-mono font-bold">
                <span>{garment.reference}</span>
                <span>•</span>
                <span>{garment.collection}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-white font-bold uppercase tracking-tight">
                {garment.name}
              </h2>
            </div>

            {/* Price Tag */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-extrabold text-white font-mono">
                ${garment.price} USD
              </span>
              <span className="text-xs text-slate-400 font-medium">Impuestos incluidos | Envío Express</span>
            </div>

            {/* Technical Specs Tags */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Tejido &amp; Composición</span>
                <strong className="text-slate-200 text-xs">{garment.material}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Densidad Textile</span>
                <strong className="text-yellow-400 text-xs font-mono">{garment.gsm || 'Heavyweight'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Tipo de Entalle</span>
                <strong className="text-slate-200 text-xs">{garment.fit_type}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Slot Outfit</span>
                <strong className="text-slate-200 text-xs uppercase">{garment.outfit_slot}</strong>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              {garment.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">Seleccionar Talla</span>
                <span className="text-yellow-400 text-[10px] font-mono">En stock listo para despacho</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {garment.available_sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded text-xs uppercase font-extrabold transition-all cursor-pointer ${
                      selectedSize === s
                        ? 'bg-yellow-500 text-slate-950 border border-yellow-400 shadow-md'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches */}
            {garment.colors.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-bold text-white uppercase tracking-wider text-[11px] block">Variante de Color</span>
                <div className="flex gap-2">
                  {garment.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                        selectedColor === c
                          ? 'bg-slate-800 text-yellow-400 border border-yellow-400'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800">
            <button
              onClick={handleWhatsAppConsultation}
              className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs uppercase tracking-widest font-extrabold rounded-lg shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-slate-950" />
              Ordenar / Consultar por WhatsApp
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenOutfitStudio();
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs uppercase tracking-widest font-bold rounded-lg border border-slate-700 hover:border-yellow-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-yellow-400" />
              Combinar esta prenda en el Creador de Outfits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
