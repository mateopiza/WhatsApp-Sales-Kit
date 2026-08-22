import React, { useState } from 'react';
import { X, Sparkles, Send, RefreshCw, ShoppingBag, Layers, Plus, Check } from 'lucide-react';
import { GARMENTS } from '../../data/products';
import { UrbanGarment, OutfitSlot } from '../../types/catalog';

interface OutfitStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OutfitStudioModal: React.FC<OutfitStudioModalProps> = ({ isOpen, onClose }) => {
  const tops = GARMENTS.filter((g) => g.outfit_slot === 'top');
  const bottoms = GARMENTS.filter((g) => g.outfit_slot === 'bottom');
  const footwears = GARMENTS.filter((g) => g.outfit_slot === 'footwear' || g.outfit_slot === 'accessory');

  const [selectedTop, setSelectedTop] = useState<UrbanGarment>(tops[0] || GARMENTS[0]);
  const [selectedBottom, setSelectedBottom] = useState<UrbanGarment>(bottoms[0] || GARMENTS[2]);
  const [selectedFootwear, setSelectedFootwear] = useState<UrbanGarment>(footwears[0] || GARMENTS[4]);

  if (!isOpen) return null;

  const rawTotal = selectedTop.price + selectedBottom.price + selectedFootwear.price;
  const comboDiscount = Math.round(rawTotal * 0.1); // 10% Bundle Discount
  const finalTotal = rawTotal - comboDiscount;

  const handleSendOutfitWhatsApp = () => {
    const text = `Hola Empires Urban, quiero cotizar y pedir el siguiente OUTFIT COMPLETO COMBINADO:\n\n👕 *Superior*: ${selectedTop.name} (Ref: ${selectedTop.reference}) — $${selectedTop.price} USD\n👖 *Inferior*: ${selectedBottom.name} (Ref: ${selectedBottom.reference}) — $${selectedBottom.price} USD\n👟 *Calzado/Acc*: ${selectedFootwear.name} (Ref: ${selectedFootwear.reference}) — $${selectedFootwear.price} USD\n\n🎁 *Descuento Combo Outfit 10%*: -$${comboDiscount} USD\n💰 *TOTAL BUNDLE*: *$${finalTotal} USD*\n\n¿Tienen disponibilidad en mi talla?`;
    window.open(`https://wa.me/573001234567?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleRandomizeOutfit = () => {
    const randomTop = tops[Math.floor(Math.random() * tops.length)];
    const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
    const randomFootwear = footwears[Math.floor(Math.random() * footwears.length)];
    if (randomTop) setSelectedTop(randomTop);
    if (randomBottom) setSelectedBottom(randomBottom);
    if (randomFootwear) setSelectedFootwear(randomFootwear);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 text-slate-100 rounded-lg border border-yellow-500/30 shadow-2xl overflow-hidden flex flex-col my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest uppercase text-yellow-400 font-bold block">
                Empires Urban Studio
              </span>
              <h3 className="font-display text-xl text-white font-semibold">
                Combinador de Outfits &amp; Style Canvas
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomizeOutfit}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Mezclar prenda aleatoria"
            >
              <RefreshCw className="w-3.5 h-3.5 text-yellow-400" />
              Combinar Random
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
          {/* Left Column: Outfit Selector Slots */}
          <div className="lg:col-span-7 space-y-5 text-xs">
            {/* Slot 1: Top Garment */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
                <span>1. Prenda Superior (Hoodie / Chaqueta / Tee)</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {tops.map((garment) => (
                  <button
                    key={garment.id}
                    onClick={() => setSelectedTop(garment)}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedTop.id === garment.id
                        ? 'bg-slate-800 border-yellow-400 shadow-md ring-1 ring-yellow-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-mono block">{garment.gsm || garment.fit_type}</span>
                      <strong className="text-white text-xs font-semibold block line-clamp-1">{garment.name}</strong>
                    </div>
                    <span className="text-yellow-400 font-bold text-xs mt-1 block">${garment.price} USD</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slot 2: Bottom Garment */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
                <span>2. Prenda Inferior (Cargo Pants / Denim)</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {bottoms.map((garment) => (
                  <button
                    key={garment.id}
                    onClick={() => setSelectedBottom(garment)}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedBottom.id === garment.id
                        ? 'bg-slate-800 border-yellow-400 shadow-md ring-1 ring-yellow-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-mono block">{garment.fit_type}</span>
                      <strong className="text-white text-xs font-semibold block line-clamp-1">{garment.name}</strong>
                    </div>
                    <span className="text-yellow-400 font-bold text-xs mt-1 block">${garment.price} USD</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slot 3: Footwear / Accessory */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
                <span>3. Calzado &amp; Accesorios (Sneakers / Bag)</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {footwears.map((garment) => (
                  <button
                    key={garment.id}
                    onClick={() => setSelectedFootwear(garment)}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedFootwear.id === garment.id
                        ? 'bg-slate-800 border-yellow-400 shadow-md ring-1 ring-yellow-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-mono block">{garment.material}</span>
                      <strong className="text-white text-xs font-semibold block line-clamp-1">{garment.name}</strong>
                    </div>
                    <span className="text-yellow-400 font-bold text-xs mt-1 block">${garment.price} USD</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Outfit Preview Canvas */}
          <div className="lg:col-span-5 bg-slate-950 p-5 rounded-lg border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Visualizador de Look</span>
                <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-semibold border border-yellow-500/30">
                  Combo 10% OFF
                </span>
              </div>

              {/* 3-Tile Visual Stack */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-900 rounded border border-slate-800 p-2 text-center">
                  <img src={selectedTop.cover_image} alt={selectedTop.name} className="w-full h-24 object-cover rounded mb-1" />
                  <span className="text-[9px] text-slate-400 block truncate">{selectedTop.name}</span>
                </div>
                <div className="bg-slate-900 rounded border border-slate-800 p-2 text-center">
                  <img src={selectedBottom.cover_image} alt={selectedBottom.name} className="w-full h-24 object-cover rounded mb-1" />
                  <span className="text-[9px] text-slate-400 block truncate">{selectedBottom.name}</span>
                </div>
                <div className="bg-slate-900 rounded border border-slate-800 p-2 text-center">
                  <img src={selectedFootwear.cover_image} alt={selectedFootwear.name} className="w-full h-24 object-cover rounded mb-1" />
                  <span className="text-[9px] text-slate-400 block truncate">{selectedFootwear.name}</span>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Suma prendas por separado:</span>
                  <span className="line-through">${rawTotal} USD</span>
                </div>
                <div className="flex justify-between text-yellow-400 font-semibold">
                  <span>Descuento Combo (10%):</span>
                  <span>-${comboDiscount} USD</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-slate-800">
                  <span>Precio Total Outfit:</span>
                  <span className="text-yellow-400 font-mono text-base">${finalTotal} USD</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSendOutfitWhatsApp}
              className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs uppercase tracking-widest font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-slate-950" />
              Pedir Outfit Completo por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
