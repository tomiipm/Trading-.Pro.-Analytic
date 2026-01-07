import { createClient } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Check if user has an active premium subscription
 * @param supabase - Supabase client instance
 * @param userId - User ID to check
 * @returns Promise<boolean> - true if user has active premium subscription
 */
export async function checkPremiumSubscription(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString())
    .eq("subscription_type", "premium")
    .single()

  return !!subscription
}

/**
 * Check if user has an active subscription (trial, one_day, or premium)
 * Excludes 'free' subscriptions
 * @param supabase - Supabase client instance
 * @param userId - User ID to check
 * @returns Promise<boolean> - true if user has active subscription (excluding free)
 */
export async function checkActiveSubscription(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString())
    .in("subscription_type", ["trial", "one_day", "premium"])
    .single()

  return !!subscription
}

/**
 * Get user subscription details
 * @param supabase - Supabase client instance
 * @param userId - User ID
 * @returns Promise with subscription data or null
 */
export async function getUserSubscription(
  supabase: SupabaseClient,
  userId: string
) {
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single()

  return subscription
}

