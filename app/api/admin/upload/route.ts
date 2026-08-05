import { NextResponse, type NextRequest } from 'next/server'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { put } from '@vercel/blob'

const MAX_BYTES = 4.5 * 1024 * 1024 // 4.5MB Vercel server upload limit
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])

function getExtension(type: string) {
  return type === 'image/jpeg'
    ? '.jpg'
    : type === 'image/png'
    ? '.png'
    : type === 'image/webp'
    ? '.webp'
    : type === 'image/avif'
    ? '.avif'
    : ''
}

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
    return NextResponse.json({ error: 'Image must be under 4.5MB.' }, { status: 400 })
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
  const ext = getExtension(file.type)
  const filename = `${Date.now()}-${safeName}${ext}`

  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${filename}`, file, {
        access: 'public',
        contentType: file.type,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })

      return NextResponse.json({ url: blob.url })
    }

    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true })
    }

    const filepath = path.join(uploadsDir, filename)
    const fileBuffer = await file.arrayBuffer()
    writeFileSync(filepath, Buffer.from(fileBuffer))
    const url = `/uploads/${filename}`

    return NextResponse.json({ url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
