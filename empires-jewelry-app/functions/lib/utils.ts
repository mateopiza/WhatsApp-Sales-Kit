import { Product, Material, ApiResponse } from './types';

export function jsonResponse<T>(data: ApiResponse<T>, status: number = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  });
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function validateProductPayload(body: any): { valid: boolean; error?: string; sanitizedProduct?: Product } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Cuerpo de la solicitud inválido' };
  }

  const {
    name,
    reference,
    category,
    collection,
    price,
    currency = 'USD',
    short_description,
    description,
    material,
    cover_image,
    images = [],
    availability = 'disponible',
    featured = false,
    badge,
    specifications = {},
  } = body;

  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    return { valid: false, error: 'El nombre debe tener al menos 3 caracteres' };
  }

  if (!reference || typeof reference !== 'string' || reference.trim().length < 2) {
    return { valid: false, error: 'La referencia SKU es obligatoria' };
  }

  const validCategories = ['anillos', 'collares', 'pulseras', 'aretes', 'alta-joyeria'];
  if (!category || !validCategories.includes(category)) {
    return { valid: false, error: 'Categoría no válida. Opciones: ' + validCategories.join(', ') };
  }

  if (!collection || typeof collection !== 'string' || collection.trim().length < 2) {
    return { valid: false, error: 'La colección es obligatoria' };
  }

  const numPrice = Number(price);
  if (isNaN(numPrice) || numPrice <= 0) {
    return { valid: false, error: 'El precio debe ser un número mayor a 0' };
  }

  if (!short_description || typeof short_description !== 'string' || short_description.trim().length < 10) {
    return { valid: false, error: 'La descripción corta debe tener al menos 10 caracteres' };
  }

  if (!description || typeof description !== 'string' || description.trim().length < 20) {
    return { valid: false, error: 'La descripción completa debe tener al menos 20 caracteres' };
  }

  if (!material || typeof material !== 'string') {
    return { valid: false, error: 'El material es obligatorio' };
  }

  if (!cover_image || typeof cover_image !== 'string' || cover_image.trim().length < 3) {
    return { valid: false, error: 'La imagen de portada es obligatoria' };
  }

  const id = body.id || `emp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const slug = body.slug ? generateSlug(body.slug) : generateSlug(name);

  const sanitizedProduct: Product = {
    id,
    slug,
    name: name.trim(),
    reference: reference.trim().toUpperCase(),
    category,
    collection: collection.trim(),
    price: numPrice,
    currency: (currency as any) || 'USD',
    short_description: short_description.trim(),
    description: description.trim(),
    material: material as Material,
    cover_image: cover_image.trim(),
    images: Array.isArray(images) && images.length > 0 ? images : [cover_image.trim()],
    availability,
    featured: Boolean(featured),
    badge: badge ? String(badge).trim() : undefined,
    specifications: specifications && typeof specifications === 'object' ? specifications : {},
  };

  return { valid: true, sanitizedProduct };
}

export function validateProductUpdates(body: any): { valid: boolean; error?: string; sanitizedUpdates?: Partial<Product> } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Cuerpo de la solicitud inválido' };
  }

  const updates: Partial<Product> = {};

  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length < 3) {
      return { valid: false, error: 'El nombre debe tener al menos 3 caracteres' };
    }
    updates.name = body.name.trim();
  }

  if (body.slug !== undefined) {
    updates.slug = generateSlug(body.slug);
  } else if (body.name && !body.slug) {
    updates.slug = generateSlug(body.name);
  }

  if (body.reference !== undefined) {
    if (typeof body.reference !== 'string' || body.reference.trim().length < 2) {
      return { valid: false, error: 'La referencia SKU no es válida' };
    }
    updates.reference = body.reference.trim().toUpperCase();
  }

  if (body.category !== undefined) {
    const validCategories = ['anillos', 'collares', 'pulseras', 'aretes', 'alta-joyeria'];
    if (!validCategories.includes(body.category)) {
      return { valid: false, error: 'Categoría no válida' };
    }
    updates.category = body.category;
  }

  if (body.collection !== undefined) updates.collection = String(body.collection).trim();
  if (body.price !== undefined) {
    const p = Number(body.price);
    if (isNaN(p) || p <= 0) return { valid: false, error: 'El precio debe ser mayor a 0' };
    updates.price = p;
  }
  if (body.currency !== undefined) updates.currency = body.currency;
  if (body.short_description !== undefined) updates.short_description = String(body.short_description).trim();
  if (body.description !== undefined) updates.description = String(body.description).trim();
  if (body.material !== undefined) updates.material = body.material;
  if (body.cover_image !== undefined) updates.cover_image = String(body.cover_image).trim();
  if (body.images !== undefined && Array.isArray(body.images)) updates.images = body.images;
  if (body.availability !== undefined) updates.availability = body.availability;
  if (body.featured !== undefined) updates.featured = Boolean(body.featured);
  if (body.badge !== undefined) updates.badge = body.badge ? String(body.badge).trim() : undefined;
  if (body.specifications !== undefined) updates.specifications = body.specifications;

  return { valid: true, sanitizedUpdates: updates };
}
