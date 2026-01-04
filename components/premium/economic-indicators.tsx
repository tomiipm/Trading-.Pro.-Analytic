"use client"

import { PremiumGate } from "@/components/PremiumGate"
import { useSubscription } from "@/hooks/useSubscription"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, TrendingDown } from "lucide-react"
import { toast } from "sonner"

interface Indicator {
  date?: string
  country?: string
  indicator?: string
  value?: number
  unit?: string
  [key: string]: any
}

const COUNTRIES = [
  { value: "US", label: "Stany Zjednoczone" },
  { value: "UK", label: "Wielka Brytania" },
  { value: "EU", label: "Unia Europejska" },
  { value: "JP", label: "Japonia" },
  { value: "CN", label: "Chiny" },
  { value: "DE", label: "Niemcy" },
  { value: "FR", label: "Francja" },
]

const INDICATORS = [
  { value: "all", label: "Wszystkie wskaźniki" },
  { value: "GDP", label: "PKB (GDP)" },
  { value: "CPI", label: "Inflacja (CPI)" },
  { value: "PPI", label: "PPI" },
  { value: "Unemployment", label: "Stopa bezrobocia" },
  { value: "Interest Rate", label: "Stopa procentowa" },
]

export function EconomicIndicatorsComponent() {
  const { isPremium, loading: subscriptionLoading } = useSubscription()

  const [selectedCountry, setSelectedCountry] = useState("US")
  const [selectedIndicator, setSelectedIndicator] = useState("all")
  const [loading, setLoading] = useState(false)
  const [indicators, setIndicators] = useState<Indicator[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchIndicators = async () => {
    if (!isPremium) return

    setLoading(true)
    try {
      let url = `/api/economic-calendar/indicators?country=${selectedCountry}`
      if (selectedIndicator && selectedIndicator !== "all") {
        url += `&indicator=${selectedIndicator}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Nie udało się pobrać wskaźników ekonomicznych")
        return
      }

      if (data.success) {
        setIndicators(Array.isArray(data.data) ? data.data : [])
        setLastUpdated(new Date())
        if (data.data.length === 0) {
          toast.info("Brak danych dla wybranych parametrów")
        } else {
          toast.success(`Pobrano ${data.data.length} wskaźników`)
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

    fetchIndicators()

    const interval = setInterval(() => {
      fetchIndicators()
    }, 10 * 60 * 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry, selectedIndicator, isPremium, subscriptionLoading])

  return (
    <PremiumGate>
      <Card className="p-8 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <TrendingDown className="h-6 w-6 text-cyan-500" />
            Economics Indicators
          </CardTitle>
          <CardDescription>
            Kompleksowe wskaźniki ekonomiczne z różnych krajów i regionów
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
              <label className="text-sm font-medium mb-2 block">Kraj</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Wskaźnik</label>
              <Select value={selectedIndicator} onValueChange={setSelectedIndicator}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INDICATORS.map((indicator) => (
                    <SelectItem key={indicator.value} value={indicator.value}>
                      {indicator.label}
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
          ) : indicators.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Wskaźniki ekonomiczne</h3>
              <div className="grid gap-4">
                {indicators.slice(0, 50).map((indicator, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      {indicator.date && (
                        <div>
                          <span className="text-muted-foreground">Data: </span>
                          <span className="font-medium">
                            {new Date(indicator.date).toLocaleDateString("pl-PL")}
                          </span>
                        </div>
                      )}
                      {indicator.indicator && (
                        <div>
                          <span className="text-muted-foreground">Wskaźnik: </span>
                          <span className="font-medium">{indicator.indicator}</span>
                        </div>
                      )}
                      {indicator.value !== undefined && (
                        <div>
                          <span className="text-muted-foreground">Wartość: </span>
                          <span className="font-medium">
                            {typeof indicator.value === "number"
                              ? indicator.value.toLocaleString("pl-PL", { maximumFractionDigits: 2 })
                              : indicator.value}
                          </span>
                          {indicator.unit && (
                            <span className="text-muted-foreground ml-1">{indicator.unit}</span>
                          )}
                        </div>
                      )}
                      {indicator.country && (
                        <div>
                          <span className="text-muted-foreground">Kraj: </span>
                          <span className="font-medium">{indicator.country}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Brak danych dla wybranych parametrów</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PremiumGate>
  )
}
