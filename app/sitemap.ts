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
    {
      url: `${siteUrl}/return-policy`,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/book-visit`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...products.map((product) => ({
      url: `${siteUrl}/product/${encodeURIComponent(product.slug)}`,
      lastModified: product.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}