"use client"
import { BackgroundSignalRunner } from "@/components/background-signal-runner"
import { ForexSignals } from "@/components/forex-signals"

export default function ForexPage() {
  return (
    <div className="min-h-screen bg-background">
      <BackgroundSignalRunner />

      <div className="container mx-auto py-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Forex Trading Signals</h1>
          <p className="text-muted-foreground">
            Real-time trading signals for major currency pairs
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
