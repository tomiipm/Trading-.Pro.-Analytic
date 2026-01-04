import { type NextRequest, NextResponse } from "next/server"
import { rateLimiters } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"
import { validateAndParse, symbolSchema, timeframeSchema } from "@/lib/validation"

export const dynamic = "force-dynamic"

const CHART_API_BASE_URL = process.env.CHART_API_URL || process.env.NEXT_PUBLIC_CHART_API_URL || "https://api.signal.iplinseparable.com/api"

async function fetchWithRetry(url: string, retries = 3, timeout = 10000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        return response
      }

      // If 502, retry after a delay
      if (response.status === 502 && i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
        continue
      }

      return response
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  throw new Error("Max retries reached")
}

export async function GET(request: NextRequest, { params }: { params: { symbol: string; timeframe: string } }) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitResult = await rateLimiters.default(ip)
    
    if (!rateLimitResult.success) {
      logger.warn("Rate limit exceeded for chart API", { ip })
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
          },
        }
      )
    }

    const { symbol, timeframe } = params

    // Validate symbol and timeframe
    const symbolValidation = validateAndParse(symbolSchema, symbol)
    if (!symbolValidation.success) {
      return NextResponse.json(
        { error: `Invalid symbol: ${symbolValidation.error}` },
        { status: 400 }
      )
    }

    const timeframeValidation = validateAndParse(timeframeSchema, timeframe)
    if (!timeframeValidation.success) {
      return NextResponse.json(
        { error: `Invalid timeframe: ${timeframeValidation.error}` },
        { status: 400 }
      )
    }

    // Map timeframe to API format (adjust based on your API requirements)
    const timeframeMap: Record<string, string> = {
      "1M": "1m",
      "5M": "5m",
      "15M": "15m",
      "30M": "30m",
      "1H": "1h",
      "4H": "4h",
      "1D": "1d",
    }
    const apiTimeframe = timeframeMap[timeframe] || timeframe.toLowerCase()

    // Try different possible API endpoints
    const possibleEndpoints = [
      `${CHART_API_BASE_URL}/chart/${symbol}/${apiTimeframe}`,
      `${CHART_API_BASE_URL}/candles/${symbol}?timeframe=${apiTimeframe}`,
      `${CHART_API_BASE_URL}/prices/${symbol}?timeframe=${apiTimeframe}`,
      `${CHART_API_BASE_URL}/chart?symbol=${symbol}&timeframe=${apiTimeframe}`,
    ]

    let chartData = null
    let lastError = null

    // Try each possible endpoint
    for (const apiUrl of possibleEndpoints) {
      try {
        const response = await fetchWithRetry(apiUrl)
        const result = await response.json()

        // Check if response is successful
        if (response.ok && result) {
          // Handle different possible response formats
          let data = null

          // Format 1: Direct array
          if (Array.isArray(result) && result.length > 0) {
            data = result
          }
          // Format 2: { data: [...] }
          else if (result.data && Array.isArray(result.data)) {
            data = result.data
          }
          // Format 3: { candles: [...] } or { prices: [...] }
          else if (result.candles && Array.isArray(result.candles)) {
            data = result.candles
          } else if (result.prices && Array.isArray(result.prices)) {
            data = result.prices
          }
          // Format 4: { status: "ok", data: [...] }
          else if (result.status === "ok" && Array.isArray(result.data)) {
            data = result.data
          }

          if (data && data.length > 0) {
            // Transform data to expected format
            chartData = data.slice(0, 100).map((item: any) => {
              // Handle different field names
              const date = item.date || item.time || item.timestamp || item.created_at
              const close = item.close || item.c || item.price
              const open = item.open || item.o
              const high = item.high || item.h
              const low = item.low || item.l

              return {
                date: typeof date === "string" ? date : new Date(date).toISOString(),
                close: Number(close) || 0,
                open: Number(open) || close || 0,
                high: Number(high) || close || 0,
                low: Number(low) || close || 0,
              }
            })

            break // Success, exit loop
          }
        }
      } catch (error) {
        lastError = error
        continue // Try next endpoint
      }
    }

    // If we got valid data, return it
    if (chartData && chartData.length > 0) {
      return NextResponse.json(chartData, {
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "Content-Type": "application/json",
        },
      })
    }

    // If all endpoints failed, return error
    logger.error("Failed to fetch chart data from all endpoints", lastError instanceof Error ? lastError : new Error(String(lastError)), { symbol, timeframe })
    return NextResponse.json(
      {
        error: "Failed to fetch chart data from API",
        message: lastError instanceof Error ? lastError.message : "All API endpoints failed",
        symbol,
        timeframe,
      },
      { status: 503 }
    )
  } catch (error) {
    logger.error("Chart API error", error instanceof Error ? error : new Error(String(error)), { symbol: params.symbol, timeframe: params.timeframe })
    return NextResponse.json(
      {
        error: "Failed to fetch chart data",
        message: error instanceof Error ? error.message : "Unknown error",
        symbol: params.symbol,
        timeframe: params.timeframe,
      },
      { status: 500 }
    )
  }
}
