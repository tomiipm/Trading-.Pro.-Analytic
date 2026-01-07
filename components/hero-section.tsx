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
import { useI18n } from "@/lib/i18n/context"

export function HeroSection() {
  const { t } = useI18n()
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
                <span>{t.heroSection.aiPowered}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
                  {t.heroSection.professionalSignals}
                </span>
                <br />
                <span className="text-foreground">{t.heroSection.realTimeTrading}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto md:mx-0">
                {t.heroSection.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                  <Link href="/signup">
                    {t.heroSection.startFree}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-cyan-500/50 hover:bg-cyan-500/10">
                  <Link href="#learn">
                    <BookOpen className="mr-2 h-5 w-5" />
                    {t.heroSection.learnTrading}
                  </Link>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <div className="text-3xl font-bold text-cyan-400">24/7</div>
                  <div className="text-sm text-muted-foreground">{t.heroSection.monitoring}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-400">AI</div>
                  <div className="text-sm text-muted-foreground">{t.heroSection.algorithms}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-400">100+</div>
                  <div className="text-sm text-muted-foreground">{t.heroSection.signalsPerDay}</div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Visual Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent backdrop-blur-sm">
                <CardContent className="p-6">
                  <Brain className="h-8 w-8 text-cyan-400 mb-4" />
                  <h3 className="font-semibold mb-2">{t.heroSection.aiPoweredTitle}</h3>
                  <p className="text-sm text-muted-foreground">{t.heroSection.aiPoweredDesc}</p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur-sm mt-4">
                <CardContent className="p-6">
                  <Zap className="h-8 w-8 text-blue-400 mb-4" />
                  <h3 className="font-semibold mb-2">{t.heroSection.realTimeTitle}</h3>
                  <p className="text-sm text-muted-foreground">{t.heroSection.realTimeDesc}</p>
                </CardContent>
              </Card>
              
              <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent backdrop-blur-sm">
                <CardContent className="p-6">
                  <Target className="h-8 w-8 text-green-400 mb-4" />
                  <h3 className="font-semibold mb-2">{t.heroSection.preciseTitle}</h3>
                  <p className="text-sm text-muted-foreground">{t.heroSection.preciseDesc}</p>
                </CardContent>
              </Card>
              
              <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-sm mt-4">
                <CardContent className="p-6">
                  <Shield className="h-8 w-8 text-purple-400 mb-4" />
                  <h3 className="font-semibold mb-2">{t.heroSection.secureTitle}</h3>
                  <p className="text-sm text-muted-foreground">{t.heroSection.secureDesc}</p>
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
              {t.heroSection.whyChoose}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.heroSection.whyChooseDesc}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-cyan-500/30 hover:border-cyan-500/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-cyan-500/10">
                    <Brain className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold">{t.heroSection.artificialIntelligence}</h3>
                </div>
                <p className="text-muted-foreground">
                  {t.heroSection.artificialIntelligenceDesc}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-blue-500/30 hover:border-blue-500/60 transition-all hover:shadow-lg hover:shadow-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <BarChart3 className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold">{t.heroSection.detailedStats}</h3>
                </div>
                <p className="text-muted-foreground">
                  {t.heroSection.detailedStatsDesc}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-green-500/30 hover:border-green-500/60 transition-all hover:shadow-lg hover:shadow-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold">{t.heroSection.highAccuracy}</h3>
                </div>
                <p className="text-muted-foreground">
                  {t.heroSection.highAccuracyDesc}
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
                <span>{t.heroSection.tradingEducation}</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t.heroSection.learnBasics}
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                {t.heroSection.learnBasicsDesc}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{t.heroSection.technicalAnalysis}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t.heroSection.technicalAnalysisDesc}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{t.heroSection.riskManagement}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t.heroSection.riskManagementDesc}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{t.heroSection.usingSignals}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t.heroSection.usingSignalsDesc}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{t.heroSection.tradingPsychology}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t.heroSection.tradingPsychologyDesc}
                    </p>
                  </div>
                </div>
              </div>
              
              <Button asChild size="lg" variant="outline" className="border-cyan-500/50 hover:bg-cyan-500/10">
                <Link href="/about">
                  {t.heroSection.learnMore}
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
                      <h3 className="text-xl font-semibold">{t.heroSection.comprehensiveGuide}</h3>
                      <p className="text-sm text-muted-foreground">{t.heroSection.comprehensiveGuideDesc}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-lg bg-blue-500/20">
                      <Target className="h-8 w-8 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{t.heroSection.practicalExamples}</h3>
                      <p className="text-sm text-muted-foreground">{t.heroSection.practicalExamplesDesc}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-lg bg-green-500/20">
                      <TrendingUp className="h-8 w-8 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{t.heroSection.successStrategies}</h3>
                      <p className="text-sm text-muted-foreground">{t.heroSection.successStrategiesDesc}</p>
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

