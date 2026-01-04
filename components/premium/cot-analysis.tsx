"use client"

import { PremiumGate } from '@/components/PremiumGate'
import { useSubscription } from '@/hooks/useSubscription'
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, BarChart3, Calendar as CalendarIcon } from "lucide-react"
import { toast } from "sonner"

interface COTData {
  date?: string
  symbol?: string
  commercialLong?: number
  commercialShort?: number
  nonCommercialLong?: number
  nonCommercialShort?: number
  nonReportableLong?: number
  nonReportableShort?: number
  [key: string]: any
}

export function COTAnalysisComponent() {
  const { isPremium, loading: subscriptionLoading } = useSubscription()

  const [fromDate, setFromDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 90)
    return date.toISOString().split("T")[0]
  })
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)
  const [cotData, setCotData] = useState<COTData[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchCOT = async () => {
    if (!isPremium) return

    setLoading(true)
    try {
      const response = await fetch(`/api/economic-calendar/cot?from=${fromDate}&to=${toDate}`)
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Nie udało się pobrać danych COT")
        return
      }

      if (data.success) {
        setCotData(Array.isArray(data.data) ? data.data : [])
        setLastUpdated(new Date())
        if (data.data.length === 0) {
          toast.info("Brak danych COT dla wybranego okresu")
        } else {
          toast.success(`Pobrano ${data.data.length} rekordów COT`)
        }
      }
    } catch (error) {
      toast.error("Wystąpił błąd podczas pobierania danych")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isPremium || subscriptionLoading) return

    fetchCOT()

    const interval = setInterval(() => {
      fetchCOT()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, isPremium, subscriptionLoading])

  return (
    <PremiumGate>
      <Card className="p-8 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-cyan-500" />
            COT Analysis By Dates
          </CardTitle>
          <CardDescription>
            Analiza raportów COT (Commitment of Traders) według dat
            {lastUpdated && (
              <span className="block text-xs text-muted-foreground mt-1">
                Ostatnia aktualizacja: {lastUpdated.toLocaleTimeString("pl-PL")}
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fromDate">Od daty</Label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="toDate">Do daty</Label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchCOT} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Pobieranie...
                  </>
                ) : (
                  <>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Pobierz dane
                  </>
                )}
              </Button>
            </div>
          </div>

          {cotData.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Dane COT</h3>
              <div className="grid gap-4">
                {cotData.slice(0, 20).map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      {item.date && (
                        <div>
                          <span className="text-muted-foreground">Data: </span>
                          <span className="font-medium">{item.date}</span>
                        </div>
                      )}
                      {item.symbol && (
                        <div>
                          <span className="text-muted-foreground">Symbol: </span>
                          <span className="font-medium">{item.symbol}</span>
                        </div>
                      )}
                      {item.commercialLong !== undefined && (
                        <div>
                          <span className="text-muted-foreground">Commercial Long: </span>
                          <span className="font-medium">{item.commercialLong.toLocaleString()}</span>
                        </div>
                      )}
                      {item.nonCommercialLong !== undefined && (
                        <div>
                          <span className="text-muted-foreground">Non-Commercial Long: </span>
                          <span className="font-medium">{item.nonCommercialLong.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            !loading && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Wybierz zakres dat i kliknij "Pobierz dane", aby zobaczyć analizę COT</p>
              </div>
            )
          )}

          {loading && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-cyan-500" />
            </div>
          )}
        </CardContent>
      </Card>
    </PremiumGate>
  )
}
