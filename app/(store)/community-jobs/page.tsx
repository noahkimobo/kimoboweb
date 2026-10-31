import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { getCommunityJobs } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Community jobs',
  description:
    'Find current casual work opportunities shared by Kimobo Furnitures with our community in Kenya.',
  alternates: { canonical: '/community-jobs' },
}

export default async function CommunityJobsPage() {
  const jobs = await getCommunityJobs()

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
          details carefully and contact us on WhatsApp to apply.
        </p>
      </header>

      {jobs.length === 0 ? (
        <section className="mt-10 rounded-2xl border border-border bg-secondary/50 px-6 py-12 text-center sm:px-10">
          <h2 className="font-serif text-2xl font-semibold">No open opportunities right now</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Please check back soon. New listings will appear here when applications are open.
          </p>
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
                    Casual opportunity
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
