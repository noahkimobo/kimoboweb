import { NextResponse, type NextRequest } from 'next/server'
import { put } from '@vercel/blob'

const MAX_BYTES = 8 * 1024 * 1024 // 8MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null)
  const file = formData?.get('file')

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'Only JPEG, PNG, WebP, or AVIF images are allowed.' },
      { status: 400 },
    )
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image must be under 8MB.' }, { status: 400 })
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
  const key = `products/${Date.now()}-${safeName}`

  try {
    const blob = await put(key, file, { access: 'public' })
    return NextResponse.json({ url: blob.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
