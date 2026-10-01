'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Menu, Search, ShoppingCart, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { CATEGORIES } from '@/lib/format'
import { siteConfig } from '@/lib/site'
import { useCart } from '@/components/cart/cart-provider'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const { count, setOpen: setCartOpen } = useCart()

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
    setSearchOpen(false)
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-accent/30 bg-secondary/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-serif text-xl">{siteConfig.name}</SheetTitle>
              </SheetHeader>
              <nav className="mt-2 flex flex-col px-4">
                <Link
                  href="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-border/60 py-3 text-sm font-medium"
                >
                  All Furniture
                </Link>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/shop?category=${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="border-b border-border/60 py-3 text-sm font-medium"
                  >
                    {c.label}
                  </Link>
                ))}
                <Link
                  href="/book-visit"
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-border/60 py-3 text-sm font-medium"
                >
                  Book a visit
                </Link>
                <Link
                  href="/sofa-repair"
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-border/60 py-3 text-sm font-medium"
                >
                  Sofa repair
                </Link>
              </nav>
              <form onSubmit={submitSearch} className="mt-4 flex gap-2 px-4">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search furniture"
                  aria-label="Search furniture"
                />
                <Button type="submit" size="icon" aria-label="Search">
                  <Search className="size-4" />
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/" className="flex items-center">
          <Image
            src="/brand-logo.svg"
            alt=""
            width={28}
            height={38}
            className="mr-2 h-[38px] w-7 object-contain"
          />
          <span className="text-lg font-semibold tracking-tight sm:text-xl">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-7 lg:flex">
          <Link
            href="/shop"
            className={cn(
              'text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
              pathname === '/shop' && !searchParams.get('category') && 'text-foreground',
            )}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className={cn(
                'text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                searchParams.get('category') === c.slug && 'text-foreground',
              )}
            >
              {c.label}
            </Link>
          ))}
          <Link
            href="/book-visit"
            className={cn(
              'rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary',
              pathname === '/book-visit' && 'border-foreground text-foreground',
            )}
          >
            Book a visit
          </Link>
          <Link
            href="/sofa-repair"
            className={cn(
              'text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
              pathname === '/sofa-repair' && 'text-foreground',
            )}
          >
            Sofa repair
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Open cart${count ? ` with ${count} items` : ''}`}
            onClick={() => setCartOpen(true)}
            className="relative"
          >
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Button>
          {searchOpen ? (
            <form onSubmit={submitSearch} className="hidden items-center gap-2 md:flex">
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search furniture"
                aria-label="Search furniture"
                className="h-9 w-56"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              className="hidden md:inline-flex"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-5" />
            </Button>
          )}

        </div>
      </div>
    </header>
  )
}
