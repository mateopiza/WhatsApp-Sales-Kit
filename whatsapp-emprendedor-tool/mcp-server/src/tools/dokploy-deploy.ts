import { provisionStoreOnDokploy, DokployDeployRequest } from '../utils/dokploy.js';

export const deployDokployStoreTool = {
  name: 'deploy_dokploy_store',
  description: `Aprovisiona y despliega automáticamente una nueva tienda de Joyería o Ropa en Dokploy con subdominio personalizado y SSL de Traefik.
Configura marca, catálogo, WhatsApp, moneda y colores en tiempo récord.`,
  inputSchema: {
    type: 'object',
    required: ['storeName', 'niche', 'storeWhatsappPhone', 'storeAdminPin'],
    properties: {
      storeName: {
        type: 'string',
        description: "Nombre comercial de la marca (ej: 'Joyería Aurelia' o 'Urban Style')",
      },
      slug: {
        type: 'string',
        description: "Subdominio deseado (ej: 'aurelia-joyas'). Si se omite, se autogenera.",
      },
      niche: {
        type: 'string',
        enum: ['jewelry', 'clothing'],
        description: "Nicho del catálogo: 'jewelry' para orfebrería/joyas o 'clothing' para moda/prendas.",
      },
      storeWhatsappPhone: {
        type: 'string',
        description: "Teléfono internacional para recibir pedidos (ej: '+573001234567')",
      },
      storeCurrency: {
        type: 'string',
        enum: ['COP', 'USD', 'MXN', 'EUR', 'PEN', 'ARS', 'CLP'],
        description: "Código ISO de la moneda de la tienda.",
      },
      storeAdminPin: {
        type: 'string',
        description: 'PIN de seguridad para acceder al panel /admin (mínimo 4 caracteres)',
      },
      storePrimaryColor: {
        type: 'string',
        description: "Color primario en formato hexadecimal (ej: '#D4B48C')",
      },
      storeAccentColor: {
        type: 'string',
        description: "Color secundario en formato hexadecimal (ej: '#3A332D')",
      },
      storeTagline: {
        type: 'string',
        description: 'Frase o eslogan de la marca',
      },
      rootDomain: {
        type: 'string',
        description: "Dominio base para el subdominio (por defecto: 'empires.app')",
      },
    },
  },
} as const;

export async function handleDeployDokployStore(args: Record<string, any>): Promise<string> {
  try {
    const req: DokployDeployRequest = {
      storeName: String(args.storeName),
      slug: args.slug ? String(args.slug) : '',
      niche: (args.niche === 'clothing' ? 'clothing' : 'jewelry') as 'jewelry' | 'clothing',
      whatsappPhone: String(args.storeWhatsappPhone),
      currency: String(args.storeCurrency || 'COP'),
      adminPin: String(args.storeAdminPin),
      primaryColor: args.storePrimaryColor ? String(args.storePrimaryColor) : undefined,
      accentColor: args.storeAccentColor ? String(args.storeAccentColor) : undefined,
      tagline: args.storeTagline ? String(args.storeTagline) : undefined,
      rootDomain: args.rootDomain ? String(args.rootDomain) : undefined,
    };

    const result = await provisionStoreOnDokploy(req);

    return [
      `🚀 **¡Tienda desplegada en Dokploy con éxito!**`,
      ``,
      `🏪 **Marca:** ${result.storeName} (${result.niche === 'jewelry' ? '💎 Joyería' : '👗 Ropa & Moda'})`,
      `🌐 **Enlace Público (SSL):** ${result.publicUrl}`,
      `🔐 **Panel de Control / Admin:** ${result.adminUrl}`,
      `📲 **Línea WhatsApp:** ${result.whatsappDirectUrl}`,
      `🔑 **PIN Admin:** ${req.adminPin}`,
      ``,
      `📡 **Subdominio Dokploy:** \`${result.subdomain}\``,
      `✨ Todos los certificados SSL y DNS fueron configurados de forma autónoma.`,
    ].join('\n');
  } catch (error: any) {
    return `❌ Error al desplegar en Dokploy: ${error.message}`;
  }
}
