'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCart } from '@/components/cart/cart-provider'
import { calcShipping, formatPrice, FREE_SHIPPING_THRESHOLD } from '@/lib/format'

export function CartDrawer() {
  const { items, subtotal, isOpen, setOpen, updateQuantity, removeItem } = useCart()
  const shipping = calcShipping(subtotal)
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl">
            Your Cart{' '}
            {items.length > 0 && (
              <span className="text-muted-foreground">({items.length})</span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add something beautiful to get started.
              </p>
            </div>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/shop">Browse furniture</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              {remaining > 0 && (
                <p className="mb-3 rounded-md bg-accent/10 px-3 py-2 text-xs text-foreground">
                  You&apos;re {formatPrice(remaining)} away from free delivery.
                </p>
              )}
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={`${item.productId}-${item.color}`} className="flex gap-3 py-4">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="relative size-20 shrink-0 overflow-hidden rounded-md bg-secondary"
                    >
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <div>
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={() => setOpen(false)}
                            className="text-sm font-medium leading-snug hover:underline"
                          >
                            {item.name}
                          </Link>
                          {item.color && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {item.color}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => removeItem(item.productId, item.color)}
                          className="h-fit text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-md border border-border">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.color,
                                item.quantity - 1,
                              )
                            }
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            disabled={item.quantity >= item.maxStock}
                            className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.color,
                                item.quantity + 1,
                              )
                            }
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-medium tabular-nums">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="gap-0 border-t border-border">
              <div className="space-y-2 pb-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium tabular-nums">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">{formatPrice(subtotal + shipping)}</span>
                </div>
              </div>
              <Button asChild size="lg" className="w-full" onClick={() => setOpen(false)}>
                <Link href="/checkout">Checkout</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                <Link href="/cart">View cart</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
