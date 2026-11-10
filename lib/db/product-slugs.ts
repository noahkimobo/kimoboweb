import type { NewProduct } from './schema'

type ProductIdentity = Pick<NewProduct, 'name' | 'slug' | 'category' | 'seaters'>

export function getSlugConflictFallback(
  product: ProductIdentity,
  attempt: number,
): ProductIdentity {
  const seaters = Math.max(1, product.seaters ?? 1)
  const isFurniture = product.category !== 'bedroom'
  const baseSlug = product.slug.replace(/-\d+-?seaters?$/i, '')
  const baseName = product.name.replace(/\s+\d+\s*-?\s*seaters?$/i, '').trim()
  const suffix = isFurniture ? `${seaters}-seater` : 'bedroom'
  const retrySuffix = attempt > 0 ? `-${attempt + 1}` : ''
  const nameRetrySuffix = attempt > 0 ? ` ${attempt + 1}` : ''

  return {
    ...product,
    slug: `${baseSlug}-${suffix}${retrySuffix}`,
    name: `${baseName} ${isFurniture ? `${seaters}-Seater` : 'Bedroom'}${nameRetrySuffix}`,
  }
}
