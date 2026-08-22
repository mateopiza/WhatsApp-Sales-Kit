import { Category, Material, Availability, ProductSpecifications } from './catalog';

export type AdminTab = 'catalog' | 'form' | 'categories' | 'stats';

export interface AdminAuthState {
  isAuthenticated: boolean;
  token: string | null;
  expiresAt: number | null;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  isLocked: boolean;
  lockoutRemainingSeconds: number;
  attemptsCount: number;
}

export interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  reference: string;
  category: Category;
  collection: string;
  price: number | string;
  currency: 'USD' | 'COP' | 'EUR';
  short_description: string;
  description: string;
  material: Material;
  images: string[];
  cover_image: string;
  availability: Availability;
  featured: boolean;
  badge?: string;
  specifications: ProductSpecifications;
}

export interface FormValidationErrors {
  name?: string;
  slug?: string;
  reference?: string;
  category?: string;
  collection?: string;
  price?: string;
  short_description?: string;
  description?: string;
  material?: string;
  cover_image?: string;
  images?: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error';
