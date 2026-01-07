"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, AlertCircle, BarChart3, RefreshCw, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"

interface Signal {
  id: string
  instrument: string
  signal_type: string
  entry_price: number
  sl: number
  tp1: number
  tp2: number
  tp3: number
  status: string
  created_at: string
  updated_at: string
  probability?: number
}

interface Statistics {
  totalSignals: number
  activeSignals: number
  tp1Hits: number
  tp2Hits: number
  tp3Hits: number
  slHits: number
  winRate: number
}

type TimeRange = "1d" | "7d" | "30d"

export function TradingStatistics() {
  const { t } = useI18n()
  const [signals, setSignals] = useState<Signal[]>([])
  const [timeRange, setTimeRange] = useState<TimeRange>("7d")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchSignals = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true)

      const response = await fetch(`/api/signals?limit=100`)

      if (!response.ok) throw new Error("Failed to fetch signals")

      const result = await response.json()
      if (result.success && Array.isArray(result.signals)) {
        setSignals(result.signals)
      }
    } catch (error) {
      // Error handling - no logging to console
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchSignals()
    const interval = setInterval(() => fetchSignals(), 60000)
    return () => clearInterval(interval)
  }, [timeRange])

  const calculateStatistics = (): Statistics => {
    const now = new Date()
    const cutoffTime = new Date()

    if (timeRange === "1d") {
      cutoffTime.setDate(cutoffTime.getDate() - 1)
    } else if (timeRange === "7d") {
      cutoffTime.setDate(cutoffTime.getDate() - 7)
    } else if (timeRange === "30d") {
      cutoffTime.setDate(cutoffTime.getDate() - 30)
    }

    const filteredSignals = signals.filter((signal) => {
      const signalDate = new Date(signal.updated_at || signal.created_at)
      return signalDate >= cutoffTime
    })

    let tp1Hits = 0
    let tp2Hits = 0
    let tp3Hits = 0
    let slHits = 0
    let activeSignals = 0

    filteredSignals.forEach((signal) => {
      const status = signal.status?.toLowerCase()

      if (status.includes("sl_hit") || status.includes("sl hit") || (status.includes("sl") && !status.includes("tp"))) {
        slHits++
      } else if (status.includes("active") || status.includes("aktywny")) {
        activeSignals++
      } else if (status.includes("tp3")) {
        tp3Hits++
      } else if (status.includes("tp2")) {
        tp2Hits++
      } else if (status.includes("tp1")) {
        tp1Hits++
      }
    })

    const totalClosedSignals = tp1Hits + tp2Hits + tp3Hits + slHits
    const totalWins = tp1Hits + tp2Hits + tp3Hits
    const winRate = totalClosedSignals > 0 ? (totalWins / totalClosedSignals) * 100 : 0

    return {
      totalSignals: filteredSignals.length,
      activeSignals,
      tp1Hits,
      tp2Hits,
      tp3Hits,
      slHits,
      winRate,
    }
  }

  const stats = calculateStatistics()

  if (loading) {
    return (
      <Card className="w-full border-2 border-cyan-500/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            {t.tradingStatistics?.title || "Trading Statistics"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full border-2 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            {t.tradingStatistics?.title || "Trading Statistics"}
          </CardTitle>
          <Button onClick={() => fetchSignals(true)} size="sm" variant="ghost" disabled={refreshing}>
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Range Selector */}
        <div className="flex gap-2">
          <Button
            onClick={() => setTimeRange("1d")}
            variant={timeRange === "1d" ? "default" : "outline"}
            size="sm"
            className={cn(
              timeRange === "1d" && "bg-cyan-500 hover:bg-cyan-600 border-cyan-400",
              timeRange !== "1d" && "border-cyan-500/40 hover:border-cyan-400",
            )}
          >
            {t.tradingStatistics?.oneDay || "1 Day"}
          </Button>
          <Button
            onClick={() => setTimeRange("7d")}
            variant={timeRange === "7d" ? "default" : "outline"}
            size="sm"
            className={cn(
              timeRange === "7d" && "bg-cyan-500 hover:bg-cyan-600 border-cyan-400",
              timeRange !== "7d" && "border-cyan-500/40 hover:border-cyan-400",
            )}
          >
            {t.tradingStatistics?.sevenDays || "7 Days"}
          </Button>
          <Button
            onClick={() => setTimeRange("30d")}
            variant={timeRange === "30d" ? "default" : "outline"}
            size="sm"
            className={cn(
              timeRange === "30d" && "bg-cyan-500 hover:bg-cyan-600 border-cyan-400",
              timeRange !== "30d" && "border-cyan-500/40 hover:border-cyan-400",
            )}
          >
            {t.tradingStatistics?.thirtyDays || "30 Days"}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <StatCard label={t.tradingStatistics?.totalSignals || "Total Signals"} value={stats.totalSignals} icon={BarChart3} color="cyan" />
          <StatCard label={t.tradingStatistics?.activeSignals || "Active Signals"} value={stats.activeSignals} icon={Activity} color="blue" />
          <StatCard label={t.tradingStatistics?.tp1Hits || "TP1 Hits"} value={stats.tp1Hits} icon={Target} color="green" />
          <StatCard label={t.tradingStatistics?.tp2Hits || "TP2 Hits"} value={stats.tp2Hits} icon={Target} color="emerald" />
          <StatCard label={t.tradingStatistics?.tp3Hits || "TP3 Hits"} value={stats.tp3Hits} icon={Target} color="lime" />
          <StatCard label={t.tradingStatistics?.stopLoss || "Stop Loss"} value={stats.slHits} icon={AlertCircle} color="red" />
          <StatCard
            label={t.tradingStatistics?.winRate || "Win Rate"}
            value={`${stats.winRate.toFixed(1)}%`}
            icon={BarChart3}
            color={stats.winRate >= 70 ? "green" : stats.winRate >= 50 ? "yellow" : "red"}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
  icon: any
  color: string
}) {
  const colorClasses = {
    cyan: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400",
    blue: "border-blue-500/40 bg-blue-500/10 text-blue-400",
    green: "border-green-500/40 bg-green-500/10 text-green-400",
    emerald: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    lime: "border-lime-500/40 bg-lime-500/10 text-lime-400",
    red: "border-red-500/40 bg-red-500/10 text-red-400",
    yellow: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  }

  return (
    <div
      className={cn(
        "p-4 rounded-lg border-2 transition-all duration-300",
        colorClasses[color as keyof typeof colorClasses] || colorClasses.cyan,
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}
