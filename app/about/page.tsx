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
                    src={encodeURI("/images/mobile-app/2026, 20_02_55.png")} 
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
                Jak Działają Nasze Algorytmy?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-6 border border-cyan-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Network className="h-5 w-5 text-cyan-400" />
                  Architektura Systemu
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nasz system opiera się na wielowarstwowej architekturze, która łączy różne komponenty analityczne:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Warstwa zbierania danych:</strong> System pobiera dane bezpośrednio z głównych baz danych 
                      w czasie rzeczywistym, bez żadnych opóźnień. Ceny do generowania sygnałów, dane ekonomiczne i inne informacje rynkowe są 
                      pobierane bezpośrednio z wiodących dostawców danych finansowych (ceny tick-by-tick, wolumen transakcji, dane ekonomiczne, 
                      wiadomości finansowe). Zapewnia to najwyższą aktualność i precyzję danych wykorzystywanych przez algorytmy AI.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Warstwa przetwarzania:</strong> Dane są normalizowane, walidowane i przygotowywane 
                      do analizy przez moduły preprocessingu
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Warstwa analityczna:</strong> Zaawansowane modele AI analizują dane używając 
                      sieci neuronowych, uczenia maszynowego i analizy statystycznej
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Warstwa decyzyjna:</strong> System generuje sygnały handlowe z oceną prawdopodobieństwa, 
                      poziomami wejścia/wyjścia i zarządzaniem ryzykiem
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-400" />
                  Technologie Sztucznej Inteligencji
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Uczenie Maszynowe (ML)</h4>
                    <p className="text-sm text-muted-foreground">
                      System wykorzystuje algorytmy uczenia nadzorowanego i nienadzorowanego do identyfikacji wzorców rynkowych. 
                      Modele są trenowane na historycznych danych obejmujących miliony transakcji i setki tysięcy sygnałów rynkowych.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Głębokie Uczenie (Deep Learning)</h4>
                    <p className="text-sm text-muted-foreground">
                      Zaawansowane sieci neuronowe (LSTM, Transformer) analizują sekwencje czasowe danych rynkowych, 
                      wykrywając długoterminowe zależności i trendy, które są niewidoczne dla tradycyjnych metod.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Reinforcement Learning</h4>
                    <p className="text-sm text-muted-foreground">
                      System uczy się z własnych decyzji, optymalizując strategie handlowe poprzez ciągłe testowanie 
                      i poprawianie wyników w symulowanym środowisku rynkowym.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Ensemble Methods</h4>
                    <p className="text-sm text-muted-foreground">
                      Kombinacja wielu modeli AI (ensemble) zapewnia większą dokładność i stabilność sygnałów, 
                      redukując ryzyko błędów pojedynczego modelu.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  Analiza Techniczna i Fundamentalna
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Analiza Techniczna</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Wskaźniki trendu: Moving Averages (SMA, EMA), MACD, ADX</li>
                      <li>Wskaźniki momentum: RSI, Stochastic, Williams %R</li>
                      <li>Analiza wolumenu: OBV, Volume Profile, VWAP</li>
                      <li>Formacje wykresów: Wzorce świecowe, formacje kontynuacji i odwrócenia</li>
                      <li>Poziomy wsparcia i oporu: Automatyczna identyfikacja kluczowych poziomów cenowych</li>
                      <li>Analiza wielu timeframe'ów: H1, H4, D1, W1</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Analiza Fundamentalna</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Wydarzenia ekonomiczne: Decyzje banków centralnych, wskaźniki makroekonomiczne</li>
                      <li>Kalendarz ekonomiczny: Analiza wpływu nadchodzących wydarzeń na rynek</li>
                      <li>Sentyment rynku: Analiza wiadomości finansowych i social media</li>
                      <li>Korelacje międzyrynkowe: Analiza zależności między różnymi instrumentami</li>
                      <li>Dane COT (Commitment of Traders): Analiza pozycji dużych graczy</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-400" />
                  Generowanie Sygnałów Handlowych
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Proces generowania sygnału składa się z następujących etapów:
                </p>
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <strong className="text-foreground">Identyfikacja możliwości:</strong> System skanuje wszystkie instrumenty w czasie rzeczywistym, 
                      wykorzystując aktualne ceny pobierane bezpośrednio z głównych baz danych bez opóźnień. Identyfikuje sytuacje, gdzie konfluencja 
                      wskaźników technicznych i fundamentalnych wskazuje na wysokie prawdopodobieństwo ruchu cenowego. Wszystkie dane cenowe są 
                      aktualizowane w czasie rzeczywistym, co zapewnia precyzyjne sygnały oparte na najnowszych informacjach rynkowych.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <strong className="text-foreground">Obliczanie prawdopodobieństwa:</strong> Każda możliwość jest oceniana przez zespół modeli AI, 
                      które przypisują prawdopodobieństwo sukcesu w zakresie 0-100%. Sygnały z prawdopodobieństwem powyżej 60% są kwalifikowane do publikacji.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <strong className="text-foreground">Określenie poziomów:</strong> System automatycznie oblicza optymalne poziomy:
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li><strong>Entry Price:</strong> Cena wejścia w transakcję</li>
                        <li><strong>Stop Loss (SL):</strong> Poziom ochrony przed stratą, obliczany na podstawie zmienności i struktury rynku</li>
                        <li><strong>Take Profit (TP1, TP2, TP3):</strong> Poziomy zysku, gdzie TP3 jest głównym celem, a TP1 i TP2 są poziomami częściowego zamykania pozycji</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">4</span>
                    <div>
                      <strong className="text-foreground">Obliczanie Risk/Reward:</strong> System automatycznie oblicza stosunek ryzyka do zysku, 
                      zapewniając, że każdy sygnał ma minimum 1:1.5 Risk/Reward ratio.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">5</span>
                    <div>
                      <strong className="text-foreground">Walidacja i publikacja:</strong> Sygnał przechodzi przez finalną walidację, 
                      sprawdzając konfluencję wszystkich czynników, a następnie jest publikowany na platformie w czasie rzeczywistym.
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-6 border border-orange-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-400" />
                  Obliczanie Pipsów i Punktów
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nasz system automatycznie dostosowuje obliczenia do specyfiki każdego instrumentu:
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-background/50 rounded p-4">
                    <h4 className="font-semibold mb-2 text-foreground">Pary Walutowe (Forex)</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Standardowe pary (EUR/USD, GBP/USD): 1 pip = 0.0001 (mnożnik 10,000)</li>
                      <li>• Pary z JPY (USD/JPY, EUR/JPY): 1 pip = 0.01 (mnożnik 100)</li>
                    </ul>
                  </div>
                  <div className="bg-background/50 rounded p-4">
                    <h4 className="font-semibold mb-2 text-foreground">Złoto (XAU)</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• XAU/USD, XAU/AUD: 1 punkt = 0.01 (mnożnik 100)</li>
                      <li>• XAU/JPY: 1 punkt = 0.1 (mnożnik 10)</li>
                    </ul>
                  </div>
                  <div className="bg-background/50 rounded p-4">
                    <h4 className="font-semibold mb-2 text-foreground">Indeksy</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• US30 (Dow Jones): 1 punkt = 1.0 (mnożnik 1)</li>
                      <li>• US100 (NASDAQ): 1 punkt = 1.0 (mnożnik 1)</li>
                    </ul>
                  </div>
                  <div className="bg-background/50 rounded p-4">
                    <h4 className="font-semibold mb-2 text-foreground">Automatyzacja</h4>
                    <p className="text-muted-foreground">
                      System automatycznie rozpoznaje typ instrumentu i stosuje odpowiednie mnożniki, 
                      wyświetlając wyniki w odpowiednich jednostkach (pips/pkt).
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-6 border border-cyan-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-cyan-400" />
                  System Aktualizacji w Czasie Rzeczywistym
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Platforma działa 24/7, zapewniając ciągłą aktualizację danych. Wszystkie ceny i dane rynkowe są pobierane bezpośrednio 
                  z głównych baz danych w czasie rzeczywistym, bez żadnych opóźnień. To oznacza, że sygnały handlowe są generowane na podstawie 
                  najaktualniejszych informacji dostępnych na rynku, co zapewnia maksymalną precyzję i aktualność.
                </p>
                <div className="bg-background/50 rounded-lg p-4 mb-4 border border-cyan-500/20">
                  <p className="text-sm font-semibold text-foreground mb-2">Źródła danych w czasie rzeczywistym:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Ceny instrumentów finansowych:</strong> Bezpośrednie połączenie z głównymi bazami danych rynkowych</li>
                    <li>• <strong>Dane ekonomiczne:</strong> Oficjalne źródła danych makroekonomicznych</li>
                    <li>• <strong>Wolumen transakcji:</strong> Dane tick-by-tick z głównych giełd i platform handlowych</li>
                    <li>• <strong>Brak opóźnień:</strong> Wszystkie dane są synchronizowane w czasie rzeczywistym</li>
                  </ul>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Sygnały handlowe:</strong> Aktualizacja co 30 sekund - system sprawdza nowe sygnały 
                      i aktualizuje status istniejących (aktywny, TP hit, SL hit)
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Kalendarz ekonomiczny:</strong> Aktualizacja co 5 minut - nowe wydarzenia i aktualizacje 
                      wartości rzeczywistych
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Premium features:</strong> 
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                        <li>DCF Levered: Auto-refresh co 15 minut</li>
                        <li>COT Analysis: Auto-refresh co 5 minut</li>
                        <li>Holidays: Auto-refresh co 30 minut</li>
                        <li>Economic Indicators: Auto-refresh co 10 minut</li>
                        <li>Senate Trading: Auto-refresh co 30 minut</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Powiadomienia push:</strong> Użytkownicy otrzymują natychmiastowe powiadomienia o nowych sygnałach 
                      i ważnych wydarzeniach ekonomicznych
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
                Funkcjonalności Platformy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sygnały Handlowe */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-6 border border-cyan-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  Sygnały Handlowe w Czasie Rzeczywistym
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nasza platforma dostarcza profesjonalne sygnały handlowe dla szerokiej gamy instrumentów finansowych:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Pary Walutowe (Forex)</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• EUR/USD, GBP/USD, USD/JPY</li>
                      <li>• AUD/USD, USD/CAD, NZD/USD</li>
                      <li>• EUR/GBP, EUR/JPY, GBP/JPY</li>
                      <li>• AUD/JPY i inne główne pary</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Towary i Indeksy</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Złoto: XAU/USD, XAU/JPY, XAU/AUD</li>
                      <li>• Indeksy: US30 (Dow Jones), US100 (NASDAQ)</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-background/50 rounded p-4">
                  <h4 className="font-semibold mb-2 text-foreground">Każdy sygnał zawiera:</h4>
                  <ul className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      Kierunek transakcji (BUY/SELL)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      Dokładną cenę wejścia
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      Stop Loss (SL) z obliczonym ryzykiem w pipsach/punktach
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      Take Profit (TP1, TP2, TP3) z obliczonym zyskiem
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      Prawdopodobieństwo sukcesu (0-100%)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      Risk/Reward ratio
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      Czas od utworzenia sygnału
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      Status (aktywny, TP hit, SL hit)
                    </li>
                  </ul>
                </div>
              </div>

              {/* Kalendarz Ekonomiczny */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  Kalendarz Ekonomiczny
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Kompleksowy kalendarz wydarzeń ekonomicznych z oceną wpływu na rynek:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Dostępne dla wszystkich:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Wydarzenia ekonomiczne z całego świata</li>
                      <li>• Decyzje banków centralnych</li>
                      <li>• Wskaźniki makroekonomiczne (PKB, inflacja, bezrobocie)</li>
                      <li>• Ocena wpływu (wysoki, średni, niski)</li>
                      <li>• Prognozy vs wartości rzeczywiste</li>
                      <li>• Filtrowanie po kraju i wpływie</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-400" />
                      Funkcje Premium:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>Custom DCF Levered:</strong> Analiza wyceny spółek metodą DCF</li>
                      <li>• <strong>COT Analysis:</strong> Analiza raportów Commitment of Traders</li>
                      <li>• <strong>Holidays By Exchange:</strong> Święta giełdowe według giełdy</li>
                      <li>• <strong>Economic Indicators:</strong> Szczegółowe wskaźniki ekonomiczne</li>
                      <li>• <strong>Senate Trading:</strong> Dane o transakcjach senatorów USA</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Aplikacja Mobilna */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-purple-400" />
                  Aplikacja Mobilna
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Pełna funkcjonalność platformy dostępna na urządzeniach mobilnych:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-background/50 rounded p-4">
                    <h4 className="font-semibold mb-2 text-foreground">Sygnały w czasie rzeczywistym</h4>
                    <p className="text-sm text-muted-foreground">
                      Natychmiastowe powiadomienia push o nowych sygnałach i aktualizacjach
                    </p>
                  </div>
                  <div className="bg-background/50 rounded p-4">
                    <h4 className="font-semibold mb-2 text-foreground">Nowoczesny interfejs</h4>
                    <p className="text-sm text-muted-foreground">
                      Intuicyjny design zaprojektowany z myślą o traderach, wszystkie informacje na wyciągnięcie ręki
                    </p>
                  </div>
                  <div className="bg-background/50 rounded p-4">
                    <h4 className="font-semibold mb-2 text-foreground">Pełna funkcjonalność</h4>
                    <p className="text-sm text-muted-foreground">
                      Wszystkie funkcje platformy webowej dostępne w aplikacji mobilnej
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

