import { Product } from '../types/catalog';
import { ProductFormData, FormValidationErrors } from '../types/admin';

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function validateProductForm(
  data: ProductFormData,
  existingProducts: Product[] = [],
  editingId?: string
): { isValid: boolean; errors: FormValidationErrors } {
  const errors: FormValidationErrors = {};

  // 1. Name validation
  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'El nombre debe contener al menos 3 caracteres.';
  }

  // 2. Slug validation
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!data.slug || !slugRegex.test(data.slug.trim())) {
    errors.slug = 'El slug solo puede contener letras minúsculas, números y guiones (ej. anillo-solitario).';
  } else {
    const slugExists = existingProducts.some(
      (p) => p.slug === data.slug.trim() && p.id !== editingId
    );
    if (slugExists) {
      errors.slug = 'Este slug ya está en uso por otra pieza del catálogo.';
    }
  }

  // 3. Reference SKU validation
  if (!data.reference || data.reference.trim().length < 2) {
    errors.reference = 'La referencia SKU es obligatoria (ej. REF-EMP-0101).';
  } else {
    const refExists = existingProducts.some(
      (p) => p.reference.toUpperCase() === data.reference.trim().toUpperCase() && p.id !== editingId
    );
    if (refExists) {
      errors.reference = 'Esta referencia SKU ya está asignada a otra pieza.';
    }
  }

  // 4. Category validation
  const validCategories = ['anillos', 'collares', 'pulseras', 'aretes', 'alta-joyeria'];
  if (!data.category || !validCategories.includes(data.category)) {
    errors.category = 'Seleccione una categoría válida.';
  }

  // 5. Collection validation
  if (!data.collection || data.collection.trim().length < 2) {
    errors.collection = 'Especifique la colección a la que pertenece la pieza.';
  }

  // 6. Price validation
  const numPrice = typeof data.price === 'string' ? parseFloat(data.price) : data.price;
  if (isNaN(numPrice) || numPrice <= 0) {
    errors.price = 'Ingrese un precio válido mayor a 0.';
  }

  // 7. Short description validation
  if (!data.short_description || data.short_description.trim().length < 10) {
    errors.short_description = 'La descripción corta debe tener al menos 10 caracteres.';
  } else if (data.short_description.length > 200) {
    errors.short_description = 'La descripción corta no debe exceder 200 caracteres.';
  }

  // 8. Description validation
  if (!data.description || data.description.trim().length < 20) {
    errors.description = 'La descripción editorial completa debe tener al menos 20 caracteres.';
  }

  // 9. Material validation
  if (!data.material) {
    errors.material = 'Seleccione un material noble.';
  }

  // 10. Cover Image validation
  if (!data.cover_image || data.cover_image.trim().length < 3) {
    errors.cover_image = 'Debe especificar una imagen principal de portada.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
