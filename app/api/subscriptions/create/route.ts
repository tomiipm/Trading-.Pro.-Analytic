import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { rateLimiters } from "@/lib/rate-limit"
import { validateAndParse, subscriptionSchema } from "@/lib/validation"
import { logger } from "@/lib/logger"

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitResult = await rateLimiters.subscriptions(ip)
    
    if (!rateLimitResult.success) {
      logger.warn("Rate limit exceeded for subscriptions", { ip })
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
    const validation = validateAndParse(subscriptionSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { subscriptionType, days } = validation.data

    const supabase = await createClient()
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

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + days)

    // Check if user already has a subscription
    const { data: existingSubscription } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single()

    let data, error

    if (existingSubscription) {
      // Update existing subscription
      const { data: updatedData, error: updateError } = await supabase
        .from("user_subscriptions")
        .update({
          subscription_type: subscriptionType,
          status: "active",
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single()

      data = updatedData
      error = updateError
    } else {
      // Create new subscription
      const { data: insertedData, error: insertError } = await supabase
        .from("user_subscriptions")
        .insert({
          user_id: user.id,
          subscription_type: subscriptionType,
          status: "active",
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single()

      data = insertedData
      error = insertError
    }

    if (error) {
      logger.error("Subscription creation error", new Error(error.message), { subscriptionType, days })
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    logger.info("Subscription created/updated", { subscriptionType, days, userId: data.user_id })
    
    return NextResponse.json({
      success: true,
      subscription: data,
    })
  } catch (error) {
    logger.error("Subscription error", error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}

