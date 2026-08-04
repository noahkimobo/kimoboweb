import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin-auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Guard the admin dashboard pages (except the login page itself) and the
  // admin API routes that power it.
  const isAdminApi = pathname.startsWith('/api/admin') && pathname !== '/api/admin/login'
  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login'

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value
    const valid = await verifySessionToken(token)
    if (!valid) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }

  // If already authenticated, skip the login page.
  if (pathname === '/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE)?.value
    if (await verifySessionToken(token)) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
