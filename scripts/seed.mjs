// One-off script to seed the products table with a starter catalog so every
// category page has at least 20 products to show.
//
// This reuses the handful of product photos already in /public/products as
// placeholders across many product "variants" (different names/colors/
// prices). Swap in real photos any time from the admin panel at /admin.
//
// Usage:
//   DATABASE_URL="postgres://..." node scripts/seed.mjs
// or, if DATABASE_URL is already in .env.local / .env:
//   node scripts/seed.mjs

import { readFileSync, existsSync } from 'node:fs'
import { Pool } from 'pg'

// --- minimal .env / .env.local loader (no extra dependency needed) --------
for (const file of ['.env.local', '.env']) {
  if (existsSync(file)) {
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
}

if (!process.env.DATABASE_URL) {
  console.error(
    'DATABASE_URL is not set. Set it in .env.local or pass it inline, e.g.\n' +
      '  DATABASE_URL="postgres://..." node scripts/seed.mjs',
  )
  process.exit(1)
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// --- catalog generation ----------------------------------------------------

const COLORS = [
  { name: 'Oak', hex: '#c9a876' },
  { name: 'Walnut', hex: '#5c4433' },
  { name: 'Charcoal', hex: '#3a3a3a' },
  { name: 'Oat', hex: '#e4dccb' },
  { name: 'Terracotta', hex: '#b5563c' },
  { name: 'Sage', hex: '#8a9a7b' },
  { name: 'Espresso', hex: '#3e2c23' },
  { name: 'Ivory', hex: '#f2ede3' },
  { name: 'Rust', hex: '#a4502c' },
  { name: 'Stone', hex: '#a8a29a' },
]

const NAME_PREFIXES = [
  'Norrland', 'Kessel', 'Alden', 'Marlow', 'Birchwood', 'Hollis', 'Sana',
  'Rowen', 'Tavik', 'Elowen', 'Dunmore', 'Karu', 'Solvei', 'Brenna',
  'Corben', 'Halden', 'Isla', 'Josaka', 'Kembe', 'Larkin', 'Moraine',
  'Nyeri', 'Oakden', 'Perrin',
]

const CATEGORY_BASES = {
  living: [
    { base: 'Sofa', image: '/products/sofa.png', extra: '/products/hero-living.png' },
    { base: 'Lounge Chair', image: '/products/lounge-chair.png', extra: '/products/lounge-chair-detail.png' },
    { base: 'Armchair', image: '/products/lounge-chair-room.png', extra: '/products/lounge-chair.png' },
    { base: 'Sectional Sofa', image: '/products/sofa.png', extra: '/products/hero-living.png' },
  ],
  dining: [
    { base: 'Dining Table', image: '/products/dining-table.png', extra: '/products/cat-dining.png' },
    { base: 'Dining Chair', image: '/products/dining-chair.png', extra: '/products/dining-table.png' },
    { base: 'Bench', image: '/products/dining-table.png', extra: '/products/dining-chair.png' },
    { base: 'Sideboard', image: '/products/dining-table.png', extra: '/products/cat-dining.png' },
  ],
  office: [
    { base: 'Desk', image: '/products/desk.png', extra: '/products/cat-office.png' },
    { base: 'Task Chair', image: '/products/task-chair.png', extra: '/products/desk.png' },
    { base: 'Bookshelf', image: '/products/desk.png', extra: '/products/task-chair.png' },
    { base: 'Standing Desk', image: '/products/desk.png', extra: '/products/cat-office.png' },
  ],
  bedroom: [
    { base: 'Bed Frame', image: '/products/bed.png', extra: '/products/cat-bedroom.png' },
    { base: 'Nightstand', image: '/products/nightstand.png', extra: '/products/bed.png' },
    { base: 'Dresser', image: '/products/nightstand.png', extra: '/products/cat-bedroom.png' },
    { base: 'Headboard', image: '/products/bed.png', extra: '/products/nightstand.png' },
  ],
}

const BASE_PRICE_CENTS = {
  Sofa: 189900, 'Lounge Chair': 74900, Armchair: 64900, 'Sectional Sofa': 249900,
  'Dining Table': 129900, 'Dining Chair': 24900, Bench: 39900, Sideboard: 109900,
  Desk: 84900, 'Task Chair': 49900, Bookshelf: 59900, 'Standing Desk': 99900,
  'Bed Frame': 139900, Nightstand: 29900, Dresser: 94900, Headboard: 44900,
}

const MATERIALS = ['Solid oak', 'Solid walnut', 'FSC-certified pine', 'Ash veneer']

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function buildProducts() {
  const products = []
  let nameIdx = 0
  const PER_CATEGORY = 24 // comfortably over the "not less than 20" requirement

  for (const [category, bases] of Object.entries(CATEGORY_BASES)) {
    for (let i = 0; i < PER_CATEGORY; i++) {
      const { base, image, extra } = bases[i % bases.length]
      const prefix = NAME_PREFIXES[nameIdx % NAME_PREFIXES.length]
      const color = COLORS[i % COLORS.length]
      const color2 = COLORS[(i + 4) % COLORS.length]
      nameIdx++

      const name = `${prefix} ${base}`
      const slug = `${slugify(name)}-${i + 1}`
      const priceBase = BASE_PRICE_CENTS[base] ?? 59900
      // small deterministic price variation so the catalog doesn't look copy-pasted
      const price = Math.round((priceBase * (0.85 + (i % 6) * 0.06)) / 100) * 100
      const onSale = i % 5 === 0
      const compareAtPrice = onSale ? Math.round((price * 1.2) / 100) * 100 : null
      const outOfStock = i % 9 === 0
      const stock = outOfStock ? 0 : 4 + (i % 12)
      const featured = i < 2 // first couple of each category show up as "featured"

      products.push({
        name,
        slug,
        description: `${MATERIALS[i % MATERIALS.length]} ${base.toLowerCase()} finished in ${color.name.toLowerCase()}. Built to order with honest, durable craftsmanship for everyday living.`,
        category,
        price,
        compareAtPrice,
        images: [image, extra].filter(Boolean),
        colors: [color, color2],
        materials: [MATERIALS[i % MATERIALS.length]],
        dimensions: '',
        weight: '',
        stock,
        featured,
      })
    }
  }
  return products
}

async function main() {
  const products = buildProducts()
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    let inserted = 0
    for (const p of products) {
      const res = await client.query(
        `INSERT INTO products
          (name, slug, description, category, price, compare_at_price, images, colors, materials, dimensions, weight, stock, featured)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (slug) DO NOTHING`,
        [
          p.name,
          p.slug,
          p.description,
          p.category,
          p.price,
          p.compareAtPrice,
          JSON.stringify(p.images),
          JSON.stringify(p.colors),
          JSON.stringify(p.materials),
          p.dimensions,
          p.weight,
          p.stock,
          p.featured,
        ],
      )
      inserted += res.rowCount
    }
    await client.query('COMMIT')
    console.log(`Done. Inserted ${inserted} new products (${products.length} attempted, duplicates skipped).`)
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
