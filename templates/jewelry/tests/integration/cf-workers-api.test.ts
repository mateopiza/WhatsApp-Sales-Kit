import { describe, it, expect } from 'vitest';
import { onRequest as middleware } from '../../functions/_middleware';
import { onRequestPost as authPost, onRequestGet as authGet } from '../../functions/api/auth';
import { onRequestGet as productsGet, onRequestPost as productsPost } from '../../functions/api/products';
import {
  onRequestGet as productItemGet,
  onRequestPut as productItemPut,
  onRequestDelete as productItemDelete,
} from '../../functions/api/products/[id]';
import { Env } from '../../functions/lib/types';

describe('Cloudflare Pages Functions & Workers REST API Pipeline', () => {
  const env: Env = {
    AUTH_SECRET: 'test-secret-2026',
    ADMIN_PIN: 'empires2026',
    ENVIRONMENT: 'test',
  };

  let adminToken = '';
  const testProductId = 'emp-cf-test-01';

  it('handles CORS preflight OPTIONS requests in middleware', async () => {
    const request = new Request('http://localhost/api/products', { method: 'OPTIONS' });
    const context: any = {
      request,
      env,
      next: async () => new Response('ok'),
    };

    const res = await middleware(context);
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('GET, POST, PUT, DELETE');
  });

  it('authenticates admin and issues signed HMAC-SHA256 token', async () => {
    const request = new Request('http://localhost/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: 'empires2026' }),
    });

    const context: any = { request, env };
    const res = await authPost(context);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.authenticated).toBe(true);
    expect(json.data.token).toBeDefined();

    adminToken = json.data.token;
  });

  it('verifies valid admin token via GET /api/auth', async () => {
    const request = new Request('http://localhost/api/auth', {
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    const context: any = { request, env };
    const res = await authGet(context);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.authenticated).toBe(true);
  });

  it('lists catalog products via GET /api/products with filtering', async () => {
    const request = new Request('http://localhost/api/products?category=anillos', {
      method: 'GET',
    });

    const context: any = { request, env };
    const res = await productsGet(context);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
    json.data.forEach((p: any) => {
      expect(p.category).toBe('anillos');
    });
  });

  it('rejects POST /api/products without admin authorization token', async () => {
    const request = new Request('http://localhost/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Gargantilla No Autorizada',
        reference: 'REF-UNAUTH-01',
      }),
    });

    const context: any = { request, env };
    const res = await productsPost(context);
    expect(res.status).toBe(401);
  });

  it('creates new product via POST /api/products with admin auth', async () => {
    const request = new Request('http://localhost/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        id: testProductId,
        name: 'Gargantilla Esmeralda Imperial',
        reference: 'REF-CF-01',
        category: 'collares',
        collection: 'Colección Imperial',
        price: 3400,
        currency: 'USD',
        short_description: 'Gargantilla en oro amarillo 18k con esmeralda colombiana.',
        description: 'Una pieza única de alta costura que celebra las gemas más preciadas de Colombia.',
        material: 'Oro Amarillo 18k',
        cover_image: '/assets/hero/hero-necklace-rings.png',
        images: ['/assets/hero/hero-necklace-rings.png'],
        availability: 'disponible',
        featured: true,
      }),
    });

    const context: any = { request, env };
    const res = await productsPost(context);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.id).toBe(testProductId);
    expect(json.data.name).toBe('Gargantilla Esmeralda Imperial');
  });

  it('fetches single product via GET /api/products/:id', async () => {
    const request = new Request(`http://localhost/api/products/${testProductId}`, {
      method: 'GET',
    });

    const context: any = {
      request,
      env,
      params: { id: testProductId },
    };

    const res = await productItemGet(context);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.name).toBe('Gargantilla Esmeralda Imperial');
  });

  it('updates product price via PUT /api/products/:id with admin auth', async () => {
    const request = new Request(`http://localhost/api/products/${testProductId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        price: 3950,
      }),
    });

    const context: any = {
      request,
      env,
      params: { id: testProductId },
    };

    const res = await productItemPut(context);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.price).toBe(3950);
  });

  it('deletes product via DELETE /api/products/:id with admin auth', async () => {
    const request = new Request(`http://localhost/api/products/${testProductId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    const context: any = {
      request,
      env,
      params: { id: testProductId },
    };

    const res = await productItemDelete(context);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.deletedId).toBe(testProductId);
  });
});
