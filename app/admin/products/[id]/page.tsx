import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/queries'
import { ProductForm } from '../product-form'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProductById(Number(id))
  if (!product) notFound()

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold tracking-tight">
        Edit product
      </h1>
      <ProductForm product={product} />
    </div>
  )
}
