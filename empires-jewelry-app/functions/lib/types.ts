export type Category = 'anillos' | 'collares' | 'pulseras' | 'aretes' | 'alta-joyeria';

export type Material = 
  | 'Oro Amarillo 18k' 
  | 'Oro Blanco 18k' 
  | 'Oro Rosa 18k' 
  | 'Plata Esterlina 925' 
  | 'Platino' 
  | 'Diamantes';

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

export interface ProductFilterParams {
  category?: string;
  material?: string;
  collection?: string;
  availability?: string;
  featured?: boolean;
  search?: string;
  sort?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'featured';
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
    tier?: 'D1' | 'KV' | 'MEMORY';
    executionTimeMs?: number;
  };
}

export interface AuthResponseData {
  token: string;
  authenticated: boolean;
  role: 'admin';
  expiresAt: number;
}

// Cloudflare Types (for D1 & KV bindings)
export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<{ results?: T[]; success: boolean; meta?: any }>;
  run<T = unknown>(): Promise<{ success: boolean; meta?: any; results?: T[] }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<{ results?: T[]; success: boolean }[]>;
  exec(query: string): Promise<{ count: number; duration: number }>;
}

export interface KVNamespace {
  get(key: string, options?: { type?: 'text' | 'json' | 'arrayBuffer' | 'stream' } | string): Promise<any>;
  put(key: string, value: string | ReadableStream | ArrayBuffer, options?: { expiration?: number; expirationTtl?: number; metadata?: any }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ keys: { name: string; expiration?: number; metadata?: any }[]; list_complete: boolean; cursor?: string }>;
}

export interface Env {
  DB?: D1Database;
  CATALOG_KV?: KVNamespace;
  AUTH_SECRET?: string;
  ADMIN_PIN?: string;
  ADMIN_PASSWORD?: string;
  ENVIRONMENT?: string;
}

export type PagesFunction<E = Env, P extends string = any, D = any> = (
  context: {
    request: Request;
    env: E;
    params: Record<P, string | string[]>;
    data: D;
    next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
    waitUntil: (promise: Promise<any>) => void;
  }
) => Response | Promise<Response>;
