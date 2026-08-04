import Link from 'next/link'
import { LayoutDashboard, Package, ExternalLink } from 'lucide-react'
import { siteConfig } from '@/lib/site'
import { LogoutButton } from './logout-button'
import { Toaster } from '@/components/ui/sonner'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-secondary/40">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-background sm:flex">
        <div className="border-b border-border px-5 py-5">
          <span className="font-serif text-lg font-semibold tracking-tight">
            {siteConfig.name}
          </span>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary"
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary"
          >
            <Package className="size-4" />
            Products
          </Link>
          <Link
            href="/"
            target="_blank"
            className="mt-auto flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
          >
            <ExternalLink className="size-4" />
            View store
          </Link>
          <LogoutButton />
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 sm:hidden">
          <span className="font-serif text-lg font-semibold">{siteConfig.name} Admin</span>
          <LogoutButton compact />
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</main>
      </div>
      <Toaster position="top-center" />
    </div>
  )
}
