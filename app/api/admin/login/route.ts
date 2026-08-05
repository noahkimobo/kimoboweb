import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, createSessionToken, SESSION_MAX_AGE } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const { password } = await request.json().catch(() => ({ password: '' }))

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD is not configured on the server.' },
      { status: 500 },
    )
  }

  // Temporary debug log for local troubleshooting (does not print the secret)
  try {
    const isMatch = typeof password === 'string' && password === adminPassword
    // eslint-disable-next-line no-console
    console.log(`[admin-login] password-received: type=${typeof password}, length=${typeof password === 'string' ? password.length : 'N/A'}, match=${isMatch}`)
    if (!isMatch) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[admin-login] debug failed', e)
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  const token = await createSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  return res
}
