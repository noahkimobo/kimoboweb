import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { products, type NewProduct } from '@/lib/db/schema'

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Partial<NewProduct> | null
  if (!body || !body.name || !body.slug || !body.category) {
    return NextResponse.json(
      { error: 'name, slug, and category are required.' },
      { status: 400 },
    )
  }

  try {
    const [created] = await db
      .insert(products)
      .values({
        name: body.name,
        slug: body.slug,
        description: body.description ?? '',
        category: body.category,
        price: body.price ?? 0,
        compareAtPrice: body.compareAtPrice ?? null,
        images: body.images ?? [],
        colors: body.colors ?? [],
        materials: body.materials ?? [],
        dimensions: body.dimensions ?? '',
        weight: body.weight ?? '',
        stock: body.stock ?? 0,
        featured: body.featured ?? false,
      })
      .returning()

    return NextResponse.json({ product: created })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create product.'
    const isDuplicateSlug = message.includes('products_slug_unique') || message.includes('duplicate key')
    return NextResponse.json(
      { error: isDuplicateSlug ? 'That slug is already in use.' : message },
      { status: 400 },
    )
  }
}
