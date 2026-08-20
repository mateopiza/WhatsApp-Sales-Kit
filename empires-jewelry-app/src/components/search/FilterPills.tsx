import React from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, MATERIALS } from '../../data/products';
import { Category, Material } from '../../types/catalog';
import { RotateCcw } from 'lucide-react';

export const FilterPills: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedMaterial,
    setSelectedMaterial,
    selectedCollection,
    setSelectedCollection,
    priceRange,
    setPriceRange,
    resetFilters,
    activeFilterCount,
    collectionsList,
  } = useApp();

  return (
    <div className="space-y-5 py-2">
      {/* Active Filters Reset Bar */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between pb-2 border-b border-taupe/15">
          <span className="text-xs font-medium text-ink">
            {activeFilterCount} {activeFilterCount === 1 ? 'filtro activo' : 'filtros activos'}
          </span>
          <button
            onClick={resetFilters}
            className="text-xs text-gold-dark hover:text-ink flex items-center gap-1 uppercase tracking-wider font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Categories */}
      <div>
        <label className="block text-[11px] uppercase tracking-wider text-taupe-contrast font-medium mb-2">
          Categoría
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory('todos')}
            className={`px-3 py-1 rounded-pill text-xs tracking-wider uppercase transition-all pill-tab-switch cursor-pointer ${
              selectedCategory === 'todos'
                ? 'bg-ink text-cream font-medium shadow-sm'
                : 'bg-cream-200 text-taupe-contrast hover:bg-cream-300 hover:text-ink'
            }`}
          >
            Todas
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as Category)}
              className={`px-3 py-1 rounded-pill text-xs tracking-wider uppercase transition-all pill-tab-switch cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-ink text-cream font-medium shadow-sm'
                  : 'bg-cream-200 text-taupe-contrast hover:bg-cream-300 hover:text-ink'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div>
        <label className="block text-[11px] uppercase tracking-wider text-taupe-contrast font-medium mb-2">
          Material & Metales
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedMaterial('todos')}
            className={`px-3 py-1 rounded-pill text-xs tracking-wider uppercase transition-all pill-tab-switch cursor-pointer ${
              selectedMaterial === 'todos'
                ? 'bg-ink text-cream font-medium shadow-sm'
                : 'bg-cream-200 text-taupe-contrast hover:bg-cream-300 hover:text-ink'
            }`}
          >
            Todos
          </button>
          {MATERIALS.map((mat) => (
            <button
              key={mat}
              onClick={() => setSelectedMaterial(mat as Material)}
              className={`px-3 py-1 rounded-pill text-xs tracking-wider uppercase transition-all pill-tab-switch cursor-pointer ${
                selectedMaterial === mat
                  ? 'bg-ink text-cream font-medium shadow-sm'
                  : 'bg-cream-200 text-taupe-contrast hover:bg-cream-300 hover:text-ink'
              }`}
            >
              {mat}
            </button>
          ))}
        </div>
      </div>

      {/* Collections */}
      <div>
        <label className="block text-[11px] uppercase tracking-wider text-taupe-contrast font-medium mb-2">
          Colección
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCollection('todas')}
            className={`px-3 py-1 rounded-pill text-xs tracking-wider uppercase transition-all pill-tab-switch cursor-pointer ${
              selectedCollection === 'todas'
                ? 'bg-ink text-cream font-medium shadow-sm'
                : 'bg-cream-200 text-taupe-contrast hover:bg-cream-300 hover:text-ink'
            }`}
          >
            Todas
          </button>
          {collectionsList.map((col) => (
            <button
              key={col}
              onClick={() => setSelectedCollection(col)}
              className={`px-3 py-1 rounded-pill text-xs tracking-wider uppercase transition-all pill-tab-switch cursor-pointer ${
                selectedCollection === col
                  ? 'bg-ink text-cream font-medium shadow-sm'
                  : 'bg-cream-200 text-taupe-contrast hover:bg-cream-300 hover:text-ink'
              }`}
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Quick Chips */}
      <div>
        <label className="block text-[11px] uppercase tracking-wider text-taupe-contrast font-medium mb-2">
          Rango de Precio (USD)
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setPriceRange([0, 20000])}
            className={`px-3 py-1 rounded-pill text-xs tracking-wider uppercase transition-all pill-tab-switch cursor-pointer ${
              priceRange[0] === 0 && priceRange[1] >= 20000
                ? 'bg-ink text-cream font-medium shadow-sm'
                : 'bg-cream-200 text-taupe-contrast hover:bg-cream-300 hover:text-ink'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setPriceRange([0, 2000])}
            className={`px-3 py-1 rounded-pill text-xs tracking-wider uppercase transition-all pill-tab-switch cursor-pointer ${
              priceRange[0] === 0 && priceRange[1] === 2000
                ? 'bg-ink text-cream font-medium shadow-sm'
                : 'bg-cream-200 text-taupe-contrast hover:bg-cream-300 hover:text-ink'
            }`}
          >
            Hasta $2,000
          </button>
          <button
            onClick={() => setPriceRange([2000, 5000])}
            className={`px-3 py-1 rounded-pill text-xs tracking-wider uppercase transition-all pill-tab-switch cursor-pointer ${
              priceRange[0] === 2000 && priceRange[1] === 5000
                ? 'bg-ink text-cream font-medium shadow-sm'
                : 'bg-cream-200 text-taupe-contrast hover:bg-cream-300 hover:text-ink'
            }`}
          >
            $2,000 - $5,000
          </button>
          <button
            onClick={() => setPriceRange([5000, 20000])}
            className={`px-3 py-1 rounded-pill text-xs tracking-wider uppercase transition-all pill-tab-switch cursor-pointer ${
              priceRange[0] === 5000 && priceRange[1] === 20000
                ? 'bg-ink text-cream font-medium shadow-sm'
                : 'bg-cream-200 text-taupe-contrast hover:bg-cream-300 hover:text-ink'
            }`}
          >
            Alta Gama (&gt; $5,000)
          </button>
        </div>
      </div>
    </div>
  );
};
