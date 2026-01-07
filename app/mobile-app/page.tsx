"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n/context"
import {
  Smartphone,
  Shield,
  TrendingUp,
  BarChart3,
  Lock,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Filter,
  Target,
  Activity,
  PieChart,
  Layers,
  Zap,
  Bell,
  Eye,
  TrendingDown,
  Copyright,
} from "lucide-react"

export default function MobileAppPage() {
  const { t } = useI18n()
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="outline" className="mb-4">
              <Smartphone className="w-3 h-3 mr-2" />
              {t.mobileApp.comingSoon}
            </Badge>
            <div className="relative mb-6 flex justify-center">
              <Image
                src="/images/mobile-app/19_03_54.png"
                alt="Trading Pro Analytics - Market analysis & trading signals"
                width={600}
                height={200}
                className="object-contain max-w-full h-auto"
                priority
                sizes="(max-width: 768px) 100vw, 600px"
                unoptimized={true}
              />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t.mobileApp.appTitle}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.mobileApp.heroDescription}
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Card className="p-4 flex items-center gap-3 hover:shadow-lg transition-shadow border-2 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Download className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-semibold text-sm">{t.mobileApp.googlePlay}</p>
                  <p className="text-xs text-muted-foreground">{t.mobileApp.comingSoonShort}</p>
                </div>
              </Card>
              <Card className="p-4 flex items-center gap-3 hover:shadow-lg transition-shadow border-2 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Download className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-semibold text-sm">{t.mobileApp.appStore}</p>
                  <p className="text-xs text-muted-foreground">{t.mobileApp.comingSoonShort}</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* App Screenshots Section */}
      <section className="container mx-auto px-4 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-cyan-500/50 text-cyan-400">
              <Smartphone className="w-3 h-3 mr-2" />
              {t.mobileApp.appInterface}
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {t.mobileApp.seeAppInAction}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.mobileApp.modernInterfaceDesc}
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stop Guessing. Start Trading */}
            <Card className="border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight">{t.mobileApp.stopGuessing}</CardTitle>
                <CardDescription className="text-xs">{t.mobileApp.aiDrivenLogic}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex-shrink-0">
                  <Image
                    src="/images/mobile-app/19_03_54.png"
                    alt="STOP GUESSING. START TRADING - AI-driven market logic"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-grow">
                  {t.mobileApp.stopGuessingDesc}
                </p>
              </CardContent>
            </Card>

            {/* Seconds Matter */}
            <Card className="border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  {t.mobileApp.secondsMatter}
                </CardTitle>
                <CardDescription className="text-xs">{t.mobileApp.instantPush}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 flex-shrink-0">
                  <Image
                    src="/images/mobile-app/Image 26.png"
                    alt="SECONDS MATTER - Instant push notifications"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-grow">
                  {t.mobileApp.secondsMatterDesc}
                </p>
              </CardContent>
            </Card>

            {/* No Chaos. Only Levels */}
            <Card className="border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight">{t.mobileApp.noChaos}</CardTitle>
                <CardDescription className="text-xs">{t.mobileApp.entryStopTake}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex-shrink-0">
                  <Image
                    src="/images/mobile-app/file_000000000c90722f9f5f0cff900d9009.png"
                    alt="NO CHAOS. ONLY LEVELS - Entry, Stop Loss, Take Profits"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-grow">
                  {t.mobileApp.noChaosDesc}
                </p>
              </CardContent>
            </Card>

            {/* Probability Over Emotion */}
            <Card className="border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight">{t.mobileApp.probabilityEmotion}</CardTitle>
                <CardDescription className="text-xs">{t.mobileApp.rankedByProbability}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex-shrink-0">
                  <Image
                    src="/images/mobile-app/8_10_30.png"
                    alt="PROBABILITY OVER EMOTION - Signals ranked by win probability"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-grow">
                  {t.mobileApp.probabilityDesc}
                </p>
              </CardContent>
            </Card>

            {/* Real Trades. Real Results */}
            <Card className="border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight">{t.mobileApp.realTrades}</CardTitle>
                <CardDescription className="text-xs">{t.mobileApp.trackHitsLosses}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex-shrink-0">
                  <Image
                    src="/images/mobile-app/_23_47.png"
                    alt="REAL TRADES. REAL RESULTS - Track hits, losses & win rates"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-grow">
                  {t.mobileApp.realTradesDesc}
                </p>
              </CardContent>
            </Card>

            {/* See What Others Can't */}
            <Card className="border-2 border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all bg-gradient-to-br from-yellow-500/5 to-amber-500/5 flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight flex items-center gap-2">
                  <Eye className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  {t.mobileApp.seeWhatOthers}
                </CardTitle>
                <CardDescription className="text-xs">{t.mobileApp.unlockPremium}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-3 border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex-shrink-0">
                  <Image
                    src="/images/mobile-app/18_08_26.png"
                    alt="SEE WHAT OTHERS CAN'T - Unlock premium signal details"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-grow">
                  {t.mobileApp.seeWhatOthersDesc}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Signal Generation Section */}
      <section className="container mx-auto px-4 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-cyan-500/50 text-cyan-400">
              <Zap className="w-3 h-3 mr-2" />
              {t.mobileApp.artificialIntelligence}
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {t.mobileApp.aiGeneratedSignals}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.mobileApp.aiSystemDesc}
            </p>
          </div>

          {/* AI Architecture Card */}
          <Card className="mb-8 border-2 border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all duration-500">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                  <Layers className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-cyan-400">{t.mobileApp.aiArchitecture}</CardTitle>
                  <CardDescription>{t.mobileApp.multiLayerModel}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                <Card className="border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      {t.mobileApp.technicalAnalysis}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="text-muted-foreground">{t.mobileApp.technicalAnalysisDesc}</p>
                    <p className="text-muted-foreground">• Identyfikacja formacji wykresów i wzorców świecowych</p>
                    <p className="text-muted-foreground">• Detekcja poziomów wsparcia i oporu z historii</p>
                    <p className="text-muted-foreground">• Ocena siły trendu na 5 interwałach czasowych</p>
                  </CardContent>
                </Card>

                <Card className="border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      {t.mobileApp.marketSentiment}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="text-muted-foreground">{t.mobileApp.marketSentimentDesc}</p>
                    <p className="text-muted-foreground">• Detekcja anomalii i nietypowych ruchów</p>
                    <p className="text-muted-foreground">• Korelacja międzyrynkowa (forex, indeksy, surowce)</p>
                  </CardContent>
                </Card>

                <Card className="border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="w-5 h-5 text-cyan-400" />
                      {t.mobileApp.volatilityAnalysis}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="text-muted-foreground">{t.mobileApp.volatilityAnalysisDesc}</p>
                    <p className="text-muted-foreground">• Gradient boosting dla optymalizacji decyzji</p>
                    <p className="text-muted-foreground">• Monte Carlo simulation dla szacowania ryzyka</p>
                  </CardContent>
                </Card>

                <Card className="border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-5 h-5 text-cyan-400" />
                      {t.mobileApp.fundamentalAnalysis}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="text-muted-foreground">{t.mobileApp.fundamentalAnalysisDesc}</p>
                    <p className="text-muted-foreground">• Stop Loss uwzględniający zmienność rynku</p>
                    <p className="text-muted-foreground">• 3 poziomy TP oparte na Fibonacci i strukturze</p>
                    <p className="text-muted-foreground">• Optymalizacja risk-reward ratio (cel min. 1:2)</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2 border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-cyan-400">
                    <Shield className="w-6 h-6" />
                    Jak system liczy i przelicza ryzyko?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-background/50 border border-cyan-500/20">
                      <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                        <span className="text-xs bg-cyan-500/20 px-2 py-1 rounded">KROK 1</span>
                        Analiza zmienności
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        System oblicza Average True Range (ATR) dla ostatnich 14 okresów, aby zmierzyć aktualną
                        zmienność instrumentu. Na tej podstawie określa bezpieczną odległość dla Stop Loss, która nie
                        będzie zbyt bliska (częste wyrzuty) ani zbyt daleka (nadmierne straty).
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-background/50 border border-cyan-500/20">
                      <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                        <span className="text-xs bg-cyan-500/20 px-2 py-1 rounded">KROK 2</span>
                        Określenie Entry i Stop Loss
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        AI wybiera optymalny punkt wejścia na podstawie kluczowych poziomów technicznych (strefy
                        wsparcia/oporu, EMA, Fibonacci). Stop Loss umieszczany jest poza najbliższą strefą struktury
                        rynkowej, z marginesem bezpieczeństwa opartym na ATR × 1.5.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-background/50 border border-cyan-500/20">
                      <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                        <span className="text-xs bg-cyan-500/20 px-2 py-1 rounded">KROK 3</span>
                        Kalkulacja wielkości pozycji
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        System rekomenduje wielkość pozycji tak, aby potencjalna strata (odległość między Entry a SL)
                        nie przekroczyła 1% kapitału. Formuła: Lot size = (Kapitał × 0.01) / (Dystans do SL × Wartość
                        pipsa).
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-background/50 border border-cyan-500/20">
                      <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                        <span className="text-xs bg-cyan-500/20 px-2 py-1 rounded">KROK 4</span>
                        Optymalizacja Take Profit
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        AI ustala 3 poziomy TP oparte na następujących kryteriach: TP1 (1:1 R:R) - szybkie
                        zabezpieczenie części zysku, TP2 (1:2 R:R) - główny cel bazujący na strukturze, TP3 (1:3+ R:R) -
                        ekstensja trendu przy utrzymaniu kierunku.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-background/50 border border-cyan-500/20">
                      <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                        <span className="text-xs bg-cyan-500/20 px-2 py-1 rounded">KROK 5</span>
                        Ocena prawdopodobieństwa sukcesu
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Model AI przypisuje każdemu sygnałowi procent pewności (70-95%). Obliczany jest na podstawie:
                        zgodności z trendem wyższego timeframe'u, siły wskaźników, jakości formacji wykresowej oraz
                        historycznej skuteczności podobnych setupów. Tylko sygnały powyżej 70% są publikowane.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/40">
                    <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Dlaczego sygnały są tak skuteczne?
                    </h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        ✓ <span className="font-semibold text-foreground">Multifaktorowa analiza:</span> System nie
                        polega na pojedynczym wskaźniku, lecz na konsensusie wielu źródeł danych
                      </p>
                      <p>
                        ✓ <span className="font-semibold text-foreground">Uczenie się w czasie rzeczywistego:</span> AI
                        analizuje skuteczność każdego sygnału i dostosowuje parametry modelu
                      </p>
                      <p>
                        ✓ <span className="font-semibold text-foreground">Filtracja niskiej jakości:</span> Tylko
                        sygnały spełniające rygorystyczne kryteria są publikowane
                      </p>
                      <p>
                        ✓ <span className="font-semibold text-foreground">Adaptacja do warunków:</span> Model rozpoznaje
                        różne fazy rynku (trend, konsolidacja) i dostosowuje strategię
                      </p>
                      <p>
                        ✓ <span className="font-semibold text-foreground">Zarządzanie ryzykiem:</span> Każdy sygnał ma
                        precyzyjnie określone poziomy SL/TP oparte na strukturze rynku
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Economic Calendar Section */}
      <section className="container mx-auto px-4 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-yellow-500/50 text-yellow-400">
              <Clock className="w-3 h-3 mr-2" />
              {t.mobileApp.economicCalendar}
            </Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {t.mobileApp.economicCalendarTitle}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.mobileApp.economicCalendarDesc}
            </p>
          </div>

          <Card className="mb-8 border-2 border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all duration-500">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                  <FileText className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-yellow-400">Integracja z kalendarzem ekonomicznym</CardTitle>
                  <CardDescription>Pełna synchronizacja z globalnymi wydarzeniami gospodarczymi</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                      {t.mobileApp.highImpactEvents}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="text-muted-foreground">• Decyzje banków centralnych (Fed, ECB, BoE, BoJ)</p>
                    <p className="text-muted-foreground">• NFP - Non-Farm Payrolls (pierwszy piątek miesiąca)</p>
                    <p className="text-muted-foreground">• CPI - Consumer Price Index (inflacja)</p>
                    <p className="text-muted-foreground">• PKB - Gross Domestic Product (wzrost gospodarczy)</p>
                    <p className="text-muted-foreground">• Retail Sales - dane o sprzedaży detalicznej</p>
                  </CardContent>
                </Card>

                <Card className="border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      Wydarzenia średniego wpływu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="text-muted-foreground">• Decyzje o stopach procentowych (mniejsze gospodarki)</p>
                    <p className="text-muted-foreground">• PMI - Purchasing Managers Index (przemysł i usługi)</p>
                    <p className="text-muted-foreground">• Unemployment Rate - stopa bezrobocia</p>
                    <p className="text-muted-foreground">• Trade Balance - bilans handlowy</p>
                    <p className="text-muted-foreground">• Industrial Production - produkcja przemysłowa</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2 border-cyan-500/40 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-yellow-400">
                    <Zap className="w-6 h-6" />
                    Funkcje zaawansowane kalendarza
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-background/50 border border-cyan-500/20">
                      <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        {t.mobileApp.pushNotifications}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t.mobileApp.pushNotificationsDesc}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-background/50 border border-cyan-500/20">
                      <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        {t.mobileApp.customFilters}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t.mobileApp.customFiltersDesc}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-background/50 border border-cyan-500/20">
                      <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        {t.mobileApp.historicalAnalysis}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t.mobileApp.historicalAnalysisDesc}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-background/50 border border-cyan-500/20">
                      <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Ostrzeżenia o ryzyku
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        System automatycznie oznacza okresy zwiększonej zmienności i sugeruje wstrzymanie się z nowymi
                        pozycjami przed i bezpośrednio po ważnych ogłoszeniach.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/40">
                    <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      {t.mobileApp.calendarIntegration}
                    </h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        {t.mobileApp.calendarIntegrationDesc}
                      </p>
                      <p>
                        ✓ <span className="font-semibold text-foreground">Post-news trading:</span> Po ogłoszeniu AI
                        szybko dostosowuje modele do nowych warunków i publikuje sygnały wykorzystujące nowy trend
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Co wyróżnia aplikację?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
              </div>
              <CardTitle className="text-cyan-400">Analiza wielowymiarowa</CardTitle>
              <CardDescription>
                System analizuje wiele wskaźników zamiast polegać na pojedynczych sygnałach
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <Layers className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">Analiza techniczna na wielu interwałach czasowych</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Activity className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">Ocena zmienności i trendów rynkowych</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <PieChart className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">Korelacja między różnymi instrumentami</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                <Filter className="w-6 h-6 text-cyan-400" />
              </div>
              <CardTitle className="text-cyan-400">Filtrowanie sygnałów</CardTitle>
              <CardDescription>
                Automatyczne eliminowanie sygnałów niskiej jakości i środowisk o niskiej przewidywalności
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <Zap className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">Filtr siły sygnału - min. 70% pewności</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">Analiza warunków rynkowych przed publikacją</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">Weryfikacja zgodności z długoterminowymi trendami</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                <Target className="w-6 h-6 text-cyan-400" />
              </div>
              <CardTitle className="text-cyan-400">Struktura ryzyka 1%</CardTitle>
              <CardDescription>Jawne poziomy Entry, Stop Loss i Take Profit dla każdego sygnału</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <Shield className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">Rekomendacja: maksymalnie 1% kapitału na transakcję</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Target className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">
                  3 poziomy Take Profit dla stopniowego zabezpieczania zysków
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">Jasno określony Stop Loss dla ograniczenia strat</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                <Clock className="w-6 h-6 text-cyan-400" />
              </div>
              <CardTitle className="text-cyan-400">Historia aktualizacji</CardTitle>
              <CardDescription>Pełna historia aktualizacji sygnałów z transparentnymi wynikami TP/SL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <FileText className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">Każdy sygnał z kompletną historią zmian statusu</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">Transparentna rejestracja osiągniętych poziomów TP</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Clock className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">Dane dostępne w sekcji historii aplikacji</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
              </div>
              <CardTitle className="text-cyan-400">{t.mobileApp.realStatistics}</CardTitle>
              <CardDescription>
                {t.mobileApp.realStatisticsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <Activity className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">Win rate i średni R:R na podstawie historii</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">Aktualizacja statystyk po zamknięciu każdego sygnału</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <PieChart className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">Link do pełnych statystyk będzie dostępny wkrótce</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <CardTitle className="text-cyan-400">Zarządzanie ryzykiem</CardTitle>
              <CardDescription>Narzędzia wspierające odpowiedzialne zarządzanie kapitałem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <Target className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">Kalkulator wielkości pozycji oparty na 1% regule</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">Ostrzeżenia o przekroczeniu zalecanego ryzyka</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <BarChart3 className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-muted-foreground">Monitoring ekspozycji portfela w czasie rzeczywistym</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Important Notice */}
      <section className="bg-muted/50 border-y border-cyan-500/20 py-12 shadow-[inset_0_0_30px_rgba(6,182,212,0.1)]">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-primary" />
                <CardTitle>{t.mobileApp.importantDisclaimer}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">
                  {t.mobileApp.disclaimer1}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">{t.mobileApp.disclaimer2}</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">
                  {t.mobileApp.disclaimer4}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">{t.mobileApp.disclaimer5}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Technology Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Model działania</h2>
          <Card className="border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <CardHeader>
              <CardTitle>System decision-support</CardTitle>
              <CardDescription>
                Trading-Pro-Analys to zaawansowany system analityczny zaprojektowany w architekturze warstwowej
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Źródła danych rynkowych</h4>
                    <p className="text-sm text-muted-foreground">
                      Pobieranie i normalizacja danych z wielu rynków finansowych
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Warstwa analizy i filtracji</h4>
                    <p className="text-sm text-muted-foreground">Algorytmy przetwarzające dane i generujące sygnały</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Warstwa statystyki</h4>
                    <p className="text-sm text-muted-foreground">Historia zdarzeń i analiza efektywności sygnałów</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Warstwa prezentacji</h4>
                    <p className="text-sm text-muted-foreground">Interfejsy mobilne i webowe dla użytkowników</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground text-center">
                  System nie przechowuje środków finansowych użytkownika i nie wykonuje transakcji
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Terms Section */}
      <section className="bg-muted/50 py-16 border-y border-cyan-500/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Warunki subskrypcji</h2>
          <div className="grid md:grid-cols-1 gap-6 max-w-3xl mx-auto">
            {/* Subscription Terms */}
            <Card className="border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <CardTitle>Warunki subskrypcji</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Charakter subskrypcji</h4>
                  <p className="text-sm text-muted-foreground">
                    Subskrypcja zapewnia natychmiastowy dostęp do funkcji premium. Dostęp aktywowany jest w momencie
                    zakupu.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Okres próbny</h4>
                  <p className="text-sm text-muted-foreground">
                    Aplikacja może oferować 7-dniowy okres próbny, który rozpoczyna się natychmiast po aktywacji
                    subskrypcji.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Anulowanie</h4>
                  <p className="text-sm text-muted-foreground">
                    Subskrypcję można anulować w dowolnym momencie poprzez konto Google Play. Dostęp pozostaje aktywny
                    do końca opłaconego okresu.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Zwroty</h4>
                  <p className="text-sm text-muted-foreground">
                    Po aktywacji subskrypcji i natychmiastowym udostępnieniu treści premium zwrot środków nie
                    przysługuje.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Google Play Compliance */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Zgodność z Google Play</h2>
          <Card className="border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                <CardTitle>Zgodność z Google Play</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm">Brak obietnic zysków</p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm">Brak doradztwa inwestycyjnego</p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm">Jasne warunki subskrypcji</p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm">Przejrzysta polityka prywatności</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <Link 
                  href="/mobile-app/privacy-policy" 
                  className="text-primary hover:underline text-sm font-medium flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Przeczytaj pełną politykę prywatności aplikacji mobilnej
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Copyright Notice Section */}
      <section className="container mx-auto px-4 py-12 relative">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-red-500/40 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Copyright className="w-5 h-5 text-red-400" />
                </div>
                <CardTitle className="text-xl text-red-400">Prawa Autorskie i Ochrona Własności Intelektualnej</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      Wszystkie treści, grafiki, zdjęcia i materiały na tej stronie są chronione prawem autorskim.
                    </p>
                    <p className="text-muted-foreground">
                      Wszelkie kopiowanie, reprodukcja, dystrybucja, modyfikacja lub udostępnianie treści, grafik, zdjęć, 
                      zrzutów ekranu aplikacji mobilnej oraz innych materiałów dostępnych na tej stronie bez pisemnej 
                      zgody właściciela jest surowo zabronione.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      Ochrona własności intelektualnej
                    </p>
                    <p className="text-muted-foreground">
                      Wszystkie znaki towarowe, loga, nazwy produktów, interfejsy użytkownika, zrzuty ekranu aplikacji 
                      mobilnej oraz inne elementy wizualne są własnością Trading Pro Analytic lub ich odpowiednich 
                      właścicieli i są chronione prawem autorskim oraz innymi przepisami dotyczącymi własności intelektualnej.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Zakazane działania:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm ml-4">
                    <li>Kopiowanie, pobieranie lub zapisywanie grafik, zdjęć i zrzutów ekranu bez zgody</li>
                    <li>Udostępnianie, publikowanie lub dystrybucja materiałów wizualnych z tej strony</li>
                    <li>Modyfikacja, edycja lub przetwarzanie jakichkolwiek treści lub grafik</li>
                    <li>Używanie materiałów w celach komercyjnych lub promocyjnych</li>
                    <li>Tworzenie prac pochodnych na podstawie treści lub grafik z tej strony</li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-red-500/20">
                  <p className="text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Trading Pro Analytic. Wszelkie prawa zastrzeżone. 
                    Nieautoryzowane użycie jakichkolwiek materiałów z tej strony może skutkować odpowiedzialnością 
                    cywilną i karną zgodnie z obowiązującymi przepisami prawa.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    W przypadku pytań dotyczących wykorzystania materiałów, prosimy o kontakt:{" "}
                    <a href="mailto:support@trading-pro-analytic.com" className="text-primary hover:underline">
                      support@trading-pro-analytic.com
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
