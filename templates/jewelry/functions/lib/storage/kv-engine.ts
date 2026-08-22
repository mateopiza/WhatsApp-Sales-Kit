import { StorageEngine } from './interface';
import { Product, ProductFilterParams, KVNamespace } from '../types';
import { SEED_PRODUCTS } from '../data/seed';

const KV_INDEX_KEY = 'catalog:product_ids';
const KV_PRODUCT_PREFIX = 'product:';
const KV_SLUG_PREFIX = 'slug:';

export class KVStorageEngine implements StorageEngine {
  readonly tierName = 'KV' as const;
  private kv: KVNamespace;
  private initialized = false;

  constructor(kv: KVNamespace) {
    this.kv = kv;
  }

  async init(): Promise<void> {
    if (this.initialized) return;
    const existingIds = await this.kv.get(KV_INDEX_KEY, 'json');
    if (!existingIds || !Array.isArray(existingIds) || existingIds.length === 0) {
      await this.resetToDefaults();
    }
    this.initialized = true;
  }

  async getAllProducts(filters?: ProductFilterParams): Promise<Product[]> {
    await this.init();
    const ids: string[] = (await this.kv.get(KV_INDEX_KEY, 'json')) || [];
    const products: Product[] = [];

    for (const id of ids) {
      const prod = await this.kv.get(`${KV_PRODUCT_PREFIX}${id}`, 'json');
      if (prod) products.push(prod);
    }

    let result = products;

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
    return this.kv.get(`${KV_PRODUCT_PREFIX}${id}`, 'json');
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    await this.init();
    const id = await this.kv.get(`${KV_SLUG_PREFIX}${slug}`, 'text');
    if (!id) return null;
    return this.getProductById(id);
  }

  async createProduct(product: Product): Promise<Product> {
    await this.init();
    const ids: string[] = (await this.kv.get(KV_INDEX_KEY, 'json')) || [];
    if (!ids.includes(product.id)) {
      ids.push(product.id);
      await this.kv.put(KV_INDEX_KEY, JSON.stringify(ids));
    }
    await this.kv.put(`${KV_PRODUCT_PREFIX}${product.id}`, JSON.stringify(product));
    await this.kv.put(`${KV_SLUG_PREFIX}${product.slug}`, product.id);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    await this.init();
    const current = await this.getProductById(id);
    if (!current) return null;

    const merged: Product = { ...current, ...updates, id };
    if (current.slug !== merged.slug) {
      await this.kv.delete(`${KV_SLUG_PREFIX}${current.slug}`);
      await this.kv.put(`${KV_SLUG_PREFIX}${merged.slug}`, id);
    }
    await this.kv.put(`${KV_PRODUCT_PREFIX}${id}`, JSON.stringify(merged));
    return merged;
  }

  async deleteProduct(id: string): Promise<boolean> {
    await this.init();
    const current = await this.getProductById(id);
    if (!current) return false;

    await this.kv.delete(`${KV_PRODUCT_PREFIX}${id}`);
    await this.kv.delete(`${KV_SLUG_PREFIX}${current.slug}`);

    const ids: string[] = (await this.kv.get(KV_INDEX_KEY, 'json')) || [];
    const updatedIds = ids.filter((item) => item !== id);
    await this.kv.put(KV_INDEX_KEY, JSON.stringify(updatedIds));
    return true;
  }

  async resetToDefaults(): Promise<Product[]> {
    const ids: string[] = [];
    for (const p of SEED_PRODUCTS) {
      ids.push(p.id);
      await this.kv.put(`${KV_PRODUCT_PREFIX}${p.id}`, JSON.stringify(p));
      await this.kv.put(`${KV_SLUG_PREFIX}${p.slug}`, p.id);
    }
    await this.kv.put(KV_INDEX_KEY, JSON.stringify(ids));
    return SEED_PRODUCTS;
  }
}
