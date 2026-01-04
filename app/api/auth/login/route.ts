import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifyRecaptcha } from "@/lib/recaptcha"
import { rateLimiters } from "@/lib/rate-limit"
import { validateAndParse, loginSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitResult = await rateLimiters.login(ip)
    
    if (!rateLimitResult.success) {
      logger.warn("Rate limit exceeded for login", { ip })
      return NextResponse.json(
        { 
          error: "Too many login attempts. Please try again later.",
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
    const validation = validateAndParse(loginSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    // reCAPTCHA temporarily disabled for testing
    // const isValid = await verifyRecaptcha(recaptchaToken)
    // if (!isValid) {
    //   logger.warn("reCAPTCHA verification failed", { email })
    //   return NextResponse.json(
    //     { error: "reCAPTCHA verification failed. Please try again." },
    //     { status: 400 }
    //   )
    // }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      logger.warn("Login failed", { email, error: error.message })
      
      // Provide user-friendly error messages
      let errorMessage = error.message
      
      if (error.message.includes("Email not confirmed") || error.message.includes("email_not_confirmed")) {
        errorMessage = "Please check your email and confirm your account before logging in."
      } else if (error.message.includes("Invalid login credentials") || error.message.includes("invalid_credentials")) {
        errorMessage = "Invalid email or password. Please try again."
      } else if (error.message.includes("too many requests")) {
        errorMessage = "Too many login attempts. Please try again later."
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 401 }
      )
    }
    
    // Check if email is confirmed
    if (data.user && !data.user.email_confirmed_at) {
      logger.warn("Login attempted with unconfirmed email", { email: data.user.email })
      return NextResponse.json(
        { error: "Please check your email and confirm your account before logging in." },
        { status: 401 }
      )
    }

    logger.info("User logged in successfully", { email: data.user?.email })
    
    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    })
  } catch (error) {
    logger.error("Login error", error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    )
  }
}

