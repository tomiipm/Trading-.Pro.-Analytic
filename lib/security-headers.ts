import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Security headers middleware
 * Adds security headers to all responses
 */
export function securityHeaders(request: NextRequest, response?: NextResponse) {
  const targetResponse = response || NextResponse.next()

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://api.signal.iplinseparable.com https://financialmodelingprep.com https://www.google.com",
    "frame-src 'self' https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ")

  // Security headers
  targetResponse.headers.set("Content-Security-Policy", csp)
  targetResponse.headers.set("X-DNS-Prefetch-Control", "on")
  targetResponse.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
  targetResponse.headers.set("X-Frame-Options", "DENY")
  targetResponse.headers.set("X-Content-Type-Options", "nosniff")
  targetResponse.headers.set("X-XSS-Protection", "1; mode=block")
  targetResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  targetResponse.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  return targetResponse
}

