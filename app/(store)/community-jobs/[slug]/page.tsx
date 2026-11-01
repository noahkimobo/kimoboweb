import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin, MessageCircle } from 'lucide-react'
import {
  communityJobCategoryLabel,
  normalizeEmployerPhone,
} from '@/lib/community-jobs'
import { getCommunityJobBySlug } from '@/lib/queries'
import { siteUrl } from '@/lib/seo'

type Params = { params: Promise<{ slug: string }> }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const job = await getCommunityJobBySlug(slug)
  if (!job) return { title: 'Opportunity not found' }

  const title = job.title.length > 35 ? `${job.title.slice(0, 32)}…` : job.title
  const description = [
    `${job.title} casual work opportunity in ${job.location}.`,
    job.compensation ? `${job.compensation}.` : '',
    'Contact the employer on WhatsApp to apply.',
  ]
    .filter(Boolean)
    .join(' ')
    .slice(0, 160)
  return {
    title: `${title} — Casual job`,
    description,
    alternates: { canonical: `/community-jobs/${encodeURIComponent(job.slug)}` },
    openGraph: { type: 'article', title: job.title, description },
  }
}

export default async function CommunityJobDetailPage({ params }: Params) {
  const { slug } = await params
  const job = await getCommunityJobBySlug(slug)
  if (!job) notFound()

  const applyMessage = [
    `Hello, I would like to apply for this opportunity: ${job.title}.`,
    `Location: ${job.location}`,
    `Opportunity: ${siteUrl}/community-jobs/${encodeURIComponent(job.slug)}`,
  ].join('\n')
  const employerPhone = normalizeEmployerPhone(job.employerPhone)
  const employerWhatsApp = employerPhone
    ? `https://wa.me/${employerPhone}?text=${encodeURIComponent(applyMessage)}`
    : null
  const categoryLabel = communityJobCategoryLabel(job.category)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: [job.description, job.requirements].filter(Boolean).join('\n\n'),
    datePosted: job.createdAt.toISOString(),
    ...(job.closesAt ? { validThrough: job.closesAt.toISOString() } : {}),
    employmentType: 'TEMPORARY',
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'KE',
      },
    },
    ...(job.compensation
      ? {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'KES',
            value: { '@type': 'QuantitativeValue', description: job.compensation },
          },
        }
      : {}),
  }
  const requirements = job.requirements.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <Link
        href="/community-jobs"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All community jobs
      </Link>

      <header className="mt-8 border-b border-border pb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {categoryLabel}
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          {job.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4" aria-hidden="true" />
            {job.location}
          </span>
          {job.compensation && <span>{job.compensation}</span>}
          {job.closesAt && (
            <span>
              Applications close{' '}
              {new Intl.DateTimeFormat('en-KE', { dateStyle: 'long' }).format(job.closesAt)}
            </span>
          )}
        </div>
      </header>

      <div className="grid gap-8 py-8 md:grid-cols-[1fr_18rem]">
        <div className="space-y-8">
          <section>
            <h2 className="font-serif text-xl font-semibold">About the work</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
              {job.description}
            </p>
          </section>
          {requirements.length > 0 && (
            <section>
              <h2 className="font-serif text-xl font-semibold">What you’ll need</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">
                {requirements.map((requirement, index) => (
                  <li key={`${index}-${requirement}`}>{requirement}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <aside className="h-fit rounded-2xl bg-secondary/60 p-5 sm:p-6">
          <h2 className="font-serif text-xl font-semibold">Interested?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Message the employer directly on WhatsApp and mention this opportunity.
          </p>
          {employerWhatsApp ? (
            <>
              <a
                href={employerWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Apply on WhatsApp
              </a>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Employer: +{employerPhone}
              </p>
            </>
          ) : (
            <p className="mt-5 rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
              The employer’s WhatsApp contact is not available yet. Please check back later.
            </p>
          )}
        </aside>
      </div>
    </article>
  )
}
