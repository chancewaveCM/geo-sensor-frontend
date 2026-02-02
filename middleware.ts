import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '')

  // Check if accessing protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect authenticated users away from auth pages
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
