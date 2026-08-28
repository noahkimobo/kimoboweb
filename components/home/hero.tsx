import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SocialLinks } from '@/components/layout/social-links'
import type { Product } from '@/lib/db/schema'
import { HeroCarousel } from '@/components/home/hero-carousel'

export function Hero({ products }: { products: Product[] }) {
  return (
    <section className="relative overflow-hidden">
      <SocialLinks className="absolute right-4 top-4 z-10 sm:right-6 lg:right-8" />
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-20 lg:px-8">
        <div className="max-w-xl">
          <h1 className="mt-5 text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Considered furniture for modern living
          </h1>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Solid wood, natural materials, and honest craftsmanship. Pieces designed to be
            lived with and passed down — not replaced.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/shop">
                Shop the collection
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/shop?category=living">Explore living</Link>
            </Button>
          </div>
        </div>

        <HeroCarousel products={products} />
      </div>
    </section>
  )
}
