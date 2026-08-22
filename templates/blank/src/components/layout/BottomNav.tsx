import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../../types/navigation';
import { Sparkles, Compass, Search, Heart, MessageCircle } from 'lucide-react';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'inicio', label: 'Inicio', icon: Compass },
  { id: 'colecciones', label: 'Colecciones', icon: Sparkles },
  { id: 'buscar', label: 'Buscar', icon: Search },
  { id: 'favoritos', label: 'Favoritos', icon: Heart },
  { id: 'contacto', label: 'Contacto', icon: MessageCircle },
];

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, favorites } = useApp();

  return (
    <nav
      role="navigation"
      aria-label="Navegación inferior"
      className="fixed bottom-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur-lg border-t border-taupe/20 pb-safe pt-1.5 px-2 md:hidden"
    >
      <div className="flex items-center justify-around max-w-md mx-auto h-13">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-label={item.label}
              data-testid={`nav-tab-${item.id}`}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 relative group active:scale-95 cursor-pointer ${
                isActive ? 'text-ink font-medium' : 'text-taupe-contrast hover:text-ink'
              }`}
            >
              <div className="relative">
                <IconComponent
                  className={`w-5 h-5 transition-all duration-200 ${
                    isActive ? 'text-ink scale-110' : 'text-taupe-contrast group-hover:text-ink'
                  } ${item.id === 'favoritos' && favorites.length > 0 && !isActive ? 'text-gold fill-gold/20' : ''}`}
                />

                {/* Badge for Favorites */}
                {item.id === 'favoritos' && favorites.length > 0 && (
                  <span
                    data-testid="bottom-nav-favorites-count"
                    className="absolute -top-1 -right-2 min-w-[15px] h-3.5 px-1 rounded-pill bg-gold text-ink text-[9px] font-bold flex items-center justify-center leading-none shadow-sm"
                  >
                    {favorites.length}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] tracking-wider uppercase mt-1 transition-colors ${
                  isActive ? 'text-ink font-semibold' : 'text-taupe-contrast'
                }`}
              >
                {item.label}
              </span>

              {/* Active Indicator Dot */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-gold mt-0.5 animate-fade-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
