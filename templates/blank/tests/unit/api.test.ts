import { describe, it, expect, beforeEach } from 'vitest';
import { apiService } from '../../src/services/api';
import { safeStorage } from '../../src/utils/storage';
import { PRODUCTS } from '../../src/data/products';

describe('Resilient Multi-Tier API Service', () => {
  beforeEach(() => {
    safeStorage.clear();
    apiService.saveLocalCatalog([...PRODUCTS]);
  });

  it('loads local catalog from safeStorage with initial fallback', () => {
    const catalog = apiService.getLocalCatalog();
    expect(catalog.length).toBe(PRODUCTS.length);
    expect(catalog[0].name).toBe(PRODUCTS[0].name);
  });

  it('filters products by category and material locally when offline', async () => {
    const res = await apiService.getProducts({ category: 'categoria-1' });
    expect(res.success).toBe(true);
    expect(res.data?.length).toBeGreaterThan(0);
    res.data?.forEach((p) => {
      expect(p.category).toBe('categoria-1');
    });
  });

  it('searches products by text query across name, SKU and description', async () => {
    const res = await apiService.getProducts({ search: 'Demo' });
    expect(res.success).toBe(true);
    expect(res.data?.length).toBeGreaterThan(0);
  });

  it('retrieves single product by ID or by slug', async () => {
    const byId = await apiService.getProductById('prod-01');
    expect(byId.success).toBe(true);
    expect(byId.data?.id).toBe('prod-01');

    const bySlug = await apiService.getProductById('producto-demo-dos');
    expect(bySlug.success).toBe(true);
    expect(bySlug.data?.reference).toBe('REF-0102');
  });

  it('creates, updates and deletes products updating the local cache', async () => {
    // 1. Create
    const created = await apiService.createProduct({
      id: 'test-product-99',
      name: 'Producto de Prueba',
      reference: 'REF-TEST-99',
      category: 'categoria-1',
      collection: 'Colección General',
      price: 12500,
      short_description: 'Producto de prueba para el test de creación.',
      description: 'Producto sintético usado únicamente para validar el flujo de creación/edición/borrado.',
      material: 'Estándar',
      cover_image: '/assets/products/placeholder-1.svg',
    });
    expect(created.success).toBe(true);
    expect(apiService.getLocalCatalog().some((p) => p.id === 'test-product-99')).toBe(true);

    // 2. Update
    const updated = await apiService.updateProduct('test-product-99', {
      price: 14000,
    });
    expect(updated.success).toBe(true);
    expect(apiService.getLocalCatalog().find((p) => p.id === 'test-product-99')?.price).toBe(14000);

    // 3. Delete
    const deleted = await apiService.deleteProduct('test-product-99');
    expect(deleted.success).toBe(true);
    expect(apiService.getLocalCatalog().some((p) => p.id === 'test-product-99')).toBe(false);
  });

  it('authenticates admin with valid PIN demo2026', async () => {
    const res = await apiService.login('demo2026');
    expect(res.success).toBe(true);
    expect(res.data?.authenticated).toBe(true);
    expect(res.data?.token).toBeDefined();
  });

  it('rejects invalid admin PIN', async () => {
    const res = await apiService.login('0000');
    expect(res.success).toBe(false);
    expect(res.data).toBeUndefined();
  });
});
