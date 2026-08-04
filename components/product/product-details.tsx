import type { Product } from "@/lib/db/schema"
import { Truck, RotateCcw, ShieldCheck } from "lucide-react"

export function ProductDetails({ product }: { product: Product }) {
  const specs: { label: string; value: string }[] = [
    { label: "Dimensions", value: product.dimensions || "—" },
    { label: "Weight", value: product.weight || "—" },
    { label: "Materials", value: (product.materials ?? []).join(", ") || "—" },
    { label: "Category", value: product.category },
  ]

  return (
    <div className="grid gap-12 md:grid-cols-2">
      <div>
        <h2 className="font-serif text-2xl text-foreground">Specifications</h2>
        <dl className="mt-6 divide-y divide-border border-y border-border">
          {specs.map((s) => (
            <div key={s.label} className="flex items-start justify-between gap-6 py-4">
              <dt className="text-sm uppercase tracking-wide text-muted-foreground">{s.label}</dt>
              <dd className="text-right text-foreground capitalize">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <h2 className="font-serif text-2xl text-foreground">The details</h2>
        <ul className="mt-6 flex flex-col gap-6">
          <li className="flex gap-4">
            <Truck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <p className="font-medium text-foreground">Free white-glove delivery</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Delivered and assembled in your home within 2–4 weeks.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <p className="font-medium text-foreground">30-day returns</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Not the right fit? Return it within 30 days, no questions asked.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <p className="font-medium text-foreground">10-year warranty</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every piece is built to last and backed for a decade.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}
