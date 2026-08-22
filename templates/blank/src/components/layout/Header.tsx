import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CurrencySelector } from './CurrencySelector';
import { Menu, Search, Heart, Lock, Sparkles, MessageCircle } from 'lucide-react';
import { storeConfig } from '../../config/storeConfig';

export const Header: React.FC = () => {
  const {
    favorites,
    setIsFavoritesOpen,
    setIsSearchOpen,
    isMenuOpen,
    setIsMenuOpen,
    setActiveTab,
    openAdmin,
  } = useApp();

  // Secret 5-Tap Gesture on Brand Mark (2.0s window)
  const tapHistoryRef = useRef<number[]>([]);

  const handleBrandMarkTap = () => {
    const now = Date.now();
    // Keep taps within last 2000ms
    const recentTaps = [...tapHistoryRef.current.filter((t) => now - t < 2000), now];
    tapHistoryRef.current = recentTaps;

    if (recentTaps.length >= 5) {
      tapHistoryRef.current = [];
      openAdmin();
    } else {
      setActiveTab('inicio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavScroll = (elementId: string, tab: 'inicio' | 'colecciones' | 'contacto') => {
    setActiveTab(tab);
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-cream/95 backdrop-blur-md border-b border-taupe/15 pt-safe transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Menu Drawer Trigger + Desktop Navigation */}
        <div className="flex items-center gap-1 sm:gap-3">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú editorial"
            className="p-2 -ml-2 text-ink hover:text-taupe-contrast transition-colors rounded-full active:scale-95 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 ml-2">
            <button
              onClick={() => handleNavScroll('hero', 'inicio')}
              className="font-display text-[11px] tracking-widest uppercase text-taupe-contrast hover:text-ink transition-colors font-medium cursor-pointer"
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavScroll('catalog-section', 'colecciones')}
              className="font-display text-[11px] tracking-widest uppercase text-taupe-contrast hover:text-ink transition-colors font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-gold-dark" />
              Colecciones
            </button>
            <button
              onClick={() => handleNavScroll('contacto-section', 'contacto')}
              className="font-display text-[11px] tracking-widest uppercase text-taupe-contrast hover:text-ink transition-colors font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-3 h-3 text-gold-dark" />
              Contacto
            </button>
          </nav>
        </div>

        {/* Center: Brand Logo Lockup with 5-Tap Easter Egg */}
        <div className="flex items-center justify-center shrink-0">
          <button
            onClick={handleBrandMarkTap}
            aria-label={`${storeConfig.name} Inicio`}
            className="flex items-center justify-center py-1 group cursor-pointer select-none"
          >
            <img
              src={storeConfig.logo}
              alt={storeConfig.name}
              className="h-7 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.025]"
              onError={(e) => {
                // Fallback to text if image not found
                e.currentTarget.style.display = 'none';
                const sibling = e.currentTarget.nextElementSibling;
                if (sibling) sibling.classList.remove('hidden');
              }}
            />
            <span className="hidden font-display text-base sm:text-xl tracking-wider text-ink font-semibold uppercase">
              {storeConfig.name}
            </span>
          </button>
        </div>

        {/* Right: Currency Selector, Search, Favorites & Admin Trigger */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Desktop Currency Selector */}
          <div className="hidden sm:block mr-1">
            <CurrencySelector />
          </div>

          {/* Quick Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Buscar productos"
            className="p-2 text-ink hover:text-taupe-contrast transition-colors rounded-full active:scale-95 cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Favorites Heart with Live Badge */}
          <button
            onClick={() => setIsFavoritesOpen(true)}
            aria-label={`Ver favoritos (${favorites.length} productos)`}
            className="p-2 text-ink hover:text-taupe-contrast transition-colors rounded-full active:scale-95 relative cursor-pointer"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                favorites.length > 0 ? 'text-gold fill-gold/20 stroke-gold' : 'text-ink'
              }`}
            />
            {favorites.length > 0 && (
              <span
                data-testid="favorites-badge"
                className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-pill bg-gold text-ink text-[10px] font-semibold flex items-center justify-center shadow-sm animate-fade-in"
              >
                {favorites.length}
              </span>
            )}
          </button>

          {/* Discrete Admin Lock Trigger */}
          <button
            onClick={openAdmin}
            aria-label="Portal de Administración CMS"
            title="Portal de Administración CMS (Ctrl+Shift+A)"
            className="p-2 text-taupe-contrast hover:text-ink transition-colors rounded-full active:scale-95 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

