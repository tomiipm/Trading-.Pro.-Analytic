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

    const { email, password, recaptchaToken } = validation.data

    // reCAPTCHA verification required for production
    if (!recaptchaToken) {
      logger.warn("reCAPTCHA token missing", { email })
      return NextResponse.json(
        { error: "reCAPTCHA verification is required. Please try again." },
        { status: 400 }
      )
    }

    const isValid = await verifyRecaptcha(recaptchaToken)
    if (!isValid) {
      logger.warn("reCAPTCHA verification failed", { email })
      return NextResponse.json(
        { error: "reCAPTCHA verification failed. Please try again." },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      logger.warn("Login failed", { email, error: error.message, errorCode: error.status })
      
      // Provide user-friendly error messages based on Supabase error codes
      let errorMessage = "Invalid email or password. Please try again."
      
      if (error.message.includes("Email not confirmed") || 
          error.message.includes("email_not_confirmed") ||
          error.status === 401) {
        errorMessage = "Please check your email and confirm your account before logging in."
      } else if (error.message.includes("Invalid login credentials") || 
                 error.message.includes("invalid_credentials") ||
                 error.message.includes("Invalid")) {
        errorMessage = "Invalid email or password. Please check your credentials and try again."
      } else if (error.message.includes("too many requests") || 
                 error.message.includes("rate limit")) {
        errorMessage = "Too many login attempts. Please wait a few minutes and try again."
      } else if (error.message.includes("network") || 
                 error.message.includes("Network")) {
        errorMessage = "Network error. Please check your connection and try again."
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 401 }
      )
    }
    
    // Check if email is confirmed (Supabase may return user even if not confirmed)
    if (data.user && !data.user.email_confirmed_at) {
      logger.warn("Login attempted with unconfirmed email", { email: data.user.email, userId: data.user.id })
      return NextResponse.json(
        { error: "Please check your email and confirm your account before logging in." },
        { status: 401 }
      )
    }

    // Verify session exists
    if (!data.session) {
      logger.warn("Login succeeded but no session created", { email: data.user?.email })
      return NextResponse.json(
        { error: "Login failed. Please try again." },
        { status: 500 }
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

