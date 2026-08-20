// ─────────────────────────────────────────────────────────────
// index.ts — Empires Jewelry MCP Server Entry Point
//
// Supports two transport modes:
//   MCP_TRANSPORT=stdio  → for Claude Desktop, Cursor, Antigravity CLI
//   MCP_TRANSPORT=http   → for web-based chat integrations (default)
// ─────────────────────────────────────────────────────────────
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express from 'express';

import { deployStoreTool, handleDeployStore } from './tools/deploy.js';
import { configureBrandingTool, handleConfigureBranding } from './tools/branding.js';
import { seedCatalogTool, handleSeedCatalog } from './tools/catalog.js';
import { getStoreStatusTool, handleGetStoreStatus } from './tools/monitor.js';

// ─── Server Definition ────────────────────────────────────────

const server = new McpServer({
  name: 'empires-jewelry-orchestrator',
  version: '1.0.0',
});

// Register all tools
server.tool(
  deployStoreTool.name,
  deployStoreTool.description,
  deployStoreTool.inputSchema.properties,
  async ({ storeName, storeWhatsappPhone, storeCurrency, storeAdminPin, ...rest }) =>
    ({ content: [{ type: 'text', text: await handleDeployStore({ storeName, storeWhatsappPhone, storeCurrency, storeAdminPin, ...rest }) }] })
);

server.tool(
  configureBrandingTool.name,
  configureBrandingTool.description,
  configureBrandingTool.inputSchema.properties,
  async (args) =>
    ({ content: [{ type: 'text', text: await handleConfigureBranding(args as Record<string, unknown>) }] })
);

server.tool(
  seedCatalogTool.name,
  seedCatalogTool.description,
  seedCatalogTool.inputSchema.properties,
  async (args) =>
    ({ content: [{ type: 'text', text: await handleSeedCatalog(args as Record<string, unknown>) }] })
);

server.tool(
  getStoreStatusTool.name,
  getStoreStatusTool.description,
  getStoreStatusTool.inputSchema.properties,
  async (args) =>
    ({ content: [{ type: 'text', text: await handleGetStoreStatus(args as Record<string, unknown>) }] })
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
  // HTTP + SSE mode — for web chat integrations
  const app = express();
  app.use(express.json());

  const sseTransports: Record<string, SSEServerTransport> = {};

  // SSE endpoint — client connects here to receive MCP messages
  app.get('/sse', (req, res) => {
    const sessionId = String(Date.now());
    const sseTransport = new SSEServerTransport(`/messages?sessionId=${sessionId}`, res);
    sseTransports[sessionId] = sseTransport;

    res.on('close', () => {
      delete sseTransports[sessionId];
    });

    server.connect(sseTransport).catch(console.error);
  });

  // POST endpoint — client sends tool calls here
  app.post('/messages', async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const sseTransport = sseTransports[sessionId];
    if (!sseTransport) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    await sseTransport.handlePostMessage(req, res);
  });

  // Health check
  app.get('/health', (_, res) => {
    res.json({ status: 'ok', server: 'empires-mcp', transport: 'http+sse', tools: 4 });
  });

  app.listen(port, () => {
    console.log(`[MCP] Empires Jewelry MCP Server listening on http://localhost:${port}`);
    console.log(`[MCP] SSE endpoint:  http://localhost:${port}/sse`);
    console.log(`[MCP] Health check:  http://localhost:${port}/health`);
    console.log(`[MCP] Tools: deploy_store | configure_branding | seed_catalog | get_store_status`);
  });
}
