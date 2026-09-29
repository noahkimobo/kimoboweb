'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { whatsappLink } from '@/lib/site'

type BookingType = 'house-measurement' | 'showroom-visit' | 'custom-order'

const bookingTypeLabels: Record<BookingType, string> = {
  'house-measurement': 'House measurement',
  'showroom-visit': 'Showroom visit',
  'custom-order': 'Custom order consultation',
}

export function BookingForm() {
  const [bookingType, setBookingType] = useState<BookingType | ''>('')
  const [dateError, setDateError] = useState('')
  const [requestLink, setRequestLink] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDateError('')

    const formData = new FormData(event.currentTarget)
    const preferredDate = String(formData.get('preferredDate') ?? '')
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (new Date(`${preferredDate}T00:00:00`) < today) {
      setDateError('Choose today or a future date.')
      return
    }

    const selectedType = String(formData.get('bookingType')) as BookingType
    const details = String(formData.get('details') ?? '').trim()
    const lines = [
      'Hi Kimobo Furnitures, I would like to request an appointment.',
      '',
      `Appointment: ${bookingTypeLabels[selectedType]}`,
      `Name: ${String(formData.get('name') ?? '').trim()}`,
      `Phone: ${String(formData.get('phone') ?? '').trim()}`,
      `Email: ${String(formData.get('email') ?? '').trim() || 'Not provided'}`,
      `Preferred date: ${preferredDate}`,
      `Preferred time: ${String(formData.get('preferredTime') ?? '')}`,
      ...(details ? [`Details: ${details}`] : []),
      '',
      'I understand this request is subject to confirmation.',
    ]

    setRequestLink(whatsappLink(lines.join('\n')))
  }

  const detailLabel = bookingType === 'house-measurement'
    ? 'Visit address and area'
    : bookingType === 'custom-order'
      ? 'Tell us about your custom order'
      : 'Anything you would like us to prepare?'

  const detailPlaceholder = bookingType === 'house-measurement'
    ? 'Share your neighborhood, address, and any helpful directions.'
    : bookingType === 'custom-order'
      ? 'Describe the piece you have in mind, including approximate size, materials, or inspiration.'
      : 'For example, which pieces or materials would you like to see?'

  const detailsRequired = bookingType === 'house-measurement' || bookingType === 'custom-order'

  return (
    <form onSubmit={handleSubmit} onChange={() => setRequestLink('')} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="bookingType">What would you like to book? *</Label>
        <select
          id="bookingType"
          name="bookingType"
          value={bookingType}
          onChange={(event) => setBookingType(event.target.value as BookingType | '')}
          required
          className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="" disabled>Select an appointment type</option>
          <option value="house-measurement">House measurement</option>
          <option value="showroom-visit">Showroom visit</option>
          <option value="custom-order">Custom order consultation</option>
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bookingName">Your name *</Label>
          <Input id="bookingName" name="name" autoComplete="name" required className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bookingPhone">Phone / WhatsApp number *</Label>
          <Input
            id="bookingPhone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            className="h-11"
            placeholder="e.g. +254 7XX XXX XXX"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="bookingEmail">Email address (optional)</Label>
          <Input
            id="bookingEmail"
            name="email"
            type="email"
            autoComplete="email"
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredDate">Preferred date *</Label>
          <Input id="preferredDate" name="preferredDate" type="date" required className="h-11" />
          {dateError && <p className="text-sm text-destructive" role="alert">{dateError}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredTime">Preferred time *</Label>
          <select
            id="preferredTime"
            name="preferredTime"
            required
            defaultValue=""
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="" disabled>Select a time preference</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Flexible">I’m flexible</option>
          </select>
        </div>
      </div>

      {bookingType && (
        <div className="space-y-2">
          <Label htmlFor="bookingDetails">
            {detailLabel}{detailsRequired ? ' *' : ''}
          </Label>
          <Textarea
            id="bookingDetails"
            name="details"
            required={detailsRequired}
            rows={4}
            placeholder={detailPlaceholder}
          />
        </div>
      )}

      <div className="space-y-3 border-t border-border pt-5">
        <Button type="submit" size="lg" className="h-12 w-full gap-2 text-base">
          Prepare booking request
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          This opens a pre-filled WhatsApp message for you to send. We’ll confirm your
          appointment directly with you.
        </p>
      </div>

      {requestLink && (
        <div className="rounded-xl border border-[#25D366]/40 bg-[#25D366]/5 p-4" role="status">
          <p className="text-sm leading-relaxed">
            Your request is ready. Continue to WhatsApp to send it to our team.
          </p>
          <Button asChild className="mt-3 h-11 w-full gap-2 bg-[#168c45] text-white hover:bg-[#11753a]">
            <a href={requestLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" aria-hidden="true" />
              Send request on WhatsApp
            </a>
          </Button>
        </div>
      )}
    </form>
  )
}