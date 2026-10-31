import type { MetadataRoute } from 'next'
import { getCommunityJobs, getProducts } from '@/lib/queries'
import { siteUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, jobs] = await Promise.all([
    getProducts({ sort: 'newest' }),
    getCommunityJobs(),
  ])

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
    {
      url: `${siteUrl}/sofa-repair`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/our-craft`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/sustainability`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/community-jobs`,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    ...jobs.map((job) => ({
      url: `${siteUrl}/community-jobs/${encodeURIComponent(job.slug)}`,
      lastModified: job.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.65,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/product/${encodeURIComponent(product.slug)}`,
      lastModified: product.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}