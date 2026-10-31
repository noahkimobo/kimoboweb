export type CommunityJobInput = {
  title?: string
  slug?: string
  description?: string
  requirements?: string
  location?: string
  compensation?: string
  closesAt?: Date | null
  published?: boolean
}

type ParseResult =
  | { ok: true; value: CommunityJobInput }
  | { ok: false; error: string }

const TEXT_LIMITS = {
  title: 160,
  slug: 180,
  description: 12000,
  requirements: 6000,
  location: 120,
  compensation: 120,
} as const

export function parseCommunityJobInput(
  input: unknown,
  partial = false,
): ParseResult {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, error: 'Request body must be an object.' }
  }

  const body = input as Record<string, unknown>
  const value: CommunityJobInput = {}
  const fields = Object.keys(TEXT_LIMITS) as (keyof typeof TEXT_LIMITS)[]

  for (const field of fields) {
    if (!(field in body)) continue
    const raw = body[field]
    if (typeof raw !== 'string') {
      return { ok: false, error: `${field} must be text.` }
    }

    const text = raw.trim()
    if (text.length > TEXT_LIMITS[field]) {
      return { ok: false, error: `${field} must be ${TEXT_LIMITS[field]} characters or fewer.` }
    }
    if (!text && ['title', 'slug', 'description', 'location'].includes(field)) {
      return { ok: false, error: `${field} is required.` }
    }
    if (field === 'slug' && text && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text)) {
      return { ok: false, error: 'Slug may contain lowercase letters, numbers, and hyphens.' }
    }
    value[field] = text
  }

  if ('closesAt' in body) {
    if (body.closesAt === null || body.closesAt === '') {
      value.closesAt = null
    } else if (typeof body.closesAt === 'string') {
      const closesAt = new Date(body.closesAt)
      if (!Number.isFinite(closesAt.getTime())) {
        return { ok: false, error: 'Closing date is invalid.' }
      }
      value.closesAt = closesAt
    } else {
      return { ok: false, error: 'Closing date must be a date or empty.' }
    }
  }

  if ('published' in body) {
    if (typeof body.published !== 'boolean') {
      return { ok: false, error: 'Published must be true or false.' }
    }
    value.published = body.published
  }

  if (!partial) {
    for (const field of ['title', 'slug', 'description', 'location'] as const) {
      if (!value[field]) return { ok: false, error: `${field} is required.` }
    }
  } else if (Object.keys(value).length === 0) {
    return { ok: false, error: 'Provide at least one field to update.' }
  }

  return { ok: true, value }
}
