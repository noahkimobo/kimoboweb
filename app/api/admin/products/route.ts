import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { products, type NewProduct } from '@/lib/db/schema'

function hasRequiredFields(
  body: Partial<NewProduct> | null | undefined,
): body is NewProduct {
  return (
    typeof body?.name === 'string' &&
    typeof body.slug === 'string' &&
    typeof body.category === 'string'
  )
}

export async function POST(request: NextRequest) {
  const requestBody = (await request.json().catch(() => null)) as
    | Partial<NewProduct>
    | Partial<NewProduct>[]
    | null
  const isBulkRequest = Array.isArray(requestBody)
  const entries = isBulkRequest
    ? requestBody
    : requestBody
      ? [requestBody]
      : []

  const validEntries = entries.filter(hasRequiredFields)
  if (entries.length === 0 || validEntries.length !== entries.length) {
    return NextResponse.json(
      { error: 'name, slug, and category are required.' },
      { status: 400 },
    )
  }

  try {
    const created = await db
      .insert(products)
      .values(
        validEntries.map((body) => ({
          name: body.name,
          slug: body.slug,
          description: body.description ?? '',
          category: body.category,
          price: body.price ?? 0,
          compareAtPrice: body.compareAtPrice ?? null,
          images: body.images ?? [],
          videoUrl: body.videoUrl ?? null,
          colors: body.colors ?? [],
          materials: body.materials ?? [],
          seaters: body.seaters ?? 1,
          woodType: body.woodType ?? '',
          cushionType: body.cushionType ?? '',
          bedSize: body.bedSize ?? null,
          bottomBedSize: body.bottomBedSize ?? null,
          topBedSize: body.topBedSize ?? null,
          doubleDecker: body.doubleDecker ?? false,
          dimensions: body.dimensions ?? '',
          weight: body.weight ?? '',
          stock: body.stock ?? 0,
          featured: body.featured ?? false,
        })),
      )
      .returning()

    return NextResponse.json(isBulkRequest ? { products: created } : { product: created[0] })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create product.'
    const isDuplicateSlug = message.includes('products_slug_unique') || message.includes('duplicate key')
    return NextResponse.json(
      { error: isDuplicateSlug ? 'That slug is already in use.' : message },
      { status: 400 },
    )
  }
}
