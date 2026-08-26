// Import the supplied furniture catalog without changing the admin product form.
//
// Usage:
//   DATABASE_URL="postgres://..." pnpm import:catalog
// or, if DATABASE_URL is already in .env.local / .env:
//   node scripts/seed-catalog.mjs

import { readFileSync, existsSync } from 'node:fs'
import { Pool } from 'pg'

for (const file of ['.env.local', '.env']) {
  if (!existsSync(file)) continue
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (!match) continue
    const key = match[1]
    let value = match[2] ?? ''
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
    if (!(key in process.env)) process.env[key] = value
  }
}

if (!process.env.DATABASE_URL) {
  console.error(
    'DATABASE_URL is not set. Set it in .env.local or pass it inline, e.g.\n' +
      '  DATABASE_URL="postgres://..." node scripts/seed-catalog.mjs',
  )
  process.exit(1)
}

const semiReclinerProducts = [
  ['Classic Charcoal', 'classic-charcoal', 1, 38000, 45000, 'none'],
  ['Classic Navy', 'classic-navy', 1, 38000, 45000, 'none'],
  ['Classic Mocha', 'classic-mocha', 1, 38000, 45000, 'none'],
  ['Classic Forest Green', 'classic-forest-green', 1, 39000, 46000, 'none'],
  ['Classic Burgundy', 'classic-burgundy', 1, 39000, 46000, 'none'],
  ['Classic Sand', 'classic-sand', 1, 38000, 45000, 'none'],
  ['Classic Charcoal with Visible Cupholders', 'classic-charcoal-visible-cupholders', 1, 42000, 50000, 'visible'],
  ['Classic Navy with Retractable Side Cupholders', 'classic-navy-retractable-cupholders', 1, 45000, 53000, 'retractable'],
  ['Compact Charcoal', 'compact-charcoal', 2, 56000, 65000, 'none'],
  ['Compact Navy', 'compact-navy', 2, 56000, 65000, 'none'],
  ['Compact Mocha', 'compact-mocha', 2, 56000, 65000, 'none'],
  ['Compact Emerald', 'compact-emerald', 2, 58000, 68000, 'none'],
  ['Compact Taupe', 'compact-taupe', 2, 56000, 65000, 'none'],
  ['Compact Charcoal with Visible Cupholders', 'compact-charcoal-visible-cupholders', 2, 60000, 70000, 'visible'],
  ['Compact Navy with Retractable Side Cupholders', 'compact-navy-retractable-cupholders', 2, 63000, 74000, 'retractable'],
  ['Family Charcoal', 'family-charcoal', 3, 72000, 82000, 'none'],
  ['Family Navy', 'family-navy', 3, 72000, 82000, 'none'],
  ['Family Mocha', 'family-mocha', 3, 72000, 82000, 'none'],
  ['Family Emerald', 'family-emerald', 3, 75000, 86000, 'none'],
  ['Family Warm Taupe', 'family-warm-taupe', 3, 72000, 82000, 'none'],
  ['Family Charcoal with Visible Cupholders', 'family-charcoal-visible-cupholders', 3, 76000, 88000, 'visible'],
  ['Family Navy with Retractable Side Cupholders', 'family-navy-retractable-cupholders', 3, 79000, 92000, 'retractable'],
  ['Lounge Charcoal', 'lounge-charcoal', 4, 90000, 104000, 'none'],
  ['Lounge Navy', 'lounge-navy', 4, 90000, 104000, 'none'],
  ['Lounge Mocha', 'lounge-mocha', 4, 90000, 104000, 'none'],
  ['Lounge Emerald with Visible Cupholders', 'lounge-emerald-visible-cupholders', 4, 95000, 110000, 'visible'],
  ['Grand Charcoal 5-Seater', 'grand-charcoal-5-seater', 5, 115000, 132000, 'none'],
  ['Grand Navy 6-Seater', 'grand-navy-6-seater', 6, 138000, 158000, 'none'],
  ['Grand Mocha 7-Seater 1+1+2+3 Set', 'grand-mocha-7-seater-1-1-2-3-set', 7, 168000, 192000, 'none'],
  ['Grand Charcoal 7-Seater 1+1+2+3 Set with Retractable Side Cupholders', 'grand-charcoal-7-seater-retractable-cupholders', 7, 182000, 208000, 'retractable'],
].map(([name, slug, seaters, price, compareAtPrice, cupholders], index) => {
  const upholsteryColors = {
    Charcoal: '#4a4a4a',
    Navy: '#1f3a5f',
    Mocha: '#6b4636',
    'Forest Green': '#315c45',
    Burgundy: '#722f37',
    Sand: '#d6c2a5',
    Emerald: '#16805d',
    Taupe: '#9a8976',
  }
  const colorName = Object.keys(upholsteryColors).find((color) => name.includes(color)) ?? 'Charcoal'
  const cupholderDetails = {
    none: 'No side cupholders included. A cupholder-free finish keeps the silhouette clean.',
    visible: 'Includes visible side cupholders. Cupholder colour can be customised to the client request.',
    retractable: 'Includes retractable side cupholders. Cupholder colour can be customised to the client request.',
  }[cupholders]
  const setDetails = seaters === 7 ? ' The 7-seater arrangement is supplied as 1+1+2+3.' : ''

  return {
    name: `Kimobo ${name} Semi-Recliner Sofa`,
    slug: `kimobo-${slug}-semi-recliner`,
    price: price * 100,
    compareAtPrice: compareAtPrice * 100,
    seaters,
    description: `A comfortable fixed-seat semi-recliner sofa made with a solid Eucalyptus frame and high-resilience foam. This model has no reclining mechanism; the semi-recliner name describes the deep, relaxed seating profile. ${cupholderDetails}${setDetails}`,
    stock: index < 8 ? 6 : 4,
    featured: index < 3,
    category: 'living',
    woodType: 'Eucalyptus',
    cushionType: 'High-resilience foam; fixed seating, no reclining mechanism',
    images: [],
    colors: [{ name: colorName, hex: upholsteryColors[colorName] }],
    materials: ['Eucalyptus', 'Upholstery colour customisable', cupholderDetails],
    dimensions: '',
    weight: '',
  }
})

const products = semiReclinerProducts

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    let inserted = 0

    for (const product of products) {
      const result = await client.query(
        `INSERT INTO products
          (name, slug, description, category, price, compare_at_price, images, colors, materials, seaters, wood_type, cushion_type, dimensions, weight, stock, featured)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
         ON CONFLICT (slug) DO NOTHING`,
        [
          product.name,
          product.slug,
          product.description,
          product.category,
          product.price,
          product.compareAtPrice,
          JSON.stringify(product.images),
          JSON.stringify(product.colors),
          JSON.stringify(product.materials),
          product.seaters,
          product.woodType,
          product.cushionType,
          product.dimensions,
          product.weight,
          product.stock,
          product.featured ?? false,
        ],
      )
      inserted += result.rowCount
    }

    await client.query('COMMIT')
    console.log(`Done. Inserted ${inserted} new catalog products (${products.length} attempted, duplicates skipped).`)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
