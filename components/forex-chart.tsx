"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, TrendingUp, TrendingDown, Activity } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { clientLogger } from "@/lib/logger-client"

interface ChartDataPoint {
  date: string
  close: number
  open: number
  high: number
  low: number
}

interface ForexChartProps {
  symbol: string
  timeframe?: string
}

// Local function to fetch chart data
async function fetchForexChartData(symbol: string, timeframe: string): Promise<ChartDataPoint[]> {
  try {
    const response = await fetch(`/api/chart/${symbol}/${timeframe}`, {
      cache: "no-store",
    })
    
    if (!response.ok) {
      clientLogger.warn("ForexChart API returned non-ok status", { status: response.status, symbol, timeframe })
      // Still try to parse the response in case it contains data
    }
    
    const data = await response.json()
    
    // Check if response contains an error
    if (data && typeof data === "object" && "error" in data) {
      clientLogger.warn("ForexChart API returned error", { error: data.error, symbol, timeframe })
      return []
    }
    
    return Array.isArray(data) && data.length > 0 ? data : []
  } catch (error) {
    clientLogger.error("ForexChart error fetching chart data", error instanceof Error ? error : new Error(String(error)), { symbol, timeframe })
    return []
  }
}

export default function ForexChart({ symbol, timeframe = "1H" }: ForexChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const loadChartData = async () => {
    try {
      setLoading(true)
      setError(null)

      clientLogger.debug("ForexChart loading chart data", { symbol, timeframe })
      const data = await fetchForexChartData(symbol, timeframe)

      clientLogger.debug("ForexChart received data", { symbol, timeframe, isArray: Array.isArray(data), length: data?.length })

      // Ensure data is always an array
      if (Array.isArray(data) && data.length > 0) {
        setChartData(data)
        setLastUpdate(new Date())
        clientLogger.debug("ForexChart successfully loaded data", { symbol, timeframe, dataPoints: data.length })
      } else {
        clientLogger.warn("ForexChart no chart data received", { symbol, timeframe })
        setError("No chart data available")
        setChartData([])
      }
    } catch (err) {
      clientLogger.error("ForexChart error loading chart data", err instanceof Error ? err : new Error(String(err)), { symbol, timeframe })
      setError("Failed to load chart data")
      setChartData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChartData()

    // Auto-refresh every 60 seconds
    const interval = setInterval(loadChartData, 60000)
    return () => clearInterval(interval)
  }, [symbol, timeframe])

  const formatSymbol = (symbol: string) => {
    if (symbol.length === 6) {
      return `${symbol.slice(0, 3)}/${symbol.slice(3)}`
    }
    return symbol
  }

  const getCurrentPrice = () => {
    if (chartData.length === 0) return 0
    return chartData[chartData.length - 1]?.close || 0
  }

  const getPriceChange = () => {
    if (chartData.length < 2) return { change: 0, percentage: 0 }

    const current = chartData[chartData.length - 1]?.close || 0
    const previous = chartData[0]?.close || 0
    const change = current - previous
    const percentage = previous !== 0 ? (change / previous) * 100 : 0

    return { change, percentage }
  }

  const { change, percentage } = getPriceChange()
  const currentPrice = getCurrentPrice()

  if (loading && chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{formatSymbol(symbol)} Chart</span>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-pulse bg-gray-200 h-4 w-32 mx-auto mb-2 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-32 w-full rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{formatSymbol(symbol)} Chart</span>
            <Badge variant="outline" className="text-xs">
              {timeframe}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadChartData}
            disabled={loading}
            className="h-8 w-8 p-0 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={loadChartData}>
              Try Again
            </Button>
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No chart data available</p>
          </div>
        ) : (
          <>
            {/* Price Info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-2xl font-bold">
                    {symbol.includes("JPY") ? currentPrice.toFixed(3) : currentPrice.toFixed(5)}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Price</div>
                </div>
                <div className={`flex items-center gap-1 ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-medium">
                    {change >= 0 ? "+" : ""}
                    {change.toFixed(5)} ({percentage.toFixed(2)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span>{chartData.length} points</span>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    }
                    className="text-xs"
                  />
                  <YAxis
                    domain={["dataMin - 0.001", "dataMax + 0.001"]}
                    tickFormatter={(value) => (symbol.includes("JPY") ? value.toFixed(3) : value.toFixed(5))}
                    className="text-xs"
                  />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value: number | undefined) => [
                      value ? (symbol.includes("JPY") ? value.toFixed(3) : value.toFixed(5)) : "",
                      "Price",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke={change >= 0 ? "#22c55e" : "#ef4444"}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {lastUpdate && (
              <div className="text-xs text-muted-foreground text-center pt-2 border-t mt-4">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
