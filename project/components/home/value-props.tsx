import { Leaf, Truck, ShieldCheck, Hammer } from 'lucide-react'

const props = [
  {
    icon: Hammer,
    title: 'Made to last',
    body: 'Solid wood joinery and time-tested construction, built by hand.',
  },
  {
    icon: Truck,
    title: 'Free delivery',
    body: 'Complimentary white-glove delivery on orders over $1,500.',
  },
  {
    icon: ShieldCheck,
    title: 'Lifetime warranty',
    body: 'We stand behind every piece for as long as you own it.',
  },
  {
    icon: Leaf,
    title: 'Responsibly sourced',
    body: 'FSC-certified timber and low-impact natural finishes.',
  },
]

export function ValueProps() {
  return (
    <section className="border-y border-border/70 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {props.map((p) => (
          <div key={p.title} className="flex flex-col gap-2">
            <p.icon className="size-6 text-accent" />
            <h3 className="text-sm font-semibold">{p.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
