"use client"
import { BackgroundSignalRunner } from "@/components/background-signal-runner"
import { ForexSignals } from "@/components/forex-signals"
import { useI18n } from "@/lib/i18n/context"

export default function ForexPage() {
  const { t } = useI18n()
  
  return (
    <div className="min-h-screen bg-background">
      <BackgroundSignalRunner />

      <div className="container mx-auto py-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{t.forexPage.title}</h1>
          <p className="text-muted-foreground">
            {t.forexPage.description}
          </p>
        </div>

        {/* Signals Section */}
        <div className="w-full">
          <ForexSignals />
        </div>
      </div>
    </div>
  )
}
