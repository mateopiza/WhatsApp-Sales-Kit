import React from 'react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types/catalog';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { DEFAULT_WHATSAPP_PHONE } from '../../utils/whatsapp';
import { X, Sparkles, Compass, Search, Heart, MessageCircle, Download, ArrowRight, Lock } from 'lucide-react';
import { storeConfig } from '../../config/storeConfig';

export const NavigationDrawer: React.FC = () => {
  const {
    isMenuOpen,
    setIsMenuOpen,
    setActiveTab,
    setSelectedCategory,
    setIsSearchOpen,
    setIsFavoritesOpen,
    favorites,
    categoriesWithCounts,
    openAdmin,
  } = useApp();

  const { isInstallable, triggerInstall } = usePWAInstall();

  if (!isMenuOpen) return null;

  const handleCategoryClick = (catId: Category) => {
    setSelectedCategory(catId);
    setActiveTab('colecciones');
    setIsMenuOpen(false);
    // Smooth scroll to catalog section
    setTimeout(() => {
      const section = document.getElementById('catalog-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-cream shadow-2xl flex flex-col z-10 border-r border-taupe/20 animate-slide-up">
        {/* Drawer Header */}
        <div className="p-5 flex items-center justify-between border-b border-taupe/15 pt-safe">
          <div className="flex items-center gap-2">
            <img
              src={storeConfig.logo}
              alt={`${storeConfig.name} Mark`}
              className="w-7 h-7 object-contain"
            />
            <span className="font-display text-sm tracking-wider uppercase text-ink font-semibold">
              {storeConfig.name}
            </span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Cerrar menú"
            className="p-1.5 text-ink hover:text-taupe-contrast transition-colors rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-7">
          {/* Main Navigation Links */}
          <div className="space-y-1">
            <p className="text-[10px] tracking-wider uppercase text-taupe-contrast font-medium mb-2">
              Navegación Principal
            </p>
            <button
              onClick={() => {
                setActiveTab('inicio');
                setIsMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full flex items-center justify-between py-2.5 text-left font-display text-sm uppercase text-ink hover:text-gold-dark transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-gold-dark" />
                Inicio
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-taupe/50" />
            </button>

            <button
              onClick={() => {
                setActiveTab('colecciones');
                setIsMenuOpen(false);
                const section = document.getElementById('catalog-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full flex items-center justify-between py-2.5 text-left font-display text-sm uppercase text-ink hover:text-gold-dark transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-gold-dark" />
                Todas las Colecciones
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-taupe/50" />
            </button>

            <button
              onClick={() => {
                setIsSearchOpen(true);
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center justify-between py-2.5 text-left font-display text-sm uppercase text-ink hover:text-gold-dark transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-gold-dark" />
                Búsqueda Instantánea
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-taupe/50" />
            </button>

            <button
              onClick={() => {
                setIsFavoritesOpen(true);
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center justify-between py-2.5 text-left font-display text-sm uppercase text-ink hover:text-gold-dark transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-gold-dark" />
                Selección Privada
              </span>
              {favorites.length > 0 && (
                <span className="px-2 py-0.5 rounded-pill bg-gold/20 text-ink text-xs font-semibold">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>

          {/* Categorías */}
          <div className="space-y-1">
            <p className="text-[10px] tracking-wider uppercase text-taupe-contrast font-medium mb-2">
              Categorías
            </p>
            {categoriesWithCounts.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="w-full flex items-center justify-between py-2 text-left text-sm text-ink hover:text-gold-dark transition-colors group cursor-pointer"
              >
                <span className="group-hover:translate-x-1 transition-transform">{cat.name}</span>
                <span className="text-xs text-taupe-contrast">{cat.count} {cat.count === 1 ? 'producto' : 'productos'}</span>
              </button>
            ))}
          </div>

          {/* Portal Privado CMS */}
          <div className="pt-2 border-t border-taupe/15">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                openAdmin();
              }}
              className="w-full flex items-center justify-between py-2 text-left text-xs uppercase tracking-wider text-taupe-contrast hover:text-ink transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-gold-dark" />
                Portal Privado CMS
              </span>
              <span className="text-[10px] font-mono text-taupe-contrast">Admin</span>
            </button>
          </div>

          {/* PWA Install Button */}
          {isInstallable && (
            <div className="pt-2">
              <button
                onClick={() => {
                  triggerInstall();
                  setIsMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-sm bg-stone/30 border border-taupe/30 text-ink text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-stone/50 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-gold-dark" />
                Instalar App en Celular
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer: WhatsApp Consultation */}
        <div className="p-5 border-t border-taupe/15 bg-cream-200/40 pb-safe">
          <a
            href={`https://wa.me/${DEFAULT_WHATSAPP_PHONE}?text=${encodeURIComponent(
              `Hola ${storeConfig.name}, deseo recibir asesoría personalizada sobre su catálogo.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-sm bg-ink text-cream text-xs tracking-wider uppercase font-medium flex items-center justify-center gap-2 hover:bg-ink-light transition-all shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-gold" />
            Asesoría por WhatsApp
          </a>
          <p className="text-[10px] text-taupe-contrast text-center mt-2.5 font-light">
            {storeConfig.tagline}
          </p>
        </div>
      </div>
    </div>
  );
};
