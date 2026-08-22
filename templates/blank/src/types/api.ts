import { Category, Material, Availability, ProductSpecifications } from './catalog';

export interface ProductFilterParams {
  category?: Category | 'todos';
  material?: Material | 'todos';
  collection?: string | 'todas';
  availability?: Availability | 'todas';
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'created-desc';
  sort?: string;
  limit?: number;
  offset?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    count?: number;
    offset?: number;
    limit?: number;
    timestamp: string;
    tier?: 'D1' | 'KV' | 'MEMORY' | 'LOCAL_CACHE';
    executionTimeMs?: number;
  };
}

export interface AuthCredentials {
  pin?: string;
  password?: string;
  credential?: string;
}

export interface AuthResponseData {
  token: string;
  authenticated: boolean;
  role: 'admin';
  expiresAt: number;
}

export interface CreateProductPayload {
  id?: string;
  name: string;
  slug?: string;
  reference: string;
  category: Category;
  collection: string;
  price: number;
  currency?: 'USD' | 'COP' | 'EUR';
  short_description: string;
  description: string;
  material: Material;
  images?: string[];
  cover_image: string;
  availability?: Availability;
  featured?: boolean;
  badge?: string;
  specifications?: ProductSpecifications;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;
