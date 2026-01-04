import { NextResponse } from "next/server"
import { rateLimiters } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"

export const dynamic = "force-dynamic"

const SIGNALS_API_URL = process.env.SIGNALS_API_URL || "https://api.signal.iplinseparable.com/api/signals"

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

export async function GET(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitResult = await rateLimiters.signals(ip)
    
    if (!rateLimitResult.success) {
      logger.warn("Rate limit exceeded for signals", { ip })
      return NextResponse.json(
        { 
          success: false,
          error: "Too many requests. Please try again later.",
          signals: [],
          count: 0,
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

    const url = new URL(request.url)
    const limitParam = url.searchParams.get("limit") || "20"
    const limit = Math.min(Math.max(parseInt(limitParam) || 20, 1), 100) // Limit between 1-100
    
    const apiUrl = `${SIGNALS_API_URL}?limit=${limit}`

    const response = await fetchWithRetry(apiUrl)
    const result = await response.json()

    if (result.status === "ok" && Array.isArray(result.data)) {

      // Map the production API format to our internal format
      const signals = result.data.map((signal: any) => ({
        id: signal.id,
        symbol: signal.instrument,
        instrument: signal.instrument,
        type: signal.signal_type?.toLowerCase() || "buy",
        signal_type: signal.signal_type,
        entryPrice: signal.entry_price,
        entry_price: signal.entry_price,
        stopLoss: signal.sl,
        sl: signal.sl,
        takeProfit: signal.tp3, // Use TP3 as main target
        tp1: signal.tp1,
        tp2: signal.tp2,
        tp3: signal.tp3,
        confidence: Math.round((signal.probability || 0.5) * 100),
        probability: signal.probability,
        status: signal.status?.toLowerCase() || "active",
        timestamp: new Date(signal.created_at).getTime(),
        created_at: signal.created_at,
        updated_at: signal.updated_at,
        timeframe: "1H", // Default timeframe
        reason: `Signal ${signal.signal_type} for ${signal.instrument}`,
      }))

      return NextResponse.json(
        {
          success: true,
          signals,
          timestamp: new Date().toISOString(),
          count: signals.length,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, max-age=0",
            "Content-Type": "application/json",
          },
        },
      )
    }

    // Handle error responses
    logger.warn("Invalid response from signals API")
    return NextResponse.json(
      {
        success: false,
        error: "Invalid response from production API",
        signals: [],
        count: 0,
      },
      { status: 500 },
    )
  } catch (error) {
    logger.error("Failed to fetch signals", error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch signals",
        details: error instanceof Error ? error.message : "Unknown error",
        signals: [],
        count: 0,
      },
      { status: 500 },
    )
  }
}
