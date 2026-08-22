import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice, formatCOPApprox } from '../../utils/formatters';
import { Heart, Eye, ArrowRight, Gem } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { SkeletonImage } from '../ui/SkeletonImage';

export const FeaturedLookbook: React.FC = () => {
  const {
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    openProductViewer,
    toggleFavorite,
    isFavorite,
    resetFilters,
    categoriesWithCounts,
    currency,
  } = useApp();

  const gridRef = useRef<HTMLDivElement>(null);

  // Stagger product cards on scroll reveal
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>('.product-card-anim');
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );

    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 70}ms`;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [filteredProducts]);

  return (
    <section id="catalog-section" className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">

      {/* ── Section Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-taupe/12 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <Gem className="w-3.5 h-3.5 text-gold-dark" />
            <span className="text-[10px] tracking-widest uppercase text-gold-dark font-semibold">
              Lookbook Editorial
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl text-ink font-normal tracking-wide">
            Catálogo &amp; Piezas Exclusivas
          </h2>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
          <button
            onClick={() => setSelectedCategory('todos')}
            className={`px-3.5 py-1.5 rounded-pill text-[10px] tracking-widest uppercase transition-all shrink-0 pill-tab-switch font-medium ${
              selectedCategory === 'todos'
                ? 'bg-ink text-cream shadow-sm'
                : 'bg-cream-200/80 text-taupe-contrast hover:text-ink hover:bg-cream-300 border border-taupe/15'
            }`}
          >
            Todas ({filteredProducts.length})
          </button>
          {categoriesWithCounts.filter(c => c.count > 0).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-pill text-[10px] tracking-widest uppercase transition-all shrink-0 pill-tab-switch font-medium ${
                selectedCategory === cat.id
                  ? 'bg-ink text-cream shadow-sm'
                  : 'bg-cream-200/80 text-taupe-contrast hover:text-ink hover:bg-cream-300 border border-taupe/15'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Products Grid ── */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
            <Gem className="w-7 h-7 text-gold-dark" />
          </div>
          <p className="font-display text-lg text-ink mb-2">No se encontraron piezas</p>
          <p className="text-xs text-taupe-contrast mb-6 font-light leading-relaxed">
            No hay piezas que coincidan con la categoría o filtros seleccionados.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-3 bg-ink text-cream text-xs uppercase tracking-widest rounded-sm hover:bg-ink-light transition-all btn-cta-luxury cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
          {filteredProducts.map((product, idx) => {
            const favorited = isFavorite(product.id);

            return (
              <article
                key={product.id}
                data-testid={`product-card-${product.id}`}
                className="product-card-anim group flex flex-col bg-cream rounded-sm border border-taupe/12 overflow-hidden shadow-luxury-card card-luxury"
                style={{
                  opacity: 0,
                  transform: 'translateY(28px)',
                  transition: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms cubic-bezier(0.25, 1, 0.5, 1), border-color 300ms cubic-bezier(0.25, 1, 0.5, 1)',
                }}
              >
                {/* ── Image Zone ── */}
                <div
                  className="relative overflow-hidden bg-stone/15 cursor-pointer select-none"
                  style={{ aspectRatio: idx === 0 ? '3/4' : '4/5' }}
                  onClick={() => openProductViewer(product, filteredProducts)}
                >
                  <SkeletonImage
                    src={product.cover_image}
                    alt={product.name}
                    aspectRatio="portrait"
                    className="img-luxury-zoom"
                  />

                  {/* Badges row */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none z-10">
                    {product.badge ? (
                      <Badge variant="gold">{product.badge}</Badge>
                    ) : (
                      <span />
                    )}

                    {/* Favorite */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      aria-label={`Guardar en favoritos ${product.name}`}
                      className="p-2 rounded-full glass-cream text-ink hover:text-gold-dark transition-all shadow-sm pointer-events-auto active:scale-90 cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          favorited ? 'text-gold fill-gold stroke-gold btn-favorite-active' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Bottom hover overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 hero-vignette-ink opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between text-cream">
                    <span className="text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-medium">
                      <Eye className="w-3.5 h-3.5 text-gold" />
                      Ver Detalles
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>

                  {/* Availability indicator */}
                  {product.availability === 'pieza-unica' && (
                    <div className="absolute bottom-3 left-3 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="px-2 py-0.5 rounded-sm glass-ink text-[9px] uppercase tracking-wider text-gold font-medium">
                        Pieza Única
                      </span>
                    </div>
                  )}
                </div>

                {/* ── Product Info ── */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Reference + Material */}
                    <div className="flex items-center justify-between text-[10px] text-taupe-contrast font-medium uppercase tracking-wider mb-1.5">
                      <span>{product.reference}</span>
                      <span className="text-gold-dark">{product.material}</span>
                    </div>

                    {/* Product Name */}
                    <h3
                      onClick={() => openProductViewer(product, filteredProducts)}
                      className="font-display text-base sm:text-lg text-ink font-medium tracking-wide uppercase hover:text-gold-dark transition-colors cursor-pointer leading-tight mb-2"
                    >
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-taupe-contrast font-light line-clamp-2 leading-relaxed">
                      {product.short_description}
                    </p>
                  </div>

                  {/* ── Price & CTA ── */}
                  <div className="mt-4 pt-3 border-t border-taupe/10 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[9px] text-taupe-contrast uppercase font-light tracking-wider mb-0.5">Precio</p>
                      <p className="font-display text-base font-semibold text-ink leading-none">
                        {formatPrice(product.price, currency || product.currency)}
                      </p>
                      {currency !== 'COP' && (
                        <p className="text-[10px] text-taupe-contrast font-light mt-0.5">
                          ~ {formatCOPApprox(product.price)} COP
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => openProductViewer(product, filteredProducts)}
                      className="px-4 py-2 rounded-sm border border-taupe/35 text-ink text-[10px] uppercase tracking-wider font-medium hover:bg-ink hover:text-cream hover:border-ink transition-all active:scale-95 cursor-pointer btn-cta-luxury shrink-0"
                    >
                      Inspeccionar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
