import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/lib/db/schema'
import { categoryLabel, formatPrice } from '@/lib/format'

export function ProductCard({ product }: { product: Product }) {
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price
  const soldOut = product.stock <= 0

  return (
    <Link href={`/product/${product.slug}`} className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
        <Image
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {onSale && !soldOut && (
            <Badge className="bg-accent text-accent-foreground hover:bg-accent">
              Sale
            </Badge>
          )}
          {soldOut && <Badge variant="secondary">Sold out</Badge>}
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-0.5">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {categoryLabel(product.category)}
        </span>
        <h3 className="text-sm font-medium leading-snug text-foreground">
          {product.name}
        </h3>
        {product.seaters > 0 && (
          <span className="text-xs text-muted-foreground">
            {product.seaters} Seater{product.seaters > 1 ? 's' : ''}
          </span>
        )}
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-sm font-semibold tabular-nums">
            {formatPrice(product.price)}
          </span>
          {onSale && (
            <span className="text-xs text-muted-foreground line-through tabular-nums">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
