import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types/catalog';
import { ArrowUpRight } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { setSelectedCategory, setActiveTab, categoriesWithCounts } = useApp();
  const gridRef = useRef<HTMLDivElement>(null);

  const handleCategorySelect = (catId: Category) => {
    setSelectedCategory(catId);
    setActiveTab('colecciones');
    const catalogSection = document.getElementById('catalog-section');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Stagger cards on scroll into view
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLDivElement>('.cat-card');
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0) scale(1)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.10, rootMargin: '0px 0px -30px 0px' }
    );

    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 80}ms`;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [categoriesWithCounts]);

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <p className="text-[10px] tracking-widest uppercase text-gold-dark font-semibold mb-3">
          Colecciones Selectas
        </p>
        <h2 className="font-display text-2xl sm:text-3xl text-ink font-normal tracking-wide">
          Categorías de Joyería
        </h2>
        <div className="w-16 h-px line-shimmer-gold mx-auto mt-4" />
      </div>

      {/* Editorial Grid */}
      <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {categoriesWithCounts.map((category, index) => {
          const hasPieces = category.count > 0;
          return (
            <div
              key={category.id}
              data-testid={`category-card-${category.id}`}
              onClick={() => hasPieces && handleCategorySelect(category.id)}
              className={`cat-card group relative overflow-hidden rounded-sm border shadow-luxury-card card-luxury ${
                hasPieces
                  ? 'cursor-pointer border-taupe/15 hover:border-gold/40'
                  : 'cursor-default border-taupe/10 opacity-70'
              } ${index === 0 ? 'col-span-2 sm:col-span-2 lg:col-span-2' : ''}`}
              style={{
                opacity: 0,
                transform: 'translateY(20px) scale(0.97)',
                transition: 'opacity 450ms cubic-bezier(0.16, 1, 0.3, 1), transform 450ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Image */}
              <div className={`relative overflow-hidden bg-stone/20 ${
                index === 0 ? 'aspect-[3/4] sm:aspect-[2/3]' : 'aspect-[3/4]'
              }`}>
                <img
                  src={category.cover}
                  alt={`Colección ${category.name}`}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover object-center img-luxury-zoom"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />

                {/* Coming soon badge */}
                {!hasPieces && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded-sm glass-ink text-[9px] uppercase tracking-wider text-cream/80 font-medium">
                      Próximamente
                    </span>
                  </div>
                )}
              </div>

              {/* Card Label */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end text-cream pointer-events-none">
                <div className="flex items-end justify-between gap-2">
                  <div>
                    {category.count > 0 && (
                      <span className="text-[9px] tracking-widest uppercase text-gold font-medium block mb-1">
                        {category.count} {category.count === 1 ? 'Pieza' : 'Piezas'}
                      </span>
                    )}
                    <h3 className="font-display text-base sm:text-lg tracking-wide uppercase text-cream font-medium leading-tight">
                      {category.name}
                    </h3>
                  </div>
                  {hasPieces && (
                    <div className="w-7 h-7 rounded-full glass-cream flex items-center justify-center text-ink shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-gold group-hover:text-ink">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
