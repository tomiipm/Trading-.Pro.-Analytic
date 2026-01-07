"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, TrendingUp, Shield, Zap, BarChart3, Clock, Cpu, Database, Network, Smartphone, Globe, Target, Activity, PieChart, LineChart, Users, Lock, CheckCircle2, RefreshCw, AlertTriangle, Calendar, Crown } from "lucide-react"
import Image from "next/image"
import { useI18n } from "@/lib/i18n/context"

export default function AboutPage() {
  const { t } = useI18n()
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {t.about.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.about.subtitle}
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* O Nas - Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Brain className="h-6 w-6 text-cyan-400" />
                {t.about.whatIs}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {t.about.whatIsDescription}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t.about.mission}
              </p>
              
              {/* Platform Graphics */}
              <div className="mt-6 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-8 border border-cyan-500/20">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <Image 
                    src="/images/mobile-app/20_02_55.png" 
                    alt="Trading Pro Analytic Platform - Zaawansowana platforma analityczna z AI" 
                    fill
                    className="object-contain rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Jak Działają Algorytmy - Detailed Technical Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Cpu className="h-6 w-6 text-cyan-400" />
                {t.about.howAlgorithmsWork}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-6 border border-cyan-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Network className="h-5 w-5 text-cyan-400" />
                  {t.about.systemArchitecture}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t.about.systemArchitectureDesc}
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">{t.about.dataCollectionLayer}:</strong> {t.about.dataCollectionLayerDesc}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">{t.about.processingLayer}:</strong> {t.about.processingLayerDesc}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">{t.about.analyticalLayer}:</strong> {t.about.analyticalLayerDesc}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">{t.about.decisionLayer}:</strong> {t.about.decisionLayerDesc}
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-400" />
                  {t.about.aiTechnologies}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">{t.about.machineLearning}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t.about.machineLearningDesc}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">{t.about.deepLearning}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t.about.deepLearningDesc}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">{t.about.reinforcementLearning}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t.about.reinforcementLearningDesc}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">{t.about.ensembleMethods}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t.about.ensembleMethodsDesc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  {t.about.technicalFundamentalAnalysis}
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">{t.about.technicalAnalysis}</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>{t.about.trendIndicators}</li>
                      <li>{t.about.momentumIndicators}</li>
                      <li>{t.about.volumeAnalysis}</li>
                      <li>{t.about.chartPatterns}</li>
                      <li>{t.about.supportResistance}</li>
                      <li>{t.about.multiTimeframe}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">{t.about.fundamentalAnalysis}</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>{t.about.economicEvents}</li>
                      <li>{t.about.economicCalendarAnalysis}</li>
                      <li>{t.about.marketSentiment}</li>
                      <li>{t.about.intermarketCorrelations}</li>
                      <li>{t.about.cotData}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-400" />
                  {t.about.signalGeneration}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t.about.signalGenerationDesc}
                </p>
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <strong className="text-foreground">{t.about.signalStep1Title}</strong> {t.about.signalStep1Desc}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <strong className="text-foreground">{t.about.signalStep2Title}</strong> {t.about.signalStep2Desc}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <strong className="text-foreground">{t.about.signalStep3Title}</strong> {t.about.signalStep3Desc}
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li>{t.about.signalStep3EntryPrice}</li>
                        <li>{t.about.signalStep3StopLoss}</li>
                        <li>{t.about.signalStep3TakeProfit}</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">4</span>
                    <div>
                      <strong className="text-foreground">{t.about.signalStep4Title}</strong> {t.about.signalStep4Desc}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">5</span>
                    <div>
                      <strong className="text-foreground">{t.about.signalStep5Title}</strong> {t.about.signalStep5Desc}
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-6 border border-orange-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-400" />
                  {t.about.pipsPointsCalculation}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t.about.pipsPointsDesc}
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-background/50 rounded p-4">
                    <h4 className="font-semibold mb-2 text-foreground">{t.about.forexPairs}</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• {t.about.forexStandardPairs}</li>
                      <li>• {t.about.forexJpyPairs}</li>
                    </ul>
                  </div>
                  <div className="bg-background/50 rounded p-4">
                    <h4 className="font-semibold mb-2 text-foreground">{t.about.goldXau}</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• {t.about.goldXauUsdAud}</li>
                      <li>• {t.about.goldXauJpy}</li>
                    </ul>
                  </div>
                  <div className="bg-background/50 rounded p-4">
                    <h4 className="font-semibold mb-2 text-foreground">{t.about.indices}</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• {t.about.indicesUs30}</li>
                      <li>• {t.about.indicesUs100}</li>
                    </ul>
                  </div>
                  <div className="bg-background/50 rounded p-4">
                    <h4 className="font-semibold mb-2 text-foreground">{t.about.automation}</h4>
                    <p className="text-muted-foreground">
                      {t.about.automationDesc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-6 border border-cyan-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-cyan-400" />
                  {t.about.realtimeUpdateSystem}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t.about.realtimeUpdateDesc}
                </p>
                <div className="bg-background/50 rounded-lg p-4 mb-4 border border-cyan-500/20">
                  <p className="text-sm font-semibold text-foreground mb-2">{t.about.realtimeDataSources}</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>{t.about.realtimePrices}</strong> {t.about.realtimePricesDesc}</li>
                    <li>• <strong>{t.about.realtimeEconomicData}</strong> {t.about.realtimeEconomicDataDesc}</li>
                    <li>• <strong>{t.about.realtimeVolume}</strong> {t.about.realtimeVolumeDesc}</li>
                    <li>• <strong>{t.about.realtimeNoDelay}</strong> {t.about.realtimeNoDelayDesc}</li>
                  </ul>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">{t.about.realtimeSignalsTitle}</strong> {t.about.realtimeSignalsDesc}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">{t.about.realtimeCalendarTitle}</strong> {t.about.realtimeCalendarDesc}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">{t.about.realtimePremiumTitle}</strong> 
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                        <li>{t.about.realtimePremiumDcf}</li>
                        <li>{t.about.realtimePremiumCot}</li>
                        <li>{t.about.realtimePremiumHolidays}</li>
                        <li>{t.about.realtimePremiumIndicators}</li>
                        <li>{t.about.realtimePremiumSenate}</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">{t.about.realtimePushTitle}</strong> {t.about.realtimePushDesc}
                    </div>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Funkcjonalności Platformy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Globe className="h-6 w-6 text-cyan-400" />
                {t.about.platformFeatures}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sygnały Handlowe */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-6 border border-cyan-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  {t.about.tradingSignalsRealtime}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t.about.tradingSignalsDesc}
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">{t.about.forexPairsTitle}</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• EUR/USD, GBP/USD, USD/JPY</li>
                      <li>• AUD/USD, USD/CAD, NZD/USD</li>
                      <li>• EUR/GBP, EUR/JPY, GBP/JPY</li>
                      <li>• AUD/JPY i inne główne pary</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">{t.about.commoditiesIndices}</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Złoto: XAU/USD, XAU/JPY, XAU/AUD</li>
                      <li>• Indeksy: US30 (Dow Jones), US100 (NASDAQ)</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-background/50 rounded p-4">
                  <h4 className="font-semibold mb-2 text-foreground">{t.about.signalContains}</h4>
                  <ul className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      {t.about.signalDirection}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      {t.about.signalEntryPrice}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      {t.about.signalStopLoss}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      {t.about.signalTakeProfit}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      {t.about.signalProbability}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      {t.about.signalRiskReward}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      {t.about.signalTimeCreated}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      {t.about.signalStatus}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Kalendarz Ekonomiczny */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  {t.about.economicCalendar}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t.about.economicCalendarDesc}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">{t.about.availableForAll}</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• {t.about.economicEventsWorld}</li>
                      <li>• {t.about.centralBankDecisions}</li>
                      <li>• {t.about.macroIndicators}</li>
                      <li>• {t.about.impactAssessment}</li>
                      <li>• {t.about.forecastVsActual}</li>
                      <li>• {t.about.filterByCountry}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-400" />
                      {t.about.premiumFeatures}
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>{t.about.dcfLevered}</strong> {t.about.dcfLeveredDesc}</li>
                      <li>• <strong>{t.about.cotAnalysis}</strong> {t.about.cotAnalysisDesc}</li>
                      <li>• <strong>{t.about.holidaysByExchange}</strong> {t.about.holidaysByExchangeDesc}</li>
                      <li>• <strong>{t.about.economicIndicators}</strong> {t.about.economicIndicatorsDesc}</li>
                      <li>• <strong>{t.about.senateTrading}</strong> {t.about.senateTradingDesc}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Aplikacja Mobilna */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-purple-400" />
                  {t.about.mobileAppTitle}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t.about.mobileAppDesc}
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-background/50 rounded p-4">
                    <h4 className="font-semibold mb-2 text-foreground">{t.about.mobileRealtimeSignals}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t.about.mobileRealtimeSignalsDesc}
                    </p>
                  </div>
                  <div className="bg-background/50 rounded p-4">
                    <h4 className="font-semibold mb-2 text-foreground">{t.about.mobileModernInterface}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t.about.mobileModernInterfaceDesc}
                    </p>
                  </div>
                  <div className="bg-background/50 rounded p-4">
                    <h4 className="font-semibold mb-2 text-foreground">{t.about.mobileFullFunctionality}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t.about.mobileFullFunctionalityDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* System Subskrypcji */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-400" />
                  System Subskrypcji
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-background/50 rounded p-4">
                    <h4 className="font-semibold mb-2 text-foreground">Darmowy dostęp</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Podstawowe sygnały handlowe</li>
                      <li>• Kalendarz ekonomiczny</li>
                      <li>• Ograniczona liczba sygnałów</li>
                    </ul>
                  </div>
                  <div className="bg-background/50 rounded p-4 border-2 border-yellow-500/30">
                    <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                      Trial (1 dzień)
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">DARMOWY</span>
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Pełny dostęp do sygnałów</li>
                      <li>• Wszystkie funkcje premium</li>
                      <li>• 1 dzień testowania</li>
                    </ul>
                  </div>
                  <div className="bg-background/50 rounded p-4 border-2 border-cyan-500/30">
                    <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                      Premium
                      <Crown className="h-4 w-4 text-yellow-400" />
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 1 dzień - $1</li>
                      <li>• 7 dni - $5</li>
                      <li>• Wszystkie funkcje premium</li>
                      <li>• Nieograniczony dostęp</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Infrastruktura i Bezpieczeństwo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Database className="h-6 w-6 text-cyan-400" />
                Infrastruktura i Bezpieczeństwo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-6 border border-cyan-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cyan-400" />
                  Bezpieczeństwo Danych
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Szyfrowanie end-to-end:</strong> Wszystkie dane przesyłane są przez połączenia HTTPS/TLS
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Bezpieczne przechowywanie:</strong> Dane użytkowników przechowywane w Supabase z pełnym szyfrowaniem
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">reCAPTCHA:</strong> Ochrona przed botami podczas rejestracji i logowania
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">RODO/GDPR:</strong> Pełna zgodność z przepisami o ochronie danych osobowych
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-400" />
                  Niezawodność Systemu
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Dostępność 24/7:</strong> System działa nieprzerwanie, zapewniając ciągły dostęp do sygnałów
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Redundancja:</strong> Wiele serwerów i kopii zapasowych zapewnia ciągłość działania
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Monitoring:</strong> Ciągłe monitorowanie wydajności i automatyczne alerty o problemach
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Skalowalność:</strong> Architektura chmurowa pozwala na dynamiczne skalowanie w zależności od obciążenia
                    </div>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Bezpieczeństwo i Niezawodność
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Zapewniamy najwyższe standardy bezpieczeństwa i niezawodności:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-4">
                <li><strong>Bezpieczna infrastruktura:</strong> Wszystkie dane są szyfrowane i przechowywane w bezpiecznych centrach danych.</li>
                <li><strong>Niezawodność systemu:</strong> Redundancja i monitoring zapewniają dostępność usług 24/7.</li>
                <li><strong>Ochrona prywatności:</strong> Szanujemy prywatność użytkowników i przestrzegamy wszystkich przepisów 
                dotyczących ochrony danych (RODO, CCPA).</li>
                <li><strong>Regularne aktualizacje:</strong> System jest ciągle ulepszany i aktualizowany o najnowsze technologie AI.</li>
              </ul>
            </section>

          {/* Dla Kogo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="h-6 w-6 text-cyan-400" />
                Dla Kogo Jest Nasza Platforma?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-6 border border-cyan-500/20">
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Początkujący Traderzy</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ucz się od zaawansowanych algorytmów AI i zrozum, jak profesjonaliści analizują rynki. 
                    Nasze sygnały zawierają szczegółowe informacje o analizie technicznej i fundamentalnej, 
                    pomagając w nauce tradingu.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20">
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Doświadczeni Traderzy</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Wykorzystaj dodatkowe narzędzia analityczne i potwierdź swoje własne analizy. 
                    Nasze algorytmy mogą służyć jako drugie zdanie w procesie decyzyjnym.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-500/20">
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Inwestorzy Instytucjonalni</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Kompleksowe dane i analizy do wsparcia procesów decyzyjnych. 
                    Zaawansowane funkcje premium dostarczają szczegółowych danych rynkowych.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/20">
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Wszyscy Zainteresowani</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Bądź na bieżąco z wydarzeniami ekonomicznymi i trendami rynkowymi. 
                    Nasz kalendarz ekonomiczny i analizy pomagają zrozumieć globalne rynki finansowe.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ostrzeżenie o Ryzyku */}
          <Card className="border-2 border-red-500/50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-6 w-6" />
                Ostrzeżenie o Ryzyku
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6">
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-red-400">Ważne:</strong> Handel na rynkach finansowych wiąże się z ryzykiem utraty kapitału. 
                  Sygnały handlowe dostarczane przez Trading Pro Analytic są narzędziami informacyjnymi i nie stanowią porady inwestycyjnej. 
                  Przed podjęciem jakichkolwiek decyzji handlowych należy dokładnie przeanalizować ryzyko i skonsultować się z niezależnym 
                  doradcą finansowym, jeśli to konieczne. Przeszłe wyniki nie gwarantują przyszłych rezultatów. 
                  Zawsze handluj odpowiedzialnie i tylko takim kapitałem, którego utratę możesz sobie pozwolić.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Kontakt */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="h-6 w-6 text-cyan-400" />
                Kontakt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Jeśli masz pytania lub potrzebujesz wsparcia, skontaktuj się z nami:
              </p>
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
                <p className="font-semibold mb-2 text-foreground">Trading Pro Analytic</p>
                <p className="text-muted-foreground">Email: support@trading-pro-analytic.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

