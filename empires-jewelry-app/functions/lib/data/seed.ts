import { Product } from '../types';

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'emp-01',
    slug: 'gargantilla-solitario-aureum-diamante',
    name: 'Gargantilla Solitario Aureum',
    reference: 'REF-EMP-0101',
    category: 'collares',
    collection: 'Esencia Áurea',
    price: 1850,
    currency: 'USD',
    short_description: 'Cadena veneciana en oro amarillo 18k con diamante solitario de corte brillante.',
    description: 'Una pieza fundamental de la orfebrería contemporánea. Diseñada para posarse suavemente sobre la clavícula, esta gargantilla presenta un diamante natural talla brillante engastado en cuatro garras de oro amarillo 18k, maximizando la refracción de la luz y celebrando la belleza de lo esencial.',
    material: 'Oro Amarillo 18k',
    cover_image: '/assets/hero/hero-necklace-rings.png',
    images: [
      '/assets/hero/hero-necklace-rings.png',
      '/assets/products/packaging-box.png',
      '/assets/imagery/social-phone-grid.png',
      '/assets/products/packaging-tag.png'
    ],
    availability: 'disponible',
    featured: true,
    badge: 'Pieza Icónica',
    specifications: {
      carats: '0.75 ct F-VS1',
      weight: '4.2 g',
      dimensions: 'Cadena 45 cm ajustable a 40 cm; Dije 6.5 mm',
      stone: 'Diamante natural corte brillante redondo',
      purity: 'Oro Ley 750 (18 Kilates)'
    }
  },
  {
    id: 'emp-02',
    slug: 'alianza-eternity-diamantes-pave',
    name: 'Alianza Eternity Pavé Diamantes',
    reference: 'REF-EMP-0102',
    category: 'anillos',
    collection: 'Nupcial & Solitarios',
    price: 2400,
    currency: 'USD',
    short_description: 'Anillo de eternidad con hilera continua de diamantes corte brillante en oro amarillo 18k.',
    description: 'Símbolo imperecedero de unión y elegancia continua. Cada diamante es meticulosamente seleccionado y calibrado a mano para crear una cinta ininterrumpida de destellos, engastada al ras sobre una montura sólida de oro amarillo de 18 kilates.',
    material: 'Diamantes',
    cover_image: '/assets/hero/hero-necklace-rings.png',
    images: [
      '/assets/hero/hero-necklace-rings.png',
      '/assets/products/packaging-box.png',
      '/assets/imagery/business-cards.png'
    ],
    availability: 'disponible',
    featured: true,
    badge: 'Nupcial',
    specifications: {
      carats: '1.20 ct total (G-VS2)',
      weight: '3.8 g',
      dimensions: 'Ancho de banda: 2.8 mm; Grosor: 1.9 mm',
      stone: 'Diamantes naturales talla brillante',
      purity: 'Oro Ley 750 (18k)'
    }
  },
  {
    id: 'emp-03',
    slug: 'anillo-solido-imperiale-smooth-band',
    name: 'Banda Imperial Satinée',
    reference: 'REF-EMP-0103',
    category: 'anillos',
    collection: 'Colección Imperial',
    price: 1150,
    currency: 'USD',
    short_description: 'Anillo de silueta curva pulida a mano con acabado espejo en oro amarillo 18k.',
    description: 'La sobriedad arquitectónica convertida en joya. Su perfil semicircular comfort-fit se adapta con suavidad al dedo, ofreciendo una presencia cálida y atemporal que refleja la pureza del oro amarillo de 18 kilates.',
    material: 'Oro Amarillo 18k',
    cover_image: '/assets/hero/hero-necklace-rings.png',
    images: [
      '/assets/hero/hero-necklace-rings.png',
      '/assets/products/packaging-tag.png',
      '/assets/imagery/social-phone-grid.png'
    ],
    availability: 'disponible',
    featured: false,
    badge: 'Esencial',
    specifications: {
      weight: '5.6 g',
      dimensions: 'Ancho de banda: 4.0 mm',
      purity: 'Oro Ley 750 (18k)'
    }
  },
  {
    id: 'emp-04',
    slug: 'colgante-oval-halo-sublime',
    name: 'Colgante Halo Diamante Oval',
    reference: 'REF-EMP-0104',
    category: 'collares',
    collection: 'Legado Eterno',
    price: 3200,
    currency: 'USD',
    short_description: 'Medallón con diamante central corte oval rodeado de micro-pavé en oro amarillo 18k.',
    description: 'Una reinterpretación contemporánea del clásico halo victoriano. El diamante central corte oval alargado estiliza la figura y se encuentra enmarcado por una corona de micro-diamantes engastados sobre una galería calada que potencia el paso de la luz.',
    material: 'Diamantes',
    cover_image: '/assets/products/packaging-box.png',
    images: [
      '/assets/products/packaging-box.png',
      '/assets/hero/hero-necklace-rings.png',
      '/assets/products/packaging-bag.png'
    ],
    availability: 'pieza-unica',
    featured: true,
    badge: 'Pieza Única',
    specifications: {
      carats: '1.10 ct central + 0.35 ct halo (E-VVS2)',
      weight: '5.1 g',
      dimensions: 'Colgante: 14 mm x 9.5 mm; Cadena: 45 cm',
      stone: 'Diamante Oval natural certificado GIA',
      purity: 'Oro Ley 750 (18k)'
    }
  },
  {
    id: 'emp-05',
    slug: 'pulsera-tenis-linea-infinita',
    name: 'Pulsera Tennis Línea Infinita',
    reference: 'REF-EMP-0105',
    category: 'pulseras',
    collection: 'Colección Imperial',
    price: 4900,
    currency: 'USD',
    short_description: 'Brazalete flexible articulado con hilera completa de diamantes engastados en cuatro garras.',
    description: 'La máxima expresión del lujo discreto. Eslabones individuales fundidos en oro blanco 18k con articulación oculta que proporciona una caída fluida como la seda sobre la muñeca. Incluye cierre de seguridad de doble pestillo integrado.',
    material: 'Oro Blanco 18k',
    cover_image: '/assets/imagery/social-phone-grid.png',
    images: [
      '/assets/imagery/social-phone-grid.png',
      '/assets/products/packaging-box.png',
      '/assets/products/packaging-tag.png'
    ],
    availability: 'bajo-pedido',
    featured: true,
    badge: 'Alta Demanda',
    specifications: {
      carats: '3.50 ct total peso (F-G, VS)',
      weight: '11.8 g',
      dimensions: 'Longitud: 17.5 cm; Ancho: 2.4 mm',
      stone: '58 Diamantes naturales corte brillante',
      closure: 'Cierre de caja oculto con doble ocho de seguridad',
      purity: 'Oro Blanco 18k (Rodinado)'
    }
  },
  {
    id: 'emp-06',
    slug: 'aretes-solitarios-brillante-lumiere',
    name: 'Aretes Solitarios Lumière',
    reference: 'REF-EMP-0106',
    category: 'aretes',
    collection: 'Esencia Áurea',
    price: 1650,
    currency: 'USD',
    short_description: 'Par de pendientes solitarios con diamantes engastados en copas de oro amarillo 18k.',
    description: 'Esenciales para iluminar el rostro a diario. Dos diamantes de proporciones idénticas sostenidos en garras minimalistas que permiten la máxima entrada de luz lateral. Sistema de rosca de seguridad para confort prolongado.',
    material: 'Oro Amarillo 18k',
    cover_image: '/assets/products/packaging-box.png',
    images: [
      '/assets/products/packaging-box.png',
      '/assets/hero/hero-necklace-rings.png',
      '/assets/imagery/business-cards.png'
    ],
    availability: 'disponible',
    featured: false,
    badge: 'Clásico',
    specifications: {
      carats: '0.80 ct par (0.40 ct c/u, F-VS2)',
      weight: '2.1 g',
      dimensions: 'Diámetro: 4.8 mm',
      stone: 'Diamantes naturales talla brillante',
      closure: 'Poste con tuerca a rosca mariposa reforzada',
      purity: 'Oro Ley 750 (18k)'
    }
  },
  {
    id: 'emp-07',
    slug: 'anillo-solitario-geometria-esmeralda',
    name: 'Solitario Geometría Esmeralda',
    reference: 'REF-EMP-0107',
    category: 'alta-joyeria',
    collection: 'Alta Joyería Signature',
    price: 8500,
    currency: 'USD',
    short_description: 'Anillo de alta joyería en platino con diamante central corte esmeralda y trapecios laterales.',
    description: 'Inspirado en la simetría del corte geométrico del emblema Empires. Este anillo de alta costura destaca por la pureza arquitectónica de un diamante corte esmeralda de 2.0 quilates, flanqueado por diamantes trapecio en platino 950.',
    material: 'Platino',
    cover_image: '/assets/hero/hero-necklace-rings.png',
    images: [
      '/assets/hero/hero-necklace-rings.png',
      '/assets/products/packaging-box.png',
      '/assets/products/packaging-bag.png',
      '/assets/products/packaging-tag.png'
    ],
    availability: 'pieza-unica',
    featured: true,
    badge: 'Alta Joyería',
    specifications: {
      carats: '2.01 ct central + 0.60 ct laterales (D-VVS1)',
      weight: '6.8 g',
      dimensions: 'Banda: 2.2 mm; Corona: 9.2 mm x 7.4 mm',
      stone: 'Diamante Corte Esmeralda GIA Triple Excellent',
      purity: 'Platino 950'
    }
  },
  {
    id: 'emp-08',
    slug: 'gargantilla-eslabon-cubano-heritage',
    name: 'Cadena Eslabón Heritage 18k',
    reference: 'REF-EMP-0108',
    category: 'collares',
    collection: 'Colección Imperial',
    price: 3850,
    currency: 'USD',
    short_description: 'Cadena de eslabón plano entrelazado con acabado semi-mate y cierre artesanal en oro 18k.',
    description: 'Una pieza de peso y contundencia elegante. Eslabones facetados individualmente para capturar la luz con cada movimiento, acabados con una textura satinada que rinde homenaje a la tradición orfebre europea.',
    material: 'Oro Amarillo 18k',
    cover_image: '/assets/imagery/social-phone-grid.png',
    images: [
      '/assets/imagery/social-phone-grid.png',
      '/assets/hero/hero-necklace-rings.png',
      '/assets/products/packaging-bag.png'
    ],
    availability: 'disponible',
    featured: false,
    badge: 'Artesanal',
    specifications: {
      weight: '24.5 g',
      dimensions: 'Longitud: 50 cm; Grosor de eslabón: 5.5 mm',
      purity: 'Oro Amarillo Ley 750 (18k)',
      closure: 'Broche mosquetón robusto con grabado láser Empires'
    }
  },
  {
    id: 'emp-09',
    slug: 'aretes-arracadas-pave-aurora',
    name: 'Arracadas Huggies Pavé Aurora',
    reference: 'REF-EMP-0109',
    category: 'aretes',
    collection: 'Esencia Áurea',
    price: 1380,
    currency: 'USD',
    short_description: 'Aros pequeños ajustados a la oreja con micro-engaste de diamantes frontales e internos.',
    description: 'Diseñadas para brillar desde cualquier ángulo. Su innovador engaste reversible incluye diamantes en el frontal exterior y en el fondo interior, logrando un destello continuo tanto de frente como de perfil.',
    material: 'Oro Rosa 18k',
    cover_image: '/assets/products/packaging-box.png',
    images: [
      '/assets/products/packaging-box.png',
      '/assets/hero/hero-necklace-rings.png',
      '/assets/imagery/social-phone-grid.png'
    ],
    availability: 'disponible',
    featured: false,
    badge: 'Tendencia',
    specifications: {
      carats: '0.45 ct total (G-VS)',
      weight: '3.4 g',
      dimensions: 'Diámetro exterior: 13 mm; Ancho: 2.0 mm',
      stone: 'Micro-diamantes corte brillante',
      closure: 'Cierre invisible tipo click',
      purity: 'Oro Rosa 18k'
    }
  },
  {
    id: 'emp-10',
    slug: 'brazalete-rigido-bangle-cleopatra',
    name: 'Brazalete Rígido Bangle Étoile',
    reference: 'REF-EMP-0110',
    category: 'pulseras',
    collection: 'Colección Imperial',
    price: 2750,
    currency: 'USD',
    short_description: 'Brazalete rígido ovalado con apertura lateral con bisagra y remate de diamantes.',
    description: 'Estructura anatómica que abraza el contorno natural de la muñeca. Forjado en oro amarillo de 18 kilates con remates engastados en micro-pavé y mecanismo de apertura invisible.',
    material: 'Oro Amarillo 18k',
    cover_image: '/assets/imagery/social-phone-grid.png',
    images: [
      '/assets/imagery/social-phone-grid.png',
      '/assets/products/packaging-box.png',
      '/assets/products/packaging-tag.png'
    ],
    availability: 'disponible',
    featured: false,
    badge: 'Edición Limitada',
    specifications: {
      carats: '0.50 ct (F-VS)',
      weight: '14.2 g',
      dimensions: 'Diámetro interior: 58 mm x 48 mm',
      closure: 'Bisagra oculta con botón pulsador de seguridad',
      purity: 'Oro Ley 750 (18k)'
    }
  },
  {
    id: 'emp-11',
    slug: 'anillo-cintillo-diamantes-marquise',
    name: 'Cintillo Marquise & Brilliant',
    reference: 'REF-EMP-0111',
    category: 'anillos',
    collection: 'Geometría & Diamantes',
    price: 2100,
    currency: 'USD',
    short_description: 'Anillo rítmico alternando diamantes corte marquesa y brillantes redondos.',
    description: 'Un juego de formas y reflejos que estiliza la mano. La alternancia de tallas geométricas crea una textura visual orgánica y sofisticada, ideal para lucir individualmente o en layering nupcial.',
    material: 'Oro Blanco 18k',
    cover_image: '/assets/hero/hero-necklace-rings.png',
    images: [
      '/assets/hero/hero-necklace-rings.png',
      '/assets/products/packaging-box.png',
      '/assets/imagery/business-cards.png'
    ],
    availability: 'disponible',
    featured: false,
    badge: 'Diseño Exclusivo',
    specifications: {
      carats: '0.90 ct total (E-F, VS1)',
      weight: '3.6 g',
      dimensions: 'Ancho de banda: 3.2 mm',
      stone: 'Diamantes naturales talla marquesa y brillante',
      purity: 'Oro Blanco 18k'
    }
  },
  {
    id: 'emp-12',
    slug: 'collar-alta-joyeria-cascada-astral',
    name: 'Collar Cascada Astral Empires',
    reference: 'REF-EMP-0112',
    category: 'alta-joyeria',
    collection: 'Alta Joyería Signature',
    price: 14500,
    currency: 'USD',
    short_description: 'Collier rivière de alta joyería con degradé de diamantes en oro blanco 18k y platino.',
    description: 'La obra cumbre de la casa Empires. Una cascada ininterrumpida de más de 120 diamantes naturales seleccionados por su fuego y blancura excepcional, ensamblados a mano en un rivière flexible que se amolda con suavidad absoluta.',
    material: 'Diamantes',
    cover_image: '/assets/hero/hero-necklace-rings.png',
    images: [
      '/assets/hero/hero-necklace-rings.png',
      '/assets/products/packaging-box.png',
      '/assets/products/packaging-bag.png',
      '/assets/products/packaging-tag.png',
      '/assets/imagery/social-phone-grid.png'
    ],
    availability: 'pieza-unica',
    featured: true,
    badge: 'Obra Maestra',
    specifications: {
      carats: '8.40 ct total peso (D-E, VVS)',
      weight: '32.0 g',
      dimensions: 'Longitud: 42 cm; Caída frontal: 18 mm',
      stone: 'Diamantes naturales talla brillante y pera certificados',
      purity: 'Platino 950 y Oro Blanco 18k'
    }
  }
];
