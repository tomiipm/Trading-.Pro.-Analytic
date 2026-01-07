import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { rateLimiters } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"
import { checkPremiumSubscription } from "@/lib/subscription-check"
import { z } from "zod"

const FMP_API_URL = process.env.FMP_API_URL || "https://financialmodelingprep.com/api/v3"

const countryQuerySchema = z.string().length(2)
const indicatorQuerySchema = z.string()

export async function GET(request: Request) {
  let country = "US"
  let indicator = ""
  
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  const rateLimitResult = await rateLimiters.premium(ip)
  
  if (!rateLimitResult.success) {
    logger.warn("Rate limit exceeded for economic indicators", { ip })
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
    const countryParam = searchParams.get("country") || "US"
    const indicatorParam = searchParams.get("indicator") || ""
    
    // Validate query parameters
    const countryValidation = countryQuerySchema.safeParse(countryParam)
    
    if (!countryValidation.success) {
      return NextResponse.json(
        { error: "Invalid country parameter. Must be 2 characters." },
        { status: 400 }
      )
    }
    
    country = countryValidation.data
    indicator = indicatorParam // Indicator is optional, no strict validation needed

    // FMP API endpoint for economic indicators
    let url = `${FMP_API_URL}/economic?country=${country}&apikey=${FMP_API_KEY}`
    
    if (indicator) {
      url = `${FMP_API_URL}/economic?country=${country}&indicator=${indicator}&apikey=${FMP_API_KEY}`
    }

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache na 1 godzinę
    })

    if (!response.ok) {
      // Try alternative endpoint
      const altUrl = `${FMP_API_URL}/economic_indicators?country=${country}&apikey=${FMP_API_KEY}`
      const altResponse = await fetch(altUrl, {
        next: { revalidate: 3600 },
      })

      if (!altResponse.ok) {
        return NextResponse.json({
          success: true,
          data: [],
          message: "Economic indicators endpoint may not be available in your FMP plan",
        })
      }

      const altData = await altResponse.json()
      return NextResponse.json({
        success: true,
        data: Array.isArray(altData) ? altData : [],
      })
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: Array.isArray(data) ? data : [],
    })
  } catch (error: any) {
    logger.error("Failed to fetch economic indicators", error instanceof Error ? error : new Error(String(error)), { country, indicator })
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch economic indicators",
        data: [],
      },
      { status: 500 },
    )
  }
}


