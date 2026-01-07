-- ============================================
-- Fix RLS Policies for premium_subscriptions
-- ============================================
-- This script fixes the overly permissive RLS policies
-- that allowed any user to read all premium subscriptions
--
-- IMPORTANT: Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Drop existing permissive policies
DROP POLICY IF EXISTS "Users can read their own premium subscriptions" ON public.premium_subscriptions;
DROP POLICY IF EXISTS "API can insert premium subscriptions" ON public.premium_subscriptions;
DROP POLICY IF EXISTS "API can update premium subscriptions" ON public.premium_subscriptions;

-- Step 2: Create secure SELECT policy
-- Users can only read their own premium subscriptions (matched by email)
CREATE POLICY "Users can read their own premium subscriptions" 
  ON public.premium_subscriptions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.email = premium_subscriptions.email 
      AND user_profiles.user_id = auth.uid()
    )
  );

-- Step 3: Note about INSERT/UPDATE
-- INSERT and UPDATE operations are handled by service_role in webhook
-- Service role bypasses RLS, so we don't need policies for INSERT/UPDATE
-- This is more secure as only the backend can modify premium_subscriptions
--
-- The webhook uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS,
-- so it can insert/update without policies

-- ============================================
-- Verification Query (optional - run to verify)
-- ============================================
-- This query should only return premium_subscriptions for the current user
-- SELECT * FROM premium_subscriptions;
-- ============================================

