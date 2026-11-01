import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import {
  COMMUNITY_JOB_CATEGORIES,
  communityJobCategoryLabel,
} from '@/lib/community-jobs'
import { getCommunityJobs } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Community jobs',
  description:
    'Find current casual work opportunities shared by Kimobo Furnitures with our community in Kenya.',
  alternates: { canonical: '/community-jobs' },
}

export default async function CommunityJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: selectedCategory } = await searchParams
  const allJobs = await getCommunityJobs()
  const knownCategories = new Set<string>(
    COMMUNITY_JOB_CATEGORIES.map((jobCategory) => jobCategory.slug),
  )
  const additionalCategories = [...new Set(allJobs.map((job) => job.category))]
    .filter((jobCategory) => !knownCategories.has(jobCategory))
    .map((slug) => ({ slug, label: communityJobCategoryLabel(slug) }))
  const categories = [...COMMUNITY_JOB_CATEGORIES, ...additionalCategories]
  const jobs = selectedCategory
    ? allJobs.filter((job) => job.category === selectedCategory)
    : allJobs

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Opportunities in our community
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Find a good day’s work.
        </h1>
        <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground sm:text-lg">
          We share casual work opportunities here as they become available. Read the
          details carefully and contact the employer directly on WhatsApp to apply.
        </p>
      </header>

      <nav aria-label="Filter jobs by type" className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/community-jobs"
          aria-current={!selectedCategory ? 'page' : undefined}
          className={`inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'border-foreground bg-foreground text-background'
              : 'border-border bg-background text-muted-foreground hover:text-foreground'
          }`}
        >
          All opportunities
          <span className="ml-2 text-xs opacity-70">{allJobs.length}</span>
        </Link>
        {categories.map((jobCategory) => {
          const count = allJobs.filter((job) => job.category === jobCategory.slug).length
          const active = selectedCategory === jobCategory.slug

          return (
            <Link
              key={jobCategory.slug}
              href={`/community-jobs?category=${jobCategory.slug}`}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              {jobCategory.label}
              <span className="ml-2 text-xs opacity-70">{count}</span>
            </Link>
          )
        })}
      </nav>

      {jobs.length === 0 ? (
        <section className="mt-10 rounded-2xl border border-border bg-secondary/50 px-6 py-12 text-center sm:px-10">
          <h2 className="font-serif text-2xl font-semibold">
            {selectedCategory ? 'No open jobs in this category yet' : 'No open opportunities right now'}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            We’re growing the listings across chapati cooking, salon work, nail
            technology, kinyozi, and more. Please check back soon.
          </p>
          {selectedCategory && (
            <Link
              href="/community-jobs"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              Browse all opportunities <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </section>
      ) : (
        <section aria-label="Open community jobs" className="mt-10 grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <article
              key={job.id}
              className="flex flex-col rounded-2xl border border-border bg-background p-5 transition-shadow hover:shadow-md sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {communityJobCategoryLabel(job.category)}
                  </p>
                  <h2 className="mt-2 font-serif text-xl font-semibold tracking-tight sm:text-2xl">
                    {job.title}
                  </h2>
                </div>
                {job.compensation && (
                  <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">
                    {job.compensation}
                  </span>
                )}
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {job.description}
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                {job.location}
              </p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                <span className="text-xs text-muted-foreground">
                  {job.closesAt
                    ? `Apply by ${new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium' }).format(job.closesAt)}`
                    : 'Applications open'}
                </span>
                <Link
                  href={`/community-jobs/${encodeURIComponent(job.slug)}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
                >
                  View opportunity
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}
