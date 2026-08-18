import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const globalForDb = globalThis as unknown as { pool?: Pool }

const poolConfig: Record<string, any> = { connectionString: process.env.DATABASE_URL }

// Enable SSL for production/Supabase connections where required.
// Supabase Postgres requires SSL; on some Node setups you must disable
// certificate verification by setting `rejectUnauthorized: false`.
if (
  process.env.NODE_ENV === 'production' ||
  (process.env.DATABASE_URL && /supabase\.(?:co|com)/.test(process.env.DATABASE_URL))
) {
  poolConfig.ssl = { rejectUnauthorized: false }
}

export const pool = globalForDb.pool ?? new Pool(poolConfig)

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool

export const db = drizzle(pool, { schema })
