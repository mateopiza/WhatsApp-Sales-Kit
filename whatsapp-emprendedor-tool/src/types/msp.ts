// ─────────────────────────────────────────────────────────────
// types/msp.ts — Tipos para MSP Studio & Despliegue Dokploy
// ─────────────────────────────────────────────────────────────

export type NicheType = 'jewelry' | 'clothing';

export interface ThemePalette {
  id: string;
  name: string;
  category: 'luxury' | 'modern' | 'vibrant' | 'minimal' | 'custom';
  description: string;
  primary: string;       // Color de acento / botones / llamadas a la acción
  accent: string;        // Color secundario / insignias
  background: string;    // Fondo general
  surface: string;       // Fondo de tarjetas / modales
  text: string;          // Color del texto principal
  textMuted: string;     // Color de subtítulos / descripciones
  border: string;        // Color de bordes y divisores
  previewGradient: string; // Gradiente para el swatch de selección
}

export interface VisualEffects {
  glassmorphism: boolean;             // Efecto de cristal translúcido con blur
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full'; // Radio de esquinas
  cardElevation: 'flat' | 'subtle' | 'floating' | 'luxury-glow'; // Sombras y brillo
  hoverZoom: boolean;                 // Micro-zoom 1.03x en hover de imágenes
  motionPreset: 'smooth' | 'snappy' | 'cinematic'; // Velocidad de transiciones
  typographyStyle: 'editorial-cinzel' | 'modern-sans' | 'luxury-serif'; // Estilo tipográfico
}

export interface ProductSample {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  tag?: string;
}

export interface StoreConfig {
  storeName: string;
  slug: string;
  niche: NicheType;
  whatsappPhone: string;
  currency: 'COP' | 'USD' | 'MXN' | 'EUR' | 'PEN' | 'ARS' | 'CLP';
  adminPin: string;
  tagline: string;
  logoUrl?: string;
  paletteId: string;
  customColors?: Partial<ThemePalette>;
  effects: VisualEffects;
  rootDomain: string; // e.g. "midominio.com"
}

export type DeploymentStep = 
  | 'idle'
  | 'validating'
  | 'provisioning_dns'
  | 'creating_dokploy_app'
  | 'configuring_traefik_ssl'
  | 'deploying_container'
  | 'ready'
  | 'error';

export interface DeploymentLog {
  step: DeploymentStep;
  message: string;
  timestamp: string;
  status: 'pending' | 'in_progress' | 'success' | 'failed';
}

export interface DeploymentResult {
  success: boolean;
  storeName: string;
  slug: string;
  subdomain: string;
  publicUrl: string;
  adminUrl: string;
  whatsappDirectUrl: string;
  niche: NicheType;
  dokployAppName: string;
  logs: DeploymentLog[];
  errorMessage?: string;
}
