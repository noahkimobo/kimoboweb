import { NextResponse, type NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { products, type NewProduct } from '@/lib/db/schema'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  const productId = Number(id)
  if (!Number.isFinite(productId)) {
    return NextResponse.json({ error: 'Invalid product id.' }, { status: 400 })
  }

  const body = (await request.json().catch(() => null)) as Partial<NewProduct> | null
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Only allow known, editable fields through.
  const updates: Partial<NewProduct> = {}
  const allowed: (keyof NewProduct)[] = [
    'name', 'slug', 'description', 'category', 'price', 'compareAtPrice',
    'images', 'colors', 'materials', 'seaters', 'woodType', 'cushionType',
    'dimensions', 'weight', 'stock', 'featured',
  ]
  for (const key of allowed) {
    if (key in body) (updates as Record<string, unknown>)[key] = body[key]
  }

  try {
    const [updated] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, productId))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
    }
    return NextResponse.json({ product: updated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update product.'
    const isDuplicateSlug = message.includes('products_slug_unique') || message.includes('duplicate key')
    return NextResponse.json(
      { error: isDuplicateSlug ? 'That slug is already in use.' : message },
      { status: 400 },
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const productId = Number(id)
  if (!Number.isFinite(productId)) {
    return NextResponse.json({ error: 'Invalid product id.' }, { status: 400 })
  }

  const [deleted] = await db.delete(products).where(eq(products.id, productId)).returning()
  if (!deleted) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
