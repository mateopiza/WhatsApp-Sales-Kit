import { PagesFunction, Env } from '../../lib/types';
import { getStorageEngine } from '../../lib/storage';
import { verifyAuthToken } from '../../lib/auth';
import { validateProductUpdates, jsonResponse } from '../../lib/utils';

export const onRequestGet: PagesFunction<Env, 'id'> = async (context) => {
  const { params, env } = context;
  const idOrSlug = params?.id as string;

  if (!idOrSlug) {
    return jsonResponse({ success: false, error: 'Identificador de producto requerido' }, 400);
  }

  const storage = getStorageEngine(env);
  await storage.init();

  let product = await storage.getProductById(idOrSlug);
  if (!product) {
    product = await storage.getProductBySlug(idOrSlug);
  }

  if (!product) {
    return jsonResponse({ success: false, error: `Pieza '${idOrSlug}' no encontrada` }, 404);
  }

  return jsonResponse({
    success: true,
    data: product,
    meta: {
      tier: storage.tierName,
      timestamp: new Date().toISOString(),
    },
  });
};

export const onRequestPut: PagesFunction<Env, 'id'> = async (context) => {
  const { params, request, env } = context;
  const id = params?.id as string;

  if (!id) {
    return jsonResponse({ success: false, error: 'Identificador de producto requerido' }, 400);
  }

  // Verify Admin Auth
  const authHeader = request.headers.get('Authorization');
  const secret = env?.AUTH_SECRET || 'demo-secret-key-2026';
  const authResult = await verifyAuthToken(authHeader, secret);
  if (!authResult.valid) {
    return jsonResponse({ success: false, error: 'Unauthorized: Token de administrador requerido' }, 401);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ success: false, error: 'Cuerpo de solicitud JSON inválido' }, 400);
  }

  const validation = validateProductUpdates(body);
  if (!validation.valid || !validation.sanitizedUpdates) {
    return jsonResponse({ success: false, error: validation.error || 'Validación fallida' }, 400);
  }

  const storage = getStorageEngine(env);
  await storage.init();

  // Check SKU uniqueness if updating SKU
  if (validation.sanitizedUpdates.reference) {
    const existing = await storage.getAllProducts();
    const conflict = existing.some(
      (p) => p.id !== id && p.reference.toUpperCase() === validation.sanitizedUpdates!.reference!.toUpperCase()
    );
    if (conflict) {
      return jsonResponse({ success: false, error: 'La referencia SKU ya está asignada a otra pieza' }, 409);
    }
  }

  const updated = await storage.updateProduct(id, validation.sanitizedUpdates);
  if (!updated) {
    return jsonResponse({ success: false, error: `Pieza con ID '${id}' no encontrada` }, 404);
  }

  return jsonResponse({
    success: true,
    data: updated,
    meta: {
      tier: storage.tierName,
      timestamp: new Date().toISOString(),
    },
  });
};

export const onRequestDelete: PagesFunction<Env, 'id'> = async (context) => {
  const { params, request, env } = context;
  const id = params?.id as string;

  if (!id) {
    return jsonResponse({ success: false, error: 'Identificador de producto requerido' }, 400);
  }

  // Verify Admin Auth
  const authHeader = request.headers.get('Authorization');
  const secret = env?.AUTH_SECRET || 'demo-secret-key-2026';
  const authResult = await verifyAuthToken(authHeader, secret);
  if (!authResult.valid) {
    return jsonResponse({ success: false, error: 'Unauthorized: Token de administrador requerido' }, 401);
  }

  const storage = getStorageEngine(env);
  await storage.init();
  const deleted = await storage.deleteProduct(id);

  if (!deleted) {
    return jsonResponse({ success: false, error: `Pieza con ID '${id}' no encontrada` }, 404);
  }

  return jsonResponse({
    success: true,
    data: { deletedId: id },
    meta: {
      tier: storage.tierName,
      timestamp: new Date().toISOString(),
    },
  });
};
