"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function BackgroundSignalRunner() {
  const [lastSignalCount, setLastSignalCount] = useState<number>(0)
  const [isPolling, setIsPolling] = useState(false)
  const [consecutiveErrors, setConsecutiveErrors] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    setIsPolling(true)
    let mounted = true

    const pollForSignals = async () => {
      if (!mounted) return

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch("/api/signals", { signal: controller.signal })
        clearTimeout(timeoutId)

        if (!response.ok) {
          if (mounted) {
            setConsecutiveErrors((prev) => prev + 1)
          }
          return
        }

        const data = await response.json()
        const signals = data.signals || []

        if (!mounted) return

        setConsecutiveErrors(0)

        // Check if we have new signals
        if (signals.length > lastSignalCount && lastSignalCount > 0) {
          // Show toast notification for the latest signal
          if (signals[0]) {
            const latestSignal = signals[0]
            toast({
              title: "New Trading Signal",
              description: `${latestSignal.type?.toUpperCase() || "Signal"} for ${latestSignal.symbol} - Confidence: ${latestSignal.confidence}%`,
              duration: 5000,
            })
          }

          // Trigger a custom event that other components can listen to
          window.dispatchEvent(
            new CustomEvent("newTradingSignal", {
              detail: signals[0],
            }),
          )
        }

        setLastSignalCount(signals.length)
      } catch (error) {
        if (!mounted) return

        setConsecutiveErrors((prev) => {
          const newCount = prev + 1
          
          // Show warning toast after 3 consecutive errors
          if (newCount >= 3) {
            toast({
              title: "Connection Issue",
              description: "Having trouble fetching new signals. Will keep trying...",
              variant: "destructive",
              duration: 5000,
            })
            return 0 // Reset to avoid spam
          }
          
          return newCount
        })
      }
    }

    // Initial fetch
    pollForSignals()

    const pollInterval = setInterval(pollForSignals, 30000)

    // Cleanup interval on unmount
    return () => {
      mounted = false
      clearInterval(pollInterval)
      setIsPolling(false)
    }
  }, [toast, lastSignalCount])

  // This component doesn't render anything visible
  return null
}

export default BackgroundSignalRunner
