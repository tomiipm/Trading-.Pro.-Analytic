"use client"
import { BackgroundSignalRunner } from "@/components/background-signal-runner"
import { ForexSignals } from "@/components/forex-signals"
import { HighRiskBanner } from "@/components/high-risk-banner"
import { PremiumSection } from "@/components/premium-section"
import { Copyright, AlertCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function HomePage() {
  const { t } = useI18n()
  return (
    <div className="min-h-screen bg-background">
      <BackgroundSignalRunner />

      {/* Premium Section - Informacje o Trial i Premium */}
      <div className="container mx-auto px-4 pt-4">
        <PremiumSection />
      </div>

      {/* High Risk Event Banner - Only shows when there's an upcoming high-risk event */}
      <div className="container mx-auto px-4 pt-4">
        <HighRiskBanner />
      </div>

      {/* Signals Section */}
      <div className="container mx-auto px-4 py-6">
        <ForexSignals />
      </div>

      {/* Copyright Notice Section */}
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/50 rounded-lg p-3 md:p-4 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                <Copyright className="w-4 h-4 text-red-500" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-xs md:text-sm font-bold text-red-500">
                    {t.copyright.title}
                  </p>
                </div>
                <p className="text-xs md:text-sm text-red-400/90 leading-relaxed">
                  {t.copyright.description}
                </p>
                <p className="text-xs md:text-sm text-red-500 font-bold">
                  © {new Date().getFullYear()} Trading Pro Analytic. {t.copyright.allRightsReserved}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
