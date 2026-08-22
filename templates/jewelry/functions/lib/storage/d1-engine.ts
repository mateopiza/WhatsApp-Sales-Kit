import { StorageEngine } from './interface';
import { Product, ProductFilterParams, D1Database } from '../types';
import { SEED_PRODUCTS } from '../data/seed';

export class D1StorageEngine implements StorageEngine {
  readonly tierName = 'D1' as const;
  private db: D1Database;
  private initialized = false;

  constructor(db: D1Database) {
    this.db = db;
  }

  async init(): Promise<void> {
    if (this.initialized) return;
    try {
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          reference TEXT UNIQUE NOT NULL,
          category TEXT NOT NULL,
          collection TEXT NOT NULL,
          price REAL NOT NULL,
          currency TEXT NOT NULL DEFAULT 'USD',
          short_description TEXT NOT NULL,
          description TEXT NOT NULL,
          material TEXT NOT NULL,
          cover_image TEXT NOT NULL,
          images TEXT NOT NULL,
          availability TEXT NOT NULL DEFAULT 'disponible',
          featured INTEGER NOT NULL DEFAULT 0,
          badge TEXT,
          specifications TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
      `);

      const countResult = await this.db.prepare('SELECT COUNT(*) as cnt FROM products').first<{ cnt: number }>();
      if (!countResult || countResult.cnt === 0) {
        await this.seedProducts();
      }
      this.initialized = true;
    } catch (err) {
      console.error('D1 initialization error:', err);
      throw err;
    }
  }

  private async seedProducts(): Promise<void> {
    const statements = SEED_PRODUCTS.map((p) =>
      this.db
        .prepare(
          `INSERT OR REPLACE INTO products 
           (id, slug, name, reference, category, collection, price, currency, short_description, description, material, cover_image, images, availability, featured, badge, specifications)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          p.id,
          p.slug,
          p.name,
          p.reference,
          p.category,
          p.collection,
          p.price,
          p.currency,
          p.short_description,
          p.description,
          p.material,
          p.cover_image,
          JSON.stringify(p.images),
          p.availability,
          p.featured ? 1 : 0,
          p.badge || null,
          JSON.stringify(p.specifications || {})
        )
    );
    await this.db.batch(statements);
  }

  private rowToProduct(row: any): Product {
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      reference: row.reference,
      category: row.category,
      collection: row.collection,
      price: Number(row.price),
      currency: row.currency,
      short_description: row.short_description,
      description: row.description,
      material: row.material,
      cover_image: row.cover_image,
      images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images || [],
      availability: row.availability,
      featured: Boolean(row.featured),
      badge: row.badge || undefined,
      specifications: typeof row.specifications === 'string' ? JSON.parse(row.specifications) : row.specifications || {},
    };
  }

  async getAllProducts(filters?: ProductFilterParams): Promise<Product[]> {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (filters?.category && filters.category !== 'todos') {
      sql += ' AND category = ?';
      params.push(filters.category);
    }
    if (filters?.material && filters.material !== 'todos') {
      sql += ' AND material = ?';
      params.push(filters.material);
    }
    if (filters?.collection && filters.collection !== 'todas') {
      sql += ' AND collection = ?';
      params.push(filters.collection);
    }
    if (filters?.availability && filters.availability !== 'todas') {
      sql += ' AND availability = ?';
      params.push(filters.availability);
    }
    if (filters?.featured !== undefined) {
      sql += ' AND featured = ?';
      params.push(filters.featured ? 1 : 0);
    }
    if (filters?.search) {
      sql += ' AND (name LIKE ? OR reference LIKE ? OR description LIKE ? OR material LIKE ? OR collection LIKE ?)';
      const queryPattern = `%${filters.search}%`;
      params.push(queryPattern, queryPattern, queryPattern, queryPattern, queryPattern);
    }

    if (filters?.sort === 'price-asc') {
      sql += ' ORDER BY price ASC';
    } else if (filters?.sort === 'price-desc') {
      sql += ' ORDER BY price DESC';
    } else if (filters?.sort === 'name-asc') {
      sql += ' ORDER BY name ASC';
    } else if (filters?.sort === 'name-desc') {
      sql += ' ORDER BY name DESC';
    } else {
      sql += ' ORDER BY featured DESC, created_at DESC';
    }

    if (filters?.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
      if (filters?.offset) {
        sql += ' OFFSET ?';
        params.push(filters.offset);
      }
    }

    const { results } = await this.db.prepare(sql).bind(...params).all();
    return (results || []).map((row) => this.rowToProduct(row));
  }

  async getProductById(id: string): Promise<Product | null> {
    const row = await this.db.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
    return row ? this.rowToProduct(row) : null;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const row = await this.db.prepare('SELECT * FROM products WHERE slug = ?').bind(slug).first();
    return row ? this.rowToProduct(row) : null;
  }

  async createProduct(product: Product): Promise<Product> {
    await this.db
      .prepare(
        `INSERT INTO products 
         (id, slug, name, reference, category, collection, price, currency, short_description, description, material, cover_image, images, availability, featured, badge, specifications, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
      )
      .bind(
        product.id,
        product.slug,
        product.name,
        product.reference,
        product.category,
        product.collection,
        product.price,
        product.currency,
        product.short_description,
        product.description,
        product.material,
        product.cover_image,
        JSON.stringify(product.images),
        product.availability,
        product.featured ? 1 : 0,
        product.badge || null,
        JSON.stringify(product.specifications || {})
      )
      .run();

    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const current = await this.getProductById(id);
    if (!current) return null;

    const merged: Product = { ...current, ...updates, id };

    await this.db
      .prepare(
        `UPDATE products SET
         slug = ?, name = ?, reference = ?, category = ?, collection = ?, price = ?, currency = ?,
         short_description = ?, description = ?, material = ?, cover_image = ?, images = ?,
         availability = ?, featured = ?, badge = ?, specifications = ?, updated_at = datetime('now')
         WHERE id = ?`
      )
      .bind(
        merged.slug,
        merged.name,
        merged.reference,
        merged.category,
        merged.collection,
        merged.price,
        merged.currency,
        merged.short_description,
        merged.description,
        merged.material,
        merged.cover_image,
        JSON.stringify(merged.images),
        merged.availability,
        merged.featured ? 1 : 0,
        merged.badge || null,
        JSON.stringify(merged.specifications || {}),
        id
      )
      .run();

    return merged;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const res = await this.db.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
    return (res.meta?.changes ?? 1) > 0;
  }

  async resetToDefaults(): Promise<Product[]> {
    await this.db.prepare('DELETE FROM products').run();
    await this.seedProducts();
    return this.getAllProducts();
  }
}
