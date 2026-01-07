import { NextResponse } from "next/server"
import { rateLimiters } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"
import { getLocaleFromLanguage } from "@/lib/i18n/utils"
import type { Language } from "@/lib/i18n/translations"

const FMP_API_URL = process.env.FMP_API_URL || "https://financialmodelingprep.com/api/v3"

/**
 * Extract language from Accept-Language header or default to 'en'
 */
function getLanguageFromRequest(request: Request): Language {
  const acceptLanguage = request.headers.get("accept-language") || ""
  // Simple parsing - take first language code
  const langMatch = acceptLanguage.match(/^([a-z]{2}(?:-[A-Z]{2})?)/i)
  if (langMatch) {
    const lang = langMatch[1].toLowerCase()
    // Map common language codes to our Language type
    if (lang.startsWith("pl")) return "pl"
    if (lang.startsWith("de")) return "de"
    if (lang.startsWith("fr")) return "fr"
    if (lang.startsWith("es")) return "es"
    if (lang.startsWith("it")) return "it"
    if (lang.startsWith("pt")) return "pt"
    if (lang.startsWith("ru")) return "ru"
    if (lang.startsWith("zh")) return "zh-CN"
    if (lang.startsWith("ja")) return "ja"
  }
  return "en" // Default to English
}

export async function GET(request: Request) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  const rateLimitResult = await rateLimiters.economicCalendar(ip)
  
  if (!rateLimitResult.success) {
    logger.warn("Rate limit exceeded for economic calendar", { ip })
    return NextResponse.json(
      { 
        success: false,
        error: "Too many requests. Please try again later.",
        events: [],
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
      {
        success: false,
        error: "FMP_API_KEY environment variable is required",
        events: [],
      },
      { status: 500 }
    )
  }
  try {
    // Get language from request headers
    const language = getLanguageFromRequest(request)
    const locale = getLocaleFromLanguage(language)

    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - 7)
    const toDate = new Date()
    toDate.setDate(toDate.getDate() + 30)

    const from = fromDate.toISOString().split("T")[0]
    const to = toDate.toISOString().split("T")[0]

    const url = `${FMP_API_URL}/economic_calendar?from=${from}&to=${to}&apikey=${FMP_API_KEY}`

    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache na 5 minut
    })

    if (!response.ok) {
      throw new Error(`FMP API error: ${response.status}`)
    }

    const data = await response.json()

    const events = Array.isArray(data)
      ? data
          .filter((event: any) => {
            const eventDate = new Date(event.date)
            const now = new Date()
            now.setHours(0, 0, 0, 0) // Resetuj do początku dnia
            return event.impact && eventDate >= now
          })
          .map((event: any) => {
            let eventDate: Date

            // Jeśli data zawiera czas (format ISO)
            if (event.date && event.date.includes("T")) {
              eventDate = new Date(event.date)
            }
            // Jeśli data jest w formacie YYYY-MM-DD
            else if (event.date && /^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
              eventDate = new Date(event.date + "T12:00:00.000Z")
            }
            // Fallback - spróbuj bezpośrednio
            else {
              eventDate = new Date(event.date)
            }

            // Sprawdź czy data jest prawidłowa
            if (isNaN(eventDate.getTime())) {
              eventDate = new Date() // Użyj bieżącej daty jako fallback
            }

            return {
              dateObj: eventDate,
              date: eventDate.toLocaleDateString(locale, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
              time: eventDate.toLocaleTimeString(locale, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
              country: event.country || "N/A",
              event: event.event || "Unknown Event",
              impact: event.impact.toLowerCase() as "high" | "medium" | "low",
              forecast: event.estimate || undefined,
              previous: event.previous || undefined,
              actual: event.actual || undefined,
            }
          })
          .sort((a: any, b: any) => a.dateObj.getTime() - b.dateObj.getTime())
          .map(({ dateObj, ...rest }: any) => rest) // Usuń dateObj przed zwróceniem
      : []

    return NextResponse.json({
      success: true,
      events,
    })
  } catch (error) {
    logger.error("Failed to fetch economic calendar", error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch economic calendar",
        events: [],
      },
      { status: 500 },
    )
  }
}
