import { StorageEngine } from './interface';
import { Product, ProductFilterParams } from '../types';
import { SEED_PRODUCTS } from '../data/seed';

export class MemoryStorageEngine implements StorageEngine {
  readonly tierName = 'MEMORY' as const;
  private products: Map<string, Product> = new Map();
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;
    this.products.clear();
    for (const p of SEED_PRODUCTS) {
      this.products.set(p.id, { ...p });
    }
    this.initialized = true;
  }

  async getAllProducts(filters?: ProductFilterParams): Promise<Product[]> {
    await this.init();
    let result = Array.from(this.products.values());

    if (filters?.category && filters.category !== 'todos') {
      result = result.filter((p) => p.category.toLowerCase() === filters.category!.toLowerCase());
    }

    if (filters?.material && filters.material !== 'todos') {
      result = result.filter((p) => p.material.toLowerCase() === filters.material!.toLowerCase());
    }

    if (filters?.collection && filters.collection !== 'todas') {
      result = result.filter((p) => p.collection.toLowerCase() === filters.collection!.toLowerCase());
    }

    if (filters?.availability && filters.availability !== 'todas') {
      result = result.filter((p) => p.availability.toLowerCase() === filters.availability!.toLowerCase());
    }

    if (filters?.featured !== undefined) {
      result = result.filter((p) => p.featured === filters.featured);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.reference.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q)
      );
    }

    if (filters?.sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters?.sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters?.sort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters?.sort === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (filters?.offset) {
      result = result.slice(filters.offset);
    }
    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  async getProductById(id: string): Promise<Product | null> {
    await this.init();
    return this.products.get(id) ? { ...this.products.get(id)! } : null;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    await this.init();
    for (const p of this.products.values()) {
      if (p.slug === slug) return { ...p };
    }
    return null;
  }

  async createProduct(product: Product): Promise<Product> {
    await this.init();
    this.products.set(product.id, { ...product });
    return { ...product };
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    await this.init();
    const existing = this.products.get(id);
    if (!existing) return null;
    const updated: Product = { ...existing, ...updates, id };
    this.products.set(id, updated);
    return { ...updated };
  }

  async deleteProduct(id: string): Promise<boolean> {
    await this.init();
    return this.products.delete(id);
  }

  async resetToDefaults(): Promise<Product[]> {
    this.products.clear();
    for (const p of SEED_PRODUCTS) {
      this.products.set(p.id, { ...p });
    }
    return Array.from(this.products.values());
  }
}
