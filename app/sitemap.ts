import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/queries'
import { siteUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts({ sort: 'newest' })

  return [
    {
      url: siteUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/shop`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...products.map((product) => ({
      url: `${siteUrl}/product/${encodeURIComponent(product.slug)}`,
      lastModified: product.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}