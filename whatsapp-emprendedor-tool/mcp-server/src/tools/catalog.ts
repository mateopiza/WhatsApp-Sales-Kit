// ─────────────────────────────────────────────────────────────
// tools/catalog.ts — seed_catalog MCP Tool
// Creates or bulk-imports products into a store via the REST API
// ─────────────────────────────────────────────────────────────
import { z } from 'zod';

const ProductSchema = z.object({
  name: z.string().min(1).max(128),
  price: z.number().positive(),
  category: z.enum(['anillos', 'collares', 'pulseras', 'aretes', 'alta-joyeria']),
  description: z.string().max(500).optional().default(''),
  material: z.string().max(64).optional().default(''),
  images: z.array(z.string().url()).optional().default([]),
  featured: z.boolean().optional().default(false),
  availability: z.enum(['disponible', 'bajo-pedido', 'pieza-unica', 'agotado']).optional().default('disponible'),
});

const SeedCatalogSchema = z.object({
  storeApiUrl: z.string().url('storeApiUrl must be the base URL of the store, e.g. http://localhost:3000/api'),
  adminPin: z.string().min(4),
  products: z.array(ProductSchema).min(1).max(100),
});

export const seedCatalogTool = {
  name: 'seed_catalog',
  description: `Creates or bulk-imports products into a running store instance via its REST API.
Use this after deploy_store to populate the catalog with the entrepreneur's products.
Supports up to 100 products per call. Categories: anillos, collares, pulseras, aretes, alta-joyeria.`,
  inputSchema: {
    type: 'object',
    required: ['storeApiUrl', 'adminPin', 'products'],
    properties: {
      storeApiUrl: {
        type: 'string',
        description: "Base URL of the store API, e.g. 'http://localhost:3000/api'",
      },
      adminPin: {
        type: 'string',
        description: 'Admin PIN for authentication with the store API',
      },
      products: {
        type: 'array',
        description: 'Array of products to import',
        items: {
          type: 'object',
          required: ['name', 'price', 'category'],
          properties: {
            name: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string', enum: ['anillos', 'collares', 'pulseras', 'aretes', 'alta-joyeria'] },
            description: { type: 'string' },
            material: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            featured: { type: 'boolean' },
            availability: { type: 'string', enum: ['disponible', 'bajo-pedido', 'pieza-unica', 'agotado'] },
          },
        },
      },
    },
  },
} as const;

export async function handleSeedCatalog(args: Record<string, unknown>): Promise<string> {
  let config;
  try {
    config = SeedCatalogSchema.parse(args);
  } catch (err: any) {
    const issues = err?.issues?.map((i: any) => `• ${i.path.join('.')}: ${i.message}`).join('\n') ?? String(err);
    return `❌ Parámetros inválidos:\n${issues}`;
  }

  // Step 1: Authenticate
  let token: string;
  try {
    const authResponse = await fetch(`${config.storeApiUrl}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: config.adminPin }),
    });
    const authData = (await authResponse.json()) as { success: boolean; data?: { token: string }; error?: string };
    if (!authData.success || !authData.data?.token) {
      return `❌ Autenticación fallida: ${authData.error ?? 'PIN incorrecto'}`;
    }
    token = authData.data.token;
  } catch (err: any) {
    return `❌ No se pudo conectar con la API de la tienda: ${err.message}`;
  }

  // Step 2: Create products one by one
  const results: string[] = [];
  let successCount = 0;
  let failCount = 0;

  for (const product of config.products) {
    try {
      const res = await fetch(`${config.storeApiUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (data.success) {
        successCount++;
      } else {
        failCount++;
        results.push(`  ⚠️ "${product.name}": ${data.error}`);
      }
    } catch (err: any) {
      failCount++;
      results.push(`  ⚠️ "${product.name}": ${err.message}`);
    }
  }

  const summary = [
    `✅ Catálogo importado: ${successCount}/${config.products.length} productos creados.`,
    failCount > 0 ? `\n⚠️ ${failCount} productos con error:` : '',
    ...results,
  ].join('\n');

  return summary;
}
