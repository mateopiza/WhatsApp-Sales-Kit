import React from 'react';
import { Compass, Flame, Layers, Heart, MessageCircle } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenOutfitStudio: () => void;
  onOpenWhatsApp: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  favoritesCount,
  onOpenFavorites,
  onOpenOutfitStudio,
  onOpenWhatsApp,
}) => {
  return (
    <nav
      role="navigation"
      aria-label="Navegación inferior móvil"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 pb-safe pt-2 px-3 md:hidden shadow-2xl"
    >
      <div className="flex items-center justify-around max-w-md mx-auto h-12">
        {/* Tab 1: Inicio */}
        <button
          onClick={() => {
            onSelectTab('inicio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
            activeTab === 'inicio' ? 'text-yellow-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[9px] tracking-wider uppercase mt-1">Inicio</span>
        </button>

        {/* Tab 2: Drops / Catálogo */}
        <button
          onClick={() => {
            onSelectTab('catalogo');
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
            activeTab === 'catalogo' ? 'text-yellow-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-5 h-5 text-yellow-400" />
          <span className="text-[9px] tracking-wider uppercase mt-1">Drops</span>
        </button>

        {/* Tab 3: Combinar Outfits */}
        <button
          onClick={onOpenOutfitStudio}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-yellow-400 transition-all cursor-pointer"
        >
          <Layers className="w-5 h-5 text-yellow-400" />
          <span className="text-[9px] tracking-wider uppercase mt-1 text-yellow-400 font-bold">Outfits</span>
        </button>

        {/* Tab 4: Favoritos */}
        <button
          onClick={onOpenFavorites}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-white transition-all relative cursor-pointer"
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-yellow-400 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-md">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[9px] tracking-wider uppercase mt-1">Guardados</span>
        </button>

        {/* Tab 5: WhatsApp VIP */}
        <button
          onClick={onOpenWhatsApp}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-emerald-400 transition-all cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-[9px] tracking-wider uppercase mt-1 text-emerald-400">WhatsApp</span>
        </button>
      </div>
    </nav>
  );
};
