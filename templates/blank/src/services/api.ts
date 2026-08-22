import { Product } from '../types/catalog';
import { ApiResponse, AuthResponseData, CreateProductPayload, UpdateProductPayload, ProductFilterParams } from '../types/api';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';
import { safeStorage } from '../utils/storage';

export const CATALOG_STORAGE_KEY = 'store_catalog';
export const ADMIN_AUTH_STORAGE_KEY = 'store_admin_auth';
const API_BASE_URL = '/api';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Retrieves the locally cached catalog from safeStorage, falling back to static PRODUCTS.
   */
  getLocalCatalog(): Product[] {
    try {
      const stored = safeStorage.getItem(CATALOG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse local catalog cache:', e);
    }
    return DEFAULT_PRODUCTS;
  }

  /**
   * Persists a product array into the local safeStorage cache.
   */
  saveLocalCatalog(products: Product[]): void {
    safeStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(products));
  }

  /**
   * Fetches products from Cloudflare Pages API with fallback to local persistent cache.
   */
  async getProducts(filters?: ProductFilterParams): Promise<ApiResponse<Product[]>> {
    const url = new URL(`${this.baseUrl}/products`, window.location.origin);
    if (filters) {
      if (filters.category && filters.category !== 'todos') url.searchParams.set('category', filters.category);
      if (filters.material && filters.material !== 'todos') url.searchParams.set('material', filters.material);
      if (filters.collection && filters.collection !== 'todas') url.searchParams.set('collection', filters.collection);
      if (filters.availability && filters.availability !== 'todas') url.searchParams.set('availability', filters.availability);
      if (filters.featured !== undefined) url.searchParams.set('featured', String(filters.featured));
      if (filters.search) url.searchParams.set('search', filters.search);
      if (filters.sort) url.searchParams.set('sort', filters.sort);
      if (filters.limit) url.searchParams.set('limit', String(filters.limit));
      if (filters.offset) url.searchParams.set('offset', String(filters.offset));
    }

    try {
      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        const json: ApiResponse<Product[]> = await res.json();
        if (json.success && json.data) {
          // If unfiltered fetch, update local storage cache
          if (!filters || Object.keys(filters).length === 0) {
            this.saveLocalCatalog(json.data);
          }
          return json;
        }
      }
    } catch (err) {
      console.info('API call failed, falling back to resilient local storage cache:', err);
    }

    // Local filter fallback
    let localData = this.getLocalCatalog();
    if (filters?.category && filters.category !== 'todos') {
      localData = localData.filter((p) => p.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters?.material && filters.material !== 'todos') {
      localData = localData.filter((p) => p.material.toLowerCase() === filters.material!.toLowerCase());
    }
    if (filters?.collection && filters.collection !== 'todas') {
      localData = localData.filter((p) => p.collection.toLowerCase() === filters.collection!.toLowerCase());
    }
    if (filters?.availability && filters.availability !== 'todas') {
      localData = localData.filter((p) => p.availability.toLowerCase() === filters.availability!.toLowerCase());
    }
    if (filters?.featured !== undefined) {
      localData = localData.filter((p) => p.featured === filters.featured);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      localData = localData.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.reference.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      data: localData,
      meta: {
        total: localData.length,
        count: localData.length,
        timestamp: new Date().toISOString(),
        tier: 'LOCAL_CACHE',
      },
    };
  }

  /**
   * Fetches a single product by ID or slug.
   */
  async getProductById(idOrSlug: string): Promise<ApiResponse<Product>> {
    try {
      const res = await fetch(`${this.baseUrl}/products/${encodeURIComponent(idOrSlug)}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const json: ApiResponse<Product> = await res.json();
        if (json.success && json.data) {
          return json;
        }
      }
    } catch (err) {
      console.info('API single item fetch failed, using local cache:', err);
    }

    const localList = this.getLocalCatalog();
    const found = localList.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (found) {
      return {
        success: true,
        data: found,
        meta: { timestamp: new Date().toISOString(), tier: 'LOCAL_CACHE' },
      };
    }

    return {
      success: false,
      error: `Producto '${idOrSlug}' no encontrado`,
    };
  }

  /**
   * Creates a new product with admin auth.
   */
  async createProduct(payload: CreateProductPayload, token?: string): Promise<ApiResponse<Product>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${this.baseUrl}/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      const json: ApiResponse<Product> = await res.json();
      if (json.success && json.data) {
        // Update local catalog cache
        const local = this.getLocalCatalog();
        const updated = [json.data, ...local.filter((p) => p.id !== json.data!.id)];
        this.saveLocalCatalog(updated);
        return json;
      }
      return json;
    } catch (err: any) {
      // Local optimistic fallback
      const id = payload.id || `prod-${Date.now().toString(36)}`;
      const newProd: Product = {
        id,
        slug: payload.slug || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: payload.name,
        reference: payload.reference.toUpperCase(),
        category: payload.category,
        collection: payload.collection,
        price: Number(payload.price),
        currency: payload.currency || 'USD',
        short_description: payload.short_description,
        description: payload.description,
        material: payload.material,
        cover_image: payload.cover_image,
        images: payload.images && payload.images.length > 0 ? payload.images : [payload.cover_image],
        availability: payload.availability || 'disponible',
        featured: Boolean(payload.featured),
        badge: payload.badge,
        specifications: payload.specifications || {},
      };

      const local = this.getLocalCatalog();
      this.saveLocalCatalog([newProd, ...local.filter((p) => p.id !== id)]);

      return {
        success: true,
        data: newProd,
        meta: { timestamp: new Date().toISOString(), tier: 'LOCAL_CACHE' },
      };
    }
  }

  /**
   * Updates an existing product with admin auth.
   */
  async updateProduct(id: string, updates: UpdateProductPayload, token?: string): Promise<ApiResponse<Product>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${this.baseUrl}/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates),
      });
      const json: ApiResponse<Product> = await res.json();
      if (json.success && json.data) {
        const local = this.getLocalCatalog();
        const updated = local.map((p) => (p.id === id ? json.data! : p));
        this.saveLocalCatalog(updated);
        return json;
      }
      return json;
    } catch (err) {
      // Local fallback
      const local = this.getLocalCatalog();
      const current = local.find((p) => p.id === id);
      if (!current) {
        return { success: false, error: `Producto '${id}' no encontrado en caché local` };
      }
      const updatedProduct: Product = { ...current, ...(updates as any), id };
      const updatedList = local.map((p) => (p.id === id ? updatedProduct : p));
      this.saveLocalCatalog(updatedList);

      return {
        success: true,
        data: updatedProduct,
        meta: { timestamp: new Date().toISOString(), tier: 'LOCAL_CACHE' },
      };
    }
  }

  /**
   * Deletes a product with admin auth.
   */
  async deleteProduct(id: string, token?: string): Promise<ApiResponse<{ deletedId: string }>> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${this.baseUrl}/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers,
      });
      const json: ApiResponse<{ deletedId: string }> = await res.json();
      if (json.success) {
        const local = this.getLocalCatalog();
        const updated = local.filter((p) => p.id !== id);
        this.saveLocalCatalog(updated);
        return json;
      }
      return json;
    } catch (err) {
      const local = this.getLocalCatalog();
      const updated = local.filter((p) => p.id !== id);
      this.saveLocalCatalog(updated);

      return {
        success: true,
        data: { deletedId: id },
        meta: { timestamp: new Date().toISOString(), tier: 'LOCAL_CACHE' },
      };
    }
  }

  /**
   * Admin Authentication (POST /api/auth)
   */
  async login(pinOrPassword: string): Promise<ApiResponse<AuthResponseData>> {
    try {
      const res = await fetch(`${this.baseUrl}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinOrPassword, credential: pinOrPassword }),
      });

      const json: ApiResponse<AuthResponseData> = await res.json();
      return json;
    } catch (err) {
      // Local auth check fallback for offline / development
      const pin = pinOrPassword.trim();
      if (pin === 'demo2026' || pin === '1879') {
        const mockExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
        const mockToken = `mock-token-${Date.now()}`;
        return {
          success: true,
          data: {
            token: mockToken,
            authenticated: true,
            role: 'admin',
            expiresAt: mockExpiresAt,
          },
        };
      }
      return {
        success: false,
        error: 'Credenciales inválidas. Ingrese el PIN o contraseña de administrador autorizado.',
      };
    }
  }

  /**
   * Verify Session Token (GET /api/auth)
   */
  async verifyToken(token: string): Promise<ApiResponse<{ authenticated: boolean; role: 'admin' }>> {
    try {
      const res = await fetch(`${this.baseUrl}/auth`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      return json;
    } catch {
      if (token && token.startsWith('mock-token-')) {
        return {
          success: true,
          data: { authenticated: true, role: 'admin' },
        };
      }
      return { success: false, error: 'Error al verificar sesión' };
    }
  }
}

export const apiService = new ApiService();
export default apiService;
