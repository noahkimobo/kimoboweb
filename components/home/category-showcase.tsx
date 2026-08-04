import Image from 'next/image'
import Link from 'next/link'

const categories = [
  { slug: 'living', label: 'Living', image: '/products/cat-living.png' },
  { slug: 'dining', label: 'Dining', image: '/products/cat-dining.png' },
  { slug: 'office', label: 'Office', image: '/products/cat-office.png' },
  { slug: 'bedroom', label: 'Bedroom', image: '/products/cat-bedroom.png' },
]

export function CategoryShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold tracking-tight">
            Shop by room
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find the right piece for every corner of your home.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop?category=${c.slug}`}
            className="group relative aspect-3/4 overflow-hidden rounded-lg bg-secondary"
          >
            <Image
              src={c.image || '/placeholder.svg'}
              alt={`${c.label} furniture`}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/5 to-transparent" />
            <span className="absolute bottom-4 left-4 font-serif text-xl font-semibold text-white">
              {c.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
