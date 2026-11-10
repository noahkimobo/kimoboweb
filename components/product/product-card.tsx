import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, MessageCircle, Sparkles } from 'lucide-react'
import type { Product } from '@/lib/db/schema'
import { categoryLabel, formatPrice } from '@/lib/format'
import { whatsappLink } from '@/lib/site'

export function ProductCard({
  product,
  blackFriday = false,
}: {
  product: Product
  blackFriday?: boolean
}) {
  const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price
  const soldOut = product.stock <= 0
  const isBlackFridayDeal = blackFriday && onSale && !soldOut
  const discountPercent = onSale
    ? Math.max(1, Math.round((1 - product.price / product.compareAtPrice!) * 100))
    : 0

  const whatsappMessage = `Hi Kimobo Furnitures, I would like to order:\n\nProduct: ${product.name}\nPrice: ${formatPrice(product.price)}\nQuantity: 1\nProduct page: ${product.slug}`

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
        isBlackFridayDeal
        ? 'border-amber-400/40 bg-gradient-to-br from-neutral-950 via-neutral-900 to-stone-900 text-white shadow-[0_12px_36px_-18px_rgba(217,147,53,0.65)] hover:border-amber-300/70 hover:shadow-[0_18px_42px_-18px_rgba(217,147,53,0.8)]'
        : 'border-border bg-card text-card-foreground hover:shadow-lg'
      }`}
    >
      <div className="relative p-2 pb-0">
        <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
          <Image
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {isBlackFridayDeal && (
            <div
              aria-label={`Black Friday deal, save ${discountPercent}%`}
              className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent"
            />
          )}
          <div
            className={`absolute left-2 right-2 top-2 flex items-start sm:left-3 sm:right-3 sm:top-3 ${
              isBlackFridayDeal ? 'justify-between gap-1' : 'flex-col gap-1.5'
            }`}
          >
            {isBlackFridayDeal ? (
              <span className="inline-flex min-w-0 items-center gap-1 rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-2 py-1 text-[8px] font-black uppercase tracking-wide text-neutral-950 shadow-lg sm:px-2.5 sm:text-[10px] sm:tracking-wider">
                <Sparkles className="size-3 shrink-0" aria-hidden="true" />
                Black Friday
              </span>
            ) : onSale && !soldOut ? (
              <Badge className="bg-accent text-accent-foreground hover:bg-accent">
                Sale
              </Badge>
            ) : null}
            {isBlackFridayDeal && (
              <span className="shrink-0 rounded-full bg-red-600 px-2 py-1 text-[10px] font-extrabold text-white shadow-lg sm:px-2.5 sm:text-xs">
                -{discountPercent}%
              </span>
            )}
            {soldOut && <Badge variant="secondary">Sold out</Badge>}
          </div>
          {isBlackFridayDeal && (
            <span className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-black/55 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
              Save {formatPrice(product.compareAtPrice! - product.price)}
            </span>
          )}
        </div>
        </Link>
        <a
        href={whatsappLink(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Order ${product.name} on WhatsApp`}
          className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <MessageCircle className="size-5" />
        </a>
      </div>
      <div className={`flex flex-1 flex-col gap-1 p-3 pt-3 sm:p-4 ${isBlackFridayDeal ? 'sm:pt-3' : ''}`}>
        <span className={`text-[10px] uppercase tracking-[0.16em] ${
          isBlackFridayDeal ? 'text-amber-300/80' : 'text-muted-foreground'
        }`}>
          {categoryLabel(product.category)}
        </span>
        <h3 className="text-sm font-semibold leading-snug">
          {product.name}
        </h3>
        {product.category !== 'bedroom' && product.seaters > 0 && (
          <span className={`text-xs ${isBlackFridayDeal ? 'text-white/60' : 'text-muted-foreground'}`}>
            {product.seaters} Seater{product.seaters > 1 ? 's' : ''}
          </span>
        )}
        {product.category === 'bedroom' && product.bedSize && (
          <span className={`text-xs ${isBlackFridayDeal ? 'text-white/60' : 'text-muted-foreground'}`}>
            {product.bedSize} ft bed
          </span>
        )}
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-3">
          <span className={`text-base font-bold tabular-nums ${
            isBlackFridayDeal ? 'text-amber-300' : ''
          }`}>
            {formatPrice(product.price)}
          </span>
          {onSale && (
            <span className={`text-xs line-through tabular-nums ${
              isBlackFridayDeal ? 'text-white/50' : 'text-muted-foreground'
            }`}>
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
        {isBlackFridayDeal && (
          <Link
            href={`/product/${product.slug}`}
            className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-amber-300 px-4 text-xs font-bold text-neutral-950 transition-colors hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            Discover this deal
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  )
}
