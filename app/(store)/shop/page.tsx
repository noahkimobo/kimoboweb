import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ShopFilters } from '@/components/product/shop-filters'
import { ProductCard } from '@/components/product/product-card'
import { getProducts, type ProductSort } from '@/lib/queries'
import { categoryLabel } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse the full Kimobo Furnitures collection of solid wood furniture.',
}

type SearchParams = Promise<{
  category?: string
  sort?: string
  q?: string
}>

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { category = 'all', sort = 'newest', q } = await searchParams
  const products = await getProducts({
    category,
    sort: sort as ProductSort,
    search: q,
  })

  const heading = q
    ? `Results for “${q}”`
    : category !== 'all'
      ? categoryLabel(category)
      : 'All Furniture'

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          {heading}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Solid wood pieces designed to be lived with. Every order includes white-glove
          delivery and our lifetime warranty.
        </p>
      </header>

      <Suspense fallback={<div className="h-10" />}>
        <ShopFilters activeCategory={category} activeSort={sort} total={products.length} />
      </Suspense>

      {products.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-2 text-center">
          <p className="font-medium">No pieces found</p>
          <p className="text-sm text-muted-foreground">
            Try a different category or search term.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
