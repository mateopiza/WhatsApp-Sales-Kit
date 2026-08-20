import React from 'react';
import { useApp } from '../../context/AppContext';
import { generateBulkWhatsAppLink, DEFAULT_WHATSAPP_PHONE } from '../../utils/whatsapp';
import { formatPrice } from '../../utils/formatters';
import { X, MessageCircle, CheckCircle2 } from 'lucide-react';

export const BulkInquiryModal: React.FC = () => {
  const { isBulkInquiryOpen, setIsBulkInquiryOpen, favoriteProducts } = useApp();

  if (!isBulkInquiryOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const bulkWhatsappUrl = generateBulkWhatsAppLink(
    favoriteProducts,
    currentUrl,
    DEFAULT_WHATSAPP_PHONE
  );

  const totalPrice = favoriteProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Consulta personalizada de selección privada"
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsBulkInquiryOpen(false)}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-cream rounded-sm shadow-luxury-modal border border-gold/40 p-6 sm:p-8 z-10 animate-modal-enter flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-taupe/15 pb-4 mb-4">
          <div>
            <span className="text-[10px] tracking-widest uppercase text-gold-dark font-medium block">
              Consulta Concierge
            </span>
            <h3 className="font-display text-xl sm:text-2xl text-ink font-normal uppercase">
              Asesoría de Selección
            </h3>
          </div>
          <button
            onClick={() => setIsBulkInquiryOpen(false)}
            aria-label="Cerrar modal de consulta"
            className="p-1.5 text-ink hover:text-taupe-contrast transition-colors rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Items Summary */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 mb-6">
          <p className="text-xs text-taupe-contrast font-light">
            Has seleccionado {favoriteProducts.length}{' '}
            {favoriteProducts.length === 1 ? 'pieza' : 'piezas'} para recibir atención personalizada por parte de nuestros maestros gemólogos.
          </p>

          <div className="space-y-2 border border-taupe/15 rounded-sm p-3 bg-cream-100/50">
            {favoriteProducts.map((product, idx) => (
              <div
                key={product.id}
                className="flex items-center justify-between py-1.5 border-b border-taupe/10 last:border-0 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-gold/20 text-ink text-[10px] flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <span className="text-ink font-medium">{product.name}</span>
                  <span className="text-taupe-contrast font-mono text-[10px]">({product.reference})</span>
                </div>
                <span className="font-display text-ink font-semibold">
                  {formatPrice(product.price, product.currency)}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-cream-200 rounded-sm flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-taupe-contrast font-medium">
              Total Estimado
            </span>
            <span className="font-display text-lg font-bold text-ink">
              {formatPrice(totalPrice, 'USD')}
            </span>
          </div>

          <div className="space-y-1.5 pt-2 text-[11px] text-taupe-contrast">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold-dark shrink-0" />
              <span>Confirmación inmediata de stock y tallas disponibles.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold-dark shrink-0" />
              <span>Opciones de personalización en oro blanco, amarillo o rosa 18k.</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Button */}
        <div className="pt-2 border-t border-taupe/15">
          <a
            href={bulkWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Enviar consulta de piezas seleccionadas por WhatsApp"
            className="w-full py-3.5 px-6 rounded-sm bg-ink text-cream text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 hover:bg-ink-light transition-all shadow-md active:scale-98 cursor-pointer btn-cta-luxury"
          >
            <MessageCircle className="w-4 h-4 text-gold" />
            Enviar Consulta por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
