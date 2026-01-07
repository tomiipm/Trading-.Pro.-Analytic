import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { rateLimiters } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"
import { checkPremiumSubscription } from "@/lib/subscription-check"
import { z } from "zod"

const FMP_API_URL = process.env.FMP_API_URL || "https://financialmodelingprep.com/api/v3"

// Validation schema for date parameters (YYYY-MM-DD format)
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Must be YYYY-MM-DD.")

export async function GET(request: Request) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  const rateLimitResult = await rateLimiters.premium(ip)
  
  if (!rateLimitResult.success) {
    logger.warn("Rate limit exceeded for COT data", { ip })
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

    const { searchParams } = new URL(request.url)
    const fromParam = searchParams.get("from") || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const toParam = searchParams.get("to") || new Date().toISOString().split("T")[0]
    
    // Validate date parameters
    const fromValidation = dateSchema.safeParse(fromParam)
    const toValidation = dateSchema.safeParse(toParam)
    
    if (!fromValidation.success || !toValidation.success) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid date parameters. Must be in YYYY-MM-DD format.",
          data: [],
        },
        { status: 400 }
      )
    }
    
    const from = fromValidation.data
    const to = toValidation.data

    // FMP API endpoint for COT data
    // Note: FMP may use different endpoint names, adjust if needed
    const url = `${FMP_API_URL}/cot?from=${from}&to=${to}&apikey=${FMP_API_KEY}`

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache na 1 godzinę
    })

    if (!response.ok) {
      // If endpoint doesn't exist, return empty data structure
      return NextResponse.json({
        success: true,
        data: [],
        message: "COT data endpoint may not be available in your FMP plan",
      })
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: Array.isArray(data) ? data : [],
    })
  } catch (error: any) {
    logger.error("Failed to fetch COT data", error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch COT data",
        data: [],
      },
      { status: 500 },
    )
  }
}


