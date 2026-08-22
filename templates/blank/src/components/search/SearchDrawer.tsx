import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FilterPills } from './FilterPills';
import { formatPrice } from '../../utils/formatters';
import { SkeletonImage } from '../ui/SkeletonImage';
import { Search, X, SlidersHorizontal, Heart, ArrowRight } from 'lucide-react';

export const SearchDrawer: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    openProductViewer,
    toggleFavorite,
    isFavorite,
    resetFilters,
    activeFilterCount,
    currency,
  } = useApp();

  const [showFilters, setShowFilters] = useState(false);

  if (!isSearchOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Búsqueda instantánea y filtros"
      className="fixed inset-0 z-50 overflow-hidden flex flex-col bg-cream animate-fade-in"
    >
      {/* Search Header */}
      <div className="p-4 sm:p-5 border-b border-taupe/15 bg-cream/95 backdrop-blur-md pt-safe">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe-contrast pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, material o referencia..."
              autoFocus
              className="w-full pl-10 pr-10 py-3 rounded-sm bg-cream-200/80 border border-taupe/30 text-ink text-sm placeholder:text-taupe-contrast focus:outline-none focus:border-ink transition-colors font-body"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Limpiar texto de búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-taupe-contrast hover:text-ink transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Alternar filtros"
            className={`p-3 rounded-sm border transition-colors flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium cursor-pointer ${
              showFilters || activeFilterCount > 0
                ? 'bg-ink text-cream border-ink'
                : 'bg-cream-200 text-ink border-taupe/30 hover:bg-cream-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-gold text-ink text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Close Drawer Button */}
          <button
            onClick={() => setIsSearchOpen(false)}
            aria-label="Cerrar buscador"
            className="p-2.5 text-ink hover:text-taupe-contrast transition-colors rounded-full active:scale-95 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Collapsible Filter Pills Section */}
        {showFilters && (
          <div className="max-w-4xl mx-auto mt-4 pt-3 border-t border-taupe/15 animate-slide-down">
            <FilterPills />
          </div>
        )}
      </div>

      {/* Results Bar */}
      <div className="px-4 sm:px-6 py-2.5 bg-cream-200/60 border-b border-taupe/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-taupe-contrast font-medium uppercase tracking-wider">
          <span>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </span>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-gold-dark hover:text-ink font-semibold"
            >
              Restablecer todo
            </button>
          )}
        </div>
      </div>

      {/* Results Grid / List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-safe">
        <div className="max-w-4xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center max-w-sm mx-auto">
              <p className="font-display text-lg text-ink mb-2">No se encontraron productos</p>
              <p className="text-xs text-taupe-contrast font-light mb-6">
                Intenta con otros términos de búsqueda o restablece los filtros.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-ink text-cream text-xs uppercase tracking-wider rounded-sm hover:bg-ink-light transition-colors cursor-pointer"
              >
                Ver Todo el Catálogo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => {
                const favorited = isFavorite(product.id);

                return (
                  <div
                    key={product.id}
                    className="group bg-cream rounded-sm border border-taupe/20 overflow-hidden flex flex-col justify-between hover:border-gold/50 transition-all shadow-luxury-card card-luxury"
                  >
                    <div
                      className="relative aspect-[4/5] bg-stone/20 overflow-hidden cursor-pointer"
                      onClick={() => {
                        openProductViewer(product, filteredProducts);
                      }}
                    >
                      <SkeletonImage
                        src={product.cover_image}
                        alt={product.name}
                        aspectRatio="portrait"
                        className="img-luxury-zoom"
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        aria-label={`Guardar en favoritos ${product.name}`}
                        className="absolute top-2.5 right-2.5 p-2 rounded-full bg-cream/80 backdrop-blur-md text-ink hover:text-gold-dark transition-all shadow-sm active:scale-90"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            favorited ? 'text-gold fill-gold stroke-gold btn-favorite-active' : 'text-ink'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-taupe-contrast font-medium uppercase tracking-wider mb-1">
                          <span>{product.reference}</span>
                          <span>{product.category}</span>
                        </div>
                        <h4
                          onClick={() => openProductViewer(product, filteredProducts)}
                          className="font-display text-sm uppercase text-ink font-medium tracking-wide hover:text-gold-dark transition-colors cursor-pointer"
                        >
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-taupe-contrast mt-1 line-clamp-1 font-light">
                          {product.material}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-taupe/10 flex items-center justify-between">
                        <span className="font-display text-sm font-semibold text-ink">
                          {formatPrice(product.price, currency || product.currency)}
                        </span>
                        <button
                          onClick={() => openProductViewer(product, filteredProducts)}
                          className="text-xs uppercase tracking-wider text-taupe-contrast hover:text-ink flex items-center gap-1 font-medium cursor-pointer"
                        >
                          Ver <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
