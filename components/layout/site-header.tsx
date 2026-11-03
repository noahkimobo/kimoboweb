'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { House, Menu, Search, ShoppingCart, X } from 'lucide-react'
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
  const activeCategory = searchParams.get('category')
  const allFurnitureActive =
    pathname === '/shop' && (!activeCategory || activeCategory === 'all')

  function navLinkClass(active: boolean) {
    return cn(
      'rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-background hover:text-foreground',
      active ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground',
    )
  }

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
        <div className="flex items-center gap-1 lg:hidden">
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
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  aria-current={pathname === '/' ? 'page' : undefined}
                  className={cn(
                    'border-b border-border/60 py-3 text-sm font-medium transition-colors hover:bg-secondary',
                    pathname === '/' && 'text-foreground',
                  )}
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setMobileOpen(false)}
                  aria-current={allFurnitureActive ? 'page' : undefined}
                  className={cn(
                    'border-b border-border/60 py-3 text-sm font-medium transition-colors hover:bg-secondary',
                    allFurnitureActive && 'text-foreground',
                  )}
                >
                  All Furniture
                </Link>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/shop?category=${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    aria-current={activeCategory === c.slug ? 'page' : undefined}
                    className={cn(
                      'border-b border-border/60 py-3 text-sm font-medium transition-colors hover:bg-secondary',
                      activeCategory === c.slug && 'text-foreground',
                    )}
                  >
                    {c.label}
                  </Link>
                ))}
                <Link
                  href="/book-visit"
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-border/60 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  Book a visit
                </Link>
                <Link
                  href="/sofa-repair"
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-border/60 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  Sofa repair
                </Link>
                <Link
                  href="/community-jobs"
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-border/60 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  Community jobs
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
          <Link
            href="/"
            aria-label="Home"
            className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <House className="size-5" />
          </Link>
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

        <nav aria-label="Main navigation" className="ml-4 hidden items-center gap-1 xl:flex">
          <Link
            href="/"
            aria-current={pathname === '/' ? 'page' : undefined}
            className={navLinkClass(pathname === '/')}
          >
            Home
          </Link>
          <Link
            href="/shop"
            aria-current={allFurnitureActive ? 'page' : undefined}
            className={navLinkClass(allFurnitureActive)}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              aria-current={activeCategory === c.slug ? 'page' : undefined}
              className={navLinkClass(activeCategory === c.slug)}
            >
              {c.label}
            </Link>
          ))}
          <Link
            href="/book-visit"
            className={cn(
              'rounded-full border border-border px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-background hover:text-foreground',
              pathname === '/book-visit' && 'border-foreground text-foreground',
            )}
            aria-current={pathname === '/book-visit' ? 'page' : undefined}
          >
            Book a visit
          </Link>
          <Link
            href="/sofa-repair"
            aria-current={pathname === '/sofa-repair' ? 'page' : undefined}
            className={navLinkClass(pathname === '/sofa-repair')}
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
