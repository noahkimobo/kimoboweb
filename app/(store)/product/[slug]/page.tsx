import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { getProductBySlug, getRelatedProducts } from "@/lib/queries"
import { ProductGallery } from "@/components/product/product-gallery"
import { PurchasePanel } from "@/components/product/purchase-panel"
import { ProductDetails } from "@/components/product/product-details"
import { ProductCard } from "@/components/product/product-card"
import { siteUrl } from "@/lib/seo"

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Product not found", robots: { index: false, follow: false } }
  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/product/${encodeURIComponent(product.slug)}`,
    },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.description,
      url: `/product/${encodeURIComponent(product.slug)}`,
      images: product.images?.[0]
        ? [{ url: product.images[0], alt: product.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [product.images[0]] : undefined,
    },
  }
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product)
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.slug,
    category: product.category,
    image: (product.images ?? []).map((image) => new URL(image, siteUrl).toString()),
    brand: {
      "@type": "Brand",
      name: "Kimobo Furnitures",
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/product/${encodeURIComponent(product.slug)}`,
      priceCurrency: "KES",
      price: (product.price / 100).toFixed(2),
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/shop" className="hover:text-foreground">
              Shop
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images ?? []} name={product.name} />
        <div className="lg:py-4">
          <PurchasePanel product={product} />
        </div>
      </div>

      <div className="mt-20">
        <ProductDetails product={product} />
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-serif text-2xl text-foreground md:text-3xl">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
