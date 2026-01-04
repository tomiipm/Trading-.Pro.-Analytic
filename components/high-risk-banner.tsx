"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, X, Clock, MapPin, ShieldAlert } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { clientLogger } from "@/lib/logger-client"
import { useI18n } from "@/lib/i18n/context"

interface EconomicEvent {
  date: string
  time: string
  country: string
  event: string
  impact: "high" | "medium" | "low"
  forecast?: string
  previous?: string
  actual?: string
}

export function HighRiskBanner() {
  const { t } = useI18n()
  const [upcomingHighRiskEvent, setUpcomingHighRiskEvent] = useState<EconomicEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    fetchHighRiskEvents()
    const interval = setInterval(fetchHighRiskEvents, 5 * 60 * 1000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchHighRiskEvents = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 sekund timeout

      const response = await fetch("/api/economic-calendar", {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        return
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.events)) {
        const now = new Date()
        const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000) // Next 24 hours

        // Find the nearest high-risk event in the next 24 hours
        const highRiskEvents = data.events
          .filter((event: EconomicEvent) => {
            if (event.impact !== "high") return false

            try {
              // Parse event date and time (format: DD.MM.YYYY and HH:MM)
              const [day, month, year] = event.date.split(".")
              const [hours, minutes] = event.time.split(":")
              
              if (!day || !month || !year || !hours || !minutes) return false

              const eventDate = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hours),
                parseInt(minutes),
              )

              // Check if date is valid
              if (isNaN(eventDate.getTime())) return false

              // Check if event is in the future and within next 24 hours
              return eventDate > now && eventDate <= next24Hours
            } catch (error) {
              clientLogger.error("HighRiskBanner error parsing event date", error instanceof Error ? error : new Error(String(error)))
              return false
            }
          })
          .sort((a: EconomicEvent, b: EconomicEvent) => {
            // Sort by date/time - earliest first
            const [dayA, monthA, yearA] = a.date.split(".")
            const [hoursA, minutesA] = a.time.split(":")
            const dateA = new Date(
              parseInt(yearA),
              parseInt(monthA) - 1,
              parseInt(dayA),
              parseInt(hoursA),
              parseInt(minutesA),
            )

            const [dayB, monthB, yearB] = b.date.split(".")
            const [hoursB, minutesB] = b.time.split(":")
            const dateB = new Date(
              parseInt(yearB),
              parseInt(monthB) - 1,
              parseInt(dayB),
              parseInt(hoursB),
              parseInt(minutesB),
            )

            return dateA.getTime() - dateB.getTime()
          })

        if (highRiskEvents.length > 0 && !isDismissed) {
          setUpcomingHighRiskEvent(highRiskEvents[0])
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      }
    } catch (error) {
      // Ignore timeout and network errors silently to prevent console spam
      if (error instanceof Error && error.name !== 'AbortError') {
        clientLogger.error("HighRiskBanner error fetching events", error)
      }
      setIsVisible(false)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
    // Store dismissal in localStorage to persist across page refreshes
    if (upcomingHighRiskEvent) {
      localStorage.setItem(
        `banner-dismissed-${upcomingHighRiskEvent.date}-${upcomingHighRiskEvent.time}`,
        "true",
      )
    }
  }

  // Check if this specific event was already dismissed
  useEffect(() => {
    if (upcomingHighRiskEvent) {
      const dismissed = localStorage.getItem(
        `banner-dismissed-${upcomingHighRiskEvent.date}-${upcomingHighRiskEvent.time}`,
      )
      if (dismissed === "true") {
        setIsDismissed(true)
        setIsVisible(false)
      }
    }
  }, [upcomingHighRiskEvent])

  if (!isVisible || !upcomingHighRiskEvent) {
    return null
  }

  // Calculate time until event
  let hoursUntil = 0
  let minutesUntil = 0
  
  try {
    const [day, month, year] = upcomingHighRiskEvent.date.split(".")
    const [hours, minutes] = upcomingHighRiskEvent.time.split(":")
    const eventDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
    )
    const now = new Date()
    const timeUntilEvent = eventDate.getTime() - now.getTime()
    hoursUntil = Math.floor(timeUntilEvent / (1000 * 60 * 60))
    minutesUntil = Math.floor((timeUntilEvent % (1000 * 60 * 60)) / (1000 * 60))
  } catch (error) {
    clientLogger.error("HighRiskBanner error calculating time until event", error instanceof Error ? error : new Error(String(error)))
  }

  return (
    <Card className="border-red-500/50 bg-gradient-to-r from-red-500/20 to-orange-500/20 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse">
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="flex-shrink-0 mt-1">
              <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-red-500 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg md:text-xl font-bold text-red-400">
                  ⚠️ {t.highRiskBanner?.title || "Upcoming High-Risk Event!"}
                </h3>
              </div>
              <div className="space-y-2 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{upcomingHighRiskEvent.country}</span>
                </div>
                <div className="font-medium text-foreground">{upcomingHighRiskEvent.event}</div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {upcomingHighRiskEvent.date} {upcomingHighRiskEvent.time}
                    </span>
                  </div>
                  {hoursUntil >= 0 && (
                    <span className="text-red-400 font-semibold">
                      {(() => {
                        const inText = t.highRiskBanner?.in || "In"
                        const minutesText = t.highRiskBanner?.minutes || "minutes"
                        if (hoursUntil > 0) {
                          return `${inText} ${hoursUntil}h ${minutesUntil}m`
                        } else {
                          return `${inText} ${minutesUntil} ${minutesText}`
                        }
                      })()}
                    </span>
                  )}
                </div>
                {upcomingHighRiskEvent.forecast && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">{t.highRiskBanner?.forecast || "Forecast"}: </span>
                    <span className="font-medium">{upcomingHighRiskEvent.forecast}</span>
                  </div>
                )}
              </div>
              
              {/* Risk Warning */}
              <div className="mt-4 p-3 bg-red-500/30 border border-red-500/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs md:text-sm text-red-200 leading-relaxed">
                    <strong className="font-semibold">{t.highRiskBanner?.riskWarning || "Risk Warning"}:</strong> {t.highRiskBanner?.riskWarningText || "During high-risk events, prices may change rapidly, which can lead to significant losses. Consider avoiding trading or reducing exposure to risk."}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <Link href="/economic-calendar">
                  <Button variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-500/20">
                    {t.highRiskBanner?.viewCalendar || t.nav.calendar || "View Economic Calendar"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

