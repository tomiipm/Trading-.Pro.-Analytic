import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { rateLimiters } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"
import { checkPremiumSubscription } from "@/lib/subscription-check"
import { z } from "zod"

const FMP_API_URL = process.env.FMP_API_URL || "https://financialmodelingprep.com/api/v3"

// Validation schema for symbol parameter
const symbolSchema = z.string().min(1).max(10).regex(/^[A-Z]+$/, "Invalid symbol format. Must be uppercase letters only.")

export async function GET(request: Request) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  const rateLimitResult = await rateLimiters.premium(ip)
  
  if (!rateLimitResult.success) {
    logger.warn("Rate limit exceeded for DCF data", { ip })
    return NextResponse.json(
      { 
        success: false,
        error: "Too many requests. Please try again later.",
        data: null,
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
    const symbolParam = searchParams.get("symbol") || "AAPL"
    
    // Validate symbol parameter
    const symbolValidation = symbolSchema.safeParse(symbolParam)
    if (!symbolValidation.success) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid symbol parameter. Must be 1-10 uppercase letters.",
          data: null,
        },
        { status: 400 }
      )
    }
    
    const symbol = symbolValidation.data

    // FMP API endpoint for DCF
    const url = `${FMP_API_URL}/dcf/${symbol}?apikey=${FMP_API_KEY}`

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache na 1 godzinę
    })

    if (!response.ok) {
      throw new Error(`FMP API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: Array.isArray(data) ? data[0] : data,
    })
  } catch (error: any) {
    logger.error("Failed to fetch DCF data", error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch DCF data",
        data: null,
      },
      { status: 500 },
    )
  }
}


