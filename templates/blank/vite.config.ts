/// <reference types="vitest" />
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Vite Dev Server Middleware Plugin simulating Cloudflare Pages Functions
function devApiPlugin(): Plugin {
  return {
    name: 'vite-plugin-store-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api')) {
          return next();
        }

        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;

        // Parse JSON body if present
        let body: any = null;
        if (req.method === 'POST' || req.method === 'PUT') {
          const buffers: Buffer[] = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const raw = Buffer.concat(buffers).toString();
          if (raw) {
            try {
              body = JSON.parse(raw);
            } catch {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
              return;
            }
          }
        }

        // 1. Auth Endpoint
        if (pathname === '/api/auth') {
          if (req.method === 'POST') {
            const pin = body?.pin || body?.credential || body?.password;
            if (pin === 'demo2026' || pin === '1879') {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  data: {
                    token: `dev-jwt-token-${Date.now()}`,
                    authenticated: true,
                    role: 'admin',
                    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
                  },
                })
              );
              return;
            }
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: false,
                error: 'Credenciales inválidas. Ingrese el PIN de administrador.',
              })
            );
            return;
          }

          if (req.method === 'GET') {
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.includes('Bearer')) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, data: { authenticated: true, role: 'admin' } }));
              return;
            }
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'Token inválido o expirado' }));
            return;
          }
        }

        // Pass through to next middleware if not explicitly matched
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devApiPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    css: true,
  },
  server: {
    port: 3000,
    host: true,
  },
});
