import { PagesFunction, Env, ProductFilterParams } from '../lib/types';
import { getStorageEngine } from '../lib/storage';
import { verifyAuthToken } from '../lib/auth';
import { validateProductPayload, jsonResponse } from '../lib/utils';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  const filters: ProductFilterParams = {
    category: url.searchParams.get('category') || undefined,
    material: url.searchParams.get('material') || undefined,
    collection: url.searchParams.get('collection') || undefined,
    availability: url.searchParams.get('availability') || undefined,
    featured: url.searchParams.has('featured')
      ? url.searchParams.get('featured') === 'true' || url.searchParams.get('featured') === '1'
      : undefined,
    search: url.searchParams.get('search') || url.searchParams.get('q') || undefined,
    sort: (url.searchParams.get('sort') as any) || undefined,
    limit: url.searchParams.has('limit') ? parseInt(url.searchParams.get('limit')!, 10) : undefined,
    offset: url.searchParams.has('offset') ? parseInt(url.searchParams.get('offset')!, 10) : undefined,
  };

  const storage = getStorageEngine(env);
  await storage.init();
  const products = await storage.getAllProducts(filters);

  return jsonResponse({
    success: true,
    data: products,
    meta: {
      total: products.length,
      count: products.length,
      offset: filters.offset || 0,
      limit: filters.limit || products.length,
      tier: storage.tierName,
      timestamp: new Date().toISOString(),
    },
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Verify Admin Authentication
  const authHeader = request.headers.get('Authorization');
  const secret = env?.AUTH_SECRET || 'empires-secret-key-2026';
  const authResult = await verifyAuthToken(authHeader, secret);
  if (!authResult.valid) {
    return jsonResponse(
      { success: false, error: 'Unauthorized: Token de autenticación de administrador requerido' },
      401
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ success: false, error: 'Cuerpo de solicitud JSON inválido' }, 400);
  }

  const validation = validateProductPayload(body);
  if (!validation.valid || !validation.sanitizedProduct) {
    return jsonResponse({ success: false, error: validation.error || 'Validación fallida' }, 400);
  }

  const storage = getStorageEngine(env);
  await storage.init();

  // Check SKU uniqueness
  const existingProducts = await storage.getAllProducts();
  const duplicateSKU = existingProducts.some(
    (p) => p.reference.toUpperCase() === validation.sanitizedProduct!.reference.toUpperCase()
  );
  if (duplicateSKU) {
    return jsonResponse({ success: false, error: 'La referencia SKU ya existe en el catálogo' }, 409);
  }

  const createdProduct = await storage.createProduct(validation.sanitizedProduct);

  return jsonResponse(
    {
      success: true,
      data: createdProduct,
      meta: {
        tier: storage.tierName,
        timestamp: new Date().toISOString(),
      },
    },
    201
  );
};
