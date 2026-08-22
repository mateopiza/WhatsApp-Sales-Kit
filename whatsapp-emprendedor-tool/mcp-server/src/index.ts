// ─────────────────────────────────────────────────────────────
// index.ts — Empires Jewelry & Fashion MCP Server Entry Point
// ─────────────────────────────────────────────────────────────
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express, { Request, Response } from 'express';
import { z } from 'zod';

import { handleDeployStore } from './tools/deploy.js';
import { handleDeployDokployStore } from './tools/dokploy-deploy.js';
import { handleConfigureBranding } from './tools/branding.js';
import { handleSeedCatalog } from './tools/catalog.js';
import { handleGetStoreStatus } from './tools/monitor.js';
import { provisionStoreOnDokploy } from './utils/dokploy.js';

// ─── Server Definition ────────────────────────────────────────

const server = new McpServer({
  name: 'empires-orchestrator',
  version: '1.2.0',
});

// 1. Tool: deploy_dokploy_store
server.tool(
  'deploy_dokploy_store',
  'Aprovisiona y despliega automáticamente una nueva tienda de Joyería o Ropa en Dokploy con subdominio y SSL.',
  {
    storeName: z.string().describe("Nombre comercial de la marca (ej: 'Joyería Aurelia')"),
    slug: z.string().optional().describe("Subdominio deseado (ej: 'aurelia-joyas')"),
    niche: z.enum(['jewelry', 'clothing']).describe("Nicho del catálogo ('jewelry' o 'clothing')"),
    storeWhatsappPhone: z.string().describe("Teléfono internacional para pedidos (ej: '+573001234567')"),
    storeCurrency: z.enum(['COP', 'USD', 'MXN', 'EUR', 'PEN', 'ARS', 'CLP']).optional().describe('Código ISO de la moneda'),
    storeAdminPin: z.string().min(4).describe('PIN de seguridad para el panel /admin'),
    storePrimaryColor: z.string().optional().describe("Color primario hex (ej: '#D4B48C')"),
    storeAccentColor: z.string().optional().describe("Color secundario hex (ej: '#3A332D')"),
    storeTagline: z.string().optional().describe('Frase o eslogan de la marca'),
    rootDomain: z.string().optional().describe("Dominio base (default: 'empires.app')"),
  },
  async (args) => {
    const text = await handleDeployDokployStore(args);
    return { content: [{ type: 'text', text }] };
  }
);

// 2. Tool: deploy_store (Docker Compose local)
server.tool(
  'deploy_store',
  'Despliega una instancia de tienda local mediante Docker Compose.',
  {
    storeName: z.string().describe("Nombre de la marca, e.g. 'Perla Negra'"),
    storeWhatsappPhone: z.string().describe("Teléfono WhatsApp con formato internacional: '+573001234567'"),
    storeCurrency: z.enum(['USD', 'COP', 'MXN', 'EUR', 'PEN', 'ARS', 'BRL', 'CLP']).describe('Código de moneda ISO 4217'),
    storeAdminPin: z.string().min(4).describe('PIN de acceso al panel /admin'),
    storePrimaryColor: z.string().optional().describe("Color de acento en hex: '#D4B48C'"),
    storeAccentColor: z.string().optional().describe("Color de contraste en hex: '#3A332D'"),
    storeTagline: z.string().optional().describe('Frase de marca'),
    storeLogoUrl: z.string().optional().describe('URL del logo'),
  },
  async (args) => {
    const text = await handleDeployStore(args);
    return { content: [{ type: 'text', text }] };
  }
);

// 3. Tool: configure_branding
server.tool(
  'configure_branding',
  'Actualiza la identidad visual y colores de una tienda en vivo sin reconstruir el contenedor.',
  {
    projectName: z.string().describe('Nombre del proyecto retornado al desplegar'),
    storeName: z.string().optional().describe('Nuevo nombre de marca'),
    storePrimaryColor: z.string().optional().describe('Nuevo color primario en hex'),
    storeAccentColor: z.string().optional().describe('Nuevo color de contraste'),
    storeTagline: z.string().optional().describe('Nueva frase de marca'),
    storeLogoUrl: z.string().optional().describe('Nueva URL del logo'),
    storeWhatsappPhone: z.string().optional().describe('Nuevo número de WhatsApp'),
  },
  async (args) => {
    const text = await handleConfigureBranding(args);
    return { content: [{ type: 'text', text }] };
  }
);

// 4. Tool: seed_catalog
server.tool(
  'seed_catalog',
  'Importa productos en bloque al catálogo de la tienda.',
  {
    storeApiUrl: z.string().describe("URL base de la API, e.g. 'http://localhost:3000/api'"),
    adminPin: z.string().describe('PIN de administrador para autenticación'),
    products: z.array(
      z.object({
        name: z.string(),
        price: z.number(),
        category: z.string(),
        description: z.string().optional(),
        images: z.array(z.string()).optional(),
        isFeatured: z.boolean().optional(),
      })
    ).describe('Lista de productos a importar'),
  },
  async (args) => {
    const text = await handleSeedCatalog(args);
    return { content: [{ type: 'text', text }] };
  }
);

// 5. Tool: get_store_status
server.tool(
  'get_store_status',
  'Consulta el estado de salud, contenedores y puertos de una tienda.',
  {
    projectName: z.string().describe('Nombre del proyecto Docker Compose'),
    showLogs: z.boolean().optional().describe('Si se deben incluir los logs recientes'),
    logLines: z.number().optional().describe('Cantidad de líneas de log a mostrar'),
  },
  async (args) => {
    const text = await handleGetStoreStatus(args);
    return { content: [{ type: 'text', text }] };
  }
);

// ─── Transport Selection ──────────────────────────────────────

const transport = process.env.MCP_TRANSPORT ?? 'http';
const port = parseInt(process.env.PORT ?? '3001', 10);

if (transport === 'stdio') {
  // STDIO mode — for Claude Desktop / Cursor / Antigravity CLI
  console.error('[MCP] Starting in STDIO transport mode');
  const stdioTransport = new StdioServerTransport();
  await server.connect(stdioTransport);
} else {
  // HTTP + SSE mode — for web chat integrations & MSP Studio
  const app = express();
  app.use(express.json());

  // CORS middleware
  app.use((_req: Request, res: Response, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (_req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  const sseTransports: Record<string, SSEServerTransport> = {};

  // SSE endpoint — client connects here to receive MCP messages
  app.get('/sse', (req: Request, res: Response) => {
    const sessionId = String(Date.now());
    const sseTransport = new SSEServerTransport(`/messages?sessionId=${sessionId}`, res);
    sseTransports[sessionId] = sseTransport;

    res.on('close', () => {
      delete sseTransports[sessionId];
    });

    server.connect(sseTransport).catch(console.error);
  });

  // POST endpoint — client sends tool calls here
  app.post('/messages', async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const sseTransport = sseTransports[sessionId];
    if (!sseTransport) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    await sseTransport.handlePostMessage(req, res);
  });

  // REST Provisioning endpoint for MSP Studio
  app.post('/api/deploy', async (req: Request, res: Response) => {
    try {
      const result = await provisionStoreOnDokploy(req.body);
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Health check
  app.get('/health', (_: Request, res: Response) => {
    res.json({ status: 'ok', server: 'empires-mcp', transport: 'http+sse', tools: 5 });
  });

  app.listen(port, () => {
    console.log(`[MCP] Empires MCP Server listening on http://localhost:${port}`);
    console.log(`[MCP] SSE endpoint:  http://localhost:${port}/sse`);
    console.log(`[MCP] Health check:  http://localhost:${port}/health`);
    console.log(`[MCP] REST Deploy:   http://localhost:${port}/api/deploy`);
    console.log(`[MCP] Tools: deploy_dokploy_store | deploy_store | configure_branding | seed_catalog | get_store_status`);
  });
}
