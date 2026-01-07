import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { validateAndParse, profileUpdateSchema } from "@/lib/validation"
import { rateLimiters } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitResult = await rateLimiters.default(ip)
    
    if (!rateLimitResult.success) {
      logger.warn("Rate limit exceeded for profile update", { ip })
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
    const validation = validateAndParse(profileUpdateSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { fullName } = validation.data

    let supabase
    try {
      supabase = await createClient()
    } catch (supabaseError: any) {
      return NextResponse.json(
        { error: supabaseError.message || "Database connection error. Please check your configuration." },
        { status: 500 }
      )
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Update user profile
    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        full_name: fullName || null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      logger.error("Profile update error", new Error(error.message), { userId: user.id })
      return NextResponse.json(
        { error: error.message || "Failed to update profile" },
        { status: 400 }
      )
    }

    // Also update user metadata in auth.users
    await supabase.auth.updateUser({
      data: {
        full_name: fullName || "",
      },
    })

    logger.info("Profile updated successfully", { userId: user.id })
    
    return NextResponse.json({
      success: true,
      profile: data,
    })
  } catch (error: any) {
    logger.error("Profile update error", error instanceof Error ? error : new Error(String(error)))
    const errorMessage = error?.message || "An error occurred during profile update"
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}


