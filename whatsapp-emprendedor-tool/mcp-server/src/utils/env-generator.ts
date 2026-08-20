// ─────────────────────────────────────────────────────────────
// env-generator.ts — Runtime env var utilities
// Validates and merges store configuration into a typed object
// ─────────────────────────────────────────────────────────────
import { z } from 'zod';

export const StoreConfigSchema = z.object({
  storeName: z.string().min(1, 'Store name is required').max(64),
  storeWhatsappPhone: z
    .string()
    .regex(/^\+\d{7,15}$/, 'WhatsApp phone must be in international format: +521234567890'),
  storeCurrency: z.enum(['USD', 'COP', 'MXN', 'EUR', 'PEN', 'ARS', 'BRL', 'CLP']),
  storeAdminPin: z.string().min(4, 'Admin PIN must be at least 4 characters'),
  storePrimaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#D4B48C'),
  storeAccentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#3A332D'),
  storeTagline: z.string().max(120).optional().default('Joyería Online'),
  storeLogoUrl: z.string().url().optional().or(z.literal('')).default(''),
  storePort: z.number().int().min(1024).max(65535).optional(),
});

export type StoreConfig = z.infer<typeof StoreConfigSchema>;

/**
 * Validates store config and returns parsed + defaulted values.
 * Throws a ZodError with field-level messages on invalid input.
 */
export function validateStoreConfig(input: unknown): StoreConfig {
  return StoreConfigSchema.parse(input);
}

/**
 * Formats ZodError issues into a human-readable string for MCP tool responses.
 */
export function formatValidationErrors(error: z.ZodError): string {
  return error.issues
    .map(issue => `• ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
}
