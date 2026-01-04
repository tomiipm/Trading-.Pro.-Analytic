"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  TrendingUp, 
  Brain, 
  Zap, 
  Shield, 
  BookOpen, 
  Target, 
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

export function HeroSection() {
  return (
    <div className="relative w-full bg-background">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 pt-8 md:pt-12 w-full">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8 text-center md:text-left w-full">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold mb-4">
                <Sparkles className="h-4 w-4" />
                <span>Wspierane przez Sztuczną Inteligencję</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
                  Profesjonalne Sygnały
                </span>
                <br />
                <span className="text-foreground">Handlowe w Czasie Rzeczywistym</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto md:mx-0">
                Wykorzystaj moc zaawansowanych algorytmów AI do podejmowania lepszych decyzji handlowych. 
                Otrzymuj precyzyjne sygnały 24/7 i zwiększ swoje szanse na sukces na rynkach finansowych.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                  <Link href="/signup">
                    Rozpocznij Za Darmo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-cyan-500/50 hover:bg-cyan-500/10">
                  <Link href="#learn">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Naucz Się Tradingu
                  </Link>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <div className="text-3xl font-bold text-cyan-400">24/7</div>
                  <div className="text-sm text-muted-foreground">Monitoring</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-400">AI</div>
                  <div className="text-sm text-muted-foreground">Algorytmy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-400">100+</div>
                  <div className="text-sm text-muted-foreground">Sygnały/Dzień</div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Visual Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent backdrop-blur-sm">
                <CardContent className="p-6">
                  <Brain className="h-8 w-8 text-cyan-400 mb-4" />
                  <h3 className="font-semibold mb-2">AI Powered</h3>
                  <p className="text-sm text-muted-foreground">Zaawansowane algorytmy uczenia maszynowego</p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur-sm mt-4">
                <CardContent className="p-6">
                  <Zap className="h-8 w-8 text-blue-400 mb-4" />
                  <h3 className="font-semibold mb-2">Real-Time</h3>
                  <p className="text-sm text-muted-foreground">Sygnały w czasie rzeczywistym</p>
                </CardContent>
              </Card>
              
              <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent backdrop-blur-sm">
                <CardContent className="p-6">
                  <Target className="h-8 w-8 text-green-400 mb-4" />
                  <h3 className="font-semibold mb-2">Precyzyjne</h3>
                  <p className="text-sm text-muted-foreground">Wysoka dokładność sygnałów</p>
                </CardContent>
              </Card>
              
              <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-sm mt-4">
                <CardContent className="p-6">
                  <Shield className="h-8 w-8 text-purple-400 mb-4" />
                  <h3 className="font-semibold mb-2">Bezpieczne</h3>
                  <p className="text-sm text-muted-foreground">Zarządzanie ryzykiem</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dlaczego Wybrać Naszą Platformę?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kompleksowe narzędzia i wsparcie dla każdego tradera
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-cyan-500/30 hover:border-cyan-500/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-cyan-500/10">
                    <Brain className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Sztuczna Inteligencja</h3>
                </div>
                <p className="text-muted-foreground">
                  Nasze algorytmy AI analizują tysiące danych rynkowych w czasie rzeczywistym, 
                  identyfikując najlepsze możliwości handlowe z wysoką dokładnością.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-blue-500/30 hover:border-blue-500/60 transition-all hover:shadow-lg hover:shadow-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <BarChart3 className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Szczegółowe Statystyki</h3>
                </div>
                <p className="text-muted-foreground">
                  Śledź wyniki swoich transakcji, analizuj wskaźniki sukcesu i optymalizuj 
                  swoją strategię handlową na podstawie rzeczywistych danych.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-green-500/30 hover:border-green-500/60 transition-all hover:shadow-lg hover:shadow-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Wysoka Dokładność</h3>
                </div>
                <p className="text-muted-foreground">
                  Nasze sygnały są precyzyjnie kalibrowane i testowane, zapewniając 
                  wysoką stopę trafności i maksymalizację zysków przy minimalnym ryzyku.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Section */}
      <section id="learn" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold mb-4">
                <BookOpen className="h-4 w-4" />
                <span>Edukacja Tradingowa</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Naucz Się Podstaw Tradingu
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                Zrozum fundamenty handlu na rynkach finansowych i naucz się korzystać z naszych 
                sygnałów w sposób efektywny i bezpieczny.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Podstawy Analizy Technicznej</h3>
                    <p className="text-sm text-muted-foreground">
                      Poznaj kluczowe wskaźniki, wykresy i narzędzia analizy technicznej
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Zarządzanie Ryzykiem</h3>
                    <p className="text-sm text-muted-foreground">
                      Naucz się odpowiednio zarządzać kapitałem i minimalizować straty
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Korzystanie z Sygnałów</h3>
                    <p className="text-sm text-muted-foreground">
                      Dowiedz się, jak interpretować i wykorzystywać nasze sygnały handlowe
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Psychologia Tradingu</h3>
                    <p className="text-sm text-muted-foreground">
                      Zrozum emocjonalne aspekty handlu i naucz się kontrolować swoje decyzje
                    </p>
                  </div>
                </div>
              </div>
              
              <Button asChild size="lg" variant="outline" className="border-cyan-500/50 hover:bg-cyan-500/10">
                <Link href="/about">
                  Dowiedz Się Więcej
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <Card className="border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-lg bg-cyan-500/20">
                      <BookOpen className="h-8 w-8 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Kompleksowy Przewodnik</h3>
                      <p className="text-sm text-muted-foreground">Od podstaw do zaawansowanych strategii</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-lg bg-blue-500/20">
                      <Target className="h-8 w-8 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Praktyczne Przykłady</h3>
                      <p className="text-sm text-muted-foreground">Rzeczywiste case studies i analizy</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-lg bg-green-500/20">
                      <TrendingUp className="h-8 w-8 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Strategie Sukcesu</h3>
                      <p className="text-sm text-muted-foreground">Sprawdzone metody profesjonalnych traderów</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

