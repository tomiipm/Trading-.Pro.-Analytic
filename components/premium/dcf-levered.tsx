"use client"

import { PremiumGate } from "@/components/PremiumGate"
import { useSubscription } from "@/hooks/useSubscription"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, DollarSign, Search } from "lucide-react"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n/context"

export function DCFLeveredComponent() {
  const { isPremium, loading: subscriptionLoading } = useSubscription()
  const { t } = useI18n()

  const [symbol, setSymbol] = useState("AAPL")
  const [loading, setLoading] = useState(false)
  const [dcfData, setDcfData] = useState<any>(null)

  const fetchDCF = async () => {
    if (!isPremium) return

    if (!symbol.trim()) {
      toast.error("Wprowadź symbol spółki")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/economic-calendar/dcf?symbol=${symbol}`)
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Nie udało się pobrać danych DCF")
        return
      }

      if (data.success && data.data) {
        setDcfData(data.data)
        toast.success("Dane DCF pobrane pomyślnie")
      }
    } catch {
      toast.error("Wystąpił błąd podczas pobierania danych")
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh TYLKO dla premium
  useEffect(() => {
    if (!isPremium || subscriptionLoading || !dcfData || !symbol.trim()) return

    const interval = setInterval(() => {
      setLoading(true)
      fetch(`/api/economic-calendar/dcf?symbol=${symbol}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setDcfData(data.data)
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }, 15 * 60 * 1000)

    return () => clearInterval(interval)
  }, [dcfData, symbol, isPremium, subscriptionLoading])

  return (
    <PremiumGate>
      <Card className="p-8 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-cyan-500" />
            Custom DCF Levered
          </CardTitle>
          <CardDescription>
            Zaawansowana analiza DCF (Discounted Cash Flow) z dźwignią finansową
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="symbol">{t.economicCalendarPage?.dcfSymbolLabel || "Symbol spółki"}</Label>
              <Input
                id="symbol"
                placeholder={t.economicCalendarPage?.dcfPlaceholder || "np. AAPL, MSFT, GOOGL"}
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && fetchDCF()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchDCF} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.economicCalendarPage?.dcfFetching || "Pobieranie..."}
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    {t.economicCalendarPage?.dcfAnalyze || "Analizuj"}
                  </>
                )}
              </Button>
            </div>
          </div>

          {dcfData && (
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-3">Wycena DCF</h3>
                <div className="space-y-2 text-sm">
                  {dcfData.dcf && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">DCF Value:</span>
                      <span className="font-semibold">${parseFloat(dcfData.dcf).toFixed(2)}</span>
                    </div>
                  )}
                  {dcfData.stockPrice && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cena akcji:</span>
                      <span className="font-semibold">${parseFloat(dcfData.stockPrice).toFixed(2)}</span>
                    </div>
                  )}
                  {dcfData.dcf && dcfData.stockPrice && (
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Różnica:</span>
                      <span
                        className={`font-semibold ${
                          parseFloat(dcfData.dcf) > parseFloat(dcfData.stockPrice)
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {(
                          (parseFloat(dcfData.dcf) / parseFloat(dcfData.stockPrice) - 1) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-3">Szczegóły</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(dcfData).map(([key, value]: [string, any]) => {
                    if (key === "dcf" || key === "stockPrice") return null
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="font-medium">
                          {typeof value === "number" ? value.toFixed(2) : String(value)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {!dcfData && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Wprowadź symbol spółki i kliknij "Analizuj", aby zobaczyć wycenę DCF</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PremiumGate>
  )
}
