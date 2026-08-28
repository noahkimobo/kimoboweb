'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Product } from '@/lib/db/schema'

export function HeroCarousel({ products }: { products: Product[] }) {
  const slides = products.filter((product) => product.images[0])
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [slides.length])

  if (!slides.length) {
    return (
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-secondary lg:aspect-square">
        <Image
          src="/products/hero-living.png"
          alt="A warm minimalist living room featuring the Oak Collection"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    )
  }

  const product = slides[active % slides.length]

  return (
    <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-secondary lg:aspect-square">
      <Link href={`/product/${product.slug}`} className="absolute inset-0">
        <Image
          key={product.id}
          src={product.images[0]}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-opacity duration-500"
        />
        <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 to-transparent px-6 pb-6 pt-16 text-lg font-medium text-white">
          {product.name}
        </span>
      </Link>
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setActive((current) => (current - 1 + slides.length) % slides.length)}
            aria-label="Previous featured product"
            className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition hover:bg-background"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setActive((current) => (current + 1) % slides.length)}
            aria-label="Next featured product"
            className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition hover:bg-background"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="absolute bottom-3 right-4 rounded-full bg-black/45 px-2 py-1 text-xs text-white">
            {active + 1} / {slides.length}
          </div>
        </>
      )}
    </div>
  )
}