import { ProductForm } from '../product-form'

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold tracking-tight">
        Add product
      </h1>
      <ProductForm />
    </div>
  )
}
