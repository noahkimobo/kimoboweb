import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Handshake, Mail, MessageCircle, Sprout, Trees } from 'lucide-react'
import { siteConfig, whatsappLink } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Sustainability & Our Community Vision',
  description:
    'Learn about Kimobo Furnitures’ proposed school tree-planting initiative, connecting furniture purchases with trees, school furniture donations, and sponsorship.',
  alternates: { canonical: '/sustainability' },
  openGraph: {
    title: 'Sustainability & Community Vision | Kimobo Furnitures',
    description:
      'Our proposed initiative aims to connect tree planting through schools with future school furniture support and sponsorship.',
    type: 'website',
  },
}

const proposedSteps = [
  {
    title: 'Plant a tree through a school',
    description:
      'For each furniture purchase, our proposed program would support planting a tree in partnership with a participating school and local planting partners.',
    icon: Sprout,
  },
  {
    title: 'Care for it and share progress',
    description:
      'Planting is only a beginning. A responsible program would agree who cares for each tree and share clear progress updates with customers and schools.',
    icon: Trees,
  },
  {
    title: 'Grow into school support',
    description:
      'As the program develops, our longer-term ambition is to support schools through furniture donations and sponsorship, shaped with the schools and community.',
    icon: BookOpen,
  },
]

export default function SustainabilityPage() {
  const contactMessage =
    'Hi Kimobo Furnitures, I would like to talk with your team about the school tree-planting and community support initiative.'
  const emailSubject = encodeURIComponent('Sustainability initiative')
  const emailBody = encodeURIComponent(
    'Hello Kimobo Furnitures,\n\nI would like to talk with your team about the school tree-planting and community support initiative.',
  )

  return (
    <article>
      <header className="bg-secondary/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            A community idea we want to grow
          </p>
          <h1 className="mt-4 max-w-4xl text-balance font-serif text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Furniture that gives something back.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            We are exploring an initiative that links every furniture purchase to a
            tree planted through a school program, with a longer-term hope of supporting
            schools with furniture donations and sponsorship.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            This is a proposed initiative, not a program currently in operation. We
            will share confirmed partners, launch details, and progress here when they
            are in place.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              The idea
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Start with a tree. Build lasting support.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              We want the idea to be practical and accountable. That means working with
              schools and planting partners, planning for tree care, and being open
              about what has—and has not—been achieved.
            </p>
          </div>

          <ol className="space-y-4">
            {proposedSteps.map(({ title, description, icon: Icon }, index) => (
              <li
                key={title}
                className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[auto_1fr] sm:p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Proposed step 0{index + 1}
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
        <div className="grid gap-6 rounded-2xl bg-foreground p-6 text-background sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <span className="flex size-11 items-center justify-center rounded-full bg-background/10">
              <Handshake className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-serif text-2xl font-semibold sm:text-3xl">
              Help us shape the initiative
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-background/75 sm:text-base">
              Schools, educators, community groups, and tree-planting partners can
              contact us to discuss what a thoughtful and measurable program could
              look like.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappLink(contactMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Talk to our team on WhatsApp
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href={`mailto:${siteConfig.email}?subject=${emailSubject}&body=${emailBody}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-background/30 px-5 py-3 text-sm font-semibold text-background hover:bg-background/10"
            >
              <Mail className="size-4" aria-hidden="true" />
              Email our team
            </a>
            <Link
              href="/community-jobs"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-background/30 px-5 py-3 text-sm font-semibold text-background hover:bg-background/10"
            >
              Community opportunities
            </Link>
          </div>
        </div>
      </section>
    </article>
  )
}
