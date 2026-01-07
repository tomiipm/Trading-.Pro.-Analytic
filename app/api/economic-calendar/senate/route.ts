import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { rateLimiters } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"
import { checkPremiumSubscription } from "@/lib/subscription-check"

export async function GET(request: Request) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  const rateLimitResult = await rateLimiters.premium(ip)
  
  if (!rateLimitResult.success) {
    logger.warn("Rate limit exceeded for senate trading", { ip })
    return NextResponse.json(
      { 
        success: false,
        error: "Too many requests. Please try again later.",
        data: [],
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

  const FMP_API_KEY = process.env.FMP_API_KEY
  
  if (!FMP_API_KEY) {
    logger.error("FMP_API_KEY environment variable is not set")
    return NextResponse.json(
      { error: "FMP_API_KEY environment variable is required" },
      { status: 500 }
    )
  }
  try {
    // Check if user is premium
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

    // Check subscription
    const hasPremium = await checkPremiumSubscription(supabase, user.id)

    if (!hasPremium) {
      return NextResponse.json(
        { error: "Premium subscription required" },
        { status: 403 }
      )
    }

    // FMP API endpoint for Senate trading data
    const url = `https://financialmodelingprep.com/stable/senate-latest?apikey=${FMP_API_KEY}`

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache na 1 godzinę
    })

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `FMP API error: ${response.status}`,
          data: [],
        },
        { status: response.status },
      )
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: Array.isArray(data) ? data : [],
    })
  } catch (error: any) {
    logger.error("Failed to fetch Senate trading data", error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch Senate trading data",
        data: [],
      },
      { status: 500 },
    )
  }
}


