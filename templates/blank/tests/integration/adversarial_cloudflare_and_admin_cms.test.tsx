import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act, renderHook } from '@testing-library/react';
import App from '../../src/App';
import { onRequestPost as authPost, onRequestGet as authGet } from '../../functions/api/auth';
import { onRequestPost as productsPost } from '../../functions/api/products';
import {
  onRequestPut as productItemPut,
  onRequestDelete as productItemDelete,
} from '../../functions/api/products/[id]';
import { generateAuthToken } from '../../functions/lib/auth';
import { Env } from '../../functions/lib/types';
import { apiService } from '../../src/services/api';
import { safeStorage } from '../../src/utils/storage';
import { PRODUCTS } from '../../src/data/products';
import { AdminProvider, useAdmin } from '../../src/context/AdminContext';
import { MemoryStorageEngine } from '../../functions/lib/storage/memory-engine';

describe('Adversarial Security, Edge Cases & Resilience Suite', () => {
  const secret = 'test-secret-key-2026';
  const env: Env = {
    AUTH_SECRET: secret,
    ADMIN_PIN: 'demo2026',
    ADMIN_PASSWORD: 'admin-password-2026',
    ENVIRONMENT: 'test',
  };

  let validAdminToken = '';

  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();
    safeStorage.clear();
    apiService.saveLocalCatalog([...PRODUCTS]);

    // Generate valid admin token for API tests
    const exp = Date.now() + 24 * 60 * 60 * 1000;
    validAdminToken = await generateAuthToken({ role: 'admin', expiresAt: exp }, secret);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // =========================================================================
  // CATEGORY 1: CLOUDFLARE API HANDLER SECURITY & ADVERSARIAL PAYLOADS
  // =========================================================================
  describe('Category 1: Cloudflare API Handler Security & Adversarial Payloads', () => {
    it('AUTH-01: Rejects POST /api/products without Authorization header with 401', async () => {
      const req = new Request('http://localhost/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Collar Diamantes Oro',
          reference: 'REF-UNAUTH-01',
          category: 'collares',
          collection: 'Imperial',
          price: 5000,
          short_description: 'Collar en oro amarillo 18k.',
          description: 'Collar exclusivo con diamantes naturales certificados.',
          material: 'Oro Amarillo 18k',
          cover_image: '/assets/hero/hero-necklace-rings.png',
        }),
      });

      const res = await productsPost({ request: req, env } as any);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain('Unauthorized');
    });

    it('AUTH-02: Rejects PUT /api/products/:id without Authorization header with 401', async () => {
      const req = new Request('http://localhost/api/products/emp-01', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: 2990 }),
      });

      const res = await productItemPut({ request: req, env, params: { id: 'emp-01' } } as any);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('AUTH-03: Rejects DELETE /api/products/:id without Authorization header with 401', async () => {
      const req = new Request('http://localhost/api/products/emp-01', {
        method: 'DELETE',
      });

      const res = await productItemDelete({ request: req, env, params: { id: 'emp-01' } } as any);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('AUTH-04: Rejects GET /api/auth with forged HMAC signature (wrong secret)', async () => {
      const forgedToken = await generateAuthToken(
        { role: 'admin', expiresAt: Date.now() + 100000 },
        'wrong-secret-key-attacker'
      );

      const req = new Request('http://localhost/api/auth', {
        method: 'GET',
        headers: { Authorization: `Bearer ${forgedToken}` },
      });

      const res = await authGet({ request: req, env } as any);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain('Firma de token inválida');
    });

    it('AUTH-05: Rejects malformed and truncated tokens with 401', async () => {
      const malformedTokens = [
        'Bearer ',
        'Bearer invalid-token-string',
        'Bearer header.payload', // missing signature
        'Bearer header.payload.sig.extra', // 4 parts
        'not-a-bearer-token',
        'Bearer %%%invalid_base64$$$.payload.sig',
      ];

      for (const token of malformedTokens) {
        const req = new Request('http://localhost/api/auth', {
          method: 'GET',
          headers: { Authorization: token },
        });

        const res = await authGet({ request: req, env } as any);
        expect(res.status).toBe(401);
        const json = await res.json();
        expect(json.success).toBe(false);
      }
    });

    it('AUTH-06: Rejects expired tokens with 401', async () => {
      // Token expired 1 hour ago
      const expiredToken = await generateAuthToken(
        { role: 'admin', expiresAt: Date.now() - 3600 * 1000 },
        secret
      );

      const req = new Request('http://localhost/api/auth', {
        method: 'GET',
        headers: { Authorization: `Bearer ${expiredToken}` },
      });

      const res = await authGet({ request: req, env } as any);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain('Token expirado');
    });

    it('JSON-01: Rejects malformed / unparseable JSON in POST /api/auth with 400', async () => {
      const req = new Request('http://localhost/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{"pin": "demo2026", broken_json: ',
      });

      const res = await authPost({ request: req, env } as any);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toBe('Invalid JSON payload');
    });

    it('JSON-02: Rejects malformed JSON in POST /api/products with 400', async () => {
      const req = new Request('http://localhost/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validAdminToken}`,
        },
        body: '{"name": "Anillo Malformado',
      });

      const res = await productsPost({ request: req, env } as any);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('JSON-03: Rejects malformed JSON in PUT /api/products/:id with 400', async () => {
      const req = new Request('http://localhost/api/products/emp-01', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validAdminToken}`,
        },
        body: 'invalid-non-json-payload',
      });

      const res = await productItemPut({ request: req, env, params: { id: 'emp-01' } } as any);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('INJ-01: SQL injection strings in product fields are safely stored as pure data without crashes', async () => {
      const injectionPayload = {
        name: "Anillo'; DROP TABLE products; --",
        reference: "REF-SQL-01' OR '1'='1",
        category: 'anillos',
        collection: "Colección' UNION SELECT * FROM users; --",
        price: 1500,
        currency: 'USD',
        short_description: "Breve descripción con comillas ' y caracteres especiales \" \\",
        description: "Descripción orfebre con payload SQL: Robert'); DROP TABLE Students;--",
        material: 'Oro Amarillo 18k',
        cover_image: '/assets/products/packaging-box.png',
        images: ['/assets/products/packaging-box.png'],
        availability: 'disponible',
      };

      const req = new Request('http://localhost/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validAdminToken}`,
        },
        body: JSON.stringify(injectionPayload),
      });

      const res = await productsPost({ request: req, env } as any);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.name).toBe("Anillo'; DROP TABLE products; --");
      expect(json.data.reference).toBe("REF-SQL-01' OR '1'='1".toUpperCase());
    });

    it('INJ-02: Handles XSS and script payload characters cleanly as text', async () => {
      const xssPayload = {
        name: '<script>alert("xss")</script> Joya',
        reference: 'REF-XSS-99',
        category: 'aretes',
        collection: 'Colección <svg onload=alert(1)>',
        price: 980,
        short_description: '<iframe src="javascript:alert(1)"></iframe> Resumen de prueba',
        description: '<img src=x onerror=alert(1)> Descripción orfebre extensa y segura.',
        material: 'Plata Esterlina 925',
        cover_image: '/assets/products/packaging-box.png',
      };

      const req = new Request('http://localhost/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validAdminToken}`,
        },
        body: JSON.stringify(xssPayload),
      });

      const res = await productsPost({ request: req, env } as any);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.name).toContain('<script>');
    });

    it('VAL-01: Rejects negative prices with 400 Bad Request', async () => {
      const invalidPrices = [-1, -500, -0.01, -99999];

      for (const p of invalidPrices) {
        const req = new Request('http://localhost/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${validAdminToken}`,
          },
          body: JSON.stringify({
            name: 'Joya Precio Negativo',
            reference: `REF-NEG-${Math.abs(p)}`,
            category: 'collares',
            collection: 'Test',
            price: p,
            short_description: 'Descripción corta válida para test.',
            description: 'Descripción completa detallada de más de 20 caracteres.',
            material: 'Oro Blanco 18k',
            cover_image: '/assets/hero/hero-necklace-rings.png',
          }),
        });

        const res = await productsPost({ request: req, env } as any);
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.success).toBe(false);
        expect(json.error).toContain('precio');
      }
    });

    it('VAL-02: Rejects zero and non-numeric prices with 400 Bad Request', async () => {
      const nonNumericPrices = [0, 'gratis', 'NaN', 'undefined', null, {}];

      for (const p of nonNumericPrices) {
        const req = new Request('http://localhost/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${validAdminToken}`,
          },
          body: JSON.stringify({
            name: 'Joya Precio Inválido',
            reference: 'REF-PRICE-INV',
            category: 'collares',
            collection: 'Test',
            price: p,
            short_description: 'Descripción corta válida para test.',
            description: 'Descripción completa detallada de más de 20 caracteres.',
            material: 'Oro Blanco 18k',
            cover_image: '/assets/hero/hero-necklace-rings.png',
          }),
        });

        const res = await productsPost({ request: req, env } as any);
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.success).toBe(false);
      }
    });

    it('VAL-03: Rejects missing or blank required fields with 400 Bad Request', async () => {
      const testCases = [
        { payload: { reference: 'REF-01', price: 100 }, expectedErr: 'nombre' },
        { payload: { name: '  ', reference: 'REF-01', price: 100 }, expectedErr: 'nombre' },
        { payload: { name: 'Anillo', reference: '', price: 100 }, expectedErr: 'referencia' },
        { payload: { name: 'Anillo', reference: 'REF-01', category: '', price: 100 }, expectedErr: 'Categoría' },
        { payload: { name: 'Anillo', reference: 'REF-01', category: 'categoria-1', collection: '', price: 100 }, expectedErr: 'colección' },
        { payload: { name: 'Anillo', reference: 'REF-01', category: 'categoria-1', collection: 'Col', price: 100, short_description: 'Corta' }, expectedErr: 'corta' },
        { payload: { name: 'Anillo', reference: 'REF-01', category: 'categoria-1', collection: 'Col', price: 100, short_description: 'Valida con diez', description: 'Muy corta' }, expectedErr: 'completa' },
      ];

      for (const tc of testCases) {
        const req = new Request('http://localhost/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${validAdminToken}`,
          },
          body: JSON.stringify(tc.payload),
        });

        const res = await productsPost({ request: req, env } as any);
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.success).toBe(false);
        expect(json.error.toLowerCase()).toContain(tc.expectedErr.toLowerCase());
      }
    });
  });

  // =========================================================================
  // CATEGORY 2: ADMIN CMS EDGE CASES & STRESS SCENARIOS
  // =========================================================================
  describe('Category 2: Admin CMS Edge Cases, Concurrency & Rate Limiting', () => {
    it('CMS-01: Rapid consecutive product creations (50 concurrent pieces) succeed without corruption', async () => {
      const memoryStorage = new MemoryStorageEngine();
      await memoryStorage.init();

      const promises = Array.from({ length: 50 }).map((_, i) => {
        return memoryStorage.createProduct({
          id: `stress-prod-${i}`,
          slug: `stress-prod-${i}`,
          name: `Joya Concurrente #${i}`,
          reference: `REF-STRESS-${i.toString().padStart(4, '0')}`,
          category: 'anillos',
          collection: 'Stress Test Collection',
          price: 1000 + i * 10,
          currency: 'USD',
          short_description: `Resumen de prueba concurrente pieza #${i}.`,
          description: `Descripción detallada orfebre para la prueba de estrés de la pieza #${i}.`,
          material: 'Oro Amarillo 18k',
          cover_image: '/assets/hero/hero-necklace-rings.png',
          images: ['/assets/hero/hero-necklace-rings.png'],
          availability: 'disponible',
          featured: i % 2 === 0,
          specifications: {},
        });
      });

      const results = await Promise.all(promises);
      expect(results.length).toBe(50);

      const all = await memoryStorage.getAllProducts();
      expect(all.length).toBeGreaterThanOrEqual(50);
      for (let i = 0; i < 50; i++) {
        expect(all.some((p) => p.id === `stress-prod-${i}`)).toBe(true);
      }
    });

    it('CMS-02: Deleting a non-existent product ID via API returns 404', async () => {
      const req = new Request('http://localhost/api/products/non-existent-product-id-99999', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${validAdminToken}` },
      });

      const res = await productItemDelete({
        request: req,
        env,
        params: { id: 'non-existent-product-id-99999' },
      } as any);

      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain('no encontrada');
    });

    it('CMS-03: Creating a product with duplicate SKU reference returns 409 Conflict', async () => {
      // First creation
      const payload1 = {
        name: 'Pieza Original SKU',
        reference: 'REF-DUPLICATE-SKU',
        category: 'collares',
        collection: 'Colección Test',
        price: 2500,
        short_description: 'Descripción corta para test de duplicado SKU.',
        description: 'Descripción orfebre extendida para el test de unicidad de referencia SKU.',
        material: 'Oro Blanco 18k',
        cover_image: '/assets/hero/hero-necklace-rings.png',
      };

      const req1 = new Request('http://localhost/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validAdminToken}`,
        },
        body: JSON.stringify(payload1),
      });
      const res1 = await productsPost({ request: req1, env } as any);
      expect(res1.status).toBe(201);

      // Duplicate creation with same SKU
      const payload2 = {
        ...payload1,
        name: 'Pieza Clon SKU',
      };
      const req2 = new Request('http://localhost/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validAdminToken}`,
        },
        body: JSON.stringify(payload2),
      });
      const res2 = await productsPost({ request: req2, env } as any);
      expect(res2.status).toBe(409);
      const json2 = await res2.json();
      expect(json2.success).toBe(false);
      expect(json2.error).toContain('ya existe');
    });

    it('CMS-04: Updating a product to an existing SKU reference returns 409 Conflict', async () => {
      // Create Piece A
      const reqA = new Request('http://localhost/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validAdminToken}`,
        },
        body: JSON.stringify({
          id: 'emp-piece-a',
          name: 'Pieza A',
          reference: 'REF-UNIQUE-A',
          category: 'collares',
          collection: 'Test',
          price: 2000,
          short_description: 'Descripción corta para pieza A.',
          description: 'Descripción orfebre extendida de pieza A.',
          material: 'Oro Amarillo 18k',
          cover_image: '/assets/hero/hero-necklace-rings.png',
        }),
      });
      await productsPost({ request: reqA, env } as any);

      // Create Piece B
      const reqB = new Request('http://localhost/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validAdminToken}`,
        },
        body: JSON.stringify({
          id: 'emp-piece-b',
          name: 'Pieza B',
          reference: 'REF-UNIQUE-B',
          category: 'collares',
          collection: 'Test',
          price: 2000,
          short_description: 'Descripción corta para pieza B.',
          description: 'Descripción orfebre extendida de pieza B.',
          material: 'Oro Amarillo 18k',
          cover_image: '/assets/hero/hero-necklace-rings.png',
        }),
      });
      await productsPost({ request: reqB, env } as any);

      // Try updating Piece B to have Piece A's SKU 'REF-UNIQUE-A'
      const updateReq = new Request('http://localhost/api/products/emp-piece-b', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validAdminToken}`,
        },
        body: JSON.stringify({ reference: 'REF-UNIQUE-A' }),
      });

      const updateRes = await productItemPut({
        request: updateReq,
        env,
        params: { id: 'emp-piece-b' },
      } as any);

      expect(updateRes.status).toBe(409);
      const json = await updateRes.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain('asignada');
    });

    it('CMS-05: Updating a product without changing its own SKU does not trigger conflict', async () => {
      const updateReq = new Request('http://localhost/api/products/emp-piece-a', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validAdminToken}`,
        },
        body: JSON.stringify({ reference: 'REF-UNIQUE-A', price: 2850 }),
      });

      const updateRes = await productItemPut({
        request: updateReq,
        env,
        params: { id: 'emp-piece-a' },
      } as any);

      expect(updateRes.status).toBe(200);
      const json = await updateRes.json();
      expect(json.success).toBe(true);
      expect(json.data.price).toBe(2850);
    });

    it('CMS-06: Rate limiting lockout is enforced after exactly 5 invalid PIN attempts', async () => {
      const { result } = renderHook(() => useAdmin(), {
        wrapper: ({ children }) => <AdminProvider>{children}</AdminProvider>,
      });

      expect(result.current.attemptsCount).toBe(0);
      expect(result.current.isLocked).toBe(false);

      // Attempt 1
      let res1 = await act(async () => result.current.login('wrong-pin-1'));
      expect(res1.success).toBe(false);
      expect(res1.error).toContain('Intentos restantes: 4');
      expect(result.current.attemptsCount).toBe(1);
      expect(result.current.isLocked).toBe(false);

      // Attempt 2
      let res2 = await act(async () => result.current.login('wrong-pin-2'));
      expect(res2.success).toBe(false);
      expect(res2.error).toContain('Intentos restantes: 3');
      expect(result.current.attemptsCount).toBe(2);

      // Attempt 3
      let res3 = await act(async () => result.current.login('wrong-pin-3'));
      expect(res3.success).toBe(false);
      expect(res3.error).toContain('Intentos restantes: 2');
      expect(result.current.attemptsCount).toBe(3);

      // Attempt 4
      let res4 = await act(async () => result.current.login('wrong-pin-4'));
      expect(res4.success).toBe(false);
      expect(res4.error).toContain('Intentos restantes: 1');
      expect(result.current.attemptsCount).toBe(4);

      // Attempt 5 -> Enforces lockout
      let res5 = await act(async () => result.current.login('wrong-pin-5'));
      expect(res5.success).toBe(false);
      expect(res5.error).toContain('bloqueado por 5 minutos');
      expect(result.current.attemptsCount).toBe(5);
      expect(result.current.isLocked).toBe(true);
      expect(result.current.lockoutRemainingSeconds).toBeGreaterThan(0);

      // Attempt 6 (Even with the REAL PIN 'demo2026') -> Must be blocked!
      let res6 = await act(async () => result.current.login('demo2026'));
      expect(res6.success).toBe(false);
      expect(res6.error).toContain('Acceso bloqueado por demasiados intentos fallidos');
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('CMS-07: Rate limiting lockout persists across session/provider reloads', async () => {
      // Setup lockout in storage
      const lockUntil = Date.now() + 300 * 1000;
      safeStorage.setItem(
        'store_admin_attempts',
        JSON.stringify({ count: 5, lockedUntil: lockUntil })
      );

      const { result } = renderHook(() => useAdmin(), {
        wrapper: ({ children }) => <AdminProvider>{children}</AdminProvider>,
      });

      expect(result.current.isLocked).toBe(true);

      const attempt = await act(async () => result.current.login('demo2026'));
      expect(attempt.success).toBe(false);
      expect(attempt.error).toContain('Acceso bloqueado');
    });
  });

  // =========================================================================
  // CATEGORY 3: MULTI-TIER STORAGE FALLBACK & OFFLINE RESILIENCE
  // =========================================================================
  describe('Category 3: Multi-Tier Storage Fallback & Offline Resilience', () => {
    it('OFFLINE-01: Full network failure in getProducts() transparently falls back to local cache without throwing', async () => {
      // Mock fetch rejection (network offline)
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch (offline network)'));

      const response = await apiService.getProducts();
      expect(response.success).toBe(true);
      expect(response.meta?.tier).toBe('LOCAL_CACHE');
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data!.length).toBeGreaterThan(0);
    });

    it('OFFLINE-02: Offline getProducts with category/price/search filtering applies locally', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

      const response = await apiService.getProducts({
        category: 'categoria-1',
        search: 'Demo',
      });

      expect(response.success).toBe(true);
      expect(response.meta?.tier).toBe('LOCAL_CACHE');
      expect(response.data!.every((p) => p.category === 'categoria-1')).toBe(true);
      expect(response.data!.some((p) => p.name.includes('Demo'))).toBe(true);
    });

    it('OFFLINE-03: Offline getProductById transparently resolves from local cache', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

      const response = await apiService.getProductById('prod-01');
      expect(response.success).toBe(true);
      expect(response.meta?.tier).toBe('LOCAL_CACHE');
      expect(response.data?.id).toBe('prod-01');
      expect(response.data?.name).toBe(PRODUCTS[0].name);
    });

    it('OFFLINE-04: Offline createProduct saves to local cache and returns LOCAL_CACHE tier', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

      const newProductPayload = {
        id: 'emp-offline-01',
        name: 'Brazalete Orfebre Offline',
        reference: 'REF-OFFLINE-01',
        category: 'pulseras' as const,
        collection: 'Offline Collection',
        price: 2100,
        currency: 'USD' as const,
        short_description: 'Brazalete creado durante desconexión de red.',
        description: 'Brazalete esculpido a mano en oro rosa de 18k con acabado satinado.',
        material: 'Oro Rosa 18k' as const,
        cover_image: '/assets/products/packaging-box.png',
      };

      const response = await apiService.createProduct(newProductPayload);
      expect(response.success).toBe(true);
      expect(response.meta?.tier).toBe('LOCAL_CACHE');
      expect(response.data?.id).toBe('emp-offline-01');

      // Verify it is in local cache
      const localCatalog = apiService.getLocalCatalog();
      expect(localCatalog.some((p) => p.id === 'emp-offline-01')).toBe(true);
    });

    it('OFFLINE-05: Offline updateProduct updates local cache and returns updated product', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

      const updateRes = await apiService.updateProduct('prod-01', {
        price: 3890,
        name: 'Producto Demo 1 Editado Offline',
      });

      expect(updateRes.success).toBe(true);
      expect(updateRes.meta?.tier).toBe('LOCAL_CACHE');
      expect(updateRes.data?.price).toBe(3890);

      const localCatalog = apiService.getLocalCatalog();
      const updatedItem = localCatalog.find((p) => p.id === 'prod-01');
      expect(updatedItem?.price).toBe(3890);
      expect(updatedItem?.name).toBe('Producto Demo 1 Editado Offline');
    });

    it('OFFLINE-06: Offline deleteProduct removes product from local cache', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

      const deleteRes = await apiService.deleteProduct('emp-02');
      expect(deleteRes.success).toBe(true);
      expect(deleteRes.meta?.tier).toBe('LOCAL_CACHE');
      expect(deleteRes.data?.deletedId).toBe('emp-02');

      const localCatalog = apiService.getLocalCatalog();
      expect(localCatalog.some((p) => p.id === 'emp-02')).toBe(false);
    });

    it('OFFLINE-07: Offline login supports master PINs (demo2026, 1879) and issues mock token', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

      const res = await apiService.login('demo2026');
      expect(res.success).toBe(true);
      expect(res.data?.authenticated).toBe(true);
      expect(res.data?.token).toMatch(/^mock-token-/);

      const res2 = await apiService.login('1879');
      expect(res2.success).toBe(true);

      const resBad = await apiService.login('bad-offline-pin');
      expect(resBad.success).toBe(false);
    });

    it('OFFLINE-08: Complete React UI Admin Flow survives total network disconnection without crash', async () => {
      // Mock fetch failure for entire UI lifecycle
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Network disconnected'));

      render(<App />);

      // 1. Open Admin Modal
      const adminTriggerBtn = screen.getByLabelText(/Portal de Administración CMS/i);
      fireEvent.click(adminTriggerBtn);

      // 2. Login offline
      const pinInput = screen.getByPlaceholderText(/••••••••/i);
      fireEvent.change(pinInput, { target: { value: 'demo2026' } });
      const submitBtn = screen.getByRole('button', { name: /Acceder al Gestor/i });

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      // 3. Admin dashboard loads from local cache
      await waitFor(() => {
        expect(screen.getByText(/Gestión de Catálogo/i)).toBeInTheDocument();
      });

      // 4. Create product offline in UI
      const newProductTab = screen.getByRole('button', { name: /Nuevo Producto/i });
      fireEvent.click(newProductTab);

      const nameInput = screen.getByPlaceholderText(/Ej. Producto Demo/i);
      fireEvent.change(nameInput, { target: { value: 'Producto Offline Creado' } });

      const refInput = screen.getByPlaceholderText(/REF-0101/i);
      fireEvent.change(refInput, { target: { value: 'REF-OFFLINE-UI-01' } });

      // Pricing tab
      const pricingTab = screen.getByRole('button', { name: /2. Precio & Estado/i });
      fireEvent.click(pricingTab);
      const priceInput = screen.getByPlaceholderText(/^99$/i);
      fireEvent.change(priceInput, { target: { value: '4500' } });

      // Description tab
      const narrativeTab = screen.getByRole('button', { name: /3. Descripción/i });
      fireEvent.click(narrativeTab);
      const shortDescInput = screen.getByPlaceholderText(/Resumen para tarjetas de catálogo/i);
      fireEvent.change(shortDescInput, {
        target: { value: 'Producto creado con red desconectada.' },
      });
      const descInput = screen.getByPlaceholderText(/Historia del producto, detalles de confección/i);
      fireEvent.change(descInput, {
        target: { value: 'Creado durante una prueba de resiliencia offline completa.' },
      });

      // Publish product
      const publishBtn = screen.getByRole('button', { name: /Publicar Producto/i });
      await act(async () => {
        fireEvent.click(publishBtn);
      });

      // 5. Product appears in table
      await waitFor(() => {
        expect(screen.getAllByText(/Producto Offline Creado/i).length).toBeGreaterThan(0);
      });

      // 6. Close admin modal -> Product is displayed in catalog
      const closeAdminBtn = screen.getByLabelText(/Cerrar portal de administración/i);
      fireEvent.click(closeAdminBtn);

      await waitFor(() => {
        expect(screen.getAllByText(/Producto Offline Creado/i).length).toBeGreaterThan(0);
      });
    });
  });
});
