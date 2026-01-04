import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifyRecaptcha } from "@/lib/recaptcha"
import { rateLimiters } from "@/lib/rate-limit"
import { validateAndParse, signupSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function POST(request: Request) {
  try {
    // Rate limiting - stricter for signup
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitResult = await rateLimiters.signup(ip)
    
    if (!rateLimitResult.success) {
      logger.warn("Rate limit exceeded for signup", { ip })
      return NextResponse.json(
        { 
          error: "Too many signup attempts. Please try again later.",
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
    const validation = validateAndParse(signupSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { email, password, fullName } = validation.data

    // reCAPTCHA temporarily disabled for testing
    // const isValid = await verifyRecaptcha(recaptchaToken)
    // if (!isValid) {
    //   logger.warn("reCAPTCHA verification failed", { email })
    //   return NextResponse.json(
    //     { error: "reCAPTCHA verification failed. Please try again." },
    //     { status: 400 }
    //   )
    // }

    let supabase
    try {
      supabase = await createClient()
    } catch (supabaseError: any) {
      return NextResponse.json(
        { error: supabaseError.message || "Database connection error. Please check your configuration." },
        { status: 500 }
      )
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || "",
        },
        emailRedirectTo: `${request.headers.get("origin") || "https://trading-pro-analytic.com"}/auth/callback`,
      },
    })

    if (error) {
      // Provide more user-friendly error messages
      let errorMessage = error.message
      
      if (error.message.includes("already registered")) {
        errorMessage = "This email is already registered. Please use a different email or try logging in."
      } else if (error.message.includes("invalid")) {
        errorMessage = "Invalid email or password format. Please check your input."
      } else if (error.message.includes("password")) {
        errorMessage = "Password does not meet requirements. Please use a stronger password."
      }

      logger.warn("Signup failed", { email, error: errorMessage })
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    logger.info("User signed up successfully", { email: data.user?.email })
    
    return NextResponse.json({
      success: true,
      user: data.user,
      message: "Check your email to confirm your account",
    })
  } catch (error: any) {
    logger.error("Signup error", error instanceof Error ? error : new Error(String(error)))
    const errorMessage = error?.message || "An error occurred during signup"
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

