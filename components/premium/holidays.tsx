"use client"

import { PremiumGate } from "@/components/PremiumGate"
import { useSubscription } from "@/hooks/useSubscription"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CalendarDays } from "lucide-react"
import { toast } from "sonner"

interface Holiday {
  date?: string
  name?: string
  exchange?: string
  isClosed?: boolean
  adjCloseTime?: string
  isFullyClosed?: boolean
  [key: string]: any
}

const EXCHANGES = [
  { value: "NYSE", label: "NYSE - New York Stock Exchange" },
  { value: "NASDAQ", label: "NASDAQ" },
  { value: "LSE", label: "LSE - London Stock Exchange" },
  { value: "TSE", label: "TSE - Tokyo Stock Exchange" },
  { value: "HKEX", label: "HKEX - Hong Kong Exchange" },
  { value: "EURONEXT", label: "Euronext" },
]

export function HolidaysComponent() {
  const { isPremium, loading: subscriptionLoading } = useSubscription()

  const [selectedExchange, setSelectedExchange] = useState("NYSE")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [loading, setLoading] = useState(false)
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchHolidays = async () => {
    if (!isPremium) return

    setLoading(true)
    try {
      const response = await fetch(
        `/api/economic-calendar/holidays?exchange=${selectedExchange}&year=${selectedYear}`
      )
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Nie udało się pobrać danych o świętach")
        return
      }

      if (data.success) {
        setHolidays(Array.isArray(data.data) ? data.data : [])
        setLastUpdated(new Date())
        if (data.data.length === 0) {
          toast.info("Brak danych o świętach dla wybranej giełdy")
        } else {
          toast.success(`Znaleziono ${data.data.length} dni wolnych`)
        }
      }
    } catch {
      toast.error("Wystąpił błąd podczas pobierania danych")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isPremium || subscriptionLoading) return

    fetchHolidays()

    const interval = setInterval(() => {
      fetchHolidays()
    }, 30 * 60 * 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExchange, selectedYear, isPremium, subscriptionLoading])

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

  return (
    <PremiumGate>
      <Card className="p-8 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-cyan-500" />
            Holidays By Exchange
          </CardTitle>
          <CardDescription>
            Kalendarz dni wolnych od handlu według giełd
            {lastUpdated && (
              <span className="block text-xs text-muted-foreground mt-1">
                Ostatnia aktualizacja: {lastUpdated.toLocaleTimeString("pl-PL")}
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Giełda</label>
              <Select value={selectedExchange} onValueChange={setSelectedExchange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXCHANGES.map((exchange) => (
                    <SelectItem key={exchange.value} value={exchange.value}>
                      {exchange.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Rok</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-cyan-500" />
            </div>
          ) : holidays.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                Dni wolne od handlu – {EXCHANGES.find(e => e.value === selectedExchange)?.label}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {holidays
                  .sort((a, b) => {
                    if (!a.date || !b.date) return 0
                    return new Date(b.date).getTime() - new Date(a.date).getTime()
                  })
                  .map((holiday, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-2">
                        {holiday.date && (
                          <div className="font-semibold">
                            {new Date(holiday.date).toLocaleDateString("pl-PL", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                        )}
                        {holiday.name && (
                          <div className="text-sm text-muted-foreground">{holiday.name}</div>
                        )}
                        <div className="flex flex-wrap gap-2 text-xs">
                          {holiday.isClosed && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded">
                              Zamknięte
                            </span>
                          )}
                          {holiday.adjCloseTime && !holiday.isClosed && (
                            <span className="px-2 py-1 bg-amber-500/20 text-amber-500 rounded">
                              Wczesne zamknięcie: {holiday.adjCloseTime}
                            </span>
                          )}
                          {holiday.isFullyClosed === false && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded">
                              Częściowo otwarte
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Brak danych o świętach dla wybranej giełdy i roku</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PremiumGate>
  )
}
