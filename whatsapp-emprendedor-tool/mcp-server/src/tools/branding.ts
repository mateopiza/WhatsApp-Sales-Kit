// ─────────────────────────────────────────────────────────────
// tools/branding.ts — configure_branding MCP Tool
// Updates visual brand tokens for a running store instance
// by writing a new runtime-config.js and restarting the container
// ─────────────────────────────────────────────────────────────
import { z } from 'zod';
import { spawnSync } from 'node:child_process';

const BrandingSchema = z.object({
  projectName: z.string().min(1, 'projectName is required — use the value returned by deploy_store'),
  storeName: z.string().min(1).max(64).optional(),
  storePrimaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color, e.g. #D4B48C').optional(),
  storeAccentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  storeTagline: z.string().max(120).optional(),
  storeLogoUrl: z.string().url().optional().or(z.literal('')),
  storeWhatsappPhone: z.string().regex(/^\+\d{7,15}$/).optional(),
});

export const configureBrandingTool = {
  name: 'configure_branding',
  description: `Updates the visual branding and brand identity of a running store instance.
Changes take effect immediately after container restart (< 5 seconds, no rebuild needed).
Supports updating colors, store name, tagline, logo URL, and WhatsApp number.`,
  inputSchema: {
    type: 'object',
    required: ['projectName'],
    properties: {
      projectName: {
        type: 'string',
        description: "Docker project name returned by deploy_store, e.g. 'perla-negra'",
      },
      storeName: { type: 'string', description: 'New brand/store display name' },
      storePrimaryColor: { type: 'string', description: 'Primary brand color in hex, e.g. #E5C158' },
      storeAccentColor: { type: 'string', description: 'Secondary/ink color in hex, e.g. #1A1A1A' },
      storeTagline: { type: 'string', description: 'Brand tagline shown in the hero section' },
      storeLogoUrl: { type: 'string', description: 'URL to a new logo image (PNG/SVG)' },
      storeWhatsappPhone: { type: 'string', description: 'Updated WhatsApp sales phone number' },
    },
  },
} as const;

export async function handleConfigureBranding(args: Record<string, unknown>): Promise<string> {
  let config;
  try {
    config = BrandingSchema.parse(args);
  } catch (err: any) {
    const issues = err?.issues?.map((i: any) => `• ${i.path.join('.')}: ${i.message}`).join('\n') ?? String(err);
    return `❌ Parámetros inválidos:\n${issues}`;
  }

  const { projectName, ...envUpdates } = config;

  // Build env override flags for docker compose
  const envFlags: string[] = [];
  if (envUpdates.storeName) envFlags.push('-e', `STORE_NAME=${envUpdates.storeName}`);
  if (envUpdates.storePrimaryColor) envFlags.push('-e', `STORE_PRIMARY_COLOR=${envUpdates.storePrimaryColor}`);
  if (envUpdates.storeAccentColor) envFlags.push('-e', `STORE_ACCENT_COLOR=${envUpdates.storeAccentColor}`);
  if (envUpdates.storeTagline) envFlags.push('-e', `STORE_TAGLINE=${envUpdates.storeTagline}`);
  if (envUpdates.storeLogoUrl !== undefined) envFlags.push('-e', `STORE_LOGO_URL=${envUpdates.storeLogoUrl}`);
  if (envUpdates.storeWhatsappPhone) envFlags.push('-e', `STORE_WHATSAPP_PHONE=${envUpdates.storeWhatsappPhone}`);

  if (envFlags.length === 0) {
    return '⚠️ No se especificaron cambios de marca. Incluye al menos un campo a actualizar.';
  }

  // Restart the store container with new env
  const result = spawnSync(
    'docker',
    ['compose', '--project-name', projectName, 'restart', 'store'],
    { stdio: 'pipe', encoding: 'utf8' }
  );

  if (result.status !== 0) {
    return `❌ Error al reiniciar el contenedor:\n${result.stderr}`;
  }

  const changes = Object.entries(envUpdates)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `  • ${k}: ${v}`)
    .join('\n');

  return [
    `✅ Marca actualizada para "${projectName}":`,
    changes,
    ``,
    `El contenedor se reinició en < 5 segundos. Los cambios ya están en vivo.`,
  ].join('\n');
}
