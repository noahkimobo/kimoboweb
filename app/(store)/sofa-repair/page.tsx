import type { Metadata } from 'next'
import { Armchair, ClipboardCheck, MessageCircle } from 'lucide-react'
import { SofaRepairForm } from '@/components/booking/sofa-repair-form'
import { siteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Book a Sofa Repair Assessment',
  description:
    'Request a repair assessment for your old sofa. Tell Kimobo Furnitures what needs attention and arrange a follow-up by WhatsApp.',
  alternates: { canonical: `${siteUrl}/sofa-repair` },
  openGraph: {
    title: 'Sofa Repair Assessment | Kimobo Furnitures',
    description: 'Request help assessing and repairing your old sofa.',
    url: `${siteUrl}/sofa-repair`,
    type: 'website',
  },
}

const steps = [
  {
    title: 'Tell us about the sofa',
    description: 'Share its age, type, and the repair or refresh it needs.',
    icon: Armchair,
  },
  {
    title: 'Choose a preferred time',
    description: 'Let us know when you would like our team to follow up.',
    icon: ClipboardCheck,
  },
  {
    title: 'Send your request',
    description: 'WhatsApp opens with your details. Our team will confirm next steps.',
    icon: MessageCircle,
  },
]

export default function SofaRepairPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
          Give it a new chapter
        </p>
        <h1 className="mt-3 text-balance font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Book a repair assessment for your old sofa
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Let us know what your sofa needs. Send a repair request and our team will
          contact you to discuss the sofa, possible next steps, and an appointment if
          appropriate. A request is not a confirmed booking or repair quote.
        </p>
      </header>

      <section className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3" aria-label="Repair request process">
        {steps.map(({ title, description, icon: Icon }, index) => (
          <article key={title} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-accent">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Step {index + 1}
            </p>
            <h2 className="mt-1 font-serif text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-12 max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <div className="mb-7">
          <h2 className="font-serif text-2xl font-semibold">Request a sofa repair assessment</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Add your location and a clear description. You can send photos to our team
            in WhatsApp after opening the request.
          </p>
        </div>
        <SofaRepairForm />
      </section>
    </main>
  )
}