export type CommunityJobInput = {
  title?: string
  slug?: string
  category?: string
  description?: string
  requirements?: string
  location?: string
  employerPhone?: string
  compensation?: string
  closesAt?: Date | null
  published?: boolean
}

type ParseResult =
  | { ok: true; value: CommunityJobInput }
  | { ok: false; error: string }

export const COMMUNITY_JOB_CATEGORIES = [
  { slug: 'chapati-cook', label: 'Chapati cook / Mtu wa kupika chapati' },
  { slug: 'salonist', label: 'Salonist' },
  { slug: 'nail-technician', label: 'Nail technician' },
  { slug: 'kinyozi', label: 'Kinyozi / Barber' },
  { slug: 'other', label: 'Other opportunity' },
] as const

const TEXT_LIMITS = {
  title: 160,
  slug: 180,
  category: 60,
  description: 12000,
  requirements: 6000,
  location: 120,
  employerPhone: 24,
  compensation: 120,
} as const

export function normalizeEmployerPhone(value: string): string | null {
  const compact = value.trim().replace(/[\s()-]/g, '')
  if (!/^\+?\d+$/.test(compact)) return null

  const digits = compact.replace(/^\+/, '')
  if (/^0[17]\d{8}$/.test(digits)) return `254${digits.slice(1)}`
  if (/^254[17]\d{8}$/.test(digits)) return digits
  return null
}

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
    if (field === 'category' && text && !COMMUNITY_JOB_CATEGORIES.some((category) => category.slug === text)) {
      return { ok: false, error: 'Choose a listed job category.' }
    }
    if (field === 'employerPhone' && text) {
      const normalizedPhone = normalizeEmployerPhone(text)
      if (!normalizedPhone) {
        return { ok: false, error: 'Enter a valid Kenyan mobile number, such as 0712345678 or +254712345678.' }
      }
      value.employerPhone = normalizedPhone
      continue
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
    for (const field of ['title', 'slug', 'category', 'description', 'location'] as const) {
      if (!value[field]) return { ok: false, error: `${field} is required.` }
    }
  } else if (Object.keys(value).length === 0) {
    return { ok: false, error: 'Provide at least one field to update.' }
  }

  if (value.published && !value.employerPhone) {
    return { ok: false, error: 'Add the employer’s WhatsApp number before publishing this listing.' }
  }

  return { ok: true, value }
}
