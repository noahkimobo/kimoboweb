'use client'

import { useState, type ChangeEvent } from 'react'
import { Camera, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function VisitEnrichmentFields({ idPrefix }: { idPrefix: string }) {
  const [coordinates, setCoordinates] = useState('')
  const [mapUrl, setMapUrl] = useState('')
  const [locationMessage, setLocationMessage] = useState('')
  const [photoNames, setPhotoNames] = useState<string[]>([])
  const [photoError, setPhotoError] = useState('')

  function estimateLocation() {
    setLocationMessage('')
    if (!navigator.geolocation) {
      setLocationMessage('Location is not available in this browser. Please enter your area in the form.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position = `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`
        setCoordinates(position)
        setMapUrl(`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`)
        setLocationMessage('Location estimated. We will include a Google Maps link in your request.')
      },
      () => setLocationMessage('We could not access your location. Allow location access or enter your area manually.'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    )
  }

  function handlePhotosChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? [])
    if (files.length > 5) {
      setPhotoError('Choose up to 5 photos.')
      event.currentTarget.value = ''
      setPhotoNames([])
      return
    }

    setPhotoError('')
    setPhotoNames(files.map((file) => file.name))
  }

  return (
    <section className="space-y-5 rounded-xl border border-border bg-secondary/30 p-4 sm:p-5" aria-label="Visit, location and photo options">
      <div className="space-y-3">
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="requestHomeVisit"
            value="yes"
            className="mt-0.5 size-4 accent-foreground"
          />
          <span>
            <span className="font-medium">I would like to request a home visit</span>
            <span className="mt-1 block leading-relaxed text-muted-foreground">
              Requests more than 30 km away need confirmation. We will discuss travel
              arrangements and any cost with you before confirming.
            </span>
          </span>
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={estimateLocation}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <MapPin className="size-4" aria-hidden="true" />
            Estimate my location
          </button>
          {coordinates && <span className="text-xs text-muted-foreground">Location captured</span>}
          <input type="hidden" name="gpsCoordinates" value={coordinates} />
          <input type="hidden" name="mapUrl" value={mapUrl} />
        </div>
        {locationMessage && <p className="text-xs text-muted-foreground" role="status">{locationMessage}</p>}
        <p className="text-xs leading-relaxed text-muted-foreground">
          Your browser will ask permission. Location is only included in the WhatsApp
          request you choose to send; you can enter an area manually instead.
        </p>
      </div>

      <div className="space-y-2 border-t border-border pt-4">
        <Label htmlFor={`${idPrefix}-photos`} className="flex items-center gap-2">
          <Camera className="size-4" aria-hidden="true" />
          Photos of your current furniture or inspiration (optional)
        </Label>
        <Input
          id={`${idPrefix}-photos`}
          name="furniturePhotos"
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={handlePhotosChange}
          className="h-auto min-h-11 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium"
        />
        {photoError && <p className="text-sm text-destructive" role="alert">{photoError}</p>}
        {photoNames.length > 0 && (
          <p className="text-xs text-muted-foreground">Selected {photoNames.length} photo{photoNames.length === 1 ? '' : 's'}: {photoNames.join(', ')}</p>
        )}
        <p className="text-xs leading-relaxed text-muted-foreground">
          On a phone this can open your camera. Photos are not uploaded by this form;
          attach them in WhatsApp after you open the prepared message.
        </p>
      </div>

      <label className="flex items-start gap-3 border-t border-border pt-4 text-sm">
        <input type="checkbox" name="requestQuote" value="yes" defaultChecked className="mt-0.5 size-4 accent-foreground" />
        <span>
          <span className="font-medium">Please include a quotation in your follow-up</span>
          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
            Any estimate is subject to reviewing the details and confirming the scope.
          </span>
        </span>
      </label>
    </section>
  )
}
