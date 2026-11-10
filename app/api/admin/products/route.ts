import { NextResponse, type NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { getPostgresErrorInfo, isProductSlugConflict } from '@/lib/db/errors'
import { getSlugConflictFallback } from '@/lib/db/product-slugs'
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
    const slugsInRequest = new Set<string>()
    const productsToInsert: NewProduct[] = []

    for (const body of validEntries) {
      let candidate: Pick<NewProduct, 'name' | 'slug' | 'category' | 'seaters'> = {
        name: body.name,
        slug: body.slug,
        category: body.category,
        seaters: body.seaters ?? 1,
      }

      for (let attempt = 0; attempt < 50; attempt += 1) {
        const [existing] = await db
          .select({ id: products.id })
          .from(products)
          .where(eq(products.slug, candidate.slug))
          .limit(1)

        if (!existing && !slugsInRequest.has(candidate.slug)) break
        candidate = getSlugConflictFallback(candidate, attempt)
      }

      const [existing] = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.slug, candidate.slug))
        .limit(1)
      if (existing || slugsInRequest.has(candidate.slug)) {
        return NextResponse.json(
          { error: 'Could not generate an available product URL. Please change the slug and try again.' },
          { status: 409 },
        )
      }

      slugsInRequest.add(candidate.slug)
      productsToInsert.push({
        ...body,
        name: candidate.name,
        slug: candidate.slug,
      })
    }

    const created = await db
      .insert(products)
      .values(
        productsToInsert.map((body) => ({
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

    if (isBulkRequest) {
      return NextResponse.json({
        products: created,
        adjustedSlugs: created.some((product, index) => product.slug !== validEntries[index].slug),
      })
    }

    return NextResponse.json({
      product: created[0],
      adjustedSlug: created[0].slug !== validEntries[0].slug,
    })
  } catch (error: unknown) {
    const isDuplicateSlug = isProductSlugConflict(error)
    if (!isDuplicateSlug) {
      console.error('Failed to create product.', {
        errorName: error instanceof Error ? error.name : 'UnknownError',
        ...getPostgresErrorInfo(error),
      })
    }
    return NextResponse.json(
      {
        error: isDuplicateSlug
          ? 'That slug is already in use. Choose a different URL slug.'
          : 'Failed to create product. Please try again.',
      },
      { status: isDuplicateSlug ? 409 : 500 },
    )
  }
}
