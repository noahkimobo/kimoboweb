import { siteConfig } from '@/lib/site'
import { cn } from '@/lib/utils'

const ICONS = {
  facebook: (
    <path d="M13.5 22v-8.5h2.85l.43-3.31H13.5V8.05c0-.96.27-1.61 1.64-1.61h1.75V3.5A23 23 0 0 0 14.6 3.4c-2.55 0-4.3 1.56-4.3 4.42v2.37H7.44v3.31h2.86V22h3.2Z" />
  ),
  instagram: (
    <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.5.5.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77a4.9 4.9 0 0 1 1.77-1.15c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 3.5A6.5 6.5 0 1 0 12 18.5 6.5 6.5 0 0 0 12 5.5Zm0 2A4.5 4.5 0 1 1 12 16.5 4.5 4.5 0 0 1 12 7.5ZM18 4.4a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z" />
  ),
  tiktok: (
    <path d="M16.6 2h-3.2v13.6a2.9 2.9 0 1 1-2.06-2.78V9.5a6.1 6.1 0 1 0 5.26 6.05V8.36a8.1 8.1 0 0 0 4.6 1.43V6.57a4.9 4.9 0 0 1-4.6-4.57Z" />
  ),
  twitter: (
    <path d="M18.9 3h3.1l-6.77 7.73L23.3 21h-6.24l-4.89-6.39L6.56 21H3.46l7.24-8.27L2.7 3h6.4l4.42 5.84Zm-1.09 16.17h1.72L7.28 4.73H5.44Z" />
  ),
} as const

export function SocialLinks({ className }: { className?: string }) {
  const links = Object.entries(siteConfig.social).filter(([, url]) => url) as [
    keyof typeof ICONS,
    string,
  ][]

  if (links.length === 0) return null

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {links.map(([key, url]) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Kimobo Furnitures on ${key}`}
          className="flex size-8 items-center justify-center rounded-full border border-border/70 bg-background/80 text-foreground/80 backdrop-blur-sm transition-colors hover:border-foreground hover:text-foreground"
        >
          <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
            {ICONS[key]}
          </svg>
        </a>
      ))}
    </div>
  )
}
