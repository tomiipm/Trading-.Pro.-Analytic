import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { rateLimiters } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"
import { checkPremiumSubscription } from "@/lib/subscription-check"
import { z } from "zod"

const FMP_API_URL = process.env.FMP_API_URL || "https://financialmodelingprep.com/api/v3"

export async function GET(request: Request) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  const rateLimitResult = await rateLimiters.premium(ip)
  
  if (!rateLimitResult.success) {
    logger.warn("Rate limit exceeded for holidays data", { ip })
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
    const exchangeParam = searchParams.get("exchange") || "NYSE"
    const yearParam = searchParams.get("year") || new Date().getFullYear().toString()
    
    // Validate exchange parameter (common exchanges)
    const exchangeSchema = z.string().min(1).max(10).regex(/^[A-Z]+$/, "Invalid exchange format")
    const yearSchema = z.string().regex(/^\d{4}$/, "Invalid year format. Must be YYYY.")
    
    const exchangeValidation = exchangeSchema.safeParse(exchangeParam)
    const yearValidation = yearSchema.safeParse(yearParam)
    
    if (!exchangeValidation.success || !yearValidation.success) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid parameters. Exchange must be uppercase letters, year must be YYYY format.",
          data: [],
        },
        { status: 400 }
      )
    }
    
    const exchange = exchangeValidation.data
    const year = yearValidation.data

    // FMP API endpoint for market holidays
    // Using the correct endpoint: /stable/holidays-by-exchange
    const url = `https://financialmodelingprep.com/stable/holidays-by-exchange?exchange=${exchange}&apikey=${FMP_API_KEY}`
    
    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache na 24 godziny
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

    // Filter by year if provided (API returns all dates, we filter client-side)
    const filteredData = Array.isArray(data)
      ? data.filter((holiday: any) => {
          if (!holiday.date) return false
          const holidayYear = new Date(holiday.date).getFullYear()
          return holidayYear.toString() === year
        })
      : []

    return NextResponse.json({
      success: true,
      data: filteredData,
    })
  } catch (error: any) {
    logger.error("Failed to fetch holidays data", error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch holidays data",
        data: [],
      },
      { status: 500 },
    )
  }
}

