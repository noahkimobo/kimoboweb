'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  if (compact) {
    return (
      <Button variant="ghost" size="icon" aria-label="Log out" onClick={handleLogout}>
        <LogOut className="size-4" />
      </Button>
    )
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-secondary"
    >
      <LogOut className="size-4" />
      Log out
    </button>
  )
}
