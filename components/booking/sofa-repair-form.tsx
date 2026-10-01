'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getCustomerProfile, requestCustomerProfilePrompt, type CustomerProfile } from '@/lib/customer-profile'
import { whatsappLink } from '@/lib/site'

export function SofaRepairForm() {
  const [profile, setProfile] = useState<CustomerProfile>({ name: '', email: '', phone: '' })
  const [requestLink, setRequestLink] = useState('')
  const [dateError, setDateError] = useState('')

  useEffect(() => {
    const savedProfile = getCustomerProfile()
    if (savedProfile) setProfile(savedProfile)
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDateError('')

    const form = new FormData(event.currentTarget)
    const preferredDate = String(form.get('preferredDate') ?? '')
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (new Date(`${preferredDate}T00:00:00`) < today) {
      setDateError('Please choose today or a future date.')
      return
    }

    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const phone = String(form.get('phone') ?? '').trim()
    const details = String(form.get('details') ?? '').trim()
    const lines = [
      'Hi Kimobo Furnitures, I would like to request an assessment for repairing an old sofa.',
      '',
      `Name: ${name}`,
      `Phone / WhatsApp: ${phone}`,
      `Email: ${email || 'Not provided'}`,
      `Location: ${String(form.get('location') ?? '').trim()}`,
      `Sofa type: ${String(form.get('sofaType') ?? '').trim() || 'Not sure'}`,
      `Preferred follow-up date: ${preferredDate}`,
      `Preferred time: ${String(form.get('preferredTime') ?? '')}`,
      `Repair details: ${details}`,
      '',
      'I can share photos of the sofa in this WhatsApp conversation. Please let me know whether an assessment/repair can be arranged and any applicable costs.',
    ]

    setRequestLink(whatsappLink(lines.join('\n')))
    requestCustomerProfilePrompt({ name, email, phone })
  }

  return (
    <form onSubmit={handleSubmit} onChange={() => setRequestLink('')} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="repairName">Your name *</Label>
          <Input id="repairName" name="name" autoComplete="name" required className="h-11" value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="repairPhone">Phone / WhatsApp number *</Label>
          <Input id="repairPhone" name="phone" type="tel" autoComplete="tel" required className="h-11" placeholder="e.g. +254 7XX XXX XXX" value={profile.phone} onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="repairEmail">Email address (optional)</Label>
          <Input id="repairEmail" name="email" type="email" autoComplete="email" className="h-11" value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="repairLocation">Your area / location *</Label>
          <Input id="repairLocation" name="location" autoComplete="address-level2" required className="h-11" placeholder="Neighborhood and town" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sofaType">Sofa type (if known)</Label>
          <Input id="sofaType" name="sofaType" className="h-11" placeholder="e.g. 3-seater, corner sofa" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="repairDate">Preferred follow-up date *</Label>
          <Input id="repairDate" name="preferredDate" type="date" required className="h-11" />
          {dateError && <p className="text-sm text-destructive" role="alert">{dateError}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="repairTime">Preferred time *</Label>
          <select id="repairTime" name="preferredTime" required defaultValue="" className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
            <option value="" disabled>Select a time preference</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Flexible">I’m flexible</option>
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="repairDetails">What needs repair or attention? *</Label>
          <Textarea id="repairDetails" name="details" required rows={5} placeholder="For example: damaged frame, sagging cushions, torn upholstery, or loose legs. Add the sofa's approximate age if you know it." />
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-5">
        <Button type="submit" size="lg" className="h-12 w-full gap-2 text-base">
          Prepare repair request
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          This opens a pre-filled WhatsApp message. Our team will review your request
          and confirm whether an assessment can be arranged.
        </p>
      </div>

      {requestLink && (
        <div className="rounded-xl border border-[#25D366]/40 bg-[#25D366]/5 p-4" role="status">
          <p className="text-sm leading-relaxed">Your repair request is ready. Send it to our team on WhatsApp and attach sofa photos if available.</p>
          <Button asChild className="mt-3 h-11 w-full gap-2 bg-[#168c45] text-white hover:bg-[#11753a]">
            <a href={requestLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" aria-hidden="true" />
              Send repair request on WhatsApp
            </a>
          </Button>
        </div>
      )}
    </form>
  )
}