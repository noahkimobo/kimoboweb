'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Expand } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export function ProductGallery({
  images,
  name,
}: {
  images: string[]
  name: string
}) {
  const gallery = images.length ? images : ['/placeholder.svg']
  const [active, setActive] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setZoomOpen(true)}
        className="group relative aspect-square overflow-hidden rounded-xl bg-secondary"
        aria-label="Zoom image"
      >
        <Image
          src={gallery[active] || '/placeholder.svg'}
          alt={`${name} — view ${active + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          <Expand className="size-4" />
        </span>
      </button>

      {gallery.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                'relative aspect-square overflow-hidden rounded-lg bg-secondary ring-2 ring-transparent transition',
                active === i && 'ring-foreground',
              )}
            >
              <Image
                src={src || '/placeholder.svg'}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-4xl overflow-hidden p-0">
          <DialogTitle className="sr-only">{name} enlarged image</DialogTitle>
          <div className="relative aspect-square w-full bg-secondary">
            <Image
              src={gallery[active] || '/placeholder.svg'}
              alt={`${name} — enlarged`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
