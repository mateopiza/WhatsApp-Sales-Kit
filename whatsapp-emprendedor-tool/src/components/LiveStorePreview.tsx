import React, { useState } from 'react';
import { StoreConfig, ThemePalette } from '../types/msp';
import { JEWELRY_SAMPLES, CLOTHING_SAMPLES } from '../data/palettes';
import { 
  Smartphone, 
  Monitor, 
  ShoppingBag, 
  MessageCircle, 
  Heart, 
  Search, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

interface LiveStorePreviewProps {
  config: StoreConfig;
  activePalette: ThemePalette;
}

export const LiveStorePreview: React.FC<LiveStorePreviewProps> = ({ config, activePalette }) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  const products = config.niche === 'jewelry' ? JEWELRY_SAMPLES : CLOTHING_SAMPLES;
  const categories = ['Todos', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = activeCategory === 'Todos' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const toggleFav = (id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getBorderRadiusClass = () => {
    switch (config.effects.borderRadius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-sm';
      case 'md': return 'rounded-lg';
      case 'lg': return 'rounded-2xl';
      case 'full': return 'rounded-3xl';
      default: return 'rounded-xl';
    }
  };

  const getElevationStyle = () => {
    switch (config.effects.cardElevation) {
      case 'flat': return 'shadow-none border';
      case 'subtle': return 'shadow-sm border';
      case 'floating': return 'shadow-xl border border-opacity-50';
      case 'luxury-glow': return `shadow-lg border ring-1 ring-opacity-30`;
      default: return 'shadow-md border';
    }
  };

  const getFontFamily = () => {
    if (config.effects.typographyStyle === 'editorial-cinzel') return 'font-serif';
    if (config.effects.typographyStyle === 'luxury-serif') return 'font-serif';
    return 'font-sans';
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-2xl backdrop-blur-xl">
      {/* Top Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Mockup Preview
          </span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            {config.slug ? `${config.slug}.${config.rootDomain}` : `tu-tienda.${config.rootDomain}`}
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
              deviceMode === 'mobile' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Móvil
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
              deviceMode === 'desktop' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Desktop
          </button>
        </div>
      </div>

      {/* Preview Viewport */}
      <div className="flex-1 flex items-center justify-center overflow-auto p-2 sm:p-4 bg-slate-950/60 rounded-xl border border-slate-800/60">
        <div
          style={{
            backgroundColor: activePalette.background,
            color: activePalette.text,
            borderColor: activePalette.border,
            width: deviceMode === 'mobile' ? '375px' : '100%',
            maxWidth: deviceMode === 'mobile' ? '375px' : '760px',
            minHeight: '620px',
            maxHeight: '740px',
          }}
          className={`flex flex-col transition-all duration-300 overflow-hidden shadow-2xl border ${
            deviceMode === 'mobile' ? 'rounded-[32px] ring-8 ring-slate-800' : 'rounded-xl'
          } ${getFontFamily()}`}
        >
          {/* Mockup Header */}
          <div 
            style={{
              backgroundColor: config.effects.glassmorphism 
                ? `${activePalette.surface}CC` 
                : activePalette.surface,
              borderColor: activePalette.border,
              backdropFilter: config.effects.glassmorphism ? 'blur(12px)' : 'none',
            }}
            className="sticky top-0 z-20 px-4 py-3 border-b flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {config.logoUrl ? (
                <img src={config.logoUrl} alt="Logo" className="w-7 h-7 object-contain rounded" />
              ) : (
                <div 
                  style={{ backgroundColor: activePalette.primary, color: '#FFFFFF' }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm"
                >
                  {config.storeName ? config.storeName.charAt(0).toUpperCase() : 'E'}
                </div>
              )}
              <div>
                <h3 className="font-bold text-sm tracking-tight leading-none" style={{ color: activePalette.text }}>
                  {config.storeName || 'Nombre de tu Marca'}
                </h3>
                <p className="text-[10px] tracking-wider uppercase opacity-75 mt-0.5" style={{ color: activePalette.textMuted }}>
                  {config.tagline || (config.niche === 'jewelry' ? 'Alta Distinción' : 'Boutique & Moda')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                type="button"
                className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
                style={{ color: activePalette.text }}
              >
                <Search className="w-4 h-4" />
              </button>
              <div 
                style={{ backgroundColor: `${activePalette.primary}20`, color: activePalette.primary }}
                className="px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>0</span>
              </div>
            </div>
          </div>

          {/* Mockup Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Editorial Hero Banner */}
            <div 
              style={{
                background: activePalette.previewGradient,
                color: '#FFFFFF',
              }}
              className={`p-4 sm:p-5 text-white ${getBorderRadiusClass()} relative overflow-hidden shadow-lg`}
            >
              <div className="relative z-10 max-w-[240px]">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md mb-2">
                  <Sparkles className="w-2.5 h-2.5" />
                  Nueva Colección 2026
                </span>
                <h4 className="text-lg sm:text-xl font-bold leading-tight drop-shadow-sm">
                  {config.niche === 'jewelry' ? 'Orfebrería & Joyería de Autor' : 'Estilo Urbano & Elegancia Diaria'}
                </h4>
                <p className="text-xs text-white/80 mt-1 line-clamp-2">
                  Compra directa por WhatsApp con despacho nacional asegurado.
                </p>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      backgroundColor: isActive ? activePalette.primary : activePalette.surface,
                      color: isActive ? '#FFFFFF' : activePalette.textMuted,
                      borderColor: activePalette.border,
                    }}
                    className={`px-3 py-1 text-xs font-semibold whitespace-nowrap border transition-all ${getBorderRadiusClass()}`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => {
                const isFav = !!favorites[product.id];
                return (
                  <div
                    key={product.id}
                    style={{
                      backgroundColor: activePalette.surface,
                      borderColor: activePalette.border,
                    }}
                    className={`flex flex-col group overflow-hidden transition-all duration-300 ${getBorderRadiusClass()} ${getElevationStyle()}`}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-slate-200">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          config.effects.hoverZoom ? 'group-hover:scale-105' : ''
                        }`}
                      />
                      {product.tag && (
                        <span 
                          style={{ backgroundColor: activePalette.primary, color: '#FFFFFF' }}
                          className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow"
                        >
                          {product.tag}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleFav(product.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm hover:scale-110 transition-transform"
                      >
                        <Heart 
                          className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`} 
                        />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider block opacity-60" style={{ color: activePalette.textMuted }}>
                          {product.category}
                        </span>
                        <h5 className="font-semibold text-xs leading-snug line-clamp-2 mt-0.5" style={{ color: activePalette.text }}>
                          {product.name}
                        </h5>
                      </div>

                      <div className="mt-2 pt-2 border-t flex items-center justify-between" style={{ borderColor: activePalette.border }}>
                        <span className="font-bold text-xs" style={{ color: activePalette.text }}>
                          ${product.price.toLocaleString()} {config.currency}
                        </span>
                        <a
                          href={`https://wa.me/${config.whatsappPhone || '573000000000'}?text=${encodeURIComponent(`Hola! Quiero consultar por ${product.name}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            backgroundColor: activePalette.primary,
                            color: '#FFFFFF',
                          }}
                          className={`p-1.5 text-white transition-transform hover:scale-105 ${getBorderRadiusClass()}`}
                          title="Consultar por WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky WhatsApp Floating Action Bar */}
          <div 
            style={{
              backgroundColor: config.effects.glassmorphism ? `${activePalette.surface}EE` : activePalette.surface,
              borderColor: activePalette.border,
              backdropFilter: config.effects.glassmorphism ? 'blur(12px)' : 'none',
            }}
            className="p-3 border-t flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: activePalette.textMuted }}>
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="truncate">Ventas Directas &amp; Pagos Seguros</span>
            </div>

            <a
              href={`https://wa.me/${config.whatsappPhone || '573000000000'}`}
              target="_blank"
              rel="noreferrer"
              style={{ backgroundColor: '#25D366', color: '#FFFFFF' }}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-bold text-xs shadow-md hover:brightness-105 transition-all ${getBorderRadiusClass()}`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Pedir al WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
