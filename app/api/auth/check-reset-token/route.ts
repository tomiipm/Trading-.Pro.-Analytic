import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { rateLimiters } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"

export async function GET(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitResult = await rateLimiters.default(ip)
    
    if (!rateLimitResult.success) {
      logger.warn("Rate limit exceeded for check reset token", { ip })
      return NextResponse.json(
        { 
          authorized: false,
          error: "Too many requests. Please try again later.",
          retryAfter: rateLimitResult.reset,
        },
        { 
          status: 429,
          headers: {
            "Retry-After": rateLimitResult.reset.toString(),
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.reset.toString(),
          },
        }
      )
    }

    // Create Supabase client
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      logger.debug("Check reset token: user not authenticated", { 
        hasError: !!error, 
        errorMessage: error?.message,
        hasUser: !!user 
      })
      return NextResponse.json(
        { authorized: false },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authorized: true,
    })
  } catch (error) {
    logger.error("Check reset token error", error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { authorized: false },
      { status: 500 }
    )
  }
}

