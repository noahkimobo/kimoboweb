import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Hero } from '@/components/home/hero'
import { CategoryShowcase } from '@/components/home/category-showcase'
import { ProductCard } from '@/components/product/product-card'
import { getFeaturedProducts } from '@/lib/queries'
import { siteConfig } from '@/lib/site'
import { siteUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const featured = await getFeaturedProducts(18)
  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kimobo Furnitures',
    url: siteUrl,
    sameAs: Object.values(siteConfig.social).filter(Boolean),
  }
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kimobo Furnitures',
    url: siteUrl,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationStructuredData, websiteStructuredData]).replace(/</g, '\\u003c'),
        }}
      />
      <Hero products={featured} />
      <CategoryShowcase />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight">
              Featured pieces
            </h2>
            <p className="mt-2 text-muted-foreground">
              A few of our most-loved designs.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden items-center gap-1 text-sm font-medium text-foreground hover:text-accent sm:flex"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {featured.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
          <h2 className="mx-auto max-w-2xl text-balance font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Not sure where to start?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-primary-foreground/80">
            Message us on WhatsApp and our team will help you find the right pieces for
            your space.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-md bg-background px-6 py-3 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
            >
              Start shopping
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/book-visit"
              className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/40 px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Book a visit
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
