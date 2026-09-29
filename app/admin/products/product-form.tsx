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
  videoUrl: string
  priceDollars: string
  compareAtPriceDollars: string
  seaters: string
  woodType: string
  cushionType: string
  bedSize: string
  bottomBedSize: string
  topBedSize: string
  doubleDecker: boolean
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

async function compressImageToWebp(file: File): Promise<File> {
  const maxInputBytes = 20 * 1024 * 1024
  const maxPixels = 40_000_000
  const maxOutputBytes = 450 * 1024

  if (file.size > maxInputBytes) {
    throw new Error(`${file.name} is larger than 20 MB. Choose a smaller image.`)
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error(`${file.name} could not be opened as an image.`)
  }

  try {
    if (bitmap.width * bitmap.height > maxPixels) {
      throw new Error(`${file.name} has too many pixels. Resize it and try again.`)
    }

    const maxDimensions = [...new Set(
      [2000, 1600, 1200, 1000, 800].map((maxDimension) =>
        Math.min(maxDimension, Math.max(bitmap.width, bitmap.height)),
      ),
    )]

    for (const maxDimension of maxDimensions) {
      const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(bitmap.width * scale))
      canvas.height = Math.max(1, Math.round(bitmap.height * scale))

      const context = canvas.getContext('2d')
      if (!context) throw new Error('Your browser could not prepare this image.')
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

      for (const quality of [0.82, 0.72, 0.62, 0.52]) {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, 'image/webp', quality),
        )
        if (!blob) throw new Error('Your browser could not convert this image to WebP.')
        if (blob.type !== 'image/webp') {
          throw new Error('Your browser does not support WebP image conversion.')
        }
        if (blob.size <= maxOutputBytes) {
          const baseName = file.name.replace(/\.[^.]+$/, '') || 'product-image'
          return new File([blob], `${baseName}.webp`, {
            type: 'image/webp',
            lastModified: Date.now(),
          })
        }
      }
    }
  } finally {
    bitmap.close()
  }

  throw new Error(`${file.name} could not be reduced enough. Try a different image.`)
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
    videoUrl: product?.videoUrl ?? '',
    priceDollars: toDollars(product?.price ?? 0),
    compareAtPriceDollars: toDollars(product?.compareAtPrice),
    seaters: String(product?.seaters ?? 1),
    woodType: product?.woodType ?? '',
    cushionType: product?.cushionType ?? '',
    bedSize: product?.bedSize ?? '',
    bottomBedSize: product?.bottomBedSize ?? '',
    topBedSize: product?.topBedSize ?? '',
    doubleDecker: product?.doubleDecker ?? false,
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
      const body = new FormData()
      for (const file of files) {
        body.append('file', await compressImageToWebp(file))
      }

      const res = await fetch('/api/admin/upload', { method: 'POST', body })
      const responseText = await res.text()
      let data: {
        error?: string
        url?: string
        urls?: string[]
      }
      try {
        data = JSON.parse(responseText) as {
          error?: string
          url?: string
          urls?: string[]
        }
      } catch {
        throw new Error(`Upload failed (${res.status}). ${responseText.slice(0, 120)}`)
      }

      if (!res.ok) throw new Error(data.error ?? 'Upload failed.')

      const uploadedUrls = Array.isArray(data.urls)
        ? data.urls
        : data.url
          ? [data.url]
          : []

      if (!uploadedUrls.length) {
        throw new Error('Upload succeeded but no image URLs were returned.')
      }

      setForm((current) => ({
        ...current,
        images: [...current.images, ...uploadedUrls],
      }))
      const countLabel = files.length > 1 ? `${files.length} images uploaded` : 'Image uploaded'
      toast.success(`${countLabel} as WebP`)
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
      videoUrl: form.videoUrl.trim() || null,
      price: toCents(form.priceDollars),
      compareAtPrice: form.compareAtPriceDollars.trim()
        ? toCents(form.compareAtPriceDollars)
        : null,
      seaters: Math.max(1, Number.parseInt(form.seaters, 10) || 1),
      woodType: form.woodType.trim(),
      cushionType: form.cushionType.trim(),
      bedSize: form.category === 'bedroom' ? form.bedSize || null : null,
      bottomBedSize: form.category === 'bedroom' && form.doubleDecker
        ? form.bottomBedSize || null
        : null,
      topBedSize: form.category === 'bedroom' && form.doubleDecker
        ? form.topBedSize || null
        : null,
      doubleDecker: form.category === 'bedroom' && form.doubleDecker,
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
            Show in homepage carousel
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

        {form.category !== 'bedroom' && (
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
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="woodType">Wood type</Label>
          <Input
            id="woodType"
            value={form.woodType}
            onChange={(e) => update('woodType', e.target.value)}
            placeholder="e.g. Mahogany"
          />
        </div>

        {form.category !== 'bedroom' && (
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
        )}

        {form.category === 'bedroom' && (
          <div className="flex flex-col gap-4 rounded-md border border-border p-4 sm:col-span-2">
            <div>
              <Label htmlFor="bedSize">Bed size (feet)</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Select a size up to the maximum 6 x 6 feet.
              </p>
            </div>
            <Select
              value={form.bedSize}
              onValueChange={(value) => update('bedSize', value ?? '')}
            >
              <SelectTrigger id="bedSize" className="w-full sm:w-64">
                <SelectValue placeholder="Choose bed size" />
              </SelectTrigger>
              <SelectContent>
                {['3 x 6', '4 x 6', '5 x 6', '6 x 6'].map((size) => (
                  <SelectItem key={size} value={size}>
                    {size} feet
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="doubleDecker">Double-decker combination</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Mark this product as a double-decker bed.
                </p>
              </div>
              <Switch
                id="doubleDecker"
                checked={form.doubleDecker}
                onCheckedChange={(checked) => update('doubleDecker', checked)}
              />
            </div>
            {form.doubleDecker && (
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['bottomBedSize', 'Bottom bed size'],
                  ['topBedSize', 'Top bed size'],
                ].map(([field, label]) => (
                  <div key={field} className="flex flex-col gap-2">
                    <Label htmlFor={field}>{label} (feet)</Label>
                    <Select
                      value={form[field as 'bottomBedSize' | 'topBedSize']}
                      onValueChange={(value) =>
                        update(field as 'bottomBedSize' | 'topBedSize', value ?? '')
                      }
                    >
                      <SelectTrigger id={field}>
                        <SelectValue placeholder="Choose size" />
                      </SelectTrigger>
                      <SelectContent>
                        {['3 x 6', '4 x 6', '5 x 6', '6 x 6'].map((size) => (
                          <SelectItem key={size} value={size}>
                            {size} feet
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="videoUrl">Product video link (optional)</Label>
          <Input
            id="videoUrl"
            type="url"
            value={form.videoUrl}
            onChange={(e) => update('videoUrl', e.target.value)}
            placeholder="https://www.tiktok.com/@your-account/video/..."
          />
          <p className="text-xs text-muted-foreground">
            Add a TikTok or other video URL for this product.
          </p>
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
        <div>
          <Label>Images</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Images are automatically resized, compressed, and saved as WebP.
          </p>
        </div>
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
                aria-label={`Delete image ${i + 1}`}
                title="Delete image"
                className="absolute right-1 top-1 flex size-7 items-center justify-center rounded-md bg-destructive text-destructive-foreground shadow-sm transition-opacity hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex size-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border px-2 text-center text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Upload className="size-5" />
            )}
            <span className="text-[11px]">
              {uploading ? 'Uploading' : 'Upload images'}
            </span>
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
