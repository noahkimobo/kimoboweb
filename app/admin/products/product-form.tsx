'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { Loader2, Trash2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORIES } from '@/lib/format'
import type { Product, ProductColor } from '@/lib/db/schema'

type FormState = {
  name: string
  slug: string
  category: string
  description: string
  priceDollars: string
  compareAtPriceDollars: string
  seaters: string
  woodType: string
  cushionType: string
  stock: string
  featured: boolean
  images: string[]
  colors: ProductColor[]
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function toDollars(cents: number | null | undefined) {
  if (cents == null) return ''
  return (cents / 100).toString()
}

function toCents(dollars: string): number {
  const n = Number.parseFloat(dollars)
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const isEditing = Boolean(product)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [slugTouched, setSlugTouched] = useState(isEditing)

  const [form, setForm] = useState<FormState>({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    category: product?.category ?? CATEGORIES[0].slug,
    description: product?.description ?? '',
    priceDollars: toDollars(product?.price ?? 0),
    compareAtPriceDollars: toDollars(product?.compareAtPrice),
    seaters: String(product?.seaters ?? 1),
    woodType: product?.woodType ?? '',
    cushionType: product?.cushionType ?? '',
    stock: String(product?.stock ?? 0),
    featured: product?.featured ?? false,
    images: product?.images ?? [],
    colors: product?.colors ?? [],
  })

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleNameChange(value: string) {
    update('name', value)
    if (!slugTouched) update('slug', slugify(value))
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    setUploading(true)
    try {
      const uploadedUrls: string[] = []

      for (const file of files) {
        const body = new FormData()
        body.append('file', file)
        const res = await fetch('/api/admin/upload', { method: 'POST', body })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Upload failed.')
        uploadedUrls.push(data.url as string)
      }

      update('images', [...form.images, ...uploadedUrls])
      toast.success(files.length > 1 ? `${files.length} images uploaded` : 'Image uploaded')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function removeImage(index: number) {
    update(
      'images',
      form.images.filter((_, i) => i !== index),
    )
  }

  function addColor() {
    update('colors', [...form.colors, { name: '', hex: '#8a8a8a' }])
  }

  function updateColor(index: number, patch: Partial<ProductColor>) {
    update(
      'colors',
      form.colors.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    )
  }

  function removeColor(index: number) {
    update(
      'colors',
      form.colors.filter((_, i) => i !== index),
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      category: form.category,
      description: form.description.trim(),
      price: toCents(form.priceDollars),
      compareAtPrice: form.compareAtPriceDollars.trim()
        ? toCents(form.compareAtPriceDollars)
        : null,
      seaters: Math.max(1, Number.parseInt(form.seaters, 10) || 1),
      woodType: form.woodType.trim(),
      cushionType: form.cushionType.trim(),
      stock: Math.max(0, Number.parseInt(form.stock, 10) || 0),
      featured: form.featured,
      images: form.images,
      colors: form.colors.filter((c) => c.name.trim()),
    }

    if (!payload.name || !payload.slug) {
      toast.error('Name is required.')
      return
    }

    startTransition(async () => {
      const url = isEditing ? `/api/admin/products/${product!.id}` : '/api/admin/products'
      const res = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Something went wrong.')
        return
      }
      toast.success(isEditing ? 'Product updated' : 'Product created')
      router.push('/admin/products')
      router.refresh()
    })
  }

  async function handleDelete() {
    if (!product) return
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return
    startTransition(async () => {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' })
      if (!res.ok) {
        toast.error('Could not delete product.')
        return
      }
      toast.success('Product deleted')
      router.push('/admin/products')
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="slug">URL slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true)
              update('slug', slugify(e.target.value))
            }}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={form.category}
            onValueChange={(v) => v && update('category', v as string)}
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <Label htmlFor="featured" className="cursor-pointer">
            Featured on homepage
          </Label>
          <Switch
            id="featured"
            checked={form.featured}
            onCheckedChange={(v) => update('featured', v)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Price (KES)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={form.priceDollars}
            onChange={(e) => update('priceDollars', e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="compareAtPrice">Compare-at price (KES, optional, shows as "sale")</Label>
          <Input
            id="compareAtPrice"
            type="number"
            min="0"
            step="0.01"
            value={form.compareAtPriceDollars}
            onChange={(e) => update('compareAtPriceDollars', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="seaters">Seaters</Label>
          <Input
            id="seaters"
            type="number"
            min="1"
            step="1"
            value={form.seaters}
            onChange={(e) => update('seaters', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="woodType">Wood type</Label>
          <Input
            id="woodType"
            value={form.woodType}
            onChange={(e) => update('woodType', e.target.value)}
            placeholder="e.g. Mahogany"
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="cushionType">Sitting area</Label>
          <Select
            value={form.cushionType}
            onValueChange={(v) => update('cushionType', v ?? '')}
          >
            <SelectTrigger id="cushionType" className="w-full">
              <SelectValue placeholder="Choose a filling type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Spring cushion">Spring cushion</SelectItem>
              <SelectItem value="Fiber filled">Fiber filled</SelectItem>
              <SelectItem value="High density foam">High density foam</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-border p-4">
        <div className="flex items-center justify-between">
          <Label>Stock &amp; availability</Label>
          <div className="flex items-center gap-2">
            <Switch
              checked={Number(form.stock) > 0}
              onCheckedChange={(checked) => update('stock', checked ? '10' : '0')}
            />
            <span className="text-xs text-muted-foreground">
              {Number(form.stock) > 0 ? 'In stock' : 'Out of stock'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="stock" className="text-sm text-muted-foreground">
            Quantity on hand
          </Label>
          <Input
            id="stock"
            type="number"
            min="0"
            className="w-28"
            value={form.stock}
            onChange={(e) => update('stock', e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Images</Label>
        <div className="flex flex-wrap gap-3">
          {form.images.map((src, i) => (
            <div
              key={src + i}
              className="group relative size-24 overflow-hidden rounded-md border border-border bg-secondary"
            >
              <Image src={src} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label="Remove image"
                className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex size-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Upload className="size-5" />
            )}
            <span className="text-[11px]">{uploading ? 'Uploading' : 'Upload'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label>Colors</Label>
          <Button type="button" variant="outline" size="sm" onClick={addColor}>
            Add color
          </Button>
        </div>
        {form.colors.length > 0 && (
          <div className="flex flex-col gap-2">
            {form.colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="color"
                  value={c.hex}
                  onChange={(e) => updateColor(i, { hex: e.target.value })}
                  className="size-9 shrink-0 cursor-pointer rounded-md border border-border bg-transparent"
                  aria-label="Color swatch"
                />
                <Input
                  value={c.name}
                  onChange={(e) => updateColor(i, { name: e.target.value })}
                  placeholder="Color name (e.g. Walnut)"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeColor(i)}
                  aria-label="Remove color"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-6">
        {isEditing ? (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="size-4" />
            Delete product
          </Button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || uploading}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isEditing ? 'Save changes' : 'Create product'}
          </Button>
        </div>
      </div>
    </form>
  )
}
