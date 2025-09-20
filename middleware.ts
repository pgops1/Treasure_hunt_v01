// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Supabase sets these cookies when a user is authenticated
  const isAuthed = Boolean(req.cookies.get('sb-access-token')?.value)

  // If authed and trying to visit /login, send to /play
  if (pathname === '/login' && isAuthed) {
    const url = req.nextUrl.clone()
    url.pathname = '/play'
    return NextResponse.redirect(url)
  }

  // If NOT authed and trying to visit /play (or its subpaths), send to /login
  if ((pathname === '/play' || pathname.startsWith('/play/')) && !isAuthed) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Otherwise, continue
  return NextResponse.next()
}

// Apply to these routes
export const config = {
  matcher: ['/login', '/play', '/play/:path*'],
}
