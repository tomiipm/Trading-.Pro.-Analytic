# 🗄️ Instrukcje Migracji Supabase - Naprawa RLS Policies

## 📋 Co zostało naprawione

Naprawiono **krytyczny problem bezpieczeństwa** w RLS (Row Level Security) policies dla tabeli `premium_subscriptions`.

### Problem:
- Poprzednie policies używały `USING (true)`, co pozwalało **każdemu użytkownikowi** czytać wszystkie płatności PayPal
- To było **poważne naruszenie prywatności** i bezpieczeństwa danych

### Rozwiązanie:
- Nowa policy sprawdza, czy użytkownik ma dostęp tylko do swoich płatności (matched by email)
- INSERT/UPDATE pozostają bez policies, ponieważ webhook używa `service_role` (który bypassuje RLS)

---

## 🚀 Jak wykonać migrację

### Opcja 1: Supabase Dashboard (Zalecane)

1. **Zaloguj się do Supabase Dashboard**
   - Przejdź do [https://app.supabase.com](https://app.supabase.com)
   - Wybierz swój projekt

2. **Otwórz SQL Editor**
   - W lewym menu kliknij **SQL Editor**
   - Kliknij **New Query**

3. **Wklej poniższe polecenie SQL:**
   ```sql
   -- Drop existing permissive policies
   DROP POLICY IF EXISTS "Users can read their own premium subscriptions" ON public.premium_subscriptions;
   DROP POLICY IF EXISTS "API can insert premium subscriptions" ON public.premium_subscriptions;
   DROP POLICY IF EXISTS "API can update premium subscriptions" ON public.premium_subscriptions;

   -- Create secure SELECT policy
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
   ```

4. **Uruchom zapytanie**
   - Kliknij **Run** (lub naciśnij `Ctrl+Enter` / `Cmd+Enter`)
   - Powinieneś zobaczyć: `Success. No rows returned`

5. **Weryfikacja (opcjonalne)**
   - Sprawdź, czy policy została utworzona:
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename = 'premium_subscriptions';
   ```
   - Powinieneś zobaczyć tylko jedną policy: `"Users can read their own premium subscriptions"`

### Opcja 2: Supabase CLI

Jeśli używasz Supabase CLI:

```bash
# 1. Połącz się z projektem
supabase link --project-ref your-project-ref

# 2. Utwórz nową migrację
supabase migration new fix_premium_subscriptions_rls

# 3. Skopiuj zawartość z scripts/fix-premium-subscriptions-rls.sql do nowego pliku migracji

# 4. Zastosuj migrację
supabase db push
```

### Opcja 3: Bezpośrednie połączenie z bazą

Jeśli masz bezpośredni dostęp do bazy PostgreSQL:

```bash
psql -h your-db-host -U postgres -d postgres -f scripts/fix-premium-subscriptions-rls.sql
```

---

## ✅ Weryfikacja po migracji

### Test 1: Sprawdź, czy policy istnieje

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'premium_subscriptions';
```

**Oczekiwany wynik:**
- Powinna być tylko **jedna policy** dla `SELECT`
- Policy powinna mieć `qual` zawierający `EXISTS` z `user_profiles`

### Test 2: Sprawdź, czy użytkownicy widzą tylko swoje płatności

1. Zaloguj się jako użytkownik A
2. Sprawdź `premium_subscriptions` - powinien widzieć tylko swoje rekordy
3. Zaloguj się jako użytkownik B
4. Sprawdź `premium_subscriptions` - powinien widzieć tylko swoje rekordy

### Test 3: Sprawdź, czy webhook nadal działa

1. Wykonaj testową płatność PayPal
2. Sprawdź, czy webhook poprawnie wstawia rekord do `premium_subscriptions`
3. Sprawdź, czy użytkownik widzi swoją płatność

---

## ⚠️ Ważne Uwagi

1. **Backup przed migracją:**
   - Zrób backup bazy danych przed wykonaniem migracji
   - W Supabase Dashboard: **Settings** → **Database** → **Backups**

2. **Webhook nadal działa:**
   - Webhook używa `SUPABASE_SERVICE_ROLE_KEY`
   - Service role **bypassuje RLS**, więc webhook może nadal wstawiać/aktualizować rekordy
   - To jest **zamierzone** - tylko backend powinien modyfikować `premium_subscriptions`

3. **Brak policy dla INSERT/UPDATE:**
   - To jest **poprawne** - webhook używa service_role, który nie potrzebuje policies
   - Jeśli chcesz dodać dodatkową warstwę bezpieczeństwa, możesz dodać policy, ale nie jest to konieczne

---

## 🐛 Rozwiązywanie problemów

### Problem: "Policy already exists"

**Rozwiązanie:**
```sql
DROP POLICY IF EXISTS "Users can read their own premium subscriptions" ON public.premium_subscriptions;
-- Następnie uruchom ponownie CREATE POLICY
```

### Problem: "Permission denied"

**Rozwiązanie:**
- Upewnij się, że używasz konta z uprawnieniami administratora
- W Supabase Dashboard użyj SQL Editor z uprawnieniami admin

### Problem: "Webhook nie działa po migracji"

**Rozwiązanie:**
- Webhook używa `service_role`, który bypassuje RLS
- Sprawdź, czy `SUPABASE_SERVICE_ROLE_KEY` jest poprawnie skonfigurowany
- Sprawdź logi webhook w Supabase Dashboard

---

## 📞 Wsparcie

Jeśli masz problemy z migracją:
1. Sprawdź logi w Supabase Dashboard
2. Sprawdź dokumentację: [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
3. Skontaktuj się z supportem Supabase

---

**Data utworzenia:** 2024  
**Wersja:** 1.0  
**Status:** ✅ Gotowe do wdrożenia

