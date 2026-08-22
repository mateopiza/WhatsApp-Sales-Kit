export type Category = 'anillos' | 'collares' | 'pulseras' | 'aretes' | 'alta-joyeria';

export type Material = 
  | 'Oro Amarillo 18k' 
  | 'Oro Blanco 18k' 
  | 'Oro Rosa 18k' 
  | 'Plata Esterlina 925' 
  | 'Platino' 
  | 'Diamantes'
  | 'Tres Oros 18k'
  | 'Oro Rosa 18k / Oro Blanco 18k'
  | 'Oro Rosa y Blanco 18k'
  | 'Oro Negro y Blanco 18k';

export type Availability = 'disponible' | 'bajo-pedido' | 'pieza-unica' | 'agotado';

export interface ProductSpecifications {
  carats?: string;
  weight?: string;
  dimensions?: string;
  stone?: string;
  closure?: string;
  purity?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  reference: string;
  category: Category;
  collection: string;
  price: number;
  currency: 'USD' | 'COP' | 'EUR';
  description: string;
  short_description: string;
  material: Material;
  images: string[];
  cover_image: string;
  availability: Availability;
  featured: boolean;
  badge?: string;
  specifications: ProductSpecifications;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  count: number;
  cover: string;
  description: string;
}

export interface WhatsAppInquiryParams {
  phoneNumber?: string;
  productName: string;
  reference: string;
  productUrl?: string;
  price?: number;
  currency?: string;
  customNote?: string;
}
