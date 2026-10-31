import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Ruler, Sparkles, SwatchBook, Trees } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Craft: Comfort, Materials & Quality',
  description:
    'Discover how Kimobo Furnitures puts comfort and quality first through considered design, colour and material choices, skilled craftsmanship, and quality checks.',
  alternates: { canonical: '/our-craft' },
  openGraph: {
    title: 'Our Craft | Kimobo Furnitures',
    description:
      'Comfort and quality guide every furniture choice, from design and materials to craftsmanship and final checks.',
    type: 'website',
  },
}

const priorities = [
  {
    title: 'Designed for everyday comfort',
    description:
      'We consider how a piece feels and functions in daily life—not only how it looks. Proportion, support, usability, and the way furniture fits a room all matter.',
    icon: Sparkles,
  },
  {
    title: 'Thoughtful colour and design',
    description:
      'Shape, finish, and colour choices are considered together so each piece feels balanced, welcoming, and easy to live with in your space.',
    icon: SwatchBook,
  },
  {
    title: 'Materials chosen with care',
    description:
      'Material choices influence comfort, appearance, durability, and care. We aim to select materials that suit the purpose of each piece and explain those choices clearly.',
    icon: Trees,
  },
  {
    title: 'Craftsmanship and quality checks',
    description:
      'Time invested in making matters. We pay attention to construction, finishing, and checks before a piece is ready, with the goal of delivering furniture you can enjoy for years.',
    icon: Check,
  },
]

export default function OurCraftPage() {
  return (
    <article>
      <header className="relative overflow-hidden bg-secondary/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            How we make a difference
          </p>
          <h1 className="mt-4 max-w-4xl text-balance font-serif text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Comfort and quality, considered at every step.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Good furniture starts long before it reaches your home. We invest care in
            design, colour, materials, craftsmanship, and quality control—so the finished
            piece feels as considered as it looks.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-md bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Explore the collection
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Our priorities
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Made with intention. Chosen to be lived with.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              We believe comfort is part of good design, and quality comes from the
              decisions behind the finished piece—not just its appearance.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {priorities.map(({ title, description, icon: Icon }, index) => (
              <article
                key={title}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  0{index + 1}
                </p>
                <h3 className="mt-1 font-serif text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/75">
              Find your fit
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
              See the details. Picture it in your home.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
              Browse the collection for product photos, dimensions, materials, and
              options—or book a visit to talk through your space.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-background px-5 py-3 text-sm font-semibold text-foreground"
            >
              Shop furniture <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/book-visit"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-primary-foreground/40 px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Ruler className="size-4" aria-hidden="true" />
              Book a visit
            </Link>
          </div>
        </div>
      </section>
    </article>
  )
}
