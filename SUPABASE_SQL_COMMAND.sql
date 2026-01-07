-- ============================================
-- 🔒 NAPRAWA RLS POLICIES DLA premium_subscriptions
-- ============================================
-- Wykonaj to polecenie w Supabase SQL Editor
-- 
-- INSTRUKCJA:
-- 1. Otwórz Supabase Dashboard → SQL Editor
-- 2. Wklej poniższe polecenie
-- 3. Kliknij "Run"
-- ============================================

-- Krok 1: Usuń stare, zbyt permissive policies
DROP POLICY IF EXISTS "Users can read their own premium subscriptions" ON public.premium_subscriptions;
DROP POLICY IF EXISTS "API can insert premium subscriptions" ON public.premium_subscriptions;
DROP POLICY IF EXISTS "API can update premium subscriptions" ON public.premium_subscriptions;

-- Krok 2: Utwórz bezpieczną policy dla SELECT
-- Użytkownicy widzą tylko swoje płatności (dopasowane po emailu)
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

-- ============================================
-- ✅ GOTOWE!
-- ============================================
-- Po wykonaniu tego polecenia:
-- - Użytkownicy będą widzieć tylko swoje płatności
-- - Webhook nadal będzie działać (używa service_role)
-- - Bezpieczeństwo danych zostało poprawione
-- ============================================

