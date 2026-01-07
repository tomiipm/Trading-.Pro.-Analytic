"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, TrendingUp, AlertTriangle, Clock, Activity, Crown, Lock, BarChart3, CalendarDays, DollarSign, TrendingDown } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { DCFLeveredComponent } from "@/components/premium/dcf-levered"
import { COTAnalysisComponent } from "@/components/premium/cot-analysis"
import { HolidaysComponent } from "@/components/premium/holidays"
import { EconomicIndicatorsComponent } from "@/components/premium/economic-indicators"
import { SenateTradingComponent } from "@/components/premium/senate-trading"
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

export default function EconomicCalendarPage() {
  const router = useRouter()
  const { user, subscription, loading: authLoading, isPremium } = useAuth()
  const { t } = useI18n()
  const [events, setEvents] = useState<EconomicEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [activeTab, setActiveTab] = useState("calendar")

  useEffect(() => {
    fetchEconomicEvents()
    const interval = setInterval(fetchEconomicEvents, 5 * 60 * 1000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchEconomicEvents = async () => {
    try {
      const response = await fetch("/api/economic-calendar")
      const data = await response.json()
      if (data.success && data.events) {
        setEvents(data.events)
      }
    } catch (error) {
      clientLogger.error("EconomicCalendar error fetching events", error instanceof Error ? error : new Error(String(error)))
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter((event) => filter === "all" || event.impact === filter)

  const impactCounts = {
    high: events.filter((e) => e.impact === "high").length,
    medium: events.filter((e) => e.impact === "medium").length,
    low: events.filter((e) => e.impact === "low").length,
  }

  const pieData = [
    { name: t.economicCalendarPage.highRisk, value: impactCounts.high, color: "#ef4444" },
    { name: t.economicCalendarPage.mediumRisk, value: impactCounts.medium, color: "#f59e0b" },
    { name: t.economicCalendarPage.lowRisk, value: impactCounts.low, color: "#10b981" },
  ]

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
      case "medium":
        return "border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
      default:
        return "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
    }
  }

  const getImpactBadgeColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-500 text-white"
      case "medium":
        return "bg-amber-500 text-white"
      default:
        return "bg-emerald-500 text-white"
    }
  }

  const isUserPremium = isPremium()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Calendar className="h-10 w-10 text-cyan-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {t.economicCalendarPage.title}
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.economicCalendarPage.description}
          </p>
        </div>

        {/* Premium Features Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="calendar">{t.economicCalendarPage.calendar}</TabsTrigger>
            <TabsTrigger value="dcf" disabled={!isUserPremium}>
              <div className="flex items-center gap-2">
                {t.economicCalendarPage.dcfLevered}
                {!isUserPremium && <Lock className="h-3 w-3" />}
              </div>
            </TabsTrigger>
            <TabsTrigger value="cot" disabled={!isUserPremium}>
              <div className="flex items-center gap-2">
                {t.economicCalendarPage.cotAnalysis}
                {!isUserPremium && <Lock className="h-3 w-3" />}
              </div>
            </TabsTrigger>
            <TabsTrigger value="holidays" disabled={!isUserPremium}>
              <div className="flex items-center gap-2">
                {t.economicCalendarPage.holidays}
                {!isUserPremium && <Lock className="h-3 w-3" />}
              </div>
            </TabsTrigger>
            <TabsTrigger value="indicators" disabled={!isUserPremium}>
              <div className="flex items-center gap-2">
                {t.economicCalendarPage.indicators}
                {!isUserPremium && <Lock className="h-3 w-3" />}
              </div>
            </TabsTrigger>
            <TabsTrigger value="senate" disabled={!isUserPremium}>
              <div className="flex items-center gap-2">
                {t.economicCalendarPage.senateTrading}
                {!isUserPremium && <Lock className="h-3 w-3" />}
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-8">

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-transparent shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.economicCalendarPage.allEvents}</p>
                <p className="text-3xl font-bold text-cyan-400">{events.length}</p>
              </div>
              <Activity className="h-10 w-10 text-cyan-500" />
            </div>
          </Card>

          <Card className="p-6 border-red-500/50 bg-gradient-to-br from-red-500/10 to-transparent shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.economicCalendarPage.highRisk}</p>
                <p className="text-3xl font-bold text-red-400">{impactCounts.high}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
          </Card>

          <Card className="p-6 border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-transparent shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.economicCalendarPage.mediumRisk}</p>
                <p className="text-3xl font-bold text-amber-400">{impactCounts.medium}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-amber-500" />
            </div>
          </Card>

          <Card className="p-6 border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.economicCalendarPage.lowRisk}</p>
                <p className="text-3xl font-bold text-emerald-400">{impactCounts.low}</p>
              </div>
              <Clock className="h-10 w-10 text-emerald-500" />
            </div>
          </Card>
        </div>

        {/* Pie Chart */}
        <Card className="p-8 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">{t.economicCalendarPage.riskDistribution}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Filters */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === "all"
                ? "bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                : "bg-card border border-cyan-500/30 hover:border-cyan-500"
            }`}
          >
            {t.economicCalendarPage.all}
          </button>
          <button
            onClick={() => setFilter("high")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === "high"
                ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                : "bg-card border border-red-500/30 hover:border-red-500"
            }`}
          >
            {t.economicCalendarPage.highRisk}
          </button>
          <button
            onClick={() => setFilter("medium")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === "medium"
                ? "bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                : "bg-card border border-amber-500/30 hover:border-amber-500"
            }`}
          >
            {t.economicCalendarPage.mediumRisk}
          </button>
          <button
            onClick={() => setFilter("low")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === "low"
                ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                : "bg-card border border-emerald-500/30 hover:border-emerald-500"
            }`}
          >
            {t.economicCalendarPage.lowRisk}
          </button>
        </div>

        {/* Events List */}
        {loading ? (
          <Card className="p-12 text-center border-cyan-500/50">
            <p className="text-muted-foreground">{t.economicCalendarPage.loadingEvents}</p>
          </Card>
        ) : filteredEvents.length === 0 ? (
          <Card className="p-12 text-center border-cyan-500/50">
            <p className="text-muted-foreground">{t.economicCalendarPage.noEvents}</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredEvents.map((event, index) => (
              <Card
                key={index}
                className={`p-6 border ${getImpactColor(event.impact)} transition-all hover:scale-[1.02]`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getImpactBadgeColor(event.impact)}`}>
                        {event.impact === "high" ? t.economicCalendarPage.high : event.impact === "medium" ? t.economicCalendarPage.medium : t.economicCalendarPage.low}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.date} {event.time}
                      </span>
                      <span className="text-sm font-medium">{event.country}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{event.event}</h3>
                    <div className="flex gap-6 text-sm">
                      {event.previous && (
                        <div>
                          <span className="text-muted-foreground">{t.economicCalendarPage.previous}: </span>
                          <span className="font-medium">{event.previous}</span>
                        </div>
                      )}
                      {event.forecast && (
                        <div>
                          <span className="text-muted-foreground">{t.economicCalendarPage.forecast}: </span>
                          <span className="font-medium">{event.forecast}</span>
                        </div>
                      )}
                      {event.actual && (
                        <div>
                          <span className="text-muted-foreground">{t.economicCalendarPage.actual}: </span>
                          <span className="font-medium">{event.actual}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {event.impact === "high" && (
                    <div className="flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/50">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <span className="text-sm font-medium text-red-400">{t.economicCalendarPage.avoidTrading}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
          </TabsContent>

          {/* Custom DCF Levered - Premium Only */}
          <TabsContent value="dcf" className="space-y-8">
            {!isUserPremium ? (
              <Card className="p-12 text-center border-cyan-500/50">
                <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">{t.economicCalendarPage.premiumFeature}</h2>
                <p className="text-muted-foreground mb-6">
                  {t.economicCalendarPage.dcfLevered} {t.economicCalendarPage.premiumOnly}
                </p>
                <Button asChild>
                  <Link href="/subscriptions">
                    <Crown className="mr-2 h-4 w-4" />
                    {t.economicCalendarPage.goToPremium}
                  </Link>
                </Button>
              </Card>
            ) : (
              <DCFLeveredComponent />
            )}
          </TabsContent>

          {/* COT Analysis By Dates - Premium Only */}
          <TabsContent value="cot" className="space-y-8">
            {!isUserPremium ? (
              <Card className="p-12 text-center border-cyan-500/50">
                <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">{t.economicCalendarPage.premiumFeature}</h2>
                <p className="text-muted-foreground mb-6">
                  {t.economicCalendarPage.cotAnalysis} {t.economicCalendarPage.premiumOnly}
                </p>
                <Button asChild>
                  <Link href="/subscriptions">
                    <Crown className="mr-2 h-4 w-4" />
                    Przejdź do Premium
                  </Link>
                </Button>
              </Card>
            ) : (
              <COTAnalysisComponent />
            )}
          </TabsContent>

          {/* Holidays By Exchange - Premium Only */}
          <TabsContent value="holidays" className="space-y-8">
            {!isUserPremium ? (
              <Card className="p-12 text-center border-cyan-500/50">
                <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">{t.economicCalendarPage.premiumFeature}</h2>
                <p className="text-muted-foreground mb-6">
                  {t.economicCalendarPage.holidays} {t.economicCalendarPage.premiumOnly}
                </p>
                <Button asChild>
                  <Link href="/subscriptions">
                    <Crown className="mr-2 h-4 w-4" />
                    Przejdź do Premium
                  </Link>
                </Button>
              </Card>
            ) : (
              <HolidaysComponent />
            )}
          </TabsContent>

          {/* Economics Indicators - Premium Only */}
          <TabsContent value="indicators" className="space-y-8">
            {!isUserPremium ? (
              <Card className="p-12 text-center border-cyan-500/50">
                <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">{t.economicCalendarPage.premiumFeature}</h2>
                <p className="text-muted-foreground mb-6">
                  {t.economicCalendarPage.indicators} {t.economicCalendarPage.premiumOnly}
                </p>
                <Button asChild>
                  <Link href="/subscriptions">
                    <Crown className="mr-2 h-4 w-4" />
                    Przejdź do Premium
                  </Link>
                </Button>
              </Card>
            ) : (
              <EconomicIndicatorsComponent />
            )}
          </TabsContent>

          <TabsContent value="senate" className="space-y-8">
            {!isUserPremium ? (
              <Card className="p-12 text-center border-cyan-500/50">
                <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">{t.economicCalendarPage.premiumFeature}</h2>
                <p className="text-muted-foreground mb-6">
                  {t.economicCalendarPage.senateTrading} {t.economicCalendarPage.premiumOnly}
                </p>
                <Button asChild>
                  <Link href="/subscriptions">
                    <Crown className="mr-2 h-4 w-4" />
                    Przejdź do Premium
                  </Link>
                </Button>
              </Card>
            ) : (
              <SenateTradingComponent />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
