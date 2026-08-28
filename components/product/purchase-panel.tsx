"use client"

import { useState } from "react"
import { Minus, Plus, Check, ShoppingBag, MessageCircle } from "lucide-react"
import type { Product, ProductColor } from "@/lib/db/schema"
import { formatPrice } from "@/lib/format"
import { whatsappLink } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart/cart-provider"

export function PurchasePanel({ product }: { product: Product }) {
  const { addItem } = useCart()
  const colors = (product.colors ?? []) as ProductColor[]
  const [color, setColor] = useState<ProductColor | null>(colors[0] ?? null)
  const [qty, setQty] = useState(1)

  const inStock = product.stock > 0
  const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images?.[0] ?? "",
        color: color?.name ?? null,
        maxStock: product.stock,
      },
      qty,
    )
  }

  function handleWhatsAppOrder() {
    const message = [
      "Hi Kimobo Furnitures, I would like to order:",
      "",
      `Product: ${product.name}`,
      `Price: ${formatPrice(product.price)}`,
      `Color: ${color?.name ?? "Not specified"}`,
      `Quantity: ${qty}`,
      `Product page: ${product.slug}`,
    ].join("\n")
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm uppercase tracking-widest text-muted-foreground">{product.category}</p>
        <h1 className="mt-2 font-serif text-3xl leading-tight text-foreground text-balance md:text-4xl">
          {product.name}
        </h1>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl text-foreground">{formatPrice(product.price)}</span>
          {onSale && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice as number)}
              </span>
              <Badge className="bg-accent text-accent-foreground hover:bg-accent">Sale</Badge>
            </>
          )}
        </div>
      </div>

      <p className="leading-relaxed text-muted-foreground">{product.description}</p>

      {colors.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-foreground">
            Color: <span className="text-muted-foreground">{color?.name}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => {
              const active = color?.name === c.name
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={c.name}
                  aria-pressed={active}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition data-[active=true]:ring-2 data-[active=true]:ring-foreground"
                  data-active={active}
                >
                  <span
                    className="h-8 w-8 rounded-full border border-border"
                    style={{ backgroundColor: c.hex }}
                  />
                  {active && (
                    <Check
                      className="absolute h-4 w-4 text-background mix-blend-difference"
                      strokeWidth={3}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-foreground">Quantity</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-full border border-border">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="flex h-11 w-11 items-center justify-center text-foreground disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-foreground tabular-nums">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              disabled={qty >= product.stock}
              className="flex h-11 w-11 items-center justify-center text-foreground disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            {inStock ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
      </div>

      <Button
        size="lg"
        className="h-14 rounded-full bg-primary text-base text-primary-foreground hover:bg-primary/90"
        disabled={!inStock}
        onClick={handleAdd}
      >
        <ShoppingBag className="mr-2 h-5 w-5" />
        {inStock ? "Add to cart" : "Out of stock"}
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="h-14 rounded-full border-[#25D366] text-base text-[#168c45] hover:bg-[#25D366]/10 hover:text-[#168c45]"
        disabled={!inStock}
        onClick={handleWhatsAppOrder}
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        Order on WhatsApp
      </Button>
    </div>
  )
}
