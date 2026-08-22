import { useState, useMemo, useCallback } from 'react';
import { Product, Category, Material, Availability } from '../types/catalog';

export interface FilterState {
  searchQuery: string;
  category: Category | 'todos';
  material: Material | 'todos';
  collection: string | 'todas';
  availability: Availability | 'todas';
  priceRange: [number, number];
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'todos',
  material: 'todos',
  collection: 'todas',
  availability: 'todas',
  priceRange: [0, 20000],
};

const normalizeText = (text: string): string => {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

export function useSearchFilter(products: Product[]) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setCategory = useCallback((cat: Category | 'todos') => {
    setFilters((prev) => ({ ...prev, category: cat }));
  }, []);

  const setMaterial = useCallback((mat: Material | 'todos') => {
    setFilters((prev) => ({ ...prev, material: mat }));
  }, []);

  const setCollection = useCallback((col: string | 'todas') => {
    setFilters((prev) => ({ ...prev, collection: col }));
  }, []);

  const setAvailability = useCallback((avail: Availability | 'todas') => {
    setFilters((prev) => ({ ...prev, availability: avail }));
  }, []);

  const setPriceRange = useCallback((range: [number, number]) => {
    const rawMin = Math.min(range[0], range[1]);
    const rawMax = Math.max(range[0], range[1]);
    const min = Math.max(0, rawMin);
    const max = Math.max(min, rawMax);
    setFilters((prev) => ({ ...prev, priceRange: [min, max] }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const filteredProducts = useMemo(() => {
    const query = normalizeText(filters.searchQuery.trim());

    return products.filter((product) => {
      // 1. Text search
      if (query.length > 0) {
        const matchesName = normalizeText(product.name).includes(query);
        const matchesRef = normalizeText(product.reference).includes(query);
        const matchesCategory = normalizeText(product.category).includes(query);
        const matchesMaterial = normalizeText(product.material).includes(query);
        const matchesCollection = normalizeText(product.collection).includes(query);
        const matchesDesc = normalizeText(product.description).includes(query);
        const matchesShortDesc = normalizeText(product.short_description).includes(query);

        if (
          !matchesName &&
          !matchesRef &&
          !matchesCategory &&
          !matchesMaterial &&
          !matchesCollection &&
          !matchesDesc &&
          !matchesShortDesc
        ) {
          return false;
        }
      }

      // 2. Category filter
      if (filters.category !== 'todos' && product.category !== filters.category) {
        return false;
      }

      // 3. Material filter
      if (filters.material !== 'todos' && product.material !== filters.material) {
        return false;
      }

      // 4. Collection filter
      if (filters.collection !== 'todas' && product.collection !== filters.collection) {
        return false;
      }

      // 5. Availability filter
      if (filters.availability !== 'todas' && product.availability !== filters.availability) {
        return false;
      }

      // 6. Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim().length > 0) count++;
    if (filters.category !== 'todos') count++;
    if (filters.material !== 'todos') count++;
    if (filters.collection !== 'todas') count++;
    if (filters.availability !== 'todas') count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 20000) count++;
    return count;
  }, [filters]);

  return {
    filters,
    setSearchQuery,
    setCategory,
    setMaterial,
    setCollection,
    setAvailability,
    setPriceRange,
    resetFilters,
    filteredProducts,
    activeFilterCount,
  };
}
