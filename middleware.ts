/**
 * Authentication middleware for 303030
 * Protects routes that require authentication using Supabase Auth
 * Redirects to home if not authenticated (login modal will handle auth)
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/calendar', '/moodboard', '/payment', '/admin', '/profile']

// Auth routes are now handled by the modal, so we just need to prevent logged-in users from seeing anything specific if needed
// For now, we can keep this simple.
const authRoutes: string[] = []

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (!isProtectedRoute) {
    // Not a protected route, allow access
    return NextResponse.next()
  }

  // Create Supabase server client for auth check
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Check authentication status
  const { data: { session } } = await supabase.auth.getSession()

  // Redirect to home if accessing protected route without authentication
  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // User is authenticated, allow access to protected route
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|moodboards/|public/).*)',
  ],
}