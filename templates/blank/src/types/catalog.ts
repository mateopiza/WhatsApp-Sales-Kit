// Category and Material are free-form: define whatever values make sense
// for your business in src/data/products.ts and the admin CMS — nothing
// in the app logic depends on specific values.
export type Category = string;

export type Material = string;

export type Availability = 'disponible' | 'bajo-pedido' | 'pieza-unica' | 'agotado';

export interface ProductSpecifications {
  weight?: string;
  dimensions?: string;
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
