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
      description: 'Una pieza de alta joyería concebida para deslumbrar en ocasiones de gala.',
      material: 'Oro Amarillo 18k',
      cover_image: '/assets/hero/hero-necklace-rings.png',
      images: ['/assets/hero/hero-necklace-rings.png'],
      availability: 'disponible',
      featured: true,
      specifications: {
        carats: '1.00 ct',
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
      reference: 'REF-EMP-0101', // Already exists in PRODUCTS
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
      name: 'Gargantilla Solitario Aureum Editada',
      slug: 'gargantilla-solitario-aureum-diamante',
      reference: 'REF-EMP-0101', // Existing SKU of emp-01
      category: 'collares',
      collection: 'Esencia Áurea',
      price: 2100,
      currency: 'USD',
      short_description: 'Cadena veneciana en oro amarillo 18k con diamante solitario.',
      description: 'Una pieza fundamental de la orfebrería contemporánea con acabado exclusivo.',
      material: 'Oro Amarillo 18k',
      cover_image: '/assets/hero/hero-necklace-rings.png',
      images: ['/assets/hero/hero-necklace-rings.png'],
      availability: 'disponible',
      featured: true,
      specifications: {},
    };

    const result = validateProductForm(editingData, PRODUCTS, 'emp-01');
    expect(result.isValid).toBe(true);
    expect(result.errors.reference).toBeUndefined();
  });
});
