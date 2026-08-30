import { NextResponse, type NextRequest } from 'next/server'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { put } from '@vercel/blob'

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
  const files = formData?.getAll('file').filter((item): item is File => item instanceof File) ?? []

  if (!files.length) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
  }

  const invalidFile = files.find((file) => !ALLOWED_TYPES.has(file.type))
  if (invalidFile) {
    return NextResponse.json(
      { error: 'Only JPEG, PNG, WebP, or AVIF images are allowed.' },
      { status: 400 },
    )
  }

  try {
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
        const ext = getExtension(file.type)
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}${ext}`

        if (process.env.BLOB_READ_WRITE_TOKEN) {
          const blob = await put(`uploads/${filename}`, file, {
            access: 'public',
            contentType: file.type,
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
        const fileBuffer = await file.arrayBuffer()
        writeFileSync(filepath, Buffer.from(fileBuffer))
        return `/uploads/${filename}`
      }),
    )

    return NextResponse.json({ urls: uploadResults, url: uploadResults[0] })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
