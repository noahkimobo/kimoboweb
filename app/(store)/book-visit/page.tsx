import type { Metadata } from 'next'
import { Armchair, DraftingCompass, Ruler, Store } from 'lucide-react'
import { BookingForm } from '@/components/booking/booking-form'
import { siteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Book a Visit or Design Consultation',
  description:
    'Request a home measurement visit, showroom appointment, custom furniture consultation, or old sofa repair assessment with Kimobo Furnitures in Kenya.',
  alternates: {
    canonical: `${siteUrl}/book-visit`,
  },
  openGraph: {
    title: 'Book a Visit | Kimobo Furnitures',
    description:
      'Arrange a home measurement, showroom visit, custom furniture consultation, or sofa repair assessment.',
    url: `${siteUrl}/book-visit`,
    type: 'website',
  },
}

const bookingOptions = [
  {
    title: 'House measurement',
    description: 'Plan your space and make sure a piece fits just right.',
    icon: Ruler,
  },
  {
    title: 'Showroom visit',
    description: 'See our furniture and materials in person.',
    icon: Store,
  },
  {
    title: 'Custom order consultation',
    description: 'Talk through a made-to-order piece for your home.',
    icon: DraftingCompass,
  },
  {
    title: 'Old sofa repair',
    description: 'Tell us what needs repair and request an assessment.',
    icon: Armchair,
  },
]

export default function BookVisitPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
          Personal appointments
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Let’s make a plan for your space
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Request a home measurement, a showroom visit, or a one-to-one consultation
          for a custom furniture order. Share a preferred time and our team will confirm
          availability with you.
        </p>
      </header>

      <section className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2" aria-label="Appointment types">
        {bookingOptions.map(({ title, description, icon: Icon }) => (
          <article key={title} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-accent">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-serif text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-12 max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <div className="mb-7">
          <h2 className="font-serif text-2xl font-semibold">Request an appointment</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Send your request to our team on WhatsApp. Your appointment is not confirmed
            until we reply and agree on a time.
          </p>
        </div>
        <BookingForm />
      </section>
    </main>
  )
}