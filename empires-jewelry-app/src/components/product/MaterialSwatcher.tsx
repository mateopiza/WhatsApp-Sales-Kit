import React from 'react';
import { Material } from '../../types/catalog';
import { Sparkles, Check } from 'lucide-react';

interface MaterialSwatcherProps {
  selectedMaterial: Material | string;
  onSelectMaterial: (material: Material) => void;
}

interface SwatchInfo {
  id: Material;
  name: string;
  colorHex: string;
  gradient: string;
  purity: string;
  description: string;
}

const MATERIAL_SWATCHES: SwatchInfo[] = [
  {
    id: 'Oro Rosa 18k',
    name: 'Oro Rosa 18k',
    colorHex: '#E8C3B9',
    gradient: 'linear-gradient(135deg, #F3D2C9 0%, #D49D90 50%, #B87E71 100%)',
    purity: '75.0% Oro Puro + Cobre & Plata',
    description: 'Cálido, romantizado y de tono sutil. El aleado ideal para resaltar en pieles de tonos cálidos y fríos por igual.',
  },
  {
    id: 'Oro Blanco 18k',
    name: 'Oro Blanco 18k',
    colorHex: '#E5E4E2',
    gradient: 'linear-gradient(135deg, #FFFFFF 0%, #D9D9D9 50%, #B5B5B5 100%)',
    purity: '75.0% Oro Puro + Paladio/Rodio',
    description: 'Luminosidad moderna con baño de rodio de alta resistencia que realza el destello natural de gemas y diamantes.',
  },
  {
    id: 'Oro Amarillo 18k',
    name: 'Oro Amarillo 18k',
    colorHex: '#D4B48C',
    gradient: 'linear-gradient(135deg, #F9E79F 0%, #D4AC0D 50%, #B7950B 100%)',
    purity: '75.0% Oro Puro Ley 750',
    description: 'El clásico tono regio e intemporal. Brillo dorado rico en tradición artesanal de alta joyería.',
  },
  {
    id: 'Tres Oros 18k',
    name: 'Tres Oros 18k',
    colorHex: '#C0A080',
    gradient: 'linear-gradient(135deg, #F3D2C9 0%, #E5E4E2 50%, #D4AC0D 100%)',
    purity: 'Combinación 750 Tricolor',
    description: 'Harmonía tricolor en balance perfecto, uniendo la sofisticación del oro rosa, blanco y amarillo.',
  },
  {
    id: 'Platino',
    name: 'Platino 950',
    colorHex: '#E5E4E2',
    gradient: 'linear-gradient(135deg, #F5F5F5 0%, #CCCCCC 50%, #999999 100%)',
    purity: '95.0% Platino Sólido Ley 950',
    description: 'Metal noble denso, hipoalergénico y de resistencia superior. El rey inmutable de los metales preciosos.',
  },
];

export const MaterialSwatcher: React.FC<MaterialSwatcherProps> = ({
  selectedMaterial,
  onSelectMaterial,
}) => {
  const currentSwatch = MATERIAL_SWATCHES.find((s) => s.id === selectedMaterial) || MATERIAL_SWATCHES[0];

  return (
    <div className="space-y-3 p-4 bg-cream-200/70 rounded-sm border border-taupe/15">
      <div className="flex items-center justify-between">
        <label className="text-[10px] text-taupe-contrast uppercase tracking-widest font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
          Acabado &amp; Metal Precioso
        </label>
        <span className="text-xs font-display font-semibold text-ink uppercase">
          {currentSwatch.name}
        </span>
      </div>

      {/* Swatch Pill Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {MATERIAL_SWATCHES.map((swatch) => {
          const isSelected = selectedMaterial === swatch.id;
          return (
            <button
              key={swatch.id}
              onClick={() => onSelectMaterial(swatch.id)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-pill text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-ink text-cream shadow-md border border-gold'
                  : 'bg-cream text-ink border border-taupe/20 hover:border-gold/60'
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-inner block"
                style={{ background: swatch.gradient }}
              />
              <span>{swatch.name}</span>
              {isSelected && <Check className="w-3 h-3 text-gold ml-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Selected Material Spec Card */}
      <div className="p-3 bg-cream rounded-sm border border-taupe/10 text-[11px] text-taupe-contrast space-y-1">
        <p className="text-ink font-medium">Pureza: {currentSwatch.purity}</p>
        <p className="text-[10px] leading-relaxed text-taupe-contrast font-light">
          {currentSwatch.description}
        </p>
      </div>
    </div>
  );
};
