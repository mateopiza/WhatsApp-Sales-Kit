import React, { useState } from 'react';
import { X, Ruler, Sparkles, Check } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

const RING_SIZES = [
  { us: '5.0', innerDiameterMm: '15.7', eu: '49', es: '9' },
  { us: '5.5', innerDiameterMm: '16.1', eu: '50.5', es: '10.5' },
  { us: '6.0', innerDiameterMm: '16.5', eu: '52', es: '12' },
  { us: '6.5', innerDiameterMm: '16.9', eu: '53.5', es: '13.5' },
  { us: '7.0', innerDiameterMm: '17.3', eu: '55', es: '15' },
  { us: '7.5', innerDiameterMm: '17.7', eu: '56', es: '16' },
  { us: '8.0', innerDiameterMm: '18.1', eu: '57', es: '17' },
  { us: '8.5', innerDiameterMm: '18.5', eu: '58.5', es: '18.5' },
  { us: '9.0', innerDiameterMm: '19.0', eu: '60', es: '20' },
];

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, category = 'anillos' }) => {
  const [selectedSizeUs, setSelectedSizeUs] = useState<string>('6.5');
  const [activeTab, setActiveTab] = useState<'anillos' | 'pulseras'>(() => {
    return category === 'pulseras' ? 'pulseras' : 'anillos';
  });

  if (!isOpen) return null;

  const currentSizeObj = RING_SIZES.find((s) => s.us === selectedSizeUs) || RING_SIZES[3];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-ink/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-cream rounded-sm border border-gold/30 shadow-2xl overflow-hidden flex flex-col my-8 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-taupe/15 bg-cream-200/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-gold/15 border border-gold/30 text-gold-dark">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest uppercase text-gold-dark font-semibold block">
                Guía de Medición Empires
              </span>
              <h3 className="font-display text-xl sm:text-2xl text-ink font-normal">
                Tallas &amp; Ajuste Perfecto
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-taupe-contrast hover:text-ink transition-colors rounded-full cursor-pointer"
            aria-label="Cerrar guía de tallas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-taupe/15 bg-cream">
          <button
            onClick={() => setActiveTab('anillos')}
            className={`flex-1 py-3 text-xs uppercase tracking-widest font-medium transition-colors border-b-2 cursor-pointer ${
              activeTab === 'anillos'
                ? 'border-gold text-ink bg-gold/5'
                : 'border-transparent text-taupe-contrast hover:text-ink'
            }`}
          >
            Anillos (Solitarios &amp; Bandas)
          </button>
          <button
            onClick={() => setActiveTab('pulseras')}
            className={`flex-1 py-3 text-xs uppercase tracking-widest font-medium transition-colors border-b-2 cursor-pointer ${
              activeTab === 'pulseras'
                ? 'border-gold text-ink bg-gold/5'
                : 'border-transparent text-taupe-contrast hover:text-ink'
            }`}
          >
            Pulseras &amp; Macramé
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'anillos' ? (
            <>
              {/* Interactive Ring Size Inspector */}
              <div className="p-5 bg-stone/20 rounded-sm border border-taupe/15 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center justify-center relative w-36 h-36">
                  {/* Virtual Ring Diameter Preview */}
                  <div
                    className="rounded-full border-4 border-gold bg-cream/90 flex items-center justify-center shadow-lg transition-all duration-300 relative"
                    style={{
                      width: `${parseFloat(currentSizeObj.innerDiameterMm) * 5.2}px`,
                      height: `${parseFloat(currentSizeObj.innerDiameterMm) * 5.2}px`,
                    }}
                  >
                    <div className="text-center p-1">
                      <span className="text-[10px] text-taupe-contrast uppercase font-semibold block">
                        Ø Interior
                      </span>
                      <span className="font-display text-lg font-bold text-ink leading-none">
                        {currentSizeObj.innerDiameterMm} mm
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-3">
                  <div className="flex items-center justify-between text-xs text-ink font-medium uppercase">
                    <span>Seleccionar Talla (US)</span>
                    <span className="text-gold-dark font-semibold">
                      Talla US {currentSizeObj.us}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {RING_SIZES.map((size) => (
                      <button
                        key={size.us}
                        onClick={() => setSelectedSizeUs(size.us)}
                        className={`py-2 rounded-sm text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                          selectedSizeUs === size.us
                            ? 'bg-ink text-gold border border-gold shadow-md font-bold'
                            : 'bg-cream-200 text-ink border border-taupe/20 hover:border-gold/50'
                        }`}
                      >
                        {size.us}
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-cream-200/80 rounded-sm border border-taupe/10 text-[11px] text-taupe-contrast space-y-1">
                    <p className="flex justify-between">
                      <span>Equivalencia Europa (EU):</span>
                      <strong className="text-ink font-semibold">{currentSizeObj.eu}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Equivalencia España (ES):</span>
                      <strong className="text-ink font-semibold">{currentSizeObj.es}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Conversion Table */}
              <div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-ink mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                  Tabla de Conversión Completa
                </h4>
                <div className="overflow-x-auto border border-taupe/15 rounded-sm">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-cream-200 text-taupe-contrast uppercase tracking-wider text-[10px] border-b border-taupe/15">
                      <tr>
                        <th className="py-2.5 px-3">Talla US</th>
                        <th className="py-2.5 px-3">Diámetro Int.</th>
                        <th className="py-2.5 px-3">Equivalencia EU</th>
                        <th className="py-2.5 px-3">Equivalencia ES</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-taupe/10 text-ink">
                      {RING_SIZES.map((size) => (
                        <tr
                          key={size.us}
                          className={selectedSizeUs === size.us ? 'bg-gold/10 font-semibold' : ''}
                        >
                          <td className="py-2 px-3">{size.us}</td>
                          <td className="py-2 px-3">{size.innerDiameterMm} mm</td>
                          <td className="py-2 px-3">{size.eu}</td>
                          <td className="py-2 px-3">{size.es}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4 text-xs leading-relaxed text-taupe-contrast">
              <div className="p-4 bg-gold/10 border border-gold/20 rounded-sm text-ink space-y-2">
                <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-gold-dark flex items-center gap-2">
                  <Check className="w-4 h-4 text-gold-dark" />
                  Cierre Ajustable Coulisse (Macramé Empires)
                </h4>
                <p className="text-xs">
                  Todas nuestras pulseras artesanales en cordón macramé están equipadas con el sistema exclusivo de nudo corredizo ajustable <strong>Coulisse Empires</strong>, permitiendo un ajuste óptimo en muñecas de <strong>14 cm a 20 cm</strong> sin requerir modificaciones.
                </p>
              </div>

              <div className="p-4 bg-stone/20 rounded-sm border border-taupe/15 space-y-2">
                <h4 className="font-semibold text-ink uppercase tracking-wider text-[11px]">
                  ¿Cómo medir tu muñeca en casa?
                </h4>
                <ol className="list-decimal pl-4 space-y-1.5 text-xs">
                  <li>Envuelve una cinta métrica flexible justo por encima del hueso de la muñeca.</li>
                  <li>Si no tienes cinta métrica, usa un hilo o tira de papel y mide la longitud sobre una regla.</li>
                  <li>Para un ajuste cómodo en brazaletes rígidos, añade 1.5 cm a tu medida exacta.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-taupe/15 bg-cream-200/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-ink text-cream text-xs uppercase tracking-widest rounded-sm hover:bg-ink-light transition-all cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
