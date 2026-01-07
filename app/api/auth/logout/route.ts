import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { rateLimiters } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitResult = await rateLimiters.default(ip)
    
    if (!rateLimitResult.success) {
      logger.warn("Rate limit exceeded for logout", { ip })
      return NextResponse.json(
        { 
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

    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      logger.warn("Logout failed", { error: error.message })
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    logger.info("User logged out successfully")
    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    logger.error("Logout error", error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    )
  }
}


