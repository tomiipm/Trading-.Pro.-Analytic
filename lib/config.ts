/**
 * Configuration helper functions for environment variables
 * This file centralizes all environment variable access and validation
 */

/**
 * Get the site URL for the application
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL environment variable (for production)
 * 2. Request origin header (for dynamic detection)
 * 3. Fallback to production URL
 */
export function getSiteUrl(requestOrigin?: string | null): string {
  // First, try environment variable (set in production)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // Second, try request origin (works in most cases)
  if (requestOrigin) {
    return requestOrigin
  }

  // Fallback to production URL (should only happen in edge cases)
  return "https://trading-pro-analytic.com"
}

/**
 * Get the site URL for server-side operations
 * Use this in API routes and server components
 */
export function getServerSiteUrl(request?: Request | { headers: Headers }): string {
  let origin: string | null = null
  
  if (request) {
    if (request instanceof Request) {
      // Try to get origin from headers first
      try {
        origin = request.headers.get("origin")
      } catch {
        // If that fails, try to get from URL
        try {
          origin = new URL(request.url).origin
        } catch {
          // If both fail, origin remains null
        }
      }
    } else if (request.headers && typeof request.headers.get === "function") {
      // Handle case where request is an object with headers
      try {
        origin = request.headers.get("origin")
      } catch {
        // If that fails, origin remains null
      }
    }
  }
  
  return getSiteUrl(origin)
}

/**
 * Validate that required environment variables are set
 * Call this at application startup or in critical paths
 */
export function validateEnvironmentVariables(): {
  isValid: boolean
  missing: string[]
} {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ]

  const optional = [
    "NEXT_PUBLIC_SITE_URL", // Optional, will use request origin as fallback
  ]

  const missing: string[] = []

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }

  // Warn about optional but recommended variables
  for (const key of optional) {
    if (!process.env[key]) {
      console.warn(`[Config] Optional environment variable ${key} is not set. Using fallback.`)
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
  }
}

