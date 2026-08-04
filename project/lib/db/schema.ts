import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export type ProductColor = { name: string; hex: string }

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull().default(''),
  category: text('category').notNull(),
  // Prices stored in minor units (cents)
  price: integer('price').notNull().default(0),
  compareAtPrice: integer('compare_at_price'),
  images: jsonb('images').$type<string[]>().notNull().default([]),
  colors: jsonb('colors').$type<ProductColor[]>().notNull().default([]),
  materials: jsonb('materials').$type<string[]>().notNull().default([]),
  dimensions: text('dimensions').notNull().default(''),
  weight: text('weight').notNull().default(''),
  stock: integer('stock').notNull().default(0),
  featured: boolean('featured').notNull().default(false),
  model3d: text('model_3d'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type OrderItem = {
  productId: number
  name: string
  slug: string
  image: string
  color: string | null
  price: number
  quantity: number
}

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull().default(''),
  shippingAddress: text('shipping_address').notNull().default(''),
  city: text('city').notNull().default(''),
  postalCode: text('postal_code').notNull().default(''),
  country: text('country').notNull().default(''),
  items: jsonb('items').$type<OrderItem[]>().notNull().default([]),
  subtotal: integer('subtotal').notNull().default(0),
  shipping: integer('shipping').notNull().default(0),
  total: integer('total').notNull().default(0),
  paymentMethod: text('payment_method').notNull().default('cod'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
