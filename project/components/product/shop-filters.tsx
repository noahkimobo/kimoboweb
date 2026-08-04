'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORIES } from '@/lib/format'
import { cn } from '@/lib/utils'

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A–Z' },
]

export function ShopFilters({
  activeCategory,
  activeSort,
  total,
}: {
  activeCategory: string
  activeSort: string
  total: number
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === null) params.delete(key)
      else params.set(key, value)
      router.push(`/shop?${params.toString()}`)
    },
    [router, searchParams],
  )

  const chips = [{ slug: 'all', label: 'All' }, ...CATEGORIES]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((c) => {
          const isActive =
            c.slug === 'all' ? activeCategory === 'all' : activeCategory === c.slug
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => setParam('category', c.slug === 'all' ? null : c.slug)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )}
            >
              {c.label}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? 'piece' : 'pieces'}
        </p>
        <Select value={activeSort} onValueChange={(v) => setParam('sort', v)}>
          <SelectTrigger className="w-48" aria-label="Sort products">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
