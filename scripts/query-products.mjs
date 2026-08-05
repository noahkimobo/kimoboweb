import { readFileSync, existsSync } from 'node:fs'
import { Pool } from 'pg'

for (const file of ['.env.local', '.env']) {
  if (!existsSync(file)) continue
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (!m) continue
    const key = m[1]
    let val = m[2] ?? ''
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
    if (!(key in process.env)) process.env[key] = val
  }
}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Set it in .env.local or .env before running this script.')
  process.exit(1)
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  const client = await pool.connect()
  try {
    const [{ count }] = await client.query('SELECT COUNT(*) FROM products')
    console.log(`\nProducts total: ${count}`)

    const { rows } = await client.query(
      `SELECT id, name, slug, category, price, compare_at_price AS "compareAtPrice", stock, featured, created_at AS "createdAt"
       FROM products
       ORDER BY created_at DESC
       LIMIT 20`,
    )

    console.table(rows)
  } catch (error) {
    console.error('Failed to query products:', error)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
