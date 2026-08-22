import { Product, ProductFilterParams } from '../types';

export interface StorageEngine {
  readonly tierName: 'D1' | 'KV' | 'MEMORY';
  init(): Promise<void>;
  getAllProducts(filters?: ProductFilterParams): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getProductBySlug(slug: string): Promise<Product | null>;
  createProduct(product: Product): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | null>;
  deleteProduct(id: string): Promise<boolean>;
  resetToDefaults(): Promise<Product[]>;
}
