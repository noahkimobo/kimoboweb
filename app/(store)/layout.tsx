import { Suspense } from 'react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { WhatsappButton } from '@/components/whatsapp-button'
import { Toaster } from '@/components/ui/sonner'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Suspense fallback={<div className="h-16 border-b border-border/70" />}>
        <SiteHeader />
      </Suspense>
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsappButton />
      <Toaster position="top-center" />
    </div>
  )
}
