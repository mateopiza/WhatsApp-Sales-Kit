import React, { useState } from 'react';
import { X, Ruler, Sparkles, Check } from 'lucide-react';

interface FitGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIZE_CHART = [
  { size: 'XS', bust: '80-84 cm', waist: '60-64 cm', hip: '86-90 cm', es: '34' },
  { size: 'S', bust: '85-89 cm', waist: '65-69 cm', hip: '91-95 cm', es: '36-38' },
  { size: 'M', bust: '90-94 cm', waist: '70-74 cm', hip: '96-100 cm', es: '40' },
  { size: 'L', bust: '95-99 cm', waist: '75-79 cm', hip: '101-105 cm', es: '42' },
  { size: 'XL', bust: '100-104 cm', waist: '80-84 cm', hip: '106-110 cm', es: '44' },
];

export const FitGuideModal: React.FC<FitGuideModalProps> = ({ isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState<string>('S');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-atelier/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-cream rounded-sm border border-gold/30 shadow-2xl overflow-hidden flex flex-col my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-grey/20 bg-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-gold/15 text-gold-dark border border-gold/30">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest uppercase text-gold-dark font-semibold block">
                Atelier Tailoring Guide
              </span>
              <h3 className="font-display text-xl text-atelier font-normal">
                Guía de Tallas &amp; Ajuste Perfecto
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-grey hover:text-atelier transition-colors rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs">
          <div className="p-4 bg-gold/10 border border-gold/20 rounded-sm text-atelier space-y-2">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-gold-dark flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-dark" />
              Servicio Bespoke A Medida Disponible
            </h4>
            <p className="text-xs text-grey leading-relaxed">
              Si tus medidas están entre dos tallas o deseas una pieza ajustada a tus especificaciones exactas, selecciona la opción <strong>Bespoke / A Medida</strong> y nuestro maestro sastre confeccionará el patrón exclusivo para ti.
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-grey/20 rounded-sm">
            <table className="w-full text-left">
              <thead className="bg-cream-200 text-grey uppercase tracking-wider text-[10px] border-b border-grey/20">
                <tr>
                  <th className="py-2.5 px-3">Talla</th>
                  <th className="py-2.5 px-3">Busto</th>
                  <th className="py-2.5 px-3">Cintura</th>
                  <th className="py-2.5 px-3">Cadera</th>
                  <th className="py-2.5 px-3">Equiv. ES/EU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey/15 text-atelier">
                {SIZE_CHART.map((row) => (
                  <tr
                    key={row.size}
                    onClick={() => setSelectedSize(row.size)}
                    className={`cursor-pointer transition-colors ${
                      selectedSize === row.size ? 'bg-gold/10 font-semibold' : 'hover:bg-cream-100'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold">{row.size}</td>
                    <td className="py-2.5 px-3">{row.bust}</td>
                    <td className="py-2.5 px-3">{row.waist}</td>
                    <td className="py-2.5 px-3">{row.hip}</td>
                    <td className="py-2.5 px-3">{row.es}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-grey/20 bg-cream-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-atelier text-cream text-xs uppercase tracking-widest rounded-sm hover:bg-atelier-light transition-all cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
