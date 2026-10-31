'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { CommunityJob } from '@/lib/db/schema'

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function toLocalDateTime(value: Date | null) {
  if (!value) return ''
  const date = new Date(value)
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 16)
}

export function CommunityJobForm({ job }: { job?: CommunityJob }) {
  const router = useRouter()
  const editing = Boolean(job)
  const [pending, startTransition] = useTransition()
  const [slugTouched, setSlugTouched] = useState(editing)
  const [form, setForm] = useState({
    title: job?.title ?? '',
    slug: job?.slug ?? '',
    description: job?.description ?? '',
    requirements: job?.requirements ?? '',
    location: job?.location ?? '',
    compensation: job?.compensation ?? '',
    closesAt: toLocalDateTime(job?.closesAt ?? null),
    published: job?.published ?? false,
  })

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const payload = {
      ...form,
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      requirements: form.requirements.trim(),
      location: form.location.trim(),
      compensation: form.compensation.trim(),
      closesAt: form.closesAt ? new Date(form.closesAt).toISOString() : null,
    }

    startTransition(async () => {
      try {
        const response = await fetch(
          job ? `/api/admin/community-jobs/${job.id}` : '/api/admin/community-jobs',
          {
            method: job ? 'PATCH' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          },
        )
        const result = (await response.json()) as { error?: string }
        if (!response.ok) {
          toast.error(result.error ?? 'Could not save this job listing.')
          return
        }

        toast.success(editing ? 'Job listing updated' : 'Job listing created')
        router.push('/admin/community-jobs')
        router.refresh()
      } catch {
        toast.error('Could not reach the server. Check your connection and try again.')
      }
    })
  }

  async function handleDelete() {
    if (!job || !confirm(`Delete "${job.title}"? This can't be undone.`)) return

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/community-jobs/${job.id}`, {
          method: 'DELETE',
        })
        const result = (await response.json()) as { error?: string }
        if (!response.ok) {
          toast.error(result.error ?? 'Could not delete this job listing.')
          return
        }
        toast.success('Job listing deleted')
        router.push('/admin/community-jobs')
        router.refresh()
      } catch {
        toast.error('Could not reach the server. Check your connection and try again.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Job title</Label>
          <Input
            id="title"
            maxLength={160}
            value={form.title}
            onChange={(event) => {
              const title = event.target.value
              update('title', title)
              if (!slugTouched) update('slug', slugify(title))
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="slug">URL slug</Label>
          <Input
            id="slug"
            maxLength={180}
            value={form.slug}
            onChange={(event) => {
              setSlugTouched(true)
              update('slug', slugify(event.target.value))
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            maxLength={120}
            placeholder="e.g. Nairobi, Kenya"
            value={form.location}
            onChange={(event) => update('location', event.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="compensation">Pay or compensation</Label>
          <Input
            id="compensation"
            maxLength={120}
            placeholder="e.g. KES 1,500 per day"
            value={form.compensation}
            onChange={(event) => update('compensation', event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="description">About the work</Label>
          <Textarea
            id="description"
            maxLength={12000}
            rows={6}
            value={form.description}
            onChange={(event) => update('description', event.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="requirements">Requirements</Label>
          <Textarea
            id="requirements"
            maxLength={6000}
            rows={4}
            placeholder="Add one requirement per line."
            value={form.requirements}
            onChange={(event) => update('requirements', event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="closesAt">Application deadline (optional)</Label>
          <Input
            id="closesAt"
            type="datetime-local"
            value={form.closesAt}
            onChange={(event) => update('closesAt', event.target.value)}
          />
        </div>
        <div className="flex items-center justify-between rounded-md border border-border px-4 py-3">
          <div>
            <Label htmlFor="published" className="cursor-pointer">Publish listing</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Published listings appear on the public jobs page.
            </p>
          </div>
          <Switch
            id="published"
            checked={form.published}
            onCheckedChange={(value) => update('published', value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        {editing ? (
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={pending}>
            Delete listing
          </Button>
        ) : <span />}
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving…' : editing ? 'Save changes' : 'Create listing'}
          </Button>
        </div>
      </div>
    </form>
  )
}
