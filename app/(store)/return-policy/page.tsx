import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MessageCircle, RotateCcw } from 'lucide-react'
import { siteUrl } from '@/lib/seo'
import { siteConfig, whatsappLink } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description:
    'Read the Kimobo Furnitures return policy. Request a return within 30 days of delivery and contact our team for help with your order.',
  alternates: {
    canonical: `${siteUrl}/return-policy`,
  },
  openGraph: {
    title: 'Returns & Refunds | Kimobo Furnitures',
    description:
      'Our 30-day return policy and how to contact Kimobo Furnitures about a return or order issue.',
    url: `${siteUrl}/return-policy`,
    type: 'website',
  },
}

const returnSteps = [
  {
    title: 'Contact us within 30 days',
    description: `Message ${siteConfig.name} on WhatsApp within 30 calendar days of receiving your order. Include your order number and the item you would like to return. You do not need to provide a reason to start a return request.`,
  },
  {
    title: 'Agree on the return arrangements',
    description:
      'Our team will get in touch to confirm the return details and agree on a practical way to get the furniture back to us. We will confirm any applicable return or collection costs with you before you proceed.',
  },
  {
    title: 'Return the item',
    description:
      'Please keep the item, its parts, and any accessories together, and follow the return instructions provided by our team. We will confirm the next steps once the item is received.',
  },
]

export default function ReturnPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
          Customer care
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Returns &amp; refunds
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          We want you to feel good about the furniture you bring home. If it is not
          right for you, contact us within 30 days of delivery and we will help you
          arrange a return.
        </p>
      </div>

      <section className="mt-12 rounded-2xl border border-border bg-secondary/40 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-background text-accent">
            <RotateCcw className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-serif text-2xl font-semibold">30-day return window</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Return requests must be made within 30 calendar days after your order is
              delivered. Get in touch with us as soon as you can so we can guide you
              through the process.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-3xl font-semibold">How to request a return</h2>
        <ol className="mt-7 space-y-7">
          {returnSteps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-sm font-semibold">
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-serif text-3xl font-semibold">Damaged or incorrect orders</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          If your order arrives damaged or you received the wrong item, please message
          us on WhatsApp as soon as possible. Include your order number and clear photos
          of the item so our team can help resolve the issue.
        </p>
      </section>

      <section className="mt-14 rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold">Need help with an order?</h2>
            <p className="mt-2 text-primary-foreground/80">
              Contact our team and we will help with your return request.
            </p>
          </div>
          <Link
            href={whatsappLink('Hi, I need help with a return. My order number is: ')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-background px-5 py-3 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Message us
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <p className="mt-8 text-sm text-muted-foreground">
        Questions? Reach us on WhatsApp at {siteConfig.phone}.
      </p>
    </main>
  )
}