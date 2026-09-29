import { NextResponse, type NextRequest } from 'next/server'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { put } from '@vercel/blob'
import sharp from 'sharp'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const MAX_FILES = 8
const MAX_FILE_SIZE = 4 * 1024 * 1024
const MAX_TOTAL_SIZE = 4 * 1024 * 1024
const MAX_IMAGE_PIXELS = 40_000_000
const MAX_IMAGE_DIMENSION = 2000

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null)
  const files = formData?.getAll('file').filter((item): item is File => item instanceof File) ?? []

  if (!files.length) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
  }

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Upload up to ${MAX_FILES} images at a time.` },
      { status: 400 },
    )
  }

  const invalidFile = files.find((file) => !ALLOWED_TYPES.has(file.type))
  if (invalidFile) {
    return NextResponse.json(
      { error: 'Only JPEG, PNG, WebP, or AVIF images are allowed.' },
      { status: 400 },
    )
  }

  const oversizedFile = files.find((file) => file.size > MAX_FILE_SIZE)
  if (oversizedFile) {
    return NextResponse.json(
      { error: 'Each prepared image must be 4 MB or smaller.' },
      { status: 413 },
    )
  }

  if (files.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_SIZE) {
    return NextResponse.json(
      { error: 'The prepared images must total 4 MB or less. Upload fewer images at a time.' },
      { status: 413 },
    )
  }

  try {
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const input = Buffer.from(await file.arrayBuffer())
        let optimized: Buffer

        try {
          const image = sharp(input, { limitInputPixels: MAX_IMAGE_PIXELS })
          const metadata = await image.metadata()

          if (!metadata.format || !['jpeg', 'png', 'webp', 'avif'].includes(metadata.format)) {
            throw new Error('unsupported format')
          }

          optimized = await image
            .rotate()
            .resize({
              width: MAX_IMAGE_DIMENSION,
              height: MAX_IMAGE_DIMENSION,
              fit: 'inside',
              withoutEnlargement: true,
            })
            .webp({ quality: 82, effort: 4 })
            .toBuffer()
        } catch {
          throw new Error(`Invalid image: ${file.name} could not be decoded.`)
        }

        const safeName = path.parse(file.name).name.replace(/[^a-zA-Z0-9-]/g, '-') || 'product-image'
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}.webp`

        if (process.env.BLOB_READ_WRITE_TOKEN) {
          const blob = await put(`uploads/${filename}`, optimized, {
            access: 'public',
            contentType: 'image/webp',
            token: process.env.BLOB_READ_WRITE_TOKEN,
          })

          return blob.url
        }

        if (process.env.NODE_ENV === 'production') {
          throw new Error('BLOB_READ_WRITE_TOKEN is not configured on the server.')
        }

        const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads')
        if (!existsSync(uploadsDir)) {
          mkdirSync(uploadsDir, { recursive: true })
        }

        const filepath = path.join(uploadsDir, filename)
        writeFileSync(filepath, optimized)
        return `/uploads/${filename}`
      }),
    )

    return NextResponse.json({ urls: uploadResults, url: uploadResults[0] })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed.'
    const invalidImage = message.startsWith('Invalid image:')
    return NextResponse.json({ error: message }, { status: invalidImage ? 400 : 500 })
  }
}
