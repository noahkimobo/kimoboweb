export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export const CATEGORIES = [
  { slug: 'living', label: 'Living' },
  { slug: 'dining', label: 'Dining' },
  { slug: 'office', label: 'Office' },
  { slug: 'bedroom', label: 'Bedroom' },
] as const

export type CategorySlug = (typeof CATEGORIES)[number]['slug']

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug
}

// Free shipping over this threshold (cents), otherwise flat rate.
export const FREE_SHIPPING_THRESHOLD = 150000
export const FLAT_SHIPPING = 4900

export function calcShipping(subtotal: number): number {
  if (subtotal === 0) return 0
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING
}
