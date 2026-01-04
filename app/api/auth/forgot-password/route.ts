import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifyRecaptcha } from "@/lib/recaptcha"
import { rateLimiters } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  recaptchaToken: z.string().optional(), // Temporarily disabled
})

export async function POST(request: Request) {
  try {
    // Rate limiting - stricter for password reset
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitResult = await rateLimiters.signup(ip) // Use signup limiter (3 req/min)
    
    if (!rateLimitResult.success) {
      logger.warn("Rate limit exceeded for forgot password", { ip })
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

    const body = await request.json()
    
    // Input validation
    const validation = forgotPasswordSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ") },
        { status: 400 }
      )
    }

    const { email } = validation.data

    // reCAPTCHA temporarily disabled for testing
    // const isValid = await verifyRecaptcha(recaptchaToken)
    // if (!isValid) {
    //   logger.warn("reCAPTCHA verification failed for forgot password", { email })
    //   return NextResponse.json(
    //     { error: "reCAPTCHA verification failed. Please try again." },
    //     { status: 400 }
    //   )
    // }

    const supabase = await createClient()

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${request.headers.get("origin") || "https://trading-pro-analytic.com"}/reset-password`,
    })

    if (error) {
      // Don't reveal if email exists or not (security best practice)
      logger.warn("Password reset request failed", { email, error: error.message })
      // Return success anyway to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, we've sent a password reset link.",
      })
    }

    logger.info("Password reset email sent", { email })
    
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we've sent a password reset link.",
    })
  } catch (error: any) {
    logger.error("Forgot password error", error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    )
  }
}

