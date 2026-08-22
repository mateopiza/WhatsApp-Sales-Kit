import React, { useState } from 'react';
import { Product } from '../../types/catalog';
import { formatPrice, formatCOPApprox } from '../../utils/formatters';
import { shareProduct } from '../../utils/share';
import { useApp } from '../../context/AppContext';
import { WhatsAppCTA } from './WhatsAppCTA';
import { Badge } from '../ui/Badge';
import { Share2, ChevronDown, ShieldCheck, Gift, Truck } from 'lucide-react';

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const { showToast, currency } = useApp();
  const [isSpecsOpen, setIsSpecsOpen] = useState(true);
  const [isPackagingOpen, setIsPackagingOpen] = useState(false);

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

  const availabilityMap: Record<string, { label: string; variant: 'success' | 'alert' | 'taupe' | 'gold' }> = {
    disponible: { label: 'Disponible Inmediato', variant: 'success' },
    'bajo-pedido': { label: 'Fabricación Bajo Pedido (10-15 días)', variant: 'taupe' },
    'pieza-unica': { label: 'Pieza Única de Colección', variant: 'gold' },
    agotado: { label: 'Agotado Temporalmente', variant: 'alert' },
  };

  const availInfo = availabilityMap[product.availability] || {
    label: product.availability,
    variant: 'gold',
  };

  return (
    <div className="p-5 sm:p-8 space-y-6 max-w-2xl mx-auto">
      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant={availInfo.variant}>{availInfo.label}</Badge>
          <span className="text-[11px] font-mono tracking-wider uppercase text-taupe-contrast font-medium">
            {product.reference}
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl text-ink font-semibold tracking-wide uppercase leading-tight mt-1">
          {product.name}
        </h1>

        <p className="text-xs uppercase tracking-wider text-taupe-contrast font-medium mt-1">
          Colección: {product.collection} · {product.material}
        </p>

        {/* Price Section */}
        <div className="mt-4 pt-3 border-t border-taupe/15 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] text-taupe-contrast uppercase tracking-wider block font-light">
              Valor de Inversión
            </span>
            <span className="font-display text-2xl sm:text-3xl font-semibold text-ink">
              {formatPrice(product.price, currency || product.currency)}
            </span>
            {currency !== 'COP' && (
              <span className="text-xs text-taupe-contrast ml-2 font-light">
                (~ {formatCOPApprox(product.price)} COP)
              </span>
            )}
          </div>

          {/* Share Action */}
          <button
            onClick={handleShare}
            aria-label={`Compartir ${product.name}`}
            className="p-2.5 rounded-full bg-cream-200 text-ink hover:bg-gold/20 hover:text-gold transition-colors active:scale-95 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editorial Narrative */}
      <div className="space-y-2">
        <p className="text-xs sm:text-sm font-light text-ink/90 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* WhatsApp Primary CTA */}
      <div className="pt-2">
        <WhatsAppCTA product={product} />
      </div>

      {/* Collapsible Accordions */}
      <div className="border-t border-taupe/20 pt-4 space-y-3">
        {/* Specifications Accordion */}
        <div className="border border-taupe/20 rounded-sm overflow-hidden bg-cream-100/40">
          <button
            onClick={() => setIsSpecsOpen(!isSpecsOpen)}
            className="w-full p-3.5 text-left font-display text-xs uppercase tracking-wider text-ink font-medium flex items-center justify-between hover:bg-cream-200/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-dark" />
              Especificaciones Técnicas
            </span>
            <ChevronDown
              className={`w-4 h-4 text-taupe-contrast transition-transform duration-300 ${
                isSpecsOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isSpecsOpen && (
            <div className="p-4 pt-1 text-xs text-taupe-contrast border-t border-taupe/10 space-y-2 font-light">
              {product.specifications.stone && (
                <div className="flex justify-between py-1 border-b border-taupe/10">
                  <span className="text-taupe-contrast">Gema / Piedra:</span>
                  <span className="text-ink font-medium text-right">{product.specifications.stone}</span>
                </div>
              )}
              {product.specifications.carats && (
                <div className="flex justify-between py-1 border-b border-taupe/10">
                  <span className="text-taupe-contrast">Kilataje / Pureza:</span>
                  <span className="text-ink font-medium text-right">{product.specifications.carats}</span>
                </div>
              )}
              {product.specifications.weight && (
                <div className="flex justify-between py-1 border-b border-taupe/10">
                  <span className="text-taupe-contrast">Peso Estimado:</span>
                  <span className="text-ink font-medium text-right">{product.specifications.weight}</span>
                </div>
              )}
              {product.specifications.dimensions && (
                <div className="flex justify-between py-1 border-b border-taupe/10">
                  <span className="text-taupe-contrast">Dimensiones:</span>
                  <span className="text-ink font-medium text-right">{product.specifications.dimensions}</span>
                </div>
              )}
              {product.specifications.closure && (
                <div className="flex justify-between py-1 border-b border-taupe/10">
                  <span className="text-taupe-contrast">Mecanismo / Cierre:</span>
                  <span className="text-ink font-medium text-right">{product.specifications.closure}</span>
                </div>
              )}
              {product.specifications.purity && (
                <div className="flex justify-between py-1 border-b border-taupe/10">
                  <span className="text-taupe-contrast">Ley del Metal:</span>
                  <span className="text-ink font-medium text-right">{product.specifications.purity}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Packaging & Shipping Accordion */}
        <div className="border border-taupe/20 rounded-sm overflow-hidden bg-cream-100/40">
          <button
            onClick={() => setIsPackagingOpen(!isPackagingOpen)}
            className="w-full p-3.5 text-left font-display text-xs uppercase tracking-wider text-ink font-medium flex items-center justify-between hover:bg-cream-200/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-gold-dark" />
              Empaque de Lujo & Envíos
            </span>
            <ChevronDown
              className={`w-4 h-4 text-taupe-contrast transition-transform duration-300 ${
                isPackagingOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isPackagingOpen && (
            <div className="p-4 pt-1 text-xs text-taupe-contrast border-t border-taupe/10 space-y-2.5 font-light">
              <p className="flex items-start gap-2">
                <Gift className="w-3.5 h-3.5 text-gold-dark shrink-0 mt-0.5" />
                <span>Incluye estuche rígido acolchado, bolsa boutique y certificado de garantía oficial Empires.</span>
              </p>
              <p className="flex items-start gap-2">
                <Truck className="w-3.5 h-3.5 text-gold-dark shrink-0 mt-0.5" />
                <span>Envío asegurado a nivel nacional e internacional con entrega personalizada y seguimiento VIP.</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
