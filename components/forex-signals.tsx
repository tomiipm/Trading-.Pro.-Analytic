"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, AlertCircle, TrendingUp, TrendingDown, Target, CheckCircle2, Clock, BarChart3, DollarSign, Percent, Timer, Info, Calendar, TrendingUp as TrendingUpIcon, Filter, ArrowUpDown, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"
import { useI18n } from "@/lib/i18n/context"
import Link from "next/link"

interface ForexSignal {
  id: string
  instrument: string
  signal_type: string
  entry_price: number
  sl: number
  tp1: number
  tp2: number
  tp3: number
  probability: number | string
  status: string
  created_at: string
}

const SUPPORTED_INSTRUMENTS = [
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "AUDUSD",
  "USDCAD",
  "NZDUSD",
  "EURGBP",
  "EURJPY",
  "GBPJPY",
  "AUDJPY",
  "XAUUSD", // Gold to USD
  "XAUJPY", // Gold to JPY
  "XAUAUD", // Gold to AUD
  "US30", // Dow Jones 30
  "US100", // NASDAQ 100
]

const SIGNALS_API_URL = "/api/signals"

// Funkcja pomocnicza do obliczania pipsów/punktów
const getPips = (price1: number, price2: number, instrument: string): number => {
  const instrumentUpper = instrument.toUpperCase()
  
  // Złoto (XAU)
  if (instrumentUpper.startsWith("XAU")) {
    if (instrumentUpper.includes("JPY")) {
      // XAUJPY: 1 punkt = 0.1 (mnożnik 10)
      return Math.abs((price1 - price2) * 10)
    } else {
      // XAUUSD, XAUAUD: 1 punkt = 0.01 (mnożnik 100)
      return Math.abs((price1 - price2) * 100)
    }
  }
  
  // Indeksy
  if (instrumentUpper === "US30" || instrumentUpper === "US100") {
    // US30, US100: 1 punkt = 1.0 (mnożnik 1)
    return Math.abs(price1 - price2)
  }
  
  // Pary walutowe z JPY
  if (instrumentUpper.includes("JPY")) {
    // JPY pary: 1 pip = 0.01 (mnożnik 100)
    return Math.abs((price1 - price2) * 100)
  }
  
  // Pozostałe pary walutowe
  // Standardowe pary: 1 pip = 0.0001 (mnożnik 10000)
  return Math.abs((price1 - price2) * 10000)
}

// Funkcja pomocnicza do formatowania pipsów/punktów
const formatPips = (pips: number, instrument: string, showUnit: boolean = true): string => {
  const instrumentUpper = instrument.toUpperCase()
  const isGold = instrumentUpper.startsWith("XAU")
  const isIndex = instrumentUpper === "US30" || instrumentUpper === "US100"
  
  // Dla wartości całkowitych pokazuj bez miejsc po przecinku, dla innych z 1 miejscem
  const formatted = pips % 1 === 0 ? pips.toFixed(0) : pips.toFixed(1)
  
  if (!showUnit) return formatted
  
  // Określ jednostkę na podstawie instrumentu
  if (isGold || isIndex) {
    return `${formatted} pkt`
  }
  
  return `${formatted} pips`
}

type TimeFilter = "1d" | "7d" | "30d" | "all"
type SortOption = "created_desc" | "created_asc" | "sl_first" | "active_first"

export function ForexSignals() {
  const { hasActiveSubscription, user, loading: authLoading } = useAuth()
  const { t } = useI18n()
  const [signals, setSignals] = useState<ForexSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedSignal, setSelectedSignal] = useState<ForexSignal | null>(null)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all")
  const [sortOption, setSortOption] = useState<SortOption>("created_desc")
  
  const hasAccess = hasActiveSubscription()
  const isLoggedIn = !!user

  const fetchSignalsFromAPI = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 sekund timeout

      const response = await fetch(SIGNALS_API_URL, {
        method: "GET",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result = await response.json()

      if (result.success && Array.isArray(result.signals)) {
        const filteredSignals = result.signals.filter((signal: ForexSignal) =>
          SUPPORTED_INSTRUMENTS.includes(signal.instrument),
        )

        setSignals(filteredSignals)
        setError(null)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError("Request timeout. Please try again.")
      } else {
        setError("Unable to connect to server. Please try again.")
      }
      setSignals([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    // Don't fetch signals if auth is still loading
    if (authLoading) {
      return
    }

    fetchSignalsFromAPI()

    const interval = setInterval(() => {
      fetchSignalsFromAPI()
    }, 30000)

    return () => clearInterval(interval)
  }, [authLoading])

  // Funkcja filtrowania sygnałów według czasu
  const filterSignalsByTime = (signalsToFilter: ForexSignal[]): ForexSignal[] => {
    if (timeFilter === "all") return signalsToFilter

    const now = new Date()
    const cutoffDate = new Date()

    switch (timeFilter) {
      case "1d":
        cutoffDate.setDate(cutoffDate.getDate() - 1)
        break
      case "7d":
        cutoffDate.setDate(cutoffDate.getDate() - 7)
        break
      case "30d":
        cutoffDate.setDate(cutoffDate.getDate() - 30)
        break
    }

    return signalsToFilter.filter((signal) => {
      const createdDate = new Date(signal.created_at)
      return createdDate >= cutoffDate
    })
  }

  // Funkcja sortowania sygnałów
  const sortSignals = (signalsToSort: ForexSignal[]): ForexSignal[] => {
    const sorted = [...signalsToSort]

    switch (sortOption) {
      case "created_desc":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return dateB - dateA // Najnowsze pierwsze
        })

      case "created_asc":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return dateA - dateB // Najstarsze pierwsze
        })

      case "sl_first":
        return sorted.sort((a, b) => {
          const aIsSL = a.status.toLowerCase().includes("sl") || a.status.toLowerCase().includes("stop")
          const bIsSL = b.status.toLowerCase().includes("sl") || b.status.toLowerCase().includes("stop")
          
          if (aIsSL && !bIsSL) return -1
          if (!aIsSL && bIsSL) return 1
          
          // Jeśli oba są SL lub oba nie są, sortuj po dacie (najnowsze pierwsze)
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return dateB - dateA
        })

      case "active_first":
        return sorted.sort((a, b) => {
          const aIsActive = a.status.toLowerCase() === "active" || a.status.toLowerCase() === "aktywny"
          const bIsActive = b.status.toLowerCase() === "active" || b.status.toLowerCase() === "aktywny"
          
          if (aIsActive && !bIsActive) return -1
          if (!aIsActive && bIsActive) return 1
          
          // Jeśli oba są aktywne lub oba nie są, sortuj po dacie (najnowsze pierwsze)
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return dateB - dateA
        })

      default:
        return sorted
    }
  }

  // Zastosuj filtry i sortowanie
  const filteredAndSortedSignals = sortSignals(filterSignalsByTime(signals))

  // Show loading only if we don't have signals yet (not on refresh)
  if (loading && signals.length === 0 && !error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Signals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              {t.signals.title}
            </CardTitle>
            <Button onClick={() => fetchSignalsFromAPI(true)} size="sm" variant="ghost" disabled={refreshing}>
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            </Button>
          </div>
          
          {/* Filtry i Sortowanie */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Filtr czasowy */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t.signals.period}</span>
              <Tabs value={timeFilter} onValueChange={(value) => setTimeFilter(value as TimeFilter)}>
                <TabsList className="h-9">
                  <TabsTrigger value="all" className="text-xs">{t.signals.all}</TabsTrigger>
                  <TabsTrigger value="1d" className="text-xs">{t.signals.oneDay}</TabsTrigger>
                  <TabsTrigger value="7d" className="text-xs">{t.signals.sevenDays}</TabsTrigger>
                  <TabsTrigger value="30d" className="text-xs">{t.signals.thirtyDays}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Sortowanie */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t.signals.sortBy}</span>
              <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                <SelectTrigger className="w-[200px] h-9">
                  <SelectValue placeholder={t.signals.sortBy} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_desc">{t.signals.newestFirst}</SelectItem>
                  <SelectItem value="created_asc">{t.signals.oldestFirst}</SelectItem>
                  <SelectItem value="active_first">{t.signals.activeFirst}</SelectItem>
                  <SelectItem value="sl_first">{t.signals.stopLossFirst}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4 bg-red-500/10 border-red-500/50">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-500">{error}</AlertDescription>
          </Alert>
        )}

        {!isLoggedIn && (
          <Alert className="mb-4 bg-yellow-500/10 border-yellow-500/50">
            <Lock className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-500">
              <div className="flex items-center justify-between">
                <span>{t.signals.loginToSeeDetails}</span>
                <Link href="/login">
                  <Button size="sm" variant="outline" className="ml-4">
                    {t.nav.login}
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {isLoggedIn && !hasAccess && (
          <Alert className="mb-4 bg-yellow-500/10 border-yellow-500/50">
            <Lock className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-500">
              <div className="flex items-center justify-between">
                <span>{t.signals.activateSubscription}</span>
                <Link href="/subscriptions">
                  <Button size="sm" variant="outline" className="ml-4">
                    {t.signals.goToSubscriptions}
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {filteredAndSortedSignals.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {signals.length === 0 
                ? (t.signals.noSignals || "No active signals available")
                : (t.signals.noSignalsInPeriod || "No signals in selected period ({period})").replace("{period}", timeFilter === "1d" ? t.signals.oneDay : timeFilter === "7d" ? t.signals.sevenDays : timeFilter === "30d" ? t.signals.thirtyDays : t.signals.all)}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              {t.signals.displayed} {filteredAndSortedSignals.length} {t.signals.of} {signals.length} {t.signals.signals}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedSignals.map((signal) => (
                <SignalCard 
                  key={signal.id} 
                  signal={signal} 
                  onClick={() => setSelectedSignal(signal)} 
                  hasAccess={hasAccess}
                />
              ))}
            </div>
          </>
        )}
        
        <SignalDetailsDialog signal={selectedSignal} onClose={() => setSelectedSignal(null)} />
      </CardContent>
    </Card>
  )
}

function SignalCard({ signal, onClick, hasAccess = true }: { signal: ForexSignal; onClick: () => void; hasAccess?: boolean }) {
  const { t } = useI18n()
  const isBuy = signal.signal_type?.toLowerCase() === "buy"

  const formatProbability = (prob: number | string): number => {
    const numProb = typeof prob === "string" ? Number.parseFloat(prob) : prob

    if (numProb > 0 && numProb < 1) {
      return Math.round(numProb * 100)
    }

    if (numProb >= 1 && numProb <= 100) {
      return Math.round(numProb)
    }

    return 50
  }

  const probabilityValue = formatProbability(signal.probability)

  const getStatusInfo = (status: string) => {
    const statusLower = status.toLowerCase()

    if (statusLower.includes("sl") || statusLower.includes("stop")) {
      return { label: "STOP LOSS", color: "red", Icon: AlertCircle }
    }
    if (statusLower === "tp1" || statusLower.includes("tp1")) {
      return { label: "TP1 HIT", color: "green", Icon: Target }
    }
    if (statusLower === "tp2" || statusLower.includes("tp2")) {
      return { label: "TP2 HIT", color: "green", Icon: Target }
    }
    if (statusLower === "tp3" || statusLower.includes("tp3")) {
      return { label: "TP3 HIT", color: "green", Icon: Target }
    }
    if (statusLower === "active" || statusLower === "aktywny") {
      return { label: "ACTIVE", color: "cyan", Icon: Clock }
    }
    if (statusLower === "hit" || statusLower === "trafiony") {
      return { label: "HIT", color: "green", Icon: CheckCircle2 }
    }
    return { label: status.toUpperCase(), color: "gray", Icon: Clock }
  }

  const statusInfo = getStatusInfo(signal.status)

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative group cursor-pointer transition-all duration-300",
        "hover:scale-[1.02]",
        "hover:shadow-[0_0_20px_rgba(6,182,212,0.7),0_0_40px_rgba(6,182,212,0.5)]",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "bg-gradient-to-r from-cyan-500/20 via-cyan-400/20 to-cyan-500/20",
          "blur-xl",
        )}
      />

      <div
        className={cn(
          "relative p-6 rounded-lg backdrop-blur-md",
          "bg-gradient-to-br from-card/80 to-card/40",
          "border-2 transition-all duration-300",
          "border-cyan-500/40 hover:border-cyan-400/80",
          "group-hover:shadow-xl",
        )}
      >
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-0.5 rounded-t-lg transition-all duration-300",
            "opacity-50 group-hover:opacity-100 group-hover:h-1",
            "bg-gradient-to-r from-transparent via-cyan-400 to-transparent",
          )}
        />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "p-2.5 rounded-md relative transition-all duration-300",
                isBuy ? "bg-green-500/20 group-hover:bg-green-500/30" : "bg-red-500/20 group-hover:bg-red-500/30",
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300",
                  isBuy ? "bg-green-400" : "bg-red-400",
                )}
              />
              {isBuy ? (
                <TrendingUp className="h-6 w-6 text-green-400 relative z-10" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-400 relative z-10" />
              )}
            </div>

            <div>
              <h4 className="font-bold text-lg tracking-tight">{signal.instrument}</h4>
              <p
                className={cn(
                  "text-sm font-semibold uppercase tracking-wider",
                  isBuy ? "text-green-400" : "text-red-400",
                )}
              >
                {signal.signal_type}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div
              className={cn(
                "relative px-4 py-1.5 rounded text-sm font-bold backdrop-blur-sm border transition-all duration-300",
                statusInfo.color === "red" &&
                  "bg-red-500/20 text-red-400 border-red-400/50 group-hover:border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]",
                statusInfo.color === "cyan" &&
                  "bg-cyan-500/20 text-cyan-400 border-cyan-400/50 group-hover:border-cyan-400",
                statusInfo.color === "green" &&
                  "bg-green-500/20 text-green-400 border-green-400/50 group-hover:border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]",
                statusInfo.color === "emerald" &&
                  "bg-emerald-500/20 text-emerald-400 border-emerald-400/50 group-hover:border-emerald-400",
                statusInfo.color === "lime" &&
                  "bg-lime-500/20 text-lime-400 border-lime-400/50 group-hover:border-lime-400",
                statusInfo.color === "gray" &&
                  "bg-gray-500/20 text-gray-400 border-gray-400/50 group-hover:border-gray-400",
              )}
            >
              <statusInfo.Icon className="h-4 w-4 inline mr-1" />
              {statusInfo.label}
            </div>

            <div
              className={cn(
                "relative px-4 py-1.5 rounded text-sm font-bold backdrop-blur-sm border transition-all duration-300",
                probabilityValue >= 80
                  ? "bg-green-500/20 text-green-400 border-green-400/50 group-hover:border-green-400"
                  : probabilityValue >= 60
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/50 group-hover:border-yellow-400"
                    : "bg-red-500/20 text-red-400 border-red-400/50 group-hover:border-red-400",
              )}
            >
              {probabilityValue}%
            </div>
          </div>
        </div>

        {hasAccess ? (
        <div className="space-y-3 text-base">
          <div className="flex justify-between items-center py-1.5 border-b border-border/30">
            <span className="text-muted-foreground text-sm">Entry</span>
            <span className="font-mono font-bold text-primary text-base">{signal.entry_price.toFixed(5)}</span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-border/30">
            <span className="text-muted-foreground text-sm">SL</span>
            <span className="font-mono font-bold text-red-400 text-base">{signal.sl.toFixed(5)}</span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">TP1</div>
              <div className="font-mono font-bold text-green-400 text-sm">{signal.tp1.toFixed(5)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">TP2</div>
              <div className="font-mono font-bold text-green-500 text-sm">{signal.tp2.toFixed(5)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">TP3</div>
              <div className="font-mono font-bold text-green-600 text-sm">{signal.tp3.toFixed(5)}</div>
            </div>
          </div>
        </div>
        ) : null}

        {/* Szczegóły - Risk/Reward i Pips - tylko dla użytkowników z subskrypcją */}
        {hasAccess && (
        <div className="mt-4 pt-3 border-t border-border/30 space-y-2">
          {(() => {
            const riskPips = getPips(signal.entry_price, signal.sl, signal.instrument)
            const tp1Pips = getPips(signal.entry_price, signal.tp1, signal.instrument)
            const tp2Pips = getPips(signal.entry_price, signal.tp2, signal.instrument)
            const tp3Pips = getPips(signal.entry_price, signal.tp3, signal.instrument)

            // Oblicz Risk/Reward Ratio
            const rr1 = (tp1Pips / riskPips).toFixed(2)
            const rr2 = (tp2Pips / riskPips).toFixed(2)
            const rr3 = (tp3Pips / riskPips).toFixed(2)

            // Oblicz czas od utworzenia
            const timeAgo = (() => {
              const now = new Date()
              const created = new Date(signal.created_at)
              const diffMs = now.getTime() - created.getTime()
              const diffMins = Math.floor(diffMs / 60000)
              const diffHours = Math.floor(diffMins / 60)
              const diffDays = Math.floor(diffHours / 24)

              if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`
              if (diffHours > 0) return `${diffHours}h ${diffMins % 60}m`
              return `${diffMins}m`
            })()

            return (
              <>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Risk:</span>
                    <span className="font-semibold text-red-400">{formatPips(riskPips, signal.instrument)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Czas:</span>
                    <span className="font-semibold">{timeAgo}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-border/20">
                  <div className="text-center">
                    <div className="text-muted-foreground mb-0.5">TP1</div>
                    <div className="font-semibold text-green-400">{formatPips(tp1Pips, signal.instrument, false)}</div>
                    <div className="text-[10px] text-muted-foreground">R:R {rr1}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground mb-0.5">TP2</div>
                    <div className="font-semibold text-green-500">{formatPips(tp2Pips, signal.instrument, false)}</div>
                    <div className="text-[10px] text-muted-foreground">R:R {rr2}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground mb-0.5">TP3</div>
                    <div className="font-semibold text-green-600">{formatPips(tp3Pips, signal.instrument, false)}</div>
                    <div className="text-[10px] text-muted-foreground">R:R {rr3}</div>
                  </div>
                </div>

                {/* Wizualizacja Risk/Reward */}
                <div className="pt-2 border-t border-border/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-muted-foreground">Risk/Reward</span>
                    <span className="text-[10px] font-semibold text-cyan-400">1:{rr3}</span>
                  </div>
                  <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 h-full bg-red-500/50"
                      style={{ width: `${(1 / (1 + parseFloat(rr3))) * 100}%` }}
                    />
                    <div
                      className="absolute right-0 h-full bg-green-500/50"
                      style={{ width: `${(parseFloat(rr3) / (1 + parseFloat(rr3))) * 100}%` }}
                    />
                  </div>
                </div>
              </>
            )
          })()}
        </div>
        )}

        {hasAccess && (
        <div className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border/30 flex items-center justify-between">
          <span>{new Date(signal.created_at).toLocaleString("pl-PL", { 
            day: "2-digit", 
            month: "2-digit", 
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}</span>
          <span className="flex items-center gap-1">
            <Percent className="h-3 w-3" />
            {probabilityValue}% szans
          </span>
        </div>
        )}
        
        {hasAccess && (
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Info className="h-4 w-4 text-cyan-400" />
        </div>
        )}
        
        {!hasAccess && (
        <div className="mt-4 pt-3 border-t border-border/30 text-center">
          <Link href="/subscriptions">
            <Button size="sm" variant="outline" className="w-full whitespace-normal break-words text-xs leading-tight h-auto py-2">
              <Lock className="h-4 w-4 mr-2 flex-shrink-0" />
              {t.signals.activateSubscription}
            </Button>
          </Link>
        </div>
        )}
      </div>
    </div>
  )
}

function SignalDetailsDialog({ signal, onClose }: { signal: ForexSignal | null; onClose: () => void }) {
  const { hasActiveSubscription } = useAuth()
  const hasAccess = hasActiveSubscription()
  
  if (!signal) return null

  const isBuy = signal.signal_type?.toLowerCase() === "buy"
  
  const formatProbability = (prob: number | string): number => {
    const numProb = typeof prob === "string" ? Number.parseFloat(prob) : prob
    if (numProb > 0 && numProb < 1) return Math.round(numProb * 100)
    if (numProb >= 1 && numProb <= 100) return Math.round(numProb)
    return 50
  }

  const probabilityValue = formatProbability(signal.probability)

  const riskPips = getPips(signal.entry_price, signal.sl, signal.instrument)
  const tp1Pips = getPips(signal.entry_price, signal.tp1, signal.instrument)
  const tp2Pips = getPips(signal.entry_price, signal.tp2, signal.instrument)
  const tp3Pips = getPips(signal.entry_price, signal.tp3, signal.instrument)

  const rr1 = (tp1Pips / riskPips).toFixed(2)
  const rr2 = (tp2Pips / riskPips).toFixed(2)
  const rr3 = (tp3Pips / riskPips).toFixed(2)

  const timeAgo = (() => {
    const now = new Date()
    const created = new Date(signal.created_at)
    const diffMs = now.getTime() - created.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`
    if (diffHours > 0) return `${diffHours}h ${diffMins % 60}m`
    return `${diffMins}m`
  })()

  return (
    <Dialog open={!!signal} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-md",
              isBuy ? "bg-green-500/20" : "bg-red-500/20"
            )}>
              {isBuy ? (
                <TrendingUpIcon className="h-6 w-6 text-green-400" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-400" />
              )}
            </div>
            <div>
              <DialogTitle className="text-2xl">{signal.instrument}</DialogTitle>
              <DialogDescription className="text-base">
                {signal.signal_type} Signal - Szczegóły
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status */}
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-sm text-muted-foreground mb-1">Status</div>
              <div className="text-lg font-semibold">{signal.status.toUpperCase()}</div>
            </div>
            {hasAccess && (
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-sm text-muted-foreground mb-1">Prawdopodobieństwo</div>
              <div className="text-lg font-semibold text-cyan-400">{probabilityValue}%</div>
            </div>
            )}
          </div>

          {/* Ceny */}
          {hasAccess ? (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Poziomy cenowe
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border bg-card">
                <div className="text-xs text-muted-foreground mb-1">Entry Price</div>
                <div className="font-mono font-bold text-lg text-primary">{signal.entry_price.toFixed(5)}</div>
              </div>
              <div className="p-3 rounded-lg border bg-card border-red-500/50 bg-red-500/5">
                <div className="text-xs text-muted-foreground mb-1">Stop Loss</div>
                <div className="font-mono font-bold text-lg text-red-400">{signal.sl.toFixed(5)}</div>
              </div>
              <div className="p-3 rounded-lg border bg-card border-green-500/50 bg-green-500/5">
                <div className="text-xs text-muted-foreground mb-1">Take Profit 1</div>
                <div className="font-mono font-bold text-lg text-green-400">{signal.tp1.toFixed(5)}</div>
              </div>
              <div className="p-3 rounded-lg border bg-card border-green-500/50 bg-green-500/5">
                <div className="text-xs text-muted-foreground mb-1">Take Profit 2</div>
                <div className="font-mono font-bold text-lg text-green-500">{signal.tp2.toFixed(5)}</div>
              </div>
              <div className="p-3 rounded-lg border bg-card border-green-500/50 bg-green-500/5">
                <div className="text-xs text-muted-foreground mb-1">Take Profit 3</div>
                <div className="font-mono font-bold text-lg text-green-600">{signal.tp3.toFixed(5)}</div>
              </div>
            </div>
          </div>
          ) : (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Poziomy cenowe
            </h3>
            <div className="p-4 rounded-lg border bg-muted/50 text-center">
              <Lock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                Zaloguj się i aktywuj subskrypcję, aby zobaczyć Entry Price, Stop Loss, Take Profits i inne szczegóły.
              </p>
              <Link href="/subscriptions">
                <Button variant="outline" className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  {t('subscriptions.activate')}
                </Button>
              </Link>
            </div>
          </div>
          )}

          {hasAccess && (
          <>
          {/* Analiza Risk/Reward */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Analiza Risk/Reward
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border bg-card border-red-500/30">
                <div className="text-xs text-muted-foreground mb-1">Risk</div>
                <div className="font-semibold text-red-400">{formatPips(riskPips, signal.instrument)}</div>
              </div>
              <div className="p-3 rounded-lg border bg-card border-green-500/30">
                <div className="text-xs text-muted-foreground mb-1">TP1</div>
                <div className="font-semibold text-green-400">{formatPips(tp1Pips, signal.instrument)}</div>
                <div className="text-[10px] text-muted-foreground mt-1">R:R {rr1}</div>
              </div>
              <div className="p-3 rounded-lg border bg-card border-green-500/30">
                <div className="text-xs text-muted-foreground mb-1">TP2</div>
                <div className="font-semibold text-green-500">{formatPips(tp2Pips, signal.instrument)}</div>
                <div className="text-[10px] text-muted-foreground mt-1">R:R {rr2}</div>
              </div>
              <div className="p-3 rounded-lg border bg-card border-green-500/30">
                <div className="text-xs text-muted-foreground mb-1">TP3</div>
                <div className="font-semibold text-green-600">{formatPips(tp3Pips, signal.instrument)}</div>
                <div className="text-[10px] text-muted-foreground mt-1">R:R {rr3}</div>
              </div>
            </div>
            
            {/* Wizualizacja Risk/Reward */}
            <div className="p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Risk/Reward Ratio</span>
                <span className="text-sm font-semibold text-cyan-400">1:{rr3}</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute left-0 h-full bg-red-500/50"
                  style={{ width: `${(1 / (1 + parseFloat(rr3))) * 100}%` }}
                />
                <div
                  className="absolute right-0 h-full bg-green-500/50"
                  style={{ width: `${(parseFloat(rr3) / (1 + parseFloat(rr3))) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Informacje czasowe */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Informacje czasowe
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border bg-card">
                <div className="text-xs text-muted-foreground mb-1">Utworzono</div>
                <div className="text-sm font-medium">
                  {new Date(signal.created_at).toLocaleString("pl-PL", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
                <div className="text-xs text-muted-foreground mt-1">({timeAgo} temu)</div>
              </div>
            </div>
          </div>

          {/* ID sygnału */}
          <div className="p-3 rounded-lg border bg-muted/30">
            <div className="text-xs text-muted-foreground">ID Sygnału</div>
            <div className="font-mono text-sm">{signal.id}</div>
          </div>
          </>
          )}

          {!hasAccess && (
          <div className="p-6 rounded-lg border-2 border-yellow-500/50 bg-yellow-500/10 text-center space-y-4">
            <Lock className="h-8 w-8 text-yellow-500 mx-auto" />
            <div>
              <h4 className="font-semibold text-lg mb-2">{t('signals.premiumDetailsTitle')}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {t('signals.premiumDetailsDescription')}
              </p>
              <Link href="/subscriptions">
                <Button className="w-full">                  {t('signals.goToSubscriptions')}
                </Button>
              </Link>
            </div>
          </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
