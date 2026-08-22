import { ThemePalette, ProductSample } from '../types/msp';

export const THEME_PALETTES: ThemePalette[] = [
  {
    id: 'royal-gold',
    name: 'Royal Gold & Taupe',
    category: 'luxury',
    description: 'Elegancia clásica, orfebrería de alta gama y tonos arena cálidos.',
    primary: '#D4B48C',      // Oro cálido
    accent: '#8A8176',       // Taupe
    background: '#F5EDE6',   // Crema suave
    surface: '#FFFFFF',      // Blanco marfil
    text: '#3A332D',         // Tinta profunda
    textMuted: '#706860',
    border: '#E3D7CC',
    previewGradient: 'linear-gradient(135deg, #D4B48C 0%, #3A332D 100%)',
  },
  {
    id: 'midnight-obsidian',
    name: 'Midnight Obsidian',
    category: 'luxury',
    description: 'Modo oscuro de ultralujo con contrastes en oro rosa y carbón.',
    primary: '#E0A96D',      // Oro rosa luminoso
    accent: '#9A8262',       // Bronce
    background: '#0F0F11',   // Negro carbón
    surface: '#1A1A1E',      // Grafito
    text: '#F5F5F7',         // Blanco titanio
    textMuted: '#A1A1AA',
    border: '#2E2E36',
    previewGradient: 'linear-gradient(135deg, #0F0F11 0%, #E0A96D 100%)',
  },
  {
    id: 'emerald-luxury',
    name: 'Emerald Artisan',
    category: 'luxury',
    description: 'Verde esmeralda colombiano profundo con destellos dorados y perla.',
    primary: '#0F5132',      // Esmeralda profundo
    accent: '#C5A880',       // Oro
    background: '#F8F9FA',   // Nieve
    surface: '#FFFFFF',
    text: '#1C2E24',         // Bosque oscuro
    textMuted: '#5C6D63',
    border: '#D8E2DC',
    previewGradient: 'linear-gradient(135deg, #0F5132 0%, #C5A880 100%)',
  },
  {
    id: 'burgundy-velvet',
    name: 'Burgundy Velvet',
    category: 'vibrant',
    description: 'Borgoña seductor con rosa empolvado para boutiques y piezas exclusivas.',
    primary: '#5C1D38',      // Borgoña vino
    accent: '#D4A373',       // Champagne
    background: '#FAF0F2',   // Rosa empolvado tenue
    surface: '#FFFFFF',
    text: '#2D1520',         // Vino oscuro
    textMuted: '#7D5A68',
    border: '#EED9E0',
    previewGradient: 'linear-gradient(135deg, #5C1D38 0%, #FAF0F2 100%)',
  },
  {
    id: 'urban-minimal',
    name: 'Urban Monochrome',
    category: 'modern',
    description: 'Estética moderna, streetwear y tipografía limpia de alto contraste.',
    primary: '#111827',      // Negro puro
    accent: '#3B82F6',       // Azul eléctrico
    background: '#F3F4F6',   // Gris minimal
    surface: '#FFFFFF',
    text: '#111827',         // Grafito
    textMuted: '#6B7280',
    border: '#E5E7EB',
    previewGradient: 'linear-gradient(135deg, #111827 0%, #3B82F6 100%)',
  },
  {
    id: 'sunset-coral',
    name: 'Sunset Terracotta',
    category: 'vibrant',
    description: 'Tonos tierra cálidos, terracota y lino para marcas artesanales.',
    primary: '#C85A32',      // Terracota
    accent: '#E09F67',       // Ámbar
    background: '#FDF8F5',   // Lino
    surface: '#FFFFFF',
    text: '#3D2314',         // Café tostado
    textMuted: '#846351',
    border: '#F0DEC9',
    previewGradient: 'linear-gradient(135deg, #C85A32 0%, #E09F67 100%)',
  },
];

export const JEWELRY_SAMPLES: ProductSample[] = [
  {
    id: 'j1',
    name: 'Anillo Solitario Imperial Oro 18K',
    price: 380000,
    category: 'Anillos',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    tag: 'Más Vendido',
  },
  {
    id: 'j2',
    name: 'Collar Esmeralda Colombiana Genuina',
    price: 520000,
    category: 'Collares',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    tag: 'Edición Limitada',
  },
  {
    id: 'j3',
    name: 'Aretes Florales Filigrana Tradicional',
    price: 195000,
    category: 'Aretes',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'j4',
    name: 'Pulsera Eslabón Cubano Plata 925',
    price: 240000,
    category: 'Pulseras',
    image: 'https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=600&q=80',
  },
];

export const CLOTHING_SAMPLES: ProductSample[] = [
  {
    id: 'c1',
    name: 'Blazer Oversize Sartorial Lino',
    price: 185000,
    category: 'Blazers',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
    tag: 'Tendencia',
  },
  {
    id: 'c2',
    name: 'Vestido Midi Seda Champagne',
    price: 210000,
    category: 'Vestidos',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
    tag: 'Exclusivo',
  },
  {
    id: 'c3',
    name: 'Pantalón Wide-Leg Plisado Alto',
    price: 135000,
    category: 'Pantalones',
    image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'c4',
    name: 'Camisa Algodón Pima Cuello Cubano',
    price: 120000,
    category: 'Camisas',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
  },
];
