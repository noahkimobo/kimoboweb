import 'server-only'
import { and, desc, eq, ilike, ne, or, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { orders, products, type Product } from '@/lib/db/schema'

export type ProductSort = 'newest' | 'price-asc' | 'price-desc' | 'name'

export async function getProducts(opts?: {
  category?: string
  search?: string
  sort?: ProductSort
}): Promise<Product[]> {
  const conditions = []
  if (opts?.category && opts.category !== 'all') {
    conditions.push(eq(products.category, opts.category))
  }
  if (opts?.search) {
    const term = `%${opts.search}%`
    conditions.push(
      or(ilike(products.name, term), ilike(products.description, term)),
    )
  }

  const orderBy = (() => {
    switch (opts?.sort) {
      case 'price-asc':
        return products.price
      case 'price-desc':
        return desc(products.price)
      case 'name':
        return products.name
      default:
        return desc(products.createdAt)
    }
  })()

  return db
    .select()
    .from(products)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderBy)
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(eq(products.featured, true))
    .orderBy(desc(products.createdAt))
    .limit(limit)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1)
  return rows[0] ?? null
}

export async function getProductById(id: number): Promise<Product | null> {
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1)
  return rows[0] ?? null
}

export async function getRelatedProducts(
  product: Product,
  limit = 3,
): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(and(eq(products.category, product.category), ne(products.id, product.id)))
    .orderBy(desc(products.createdAt))
    .limit(limit)
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({ category: products.category, count: sql<number>`count(*)::int` })
    .from(products)
    .groupBy(products.category)
  return Object.fromEntries(rows.map((r) => [r.category, r.count]))
}

export async function getOrders() {
  return db.select().from(orders).orderBy(desc(orders.createdAt))
}

export async function getDashboardStats() {
  const [productCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
  const [orderStats] = await db
    .select({
      count: sql<number>`count(*)::int`,
      revenue: sql<number>`coalesce(sum(total), 0)::int`,
    })
    .from(orders)
  const [pending] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(orders)
    .where(eq(orders.status, 'pending'))

  return {
    products: productCount?.count ?? 0,
    orders: orderStats?.count ?? 0,
    revenue: orderStats?.revenue ?? 0,
    pending: pending?.count ?? 0,
  }
}
