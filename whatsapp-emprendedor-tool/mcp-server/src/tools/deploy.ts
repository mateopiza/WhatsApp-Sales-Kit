// ─────────────────────────────────────────────────────────────
// tools/deploy.ts — deploy_store MCP Tool
// ─────────────────────────────────────────────────────────────
import { z } from 'zod';
import { deployStore, toProjectName } from '../utils/docker.js';
import { validateStoreConfig, formatValidationErrors } from '../utils/env-generator.js';

export const deployStoreTool = {
  name: 'deploy_store',
  description: `Deploys a complete jewelry store instance via Docker Compose.
Generates runtime configuration, starts the store frontend and API, and returns the public URL and admin panel URL.
Use this when an entrepreneur wants to create or launch their store.`,
  inputSchema: {
    type: 'object',
    required: ['storeName', 'storeWhatsappPhone', 'storeCurrency', 'storeAdminPin'],
    properties: {
      storeName: {
        type: 'string',
        description: "The store's brand name, e.g. 'Perla Negra' or 'Joya Dorada'",
      },
      storeWhatsappPhone: {
        type: 'string',
        description: "WhatsApp phone number in international format, e.g. '+525512345678'",
      },
      storeCurrency: {
        type: 'string',
        enum: ['USD', 'COP', 'MXN', 'EUR', 'PEN', 'ARS', 'BRL', 'CLP'],
        description: 'ISO 4217 currency code for prices displayed in the store',
      },
      storeAdminPin: {
        type: 'string',
        description: 'PIN or password for the /admin control panel (minimum 4 characters)',
      },
      storePrimaryColor: {
        type: 'string',
        description: "Brand accent color in hex format, e.g. '#E5C158' for gold",
      },
      storeAccentColor: {
        type: 'string',
        description: "Dark/ink contrast color in hex format, e.g. '#1A1A1A'",
      },
      storeTagline: {
        type: 'string',
        description: "Short brand tagline, e.g. 'Joyería de Alta Distinción'",
      },
      storeLogoUrl: {
        type: 'string',
        description: 'URL to the brand logo image (optional)',
      },
    },
  },
} as const;

export async function handleDeployStore(args: Record<string, unknown>): Promise<string> {
  let config;
  try {
    config = validateStoreConfig(args);
  } catch (err: any) {
    const msg = err?.issues ? formatValidationErrors(err) : String(err);
    return `❌ Configuración inválida:\n${msg}`;
  }

  try {
    const result = deployStore(config);
    return [
      `✅ ¡Tienda "${config.storeName}" desplegada con éxito!`,
      ``,
      `🌐 **URL Pública:** ${result.url}`,
      `🔐 **Panel de Administración:** ${result.adminUrl}`,
      `📲 **WhatsApp de Ventas:** ${config.storeWhatsappPhone}`,
      `💰 **Moneda:** ${config.storeCurrency}`,
      `🔑 **PIN Admin:** ${config.storeAdminPin}`,
      ``,
      `📦 Proyecto Docker: \`${result.projectName}\``,
      `   Para ver el estado: usa la herramienta \`get_store_status\` con projectName="${result.projectName}"`,
    ].join('\n');
  } catch (err: any) {
    return `❌ Error al desplegar la tienda: ${err.message}\n\nVerifica que Docker esté corriendo y los puertos disponibles.`;
  }
}
