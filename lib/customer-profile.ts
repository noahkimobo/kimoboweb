export type CustomerProfile = {
  name: string
  email: string
  phone: string
}

export const CUSTOMER_PROFILE_EVENT = 'kimobo:request-customer-profile'

const PROFILE_KEY = 'kimobo_customer_profile_v1'
const PROMPT_SNOOZE_KEY = 'kimobo_customer_profile_prompt_snoozed_until'
const PROMPT_SNOOZE_MS = 7 * 24 * 60 * 60 * 1000

export function getCustomerProfile(): CustomerProfile | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(PROFILE_KEY)
    if (!raw) return null

    const profile = JSON.parse(raw) as Partial<CustomerProfile>
    if (typeof profile.name !== 'string' || typeof profile.email !== 'string') return null

    return {
      name: profile.name,
      email: profile.email,
      phone: typeof profile.phone === 'string' ? profile.phone : '',
    }
  } catch {
    return null
  }
}

export function saveCustomerProfile(profile: CustomerProfile): void {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  window.localStorage.removeItem(PROMPT_SNOOZE_KEY)
}

export function customerProfilePromptIsSnoozed(): boolean {
  try {
    const snoozedUntil = Number(window.localStorage.getItem(PROMPT_SNOOZE_KEY))
    return Number.isFinite(snoozedUntil) && snoozedUntil > Date.now()
  } catch {
    return false
  }
}

export function snoozeCustomerProfilePrompt(): void {
  try {
    window.localStorage.setItem(
      PROMPT_SNOOZE_KEY,
      String(Date.now() + PROMPT_SNOOZE_MS),
    )
  } catch {
    // Profile prompts remain usable if browser storage is unavailable.
  }
}

export function requestCustomerProfilePrompt(prefill?: Partial<CustomerProfile>): void {
  if (typeof window === 'undefined') return

  window.dispatchEvent(
    new CustomEvent<Partial<CustomerProfile> | undefined>(CUSTOMER_PROFILE_EVENT, {
      detail: prefill,
    }),
  )
}