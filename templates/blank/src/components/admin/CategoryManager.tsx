import React from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Sparkles, RotateCcw, Tag } from 'lucide-react';
import { Icon } from '../ui/Icon';

export const CategoryManager: React.FC = () => {
  const { products, categoriesWithCounts, collectionsList, resetCatalog } = useApp();

  const totalProducts = products.length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream p-5 rounded-md border border-taupe/25 shadow-sm">
        <div>
          <h2 className="font-display text-xl sm:text-2xl text-ink font-semibold tracking-wide">
            Gestión de Categorías & Colecciones
          </h2>
          <p className="text-xs text-taupe-contrast mt-1 font-light">
            Estructura editorial de inventario con sincronización reactiva en tiempo real Cloudflare Workers API.
          </p>
        </div>

        <button
          onClick={resetCatalog}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm bg-white hover:bg-cream-200 border border-taupe/30 text-taupe-contrast hover:text-ink text-xs uppercase font-semibold tracking-wider transition-all self-start sm:self-auto active:scale-95 cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restablecer Catálogo Base
        </button>
      </div>

      {/* 5 Core Categories Grid */}
      <div className="space-y-4">
        <h3 className="font-display text-sm uppercase tracking-wider text-ink font-semibold flex items-center gap-2">
          <Layers className="w-4 h-4 text-gold-dark" />
          5 Categorías Principales ({categoriesWithCounts.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoriesWithCounts.map((cat) => {
            const percentage = totalProducts > 0 ? Math.round((cat.count / totalProducts) * 100) : 0;

            return (
              <div
                key={cat.id}
                className="bg-cream rounded-md border border-taupe/25 p-5 flex flex-col justify-between shadow-sm hover:border-gold/60 transition-all hover:shadow-luxury-card group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-cream-200 border border-taupe/25 flex items-center justify-center text-ink group-hover:bg-gold/20 transition-colors">
                        <Icon name={cat.icon as any} className="w-4 h-4 text-gold-dark" />
                      </div>
                      <h4 className="font-display text-base font-semibold text-ink uppercase tracking-wide">
                        {cat.name}
                      </h4>
                    </div>
                    <span className="text-xs font-semibold font-mono px-2.5 py-1 rounded-pill bg-white border border-taupe/20 text-ink shadow-xs">
                      {cat.count} {cat.count === 1 ? 'producto' : 'productos'}
                    </span>
                  </div>

                  <p className="text-xs text-taupe-contrast font-light mb-4 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                {/* Distribution Bar */}
                <div className="space-y-1.5 pt-3 border-t border-taupe/15">
                  <div className="flex items-center justify-between text-[11px] text-taupe-contrast">
                    <span className="font-medium">Participación en catálogo</span>
                    <span className="font-bold text-ink font-mono">{percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-cream-200 rounded-pill overflow-hidden border border-taupe/15">
                    <div
                      className="h-full bg-gold-dark transition-all duration-500 rounded-pill shadow-xs"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Collections List */}
      <div className="space-y-4">
        <h3 className="font-display text-sm uppercase tracking-wider text-ink font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold-dark" />
          Colecciones Activas ({collectionsList.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {collectionsList.map((colName) => {
            const count = products.filter((p) => p.collection.toLowerCase() === colName.toLowerCase()).length;

            return (
              <div
                key={colName}
                className="flex items-center justify-between p-3.5 bg-cream rounded-md border border-taupe/25 shadow-sm hover:border-gold/50 transition-colors"
              >
                <div className="min-w-0 pr-2 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                  <p className="font-display text-sm text-ink truncate font-semibold">{colName}</p>
                </div>
                <span className="text-xs font-mono font-medium text-taupe-contrast bg-white px-2 py-0.5 rounded-sm border border-taupe/20 shrink-0">
                  {count} {count === 1 ? 'producto' : 'productos'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
