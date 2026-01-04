import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { securityHeaders } from '@/lib/security-headers'

export async function middleware(request: NextRequest) {
  try {
    const response = await updateSession(request)
    
    // Apply security headers to the response from updateSession
    return securityHeaders(request, response)
  } catch (error) {
    // Jeśli wystąpi błąd w middleware, po prostu kontynuuj z security headers
    return securityHeaders(request)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

