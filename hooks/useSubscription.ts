'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

type SubscriptionStatus = 'active' | 'expired' | 'cancelled'
type SubscriptionType = 'free' | 'trial' | 'one_day' | 'premium'

interface SubscriptionData {
  subscription_type: SubscriptionType
  status: SubscriptionStatus
  expires_at: string
}

export function useSubscription() {
  const supabase = getSupabaseBrowserClient()

  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)

  const isPremium =
    subscription?.subscription_type === 'premium' &&
    subscription?.status === 'active' &&
    new Date(subscription.expires_at) > new Date()

  const isExpired =
    !!subscription &&
    (subscription.status === 'expired' ||
      new Date(subscription.expires_at) <= new Date())

  useEffect(() => {
    let mounted = true

    async function loadSubscription() {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        if (mounted) {
          setSubscription(null)
          setLoading(false)
        }
        return
      }

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('subscription_type, status, expires_at')
        .eq('user_id', user.id)
        .single()

      if (mounted) {
        if (error || !data) {
          setSubscription(null)
        } else {
          setSubscription(data)
        }
        setLoading(false)
      }
    }

    loadSubscription()

    return () => {
      mounted = false
    }
  }, [supabase])

  return {
    loading,
    subscription,
    isPremium,
    isExpired,
  }
}
