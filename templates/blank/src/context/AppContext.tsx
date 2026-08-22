import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { Product, Category, Material, Availability, CategoryInfo } from '../types/catalog';
import { NavTab } from '../types/navigation';
import { PRODUCTS, CATEGORIES, COLLECTIONS } from '../data/products';
import { useFavorites } from '../hooks/useFavorites';
import { useSearchFilter } from '../hooks/useSearchFilter';
import { apiService } from '../services/api';

export interface ToastState {
  message: string;
  type?: 'info' | 'success' | 'gold';
}

export interface AppContextType {
  // Navigation & Tabs
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isFavoritesOpen: boolean;
  setIsFavoritesOpen: (open: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isBulkInquiryOpen: boolean;
  setIsBulkInquiryOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  openAdmin: () => void;
  closeAdmin: () => void;

  // Active Product Viewer & Carousel Sequence
  selectedProduct: Product | null;
  activeSequence: Product[];
  openProductViewer: (product: Product, sequence?: Product[]) => void;
  closeProductViewer: () => void;
  nextProduct: () => void;
  prevProduct: () => void;
  hasAdjacent: { hasPrev: boolean; hasNext: boolean };
  currentProductIndex: number;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category | 'todos';
  setSelectedCategory: (cat: Category | 'todos') => void;
  selectedMaterial: Material | 'todos';
  setSelectedMaterial: (mat: Material | 'todos') => void;
  selectedCollection: string | 'todas';
  setSelectedCollection: (col: string | 'todas') => void;
  selectedAvailability: Availability | 'todas';
  setSelectedAvailability: (avail: Availability | 'todas') => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  filteredProducts: Product[];
  resetFilters: () => void;
  activeFilterCount: number;

  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  removeFavorite: (productId: string) => void;
  clearFavorites: () => void;
  favoriteProducts: Product[];

  // Toast
  toast: ToastState | null;
  showToast: (message: string, type?: 'info' | 'success' | 'gold') => void;
  hideToast: () => void;

  // Currency State
  currency: 'USD' | 'COP' | 'EUR';
  setCurrency: (currency: 'USD' | 'COP' | 'EUR') => void;

  // Catalog Dynamic Data & CRUD
  products: Product[];
  allProducts: Product[];
  categoriesWithCounts: CategoryInfo[];
  collectionsList: string[];
  addProduct: (product: Product) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  resetCatalog: () => Promise<void>;
  refreshCatalog: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Dynamic Catalog State
  const [products, setProducts] = useState<Product[]>(() => {
    return apiService.getLocalCatalog();
  });

  // Currency State with localStorage persistence
  const [currency, setCurrencyState] = useState<'USD' | 'COP' | 'EUR'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('store_currency') as 'USD' | 'COP' | 'EUR';
      if (saved && ['USD', 'COP', 'EUR'].includes(saved)) return saved;
    }
    return 'USD';
  });

  const setCurrency = useCallback((curr: 'USD' | 'COP' | 'EUR') => {
    setCurrencyState(curr);
    if (typeof window !== 'undefined') {
      localStorage.setItem('store_currency', curr);
    }
  }, []);

  // Async remote sync on mount
  useEffect(() => {
    let mounted = true;
    apiService.getProducts().then((res) => {
      if (mounted && res.success && res.data && res.data.length > 0) {
        setProducts(res.data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // 2. Navigation State
  const [activeTab, setActiveTabState] = useState<NavTab>('inicio');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBulkInquiryOpen, setIsBulkInquiryOpen] = useState(false);

  // 3. Admin Route & Modal State
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname === '/admin' || window.location.hash === '#admin';
  });

  const openAdmin = useCallback(() => {
    setIsAdminOpen(true);
    if (typeof window !== 'undefined' && window.location.pathname !== '/admin' && window.location.hash !== '#admin') {
      window.history.pushState({ admin: true }, '', '/admin');
    }
  }, []);

  const closeAdmin = useCallback(() => {
    setIsAdminOpen(false);
    if (typeof window !== 'undefined' && (window.location.pathname === '/admin' || window.location.hash === '#admin')) {
      window.history.pushState(null, '', '/');
    }
  }, []);

  // Listen to popstate and keyboard shortcuts (Ctrl+Shift+A / Cmd+Shift+A)
  useEffect(() => {
    const handlePopState = () => {
      setIsAdminOpen(window.location.pathname === '/admin' || window.location.hash === '#admin');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 4. Dynamic Categories & Collections with live counts
  const categoriesWithCounts = useMemo<CategoryInfo[]>(() => {
    return CATEGORIES.map((cat) => {
      const count = products.filter((p) => p.category === cat.id).length;
      return {
        ...cat,
        count,
      };
    });
  }, [products]);

  const collectionsList = useMemo<string[]>(() => {
    const fromProducts = Array.from(new Set(products.map((p) => p.collection))).filter(Boolean);
    const combined = Array.from(new Set([...COLLECTIONS, ...fromProducts]));
    return combined;
  }, [products]);

  // 5. Toast
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimeoutRef = React.useRef<any>(null);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'gold' = 'gold') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3200);
  }, []);

  const hideToast = useCallback(() => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast(null);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // 6. Favorites Hook
  const {
    favorites,
    toggleFavorite: rawToggleFavorite,
    isFavorite,
    removeFavorite: rawRemoveFavorite,
    clearFavorites,
  } = useFavorites();

  const toggleFavorite = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      const isAlready = favorites.includes(productId);
      rawToggleFavorite(productId);
      if (!isAlready && product) {
        showToast(`"${product.name}" añadida a tu selección privada`, 'gold');
      }
    },
    [favorites, products, rawToggleFavorite, showToast]
  );

  const removeFavorite = useCallback(
    (productId: string) => {
      rawRemoveFavorite(productId);
    },
    [rawRemoveFavorite]
  );

  const favoriteProducts = useMemo(() => {
    return products.filter((p) => favorites.includes(p.id));
  }, [products, favorites]);

  // 7. Search & Filter Hook (fed with dynamic products state)
  const {
    filters,
    setSearchQuery,
    setCategory: setSelectedCategory,
    setMaterial: setSelectedMaterial,
    setCollection: setSelectedCollection,
    setAvailability: setSelectedAvailability,
    setPriceRange,
    resetFilters,
    filteredProducts,
    activeFilterCount,
  } = useSearchFilter(products);

  // Tab switcher with drawer sync
  const setActiveTab = useCallback((tab: NavTab) => {
    setActiveTabState(tab);
    if (tab === 'buscar') {
      setIsSearchOpen(true);
      setIsFavoritesOpen(false);
      setIsMenuOpen(false);
    } else if (tab === 'favoritos') {
      setIsFavoritesOpen(true);
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    } else {
      setIsSearchOpen(false);
      setIsFavoritesOpen(false);
    }
  }, []);

  // 8. Product Viewer & Sequence Carousel
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeSequence, setActiveSequence] = useState<Product[]>(products);

  const openProductViewer = useCallback(
    (product: Product, sequence?: Product[]) => {
      const seq = sequence && sequence.length > 0 ? sequence : products;
      setActiveSequence(seq);
      setSelectedProduct(product);
    },
    [products]
  );

  const closeProductViewer = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const currentProductIndex = useMemo(() => {
    if (!selectedProduct) return -1;
    return activeSequence.findIndex((p) => p.id === selectedProduct.id);
  }, [selectedProduct, activeSequence]);

  const hasAdjacent = useMemo(() => {
    if (currentProductIndex === -1 || activeSequence.length <= 1) {
      return { hasPrev: false, hasNext: false };
    }
    return {
      hasPrev: currentProductIndex > 0,
      hasNext: currentProductIndex < activeSequence.length - 1,
    };
  }, [currentProductIndex, activeSequence]);

  const nextProduct = useCallback(() => {
    if (currentProductIndex !== -1 && currentProductIndex < activeSequence.length - 1) {
      setSelectedProduct(activeSequence[currentProductIndex + 1]);
    }
  }, [currentProductIndex, activeSequence]);

  const prevProduct = useCallback(() => {
    if (currentProductIndex > 0) {
      setSelectedProduct(activeSequence[currentProductIndex - 1]);
    }
  }, [currentProductIndex, activeSequence]);

  // 9. Optimistic CRUD operations with zero delay
  const addProduct = useCallback(
    async (newProduct: Product): Promise<boolean> => {
      // 0ms Optimistic State Mutation
      setProducts((prev) => {
        const next = [newProduct, ...prev.filter((p) => p.id !== newProduct.id)];
        apiService.saveLocalCatalog(next);
        return next;
      });
      showToast(`"${newProduct.name}" creada exitosamente`, 'success');

      // Asynchronous API Persistence
      try {
        await apiService.createProduct(newProduct);
        return true;
      } catch (err) {
        console.warn('Background sync create failed:', err);
        return true; // Still true because local state is updated
      }
    },
    [showToast]
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>): Promise<boolean> => {
      setProducts((prev) => {
        const next = prev.map((p) => (p.id === id ? { ...p, ...updates, id } : p));
        apiService.saveLocalCatalog(next);
        return next;
      });

      // Update selected product if viewer is open
      setSelectedProduct((cur) => (cur && cur.id === id ? { ...cur, ...updates, id } : cur));
      showToast('Producto actualizado exitosamente', 'success');

      try {
        await apiService.updateProduct(id, updates);
        return true;
      } catch (err) {
        console.warn('Background sync update failed:', err);
        return true;
      }
    },
    [showToast]
  );

  const deleteProduct = useCallback(
    async (id: string): Promise<boolean> => {
      const target = products.find((p) => p.id === id);
      const name = target ? target.name : id;

      setProducts((prev) => {
        const next = prev.filter((p) => p.id !== id);
        apiService.saveLocalCatalog(next);
        return next;
      });

      // Close viewer if deleting currently viewed product
      setSelectedProduct((cur) => (cur && cur.id === id ? null : cur));
      showToast(`"${name}" eliminada del catálogo`, 'info');

      try {
        await apiService.deleteProduct(id);
        return true;
      } catch (err) {
        console.warn('Background sync delete failed:', err);
        return true;
      }
    },
    [products, showToast]
  );

  const resetCatalog = useCallback(async (): Promise<void> => {
    setProducts(PRODUCTS);
    apiService.saveLocalCatalog(PRODUCTS);
    showToast('Catálogo restablecido a valores iniciales', 'info');
  }, [showToast]);

  const refreshCatalog = useCallback(async (): Promise<void> => {
    const res = await apiService.getProducts();
    if (res.success && res.data) {
      setProducts(res.data);
    }
  }, []);

  const value: AppContextType = {
    activeTab,
    setActiveTab,
    isSearchOpen,
    setIsSearchOpen,
    isFavoritesOpen,
    setIsFavoritesOpen,
    isMenuOpen,
    setIsMenuOpen,
    isBulkInquiryOpen,
    setIsBulkInquiryOpen,
    isAdminOpen,
    setIsAdminOpen,
    openAdmin,
    closeAdmin,

    selectedProduct,
    activeSequence,
    openProductViewer,
    closeProductViewer,
    nextProduct,
    prevProduct,
    hasAdjacent,
    currentProductIndex,

    searchQuery: filters.searchQuery,
    setSearchQuery,
    selectedCategory: filters.category,
    setSelectedCategory,
    selectedMaterial: filters.material,
    setSelectedMaterial,
    selectedCollection: filters.collection,
    setSelectedCollection,
    selectedAvailability: filters.availability,
    setSelectedAvailability,
    priceRange: filters.priceRange,
    setPriceRange,
    filteredProducts,
    resetFilters,
    activeFilterCount,

    favorites,
    toggleFavorite,
    isFavorite,
    removeFavorite,
    clearFavorites,
    favoriteProducts,

    toast,
    showToast,
    hideToast,

    currency,
    setCurrency,

    products,
    allProducts: products,
    categoriesWithCounts,
    collectionsList,
    addProduct,
    updateProduct,
    deleteProduct,
    resetCatalog,
    refreshCatalog,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
