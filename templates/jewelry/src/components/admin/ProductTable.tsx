import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import { formatPrice } from '../../utils/formatters';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Sparkles,
  Package,
  DollarSign,
  LayoutList,
  Grid,
  X,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export const ProductTable: React.FC = () => {
  const { products } = useApp();
  const { openCreateForm, openEditForm, openDeleteModal } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'reference'>('name');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Stats calculation
  const totalValue = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.price || 0), 0);
  }, [products]);

  const featuredCount = useMemo(() => {
    return products.filter((p) => p.featured).length;
  }, [products]);

  const availableCount = useMemo(() => {
    return products.filter((p) => p.availability === 'disponible').length;
  }, [products]);

  // Filter & Sort products
  const filteredList = useMemo(() => {
    const list = products.filter((p) => {
      const matchCategory =
        categoryFilter === 'todos' || p.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchStatus =
        statusFilter === 'todos' || p.availability.toLowerCase() === statusFilter.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.reference.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q);

      return matchCategory && matchStatus && matchSearch;
    });

    return list.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'reference') return a.reference.localeCompare(b.reference);
      return a.name.localeCompare(b.name);
    });
  }, [products, categoryFilter, statusFilter, searchQuery, sortBy]);

  const hasActiveFilters = searchQuery !== '' || categoryFilter !== 'todos' || statusFilter !== 'todos';

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('todos');
    setStatusFilter('todos');
    setSortBy('name');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Segmented KPI Metrics Dashboard Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1 */}
        <div className="p-4 bg-cream rounded-md border border-taupe/25 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-taupe-contrast">
              Total Catálogo
            </p>
            <p className="font-display text-2xl font-bold text-ink mt-1">
              {products.length} <span className="text-xs font-normal text-taupe-contrast font-body">piezas</span>
            </p>
            <p className="text-[10px] text-taupe-contrast/80 mt-1">Inventario total registrado</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-cream-200 border border-taupe/20 flex items-center justify-center text-ink shrink-0">
            <Package className="w-5 h-5 text-taupe-contrast" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 bg-cream rounded-md border border-taupe/25 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-taupe-contrast">
              Valor de Colección
            </p>
            <p className="font-display text-2xl font-bold text-ink mt-1">
              ${totalValue.toLocaleString('en-US')}{' '}
              <span className="text-xs font-normal text-taupe-contrast font-body">USD</span>
            </p>
            <p className="text-[10px] text-taupe-contrast/80 mt-1">Suma total de lista</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold-dark shrink-0">
            <DollarSign className="w-5 h-5 text-gold-dark" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 bg-cream rounded-md border border-taupe/25 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-taupe-contrast">
              Piezas Destacadas
            </p>
            <p className="font-display text-2xl font-bold text-gold-dark mt-1">
              {featuredCount} <span className="text-xs font-normal text-taupe-contrast font-body">en portada</span>
            </p>
            <p className="text-[10px] text-taupe-contrast/80 mt-1">Lookbook editorial principal</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold-dark shrink-0">
            <Sparkles className="w-5 h-5 text-gold-dark" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 bg-cream rounded-md border border-taupe/25 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-taupe-contrast">
                Disponibilidad
              </p>
              <p className="font-display text-2xl font-bold text-status-success mt-1">
                {availableCount} <span className="text-xs font-normal text-taupe-contrast font-body">en stock</span>
              </p>
            </div>
            <button
              onClick={openCreateForm}
              className="px-3 py-2 bg-ink text-cream text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-ink-dark transition-all shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-gold" />
              <span>Nueva Joya</span>
            </button>
          </div>
          <p className="text-[10px] text-taupe-contrast/80 mt-1">Instant sync Cloudflare API</p>
        </div>
      </div>

      {/* Search & Filter Toolbar - Segmented Control Bar */}
      <div className="bg-cream rounded-md border border-taupe/25 p-3.5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search input with clear button */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-taupe-contrast absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, SKU, material o colección..."
              className="w-full pl-9 pr-9 py-2.5 text-xs bg-white border border-taupe/25 rounded-sm focus:outline-none focus:border-gold text-ink placeholder-taupe-contrast/70 font-body shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe-contrast hover:text-ink p-0.5"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters & Controls Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-taupe/25 rounded-sm px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-taupe-contrast" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filtrar por categoría"
                className="text-xs bg-transparent text-ink font-medium focus:outline-none cursor-pointer"
              >
                <option value="todos">Todas las categorías</option>
                <option value="anillos">Anillos</option>
                <option value="collares">Collares</option>
                <option value="pulseras">Pulseras</option>
                <option value="aretes">Aretes</option>
                <option value="alta-joyeria">Alta Joyería</option>
              </select>
            </div>

            {/* Status dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-taupe/25 rounded-sm px-2.5 py-1.5">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filtrar por estado"
                className="text-xs bg-transparent text-ink font-medium focus:outline-none cursor-pointer"
              >
                <option value="todos">Todos los estados</option>
                <option value="disponible">Disponible</option>
                <option value="bajo-pedido">Bajo Pedido</option>
                <option value="pieza-unica">Pieza Única</option>
                <option value="agotado">Agotado</option>
              </select>
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-taupe/25 rounded-sm px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-taupe-contrast" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Ordenar por"
                className="text-xs bg-transparent text-ink font-medium focus:outline-none cursor-pointer"
              >
                <option value="name">Nombre (A-Z)</option>
                <option value="price-desc">Precio (Mayor a Menor)</option>
                <option value="price-asc">Precio (Menor a Mayor)</option>
                <option value="reference">SKU Referencia</option>
              </select>
            </div>

            {/* View Switcher Toggle */}
            <div className="flex items-center bg-cream-200 border border-taupe/25 rounded-sm p-0.5">
              <button
                onClick={() => setViewMode('table')}
                title="Vista de Tabla"
                className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-ink text-cream shadow-sm' : 'text-taupe-contrast hover:text-ink'
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="Vista de Tarjetas"
                className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-ink text-cream shadow-sm' : 'text-taupe-contrast hover:text-ink'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Counter and Active Filters Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-taupe/15 text-xs text-taupe-contrast">
          <span>
            Mostrando <strong className="text-ink font-semibold">{filteredList.length}</strong> de{' '}
            <strong className="text-ink font-semibold">{products.length}</strong> piezas registradas
          </span>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[11px] font-semibold text-gold-dark hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              Restablecer Filtros
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {filteredList.length === 0 ? (
        <div className="p-12 text-center bg-cream rounded-md border border-taupe/25 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-cream-200 border border-taupe/20 flex items-center justify-center text-taupe-contrast mx-auto">
            <Search className="w-6 h-6 text-taupe-contrast" />
          </div>
          <h3 className="font-display text-lg text-ink font-semibold">No se encontraron piezas</h3>
          <p className="text-xs text-taupe-contrast max-w-sm mx-auto font-light">
            No existen joyas que coincidan exactamente con el criterio de búsqueda o filtro seleccionado.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-cream-200 border border-taupe/30 text-ink text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-cream-300 transition-colors"
              >
                Limpiar Filtros
              </button>
            )}
            <button
              onClick={openCreateForm}
              className="px-4 py-2 bg-ink text-cream text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-ink-dark transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-gold" />
              Crear Joya
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* Executive Table View */
        <div className="overflow-x-auto bg-cream rounded-md border border-taupe/25 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-taupe/20 bg-cream-200/80 text-[11px] uppercase tracking-wider text-ink font-semibold">
                <th className="py-3.5 px-4 w-16">Foto</th>
                <th className="py-3.5 px-4">Joya & SKU</th>
                <th className="py-3.5 px-4">Categoría & Colección</th>
                <th className="py-3.5 px-4">Material</th>
                <th className="py-3.5 px-4">Precio</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe/15 text-xs bg-white/40">
              {filteredList.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-cream-200/60 transition-colors group"
                >
                  <td className="py-3 px-4">
                    <img
                      src={product.cover_image}
                      alt={product.name}
                      className="w-11 h-11 object-cover rounded-sm border border-taupe/20 bg-stone/20 shadow-xs group-hover:scale-105 transition-transform"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-display font-semibold text-ink uppercase tracking-wide flex items-center gap-1.5">
                      {product.name}
                      {product.featured && (
                        <span title="Destacado en Lookbook">
                          <Sparkles className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono font-medium text-taupe-contrast uppercase mt-0.5">
                      SKU: {product.reference}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="uppercase text-[11px] font-semibold text-ink block">
                      {product.category}
                    </span>
                    <span className="text-[10px] text-taupe-contrast block">
                      {product.collection}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-taupe-contrast font-medium">
                    {product.material}
                  </td>
                  <td className="py-3 px-4 font-bold text-ink font-mono text-sm">
                    {formatPrice(product.price, product.currency)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={product.availability === 'disponible' ? 'outline' : 'gold'}>
                      {product.availability}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => openEditForm(product)}
                        aria-label={`Editar ${product.name}`}
                        className="px-2.5 py-1.5 text-xs text-ink hover:text-white bg-cream-200 hover:bg-ink border border-taupe/30 rounded-sm transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden lg:inline font-medium">Editar</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(product)}
                        aria-label={`Eliminar ${product.name}`}
                        className="p-1.5 text-status-error hover:bg-status-error/15 border border-status-error/30 rounded-sm transition-colors cursor-pointer"
                        title="Eliminar pieza"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Visual Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredList.map((product) => (
            <div
              key={product.id}
              className="bg-cream rounded-md border border-taupe/25 shadow-sm p-4 flex flex-col justify-between hover:border-gold/60 transition-all group"
            >
              <div>
                <div className="relative aspect-square mb-3 bg-stone/20 rounded-sm overflow-hidden border border-taupe/15">
                  <img
                    src={product.cover_image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.featured && (
                    <span className="absolute top-2 right-2 bg-ink/90 text-gold p-1 rounded-full shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <span className="absolute bottom-2 left-2 bg-cream/90 text-ink text-[10px] font-mono px-2 py-0.5 rounded-sm font-semibold border border-taupe/20">
                    {product.reference}
                  </span>
                </div>

                <h4 className="font-display text-sm font-semibold text-ink uppercase tracking-wide truncate mb-1">
                  {product.name}
                </h4>

                <div className="flex items-center justify-between text-xs text-taupe-contrast mb-2">
                  <span className="capitalize font-medium">{product.category}</span>
                  <span className="font-mono text-ink font-bold">
                    {formatPrice(product.price, product.currency)}
                  </span>
                </div>

                <p className="text-[11px] text-taupe-contrast font-light line-clamp-2 mb-3">
                  {product.material} · {product.collection}
                </p>
              </div>

              <div className="pt-3 border-t border-taupe/15 flex items-center justify-between">
                <Badge variant={product.availability === 'disponible' ? 'outline' : 'gold'}>
                  {product.availability}
                </Badge>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditForm(product)}
                    className="px-2.5 py-1 text-xs uppercase font-medium text-ink bg-cream-200 hover:bg-ink hover:text-cream border border-taupe/30 rounded-sm transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    Editar
                  </button>
                  <button
                    onClick={() => openDeleteModal(product)}
                    className="p-1 text-status-error hover:bg-status-error/15 border border-status-error/30 rounded-sm transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
