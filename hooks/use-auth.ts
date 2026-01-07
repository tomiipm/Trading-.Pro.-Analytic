"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export type SubscriptionType = "free" | "trial" | "one_day" | "premium"
export type SubscriptionStatus = "active" | "expired" | "cancelled"

export interface UserSubscription {
  id: string
  user_id: string
  subscription_type: SubscriptionType
  status: SubscriptionStatus
  starts_at: string
  expires_at: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let supabase: ReturnType<typeof getSupabaseBrowserClient> | null = null
    let supabaseConfigured = false
    let sessionTimeout: NodeJS.Timeout | null = null
    let mounted = true
    
    try {
      supabase = getSupabaseBrowserClient()
      supabaseConfigured = true
    } catch (error) {
      // Supabase not configured - this is expected in some cases
      console.warn("Supabase not configured:", error)
      supabaseConfigured = false
      setLoading(false)
      return
    }

    if (!supabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    const fetchUserData = async (userId: string) => {
      if (!supabase || !mounted) return
      
      try {
        // Fetch subscription
        const { data: subscriptionData, error: subError } = await supabase
          .from("user_subscriptions")
          .select("*")
          .eq("user_id", userId)
          .eq("status", "active")
          .gt("expires_at", new Date().toISOString())
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (!subError && subscriptionData && mounted) {
          setSubscription(subscriptionData)
        } else if (mounted) {
          setSubscription(null)
        }

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", userId)
          .single()

        if (!profileError && profileData && mounted) {
          setProfile(profileData)
        }
      } catch (error) {
        // Error fetching user data
        console.warn("Error fetching user data:", error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Get initial session with timeout
    sessionTimeout = setTimeout(() => {
      if (mounted) {
        console.warn("Session fetch timeout - continuing without auth")
        setLoading(false)
      }
    }, 5000) // 5 second timeout

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (sessionTimeout) {
        clearTimeout(sessionTimeout)
        sessionTimeout = null
      }
      if (!mounted) return
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserData(session.user.id)
      } else {
        setLoading(false)
      }
    }).catch((error) => {
      if (sessionTimeout) {
        clearTimeout(sessionTimeout)
        sessionTimeout = null
      }
      console.warn("Session fetch error:", error)
      if (mounted) {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserData(session.user.id)
      } else {
        setSubscription(null)
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      if (sessionTimeout) {
        clearTimeout(sessionTimeout)
      }
      authSubscription.unsubscribe()
    }
  }, [])


  const signOut = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      await supabase.auth.signOut()
    } catch (error) {
      // Supabase not configured
    }
    setUser(null)
    setSubscription(null)
    setProfile(null)
  }

  const isPremium = () => {
    return subscription?.subscription_type === "premium" && subscription?.status === "active"
  }

  const isTrial = () => {
    return subscription?.subscription_type === "trial" && subscription?.status === "active"
  }

  const isOneDay = () => {
    return subscription?.subscription_type === "one_day" && subscription?.status === "active"
  }

  const hasActiveSubscription = () => {
    // User must be logged in AND have active subscription (but NOT 'free')
    // 'free' subscription is just a placeholder, doesn't give access to signal details
    if (!user) return false
    if (!subscription) return false
    if (subscription.status !== "active") return false
    if (new Date(subscription.expires_at) <= new Date()) return false
    // Exclude 'free' subscription - it doesn't give access
    return subscription.subscription_type !== "free"
  }

  return {
    user,
    subscription,
    profile,
    loading,
    signOut,
    isPremium,
    isTrial,
    isOneDay,
    hasActiveSubscription,
    refreshUserData: () => {
      if (user) {
        try {
          const supabase = getSupabaseBrowserClient()
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
              // Re-fetch user data logic can be added here if needed
            }
          })
        } catch (error) {
          // Supabase not configured
        }
      }
    },
  }
}

