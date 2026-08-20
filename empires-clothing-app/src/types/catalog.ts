export type UrbanCategory =
  | 'hoodies-sweatshirts'
  | 'chaquetas-outerwear'
  | 'pantalones-cargo'
  | 'camisetas-graphic-tees'
  | 'zapatillas-sneakers'
  | 'accesorios-streetwear';

export type UrbanSize = 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Oversized Free Size';

export type FitType = 'Oversized Drop-Shoulder' | 'Boxy Fit' | 'Technical Cargo Fit' | 'Unisex Relaxed';

export type OutfitSlot = 'top' | 'bottom' | 'footwear' | 'accessory';

export interface UrbanGarment {
  id: string;
  slug: string;
  name: string;
  reference: string;
  category: UrbanCategory;
  collection: string;
  price: number;
  currency: 'USD' | 'COP' | 'EUR';
  short_description: string;
  description: string;
  material: string;
  gsm?: string;
  fit_type: FitType;
  outfit_slot: OutfitSlot;
  available_sizes: UrbanSize[];
  colors: string[];
  cover_image: string;
  images: string[];
  availability: 'disponible' | 'bajo-pedido' | 'drop-limitado';
  featured: boolean;
  badge?: string;
  care_instructions: string;
}

export interface UrbanCategoryInfo {
  id: UrbanCategory;
  name: string;
  count: number;
  cover: string;
  description: string;
}
