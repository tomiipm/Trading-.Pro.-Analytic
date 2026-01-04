'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { useSubscription } from '@/hooks/useSubscription'
import { Button } from '@/components/ui/button'

interface PremiumGateProps {
  children: ReactNode
}

export function PremiumGate({ children }: PremiumGateProps) {
  const { loading, isPremium } = useSubscription()

  if (loading) return null

  if (!isPremium) {
    return (
      <div className="border border-dashed border-cyan-500/50 rounded-xl p-8 text-center space-y-4">
        <h3 className="text-xl font-semibold text-cyan-400">Funkcja Premium</h3>
        <p className="text-muted-foreground">
          Ta funkcja jest dostępna wyłącznie dla użytkowników Premium.
        </p>
        <Button asChild>
          <Link href="/subscriptions">Przejdź do subskrypcji</Link>
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
