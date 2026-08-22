import { describe, it, expect } from 'vitest';
import { validateProductForm, generateSlug } from '../../src/utils/validation';
import { ProductFormData } from '../../src/types/admin';
import { PRODUCTS } from '../../src/data/products';

describe('Admin CMS Validation & Utilities', () => {
  it('generates URL-friendly slugs from product titles', () => {
    expect(generateSlug('Gargantilla Solitario Áurea 18k')).toBe('gargantilla-solitario-aurea-18k');
    expect(generateSlug('Anillo de Compromiso & Solitario')).toBe('anillo-de-compromiso-solitario');
    expect(generateSlug('Brazalete Étoile')).toBe('brazalete-etoile');
  });

  it('validates a complete, compliant ProductFormData payload', () => {
    const validData: ProductFormData = {
      name: 'Anillo Corona Real',
      slug: 'anillo-corona-real',
      reference: 'REF-NEW-01',
      category: 'anillos',
      collection: 'Colección Imperial',
      price: 1950,
      currency: 'USD',
      short_description: 'Anillo de diseño señorial con diamantes corte princesa.',
      description: 'Una descripción de ejemplo con suficiente longitud para pasar la validación.',
      material: 'Oro Amarillo 18k',
      cover_image: '/assets/products/placeholder-1.svg',
      images: ['/assets/products/placeholder-1.svg'],
      availability: 'disponible',
      featured: true,
      specifications: {
        weight: '4.5 g',
      },
    };

    const result = validateProductForm(validData, PRODUCTS);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('catches missing name, invalid slug, and duplicate reference SKU', () => {
    const invalidData: ProductFormData = {
      name: 'A',
      slug: 'INVALID SLUG WITH SPACES',
      reference: 'REF-0101', // Already exists in PRODUCTS
      category: 'anillos',
      collection: 'Colección Imperial',
      price: -50,
      currency: 'USD',
      short_description: 'Short',
      description: 'Too short',
      material: 'Oro Amarillo 18k',
      cover_image: '',
      images: [],
      availability: 'disponible',
      featured: false,
      specifications: {},
    };

    const result = validateProductForm(invalidData, PRODUCTS);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.slug).toBeDefined();
    expect(result.errors.reference).toBeDefined();
    expect(result.errors.price).toBeDefined();
    expect(result.errors.short_description).toBeDefined();
    expect(result.errors.description).toBeDefined();
    expect(result.errors.cover_image).toBeDefined();
  });

  it('allows matching SKU when editing the same item', () => {
    const editingData: ProductFormData = {
      name: 'Producto Demo 1 Editado',
      slug: 'producto-demo-uno-editado',
      reference: 'REF-0101', // Existing SKU of prod-01
      category: 'categoria-1',
      collection: 'Colección General',
      price: 2100,
      currency: 'USD',
      short_description: 'Descripción corta editada para el producto de prueba.',
      description: 'Descripción completa editada para validar que el propio SKU no se marca como duplicado.',
      material: 'Estándar',
      cover_image: '/assets/products/placeholder-1.svg',
      images: ['/assets/products/placeholder-1.svg'],
      availability: 'disponible',
      featured: true,
      specifications: {},
    };

    const result = validateProductForm(editingData, PRODUCTS, 'prod-01');
    expect(result.isValid).toBe(true);
    expect(result.errors.reference).toBeUndefined();
  });
});
