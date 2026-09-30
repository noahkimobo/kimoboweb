'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  CUSTOMER_PROFILE_EVENT,
  customerProfilePromptIsSnoozed,
  getCustomerProfile,
  saveCustomerProfile,
  snoozeCustomerProfilePrompt,
  type CustomerProfile,
} from '@/lib/customer-profile'

const emptyProfile: CustomerProfile = { name: '', email: '', phone: '' }

export function CustomerProfilePrompt() {
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState<CustomerProfile>(emptyProfile)
  const [error, setError] = useState('')

  useEffect(() => {
    function handlePrompt(event: Event) {
      if (getCustomerProfile() || customerProfilePromptIsSnoozed()) return

      const detail = (event as CustomEvent<Partial<CustomerProfile> | undefined>).detail
      const savedProfile = getCustomerProfile()
      setProfile({
        name: detail?.name ?? savedProfile?.name ?? '',
        email: detail?.email ?? savedProfile?.email ?? '',
        phone: detail?.phone ?? savedProfile?.phone ?? '',
      })
      setError('')
      setOpen(true)
    }

    window.addEventListener(CUSTOMER_PROFILE_EVENT, handlePrompt)
    return () => window.removeEventListener(CUSTOMER_PROFILE_EVENT, handlePrompt)
  }, [])

  function closePrompt() {
    snoozeCustomerProfilePrompt()
    setOpen(false)
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      saveCustomerProfile({
        name: profile.name.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
      })
      setOpen(false)
    } catch {
      setError('Your browser could not save these details. You can continue as a guest.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && closePrompt()}>
      <DialogContent className="max-w-md rounded-2xl border border-accent/30 p-6 sm:p-7">
        <DialogHeader className="pr-6">
          <span className="mb-1 flex size-11 items-center justify-center rounded-full bg-secondary text-foreground">
            <UserRound className="size-5" aria-hidden="true" />
          </span>
          <DialogTitle className="font-serif text-xl font-semibold">
            Save your details for next time?
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Save a guest profile on this device to make future bookings and checkout
            quicker. No password or account is required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="mt-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profileName">Full name *</Label>
            <Input
              id="profileName"
              autoComplete="name"
              required
              value={profile.name}
              onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profileEmail">Email address *</Label>
            <Input
              id="profileEmail"
              type="email"
              autoComplete="email"
              required
              value={profile.email}
              onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profilePhone">Phone / WhatsApp (optional)</Label>
            <Input
              id="profilePhone"
              type="tel"
              autoComplete="tel"
              value={profile.phone}
              onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
            />
          </div>

          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={closePrompt}>
              Not now
            </Button>
            <Button type="submit">Save guest profile</Button>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Details stay in this browser and are not sent until you submit an order or
            booking request.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}