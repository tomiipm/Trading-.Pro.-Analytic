import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifyRecaptcha } from "@/lib/recaptcha"
import { rateLimiters } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"
import { z } from "zod"

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  recaptchaToken: z.string().min(1, "reCAPTCHA verification is required"),
})

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitResult = await rateLimiters.login(ip) // Use login limiter (5 req/min)
    
    if (!rateLimitResult.success) {
      logger.warn("Rate limit exceeded for reset password", { ip })
      return NextResponse.json(
        { 
          error: "Too many requests. Please try again later.",
          retryAfter: rateLimitResult.reset,
        },
        { 
          status: 429,
          headers: {
            "Retry-After": rateLimitResult.reset.toString(),
          },
        }
      )
    }

    const body = await request.json()
    
    // Input validation
    const validation = resetPasswordSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ") },
        { status: 400 }
      )
    }

    const { password, recaptchaToken } = validation.data

    // reCAPTCHA verification required for production
    if (!recaptchaToken) {
      logger.warn("reCAPTCHA token missing for reset password")
      return NextResponse.json(
        { error: "reCAPTCHA verification is required. Please try again." },
        { status: 400 }
      )
    }

    const isValid = await verifyRecaptcha(recaptchaToken)
    if (!isValid) {
      logger.warn("reCAPTCHA verification failed for reset password")
      return NextResponse.json(
        { error: "reCAPTCHA verification failed. Please try again." },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createClient()

    // For password reset, Supabase requires the user to be authenticated
    // The reset link from email should have set the session via callback (/auth/callback)
    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      logger.warn("No authenticated user for password reset", { 
        error: userError?.message, 
        errorCode: userError?.status,
        hasUser: !!user 
      })
      return NextResponse.json(
        { error: "Invalid or expired reset token. Please click the reset link from your email again." },
        { status: 401 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      )
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    })

    if (updateError) {
      logger.error("Password update failed", new Error(updateError.message), { 
        userId: user.id,
        errorCode: updateError.status 
      })
      
      let errorMessage = "Failed to update password. Please try again."
      if (updateError.message.includes("password") || updateError.message.includes("Password")) {
        errorMessage = "Password does not meet requirements. Please use a stronger password."
      } else if (updateError.message.includes("session") || updateError.message.includes("Session")) {
        errorMessage = "Your session has expired. Please click the reset link from your email again."
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    logger.info("Password reset successfully")
    
    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully.",
    })
  } catch (error: any) {
    logger.error("Reset password error", error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    )
  }
}

