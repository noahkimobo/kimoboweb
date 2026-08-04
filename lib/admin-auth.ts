// Edge-compatible admin session signing using the Web Crypto API.
// A single admin password (ADMIN_PASSWORD) gates the dashboard; a signed
// cookie (HMAC with ADMIN_SESSION_SECRET) proves an authenticated session.

export const ADMIN_COOKIE = 'kimobo_admin'
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? 'insecure-dev-secret-change-me'
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return toBase64Url(new Uint8Array(sig))
}

export async function createSessionToken(): Promise<string> {
  const expires = Date.now() + SESSION_TTL_MS
  const payload = String(expires)
  const sig = await hmac(payload)
  return `${payload}.${sig}`
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false
  const expires = Number(payload)
  if (!Number.isFinite(expires) || Date.now() > expires) return false
  const expected = await hmac(payload)
  // constant-time-ish comparison
  if (expected.length !== sig.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i)
  }
  return diff === 0
}

export const SESSION_MAX_AGE = SESSION_TTL_MS / 1000
