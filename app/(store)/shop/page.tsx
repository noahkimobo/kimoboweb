import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ShopFilters } from '@/components/product/shop-filters'
import { ProductCard } from '@/components/product/product-card'
import { getProducts, type ProductSort } from '@/lib/queries'
import { categoryLabel } from '@/lib/format'
import { ArrowDown } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{
  category?: string
  sort?: string
  q?: string
}>

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const { category, sort, q } = await searchParams
  const hasFilters = Boolean(q || (category && category !== 'all') || (sort && sort !== 'newest'))

  return {
    title: 'Shop',
    description: 'Browse the full Kimobo Furnitures collection of solid wood furniture.',
    alternates: {
      canonical: '/shop',
    },
    robots: hasFilters ? { index: false, follow: true } : undefined,
  }
}

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
      <section
        aria-labelledby="black-friday-title"
        className="relative mb-9 overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-950 via-stone-900 to-neutral-950 px-6 py-8 text-white shadow-[0_20px_60px_-30px_rgba(217,147,53,0.75)] sm:px-10 sm:py-10"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-20 size-64 rounded-full bg-amber-400/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 right-1/3 size-52 rounded-full bg-orange-600/15 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200 sm:text-xs">
              November at Kimobo
            </span>
            <h2
              id="black-friday-title"
              className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
            >
              Black Friday
              <span className="block bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 bg-clip-text text-transparent">
                made for home.
              </span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              Find a piece you’ll love for years. Look for the Black Friday mark
              to spot selected furniture with a special price.
            </p>
          </div>
          <Link
            href="#catalogue"
            className="inline-flex min-h-11 w-fit shrink-0 items-center gap-2 rounded-full bg-amber-300 px-5 text-sm font-bold text-neutral-950 transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            Explore the catalogue
            <ArrowDown className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          {heading}
        </h1>
      </header>

      <Suspense fallback={<div className="h-10" />}>
        <ShopFilters activeSort={sort} total={products.length} />
      </Suspense>

      {products.length === 0 ? (
        <div id="catalogue" className="mt-16 flex flex-col items-center gap-2 text-center">
          <p className="font-medium">No pieces found</p>
          <p className="text-sm text-muted-foreground">
            Try a different category or search term.
          </p>
        </div>
      ) : (
        <div id="catalogue" className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} blackFriday />
          ))}
        </div>
      )}
    </div>
  )
}
