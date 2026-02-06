import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Auth protection: disabled in development by default, enabled in production
// Set SKIP_AUTH=false to enable auth in development/testing
const DISABLE_AUTH_FOR_TESTING = process.env.NODE_ENV === 'development' &&
                                  process.env.SKIP_AUTH !== 'false'

export function middleware(request: NextRequest) {
  // Skip all auth checks when testing flag is enabled
  if (DISABLE_AUTH_FOR_TESTING) {
    return NextResponse.next()
  }

  const token = request.cookies.get('access_token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '')

  const protectedPaths = ['/dashboard', '/settings', '/analysis', '/query-lab']

  // Check if accessing protected routes
  const isProtectedRoute = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedRoute) {
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
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/analysis/:path*',
    '/query-lab/:path*',
    '/login',
    '/register'
  ],
}
