import React, { useState } from 'react';
import { X, Upload, Plus, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { UrbanGarment, OutfitSlot, FitType, UrbanCategory } from '../../types/catalog';

interface AdminGarmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGarment: (garment: UrbanGarment) => void;
}

export const AdminGarmentModal: React.FC<AdminGarmentModalProps> = ({ isOpen, onClose, onAddGarment }) => {
  const [name, setName] = useState('');
  const [reference, setReference] = useState('');
  const [category, setCategory] = useState<UrbanCategory>('hoodies-sweatshirts');
  const [price, setPrice] = useState<number>(250);
  const [material, setMaterial] = useState('100% Algodón Orgánico 450GSM');
  const [gsm, setGsm] = useState('450 GSM');
  const [fitType, setFitType] = useState<FitType>('Oversized Drop-Shoulder');
  const [outfitSlot, setOutfitSlot] = useState<OutfitSlot>('top');
  const [shortDesc, setShortDesc] = useState('');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('/assets/products/real/pulsera-macrame-editorial.jpg');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newGarment: UrbanGarment = {
      id: `atl-${Date.now()}`,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      reference: reference.toUpperCase() || `REF-URB-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      collection: 'Urban Drop 2026',
      price: Number(price),
      currency: 'USD',
      short_description: shortDesc || 'Prenda de alta gama urbana con acabados técnicos.',
      description: desc || 'Confeccionada con estándares de orfebrería textil y teñido mineral.',
      material,
      gsm,
      fit_type: fitType,
      outfit_slot: outfitSlot,
      available_sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Onyx Black', 'Off-White'],
      cover_image: imageUrl,
      images: [imageUrl],
      availability: 'disponible',
      featured: true,
      badge: 'Nuevo Drop',
      care_instructions: 'Lavar en frío.',
    };

    onAddGarment(newGarment);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-slate-900 text-slate-100 rounded-lg border border-yellow-500/30 shadow-2xl overflow-hidden flex flex-col my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-yellow-400" />
            <h3 className="font-display text-lg text-white font-semibold uppercase tracking-wider">
              Aprovisionar Prenda / Subir Producto
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-yellow-400 mx-auto animate-bounce" />
            <h4 className="font-bold text-white text-base">¡Prenda Aprovisionada con Éxito!</h4>
            <p className="text-xs text-slate-400">Publicada en el catálogo e integrada al Combinador de Outfits.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
            <div>
              <label className="text-[10px] uppercase font-bold text-yellow-400 block mb-1">Nombre de la Prenda</label>
              <input
                type="text"
                required
                placeholder="Ej. Hoodie Boxy Fit Metal Graphic"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:border-yellow-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-yellow-400 block mb-1">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as UrbanCategory)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200"
                >
                  <option value="hoodies-sweatshirts">Hoodies &amp; Sweatshirts</option>
                  <option value="chaquetas-outerwear">Chaquetas &amp; Outerwear</option>
                  <option value="pantalones-cargo">Pantalones Cargo</option>
                  <option value="camisetas-graphic-tees">Graphic Tees</option>
                  <option value="zapatillas-sneakers">Luxury Sneakers</option>
                  <option value="accesorios-streetwear">Accesorios Tech</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-yellow-400 block mb-1">Slot de Outfit</label>
                <select
                  value={outfitSlot}
                  onChange={(e) => setOutfitSlot(e.target.value as OutfitSlot)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200"
                >
                  <option value="top">Superior (Top)</option>
                  <option value="bottom">Inferior (Bottom)</option>
                  <option value="footwear">Calzado / Accesorio</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-yellow-400 block mb-1">Precio (USD)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-yellow-400 block mb-1">Densidad (GSM)</label>
                <input
                  type="text"
                  placeholder="500 GSM"
                  value={gsm}
                  onChange={(e) => setGsm(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-yellow-400 block mb-1">Foto Principal (URL / Asset)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-200 font-mono text-[11px]"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('/assets/products/real/pulsera-macrame-editorial.jpg')}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-yellow-400 font-bold rounded flex items-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Preset
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold uppercase tracking-widest rounded transition-colors"
              >
                Aprovisionar &amp; Publicar Prenda
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
