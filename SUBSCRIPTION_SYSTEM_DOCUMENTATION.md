# Dokumentacja Systemu Subskrypcji

## 📋 Przegląd Systemu

System subskrypcji w Trading Pro Analytic składa się z:
- **Trial** - 1 dzień, darmowe
- **Premium** - 1 dzień ($1) lub 7 dni ($7), płatne przez PayPal
- **Free** - domyślna subskrypcja przy rejestracji (100 lat)

## 💰 Ceny i Kwoty

### Trial (Darmowe)
- **Cena:** $0 (darmowe)
- **Czas trwania:** 1 dzień (24 godziny)
- **Aktywacja:** Natychmiastowa przez przycisk "Aktywuj Test"
- **Endpoint:** `POST /api/subscriptions/create`
- **Parametry:** `{ subscriptionType: "trial", days: 1 }`

### Premium - 1 Dzień
- **Cena:** $1 USD
- **Czas trwania:** 1 dzień (24 godziny)
- **Płatność:** PayPal
- **Aktywacja:** Po potwierdzeniu płatności przez PayPal webhook

### Premium - 7 Dni
- **Cena:** $7 USD
- **Czas trwania:** 7 dni
- **Płatność:** PayPal
- **Aktywacja:** Po potwierdzeniu płatności przez PayPal webhook

## 🔄 Proces Tworzenia Subskrypcji

### 1. Trial Subscription

**Krok 1:** Użytkownik klika "Aktywuj Test" na `/subscriptions`
```typescript
// app/subscriptions/page.tsx - handleActivateTrial()
POST /api/subscriptions/create
Body: { subscriptionType: "trial", days: 1 }
```

**Krok 2:** Backend tworzy/aktualizuje subskrypcję
```typescript
// app/api/subscriptions/create/route.ts
- Sprawdza czy użytkownik jest zalogowany
- Oblicza expires_at = teraz + 1 dzień
- UPSERT do tabeli user_subscriptions
- subscription_type = "trial"
- status = "active"
```

**Krok 3:** Subskrypcja jest aktywna natychmiast

### 2. Premium Subscription (PayPal)

**Krok 1:** Użytkownik klika "Aktywuj 1 dzień" lub "Aktywuj 7 dni"
```typescript
// app/subscriptions/page.tsx - handleActivatePremium(days)
POST /api/paypal/create-order
Body: { amount: 1 lub 7, currency: "USD", days: 1 lub 7 }
```

**Krok 2:** Backend tworzy zamówienie PayPal
```typescript
// app/api/paypal/create-order/route.ts
- Waliduje: amount === days (1 lub 7)
- Tworzy PayPal order z odpowiednią kwotą
- Zwraca approvalUrl
```

**Krok 3:** Użytkownik przekierowany do PayPal
- Płaci $1 lub $7
- PayPal przekierowuje z powrotem do `/subscriptions?success=true`

**Krok 4:** PayPal wysyła webhook
```typescript
// app/api/paypal/webhook/route.ts
- Odbiera event: "CHECKOUT.ORDER.APPROVED" lub "PAYMENT.CAPTURE.COMPLETED"
- Weryfikuje podpis PayPal
- Określa dni na podstawie kwoty:
  * $1 = 1 dzień
  * $7 = 7 dni
- Znajduje user_id po emailu z PayPal
- Oblicza expires_at = teraz + dni
- Zapisuje do premium_subscriptions (log płatności)
- UPSERT do user_subscriptions (ŹRÓDŁO PRAWDY):
  * subscription_type = "premium"
  * status = "active"
  * expires_at = obliczona data
```

**Krok 5:** Subskrypcja jest aktywna po webhook

## 🗄️ Struktura Bazy Danych

### Tabela: `user_subscriptions` (ŹRÓDŁO PRAWDY)

```sql
- id: UUID (primary key)
- user_id: UUID (foreign key → auth.users)
- subscription_type: VARCHAR ('free', 'trial', 'one_day', 'premium')
- status: VARCHAR ('active', 'expired', 'cancelled')
- starts_at: TIMESTAMP
- expires_at: TIMESTAMP (WAŻNE: sprawdzane przy weryfikacji)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- UNIQUE(user_id) - jeden użytkownik = jedna subskrypcja
```

**Uwaga:** Tabela ma UNIQUE constraint na `user_id`, więc zawsze jest tylko jedna aktywna subskrypcja na użytkownika.

### Tabela: `premium_subscriptions` (Log płatności)

```sql
- id: UUID
- email: VARCHAR (email z PayPal)
- paypal_order_id: VARCHAR (UNIQUE)
- amount: NUMERIC (kwota płatności)
- currency: VARCHAR (domyślnie 'USD')
- status: VARCHAR
- expires_at: TIMESTAMP
- payment_method: VARCHAR (domyślnie 'paypal')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**Uwaga:** To jest tylko log płatności. Rzeczywista subskrypcja jest w `user_subscriptions`.

## ✅ Gdzie i Jak Sprawdzana Jest Subskrypcja

### 1. Hook: `useAuth()` (`hooks/use-auth.ts`)

**Funkcja:** `hasActiveSubscription()`
```typescript
hasActiveSubscription = () => {
  if (!user) return false
  return subscription !== null 
    && subscription.status === "active" 
    && new Date(subscription.expires_at) > new Date()
}
```

**Gdzie używane:**
- `components/forex-signals.tsx` - sprawdza czy pokazać szczegóły sygnałów
- `app/economic-calendar/page.tsx` - sprawdza dostęp do premium features

**Zapytanie do bazy:**
```typescript
.from("user_subscriptions")
.select("*")
.eq("user_id", userId)
.eq("status", "active")
.gt("expires_at", new Date().toISOString())  // WAŻNE: sprawdza czy nie wygasła
.order("created_at", { ascending: false })
.limit(1)
.single()
```

### 2. Hook: `useSubscription()` (`hooks/useSubscription.ts`)

**Funkcja:** `isPremium`
```typescript
isPremium = subscription?.subscription_type === 'premium' 
  && subscription?.status === 'active' 
  && new Date(subscription.expires_at) > new Date()
```

**Gdzie używane:**
- `components/PremiumGate.tsx` - blokuje dostęp do premium features

**Zapytanie do bazy:**
```typescript
.from('user_subscriptions')
.select('subscription_type, status, expires_at')
.eq('user_id', user.id)
.single()
```

### 3. API Routes - Sprawdzanie Premium

**Przykład:** `app/api/economic-calendar/senate/route.ts`
```typescript
// Sprawdza czy użytkownik ma premium
const { data: subscription } = await supabase
  .from("user_subscriptions")
  .select("*")
  .eq("user_id", user.id)
  .eq("status", "active")
  .gt("expires_at", new Date().toISOString())  // Sprawdza wygaśnięcie
  .eq("subscription_type", "premium")  // Tylko premium
  .single()

if (!subscription) {
  return NextResponse.json(
    { error: "Premium subscription required" },
    { status: 403 }
  )
}
```

**Gdzie używane:**
- `/api/economic-calendar/dcf` - DCF Levered (tylko premium)
- `/api/economic-calendar/cot` - COT Analysis (tylko premium)
- `/api/economic-calendar/holidays` - Holidays (tylko premium)
- `/api/economic-calendar/indicators` - Indicators (tylko premium)
- `/api/economic-calendar/senate` - Senate Trading (tylko premium)

## 🔒 Jak Działa Ukrywanie Sygnałów

### Komponent: `components/forex-signals.tsx`

**Sprawdzanie dostępu:**
```typescript
const { hasActiveSubscription, user } = useAuth()
const hasAccess = hasActiveSubscription()
```

**Co jest ukrywane bez subskrypcji:**
1. **Entry Price** - cena wejścia
2. **Stop Loss** - poziom stop loss
3. **Take Profit (TP1, TP2, TP3)** - poziomy take profit
4. **Risk/Reward** - stosunek ryzyka do zysku
5. **Probability** - prawdopodobieństwo sukcesu

**Co jest widoczne bez subskrypcji:**
- Instrument (EURUSD, GBPUSD, etc.)
- Typ sygnału (BUY/SELL)
- Status (Active/Closed)
- Data utworzenia
- Podstawowe informacje

**Komunikaty:**
- **Nie zalogowany:** "Zaloguj się i aktywuj subskrypcję, aby zobaczyć Entry Price, Stop Loss, Take Profits..."
- **Zalogowany bez subskrypcji:** "Aktywuj subskrypcję, aby zobaczyć Entry Price, Risk/Reward, Probability..."

## ⏰ Kiedy Subskrypcja Się Włącza

### Trial
- **Natychmiast** po kliknięciu "Aktywuj Test"
- Nie wymaga płatności
- Aktywacja przez `POST /api/subscriptions/create`

### Premium
- **Po potwierdzeniu płatności przez PayPal webhook**
- Webhook przychodzi automatycznie po płatności
- Zwykle w ciągu kilku sekund po płatności
- Może zająć do 1-2 minut w rzadkich przypadkach

## 🔍 Kto Sprawdza Subskrypcję

### Frontend (Client-Side)
1. **`useAuth()` hook** - sprawdza przy każdym renderze komponentu
2. **`useSubscription()` hook** - sprawdza w PremiumGate
3. **Komponenty** - sprawdzają `hasActiveSubscription()` lub `isPremium()`

### Backend (Server-Side)
1. **API Routes** - sprawdzają przed zwróceniem danych premium
2. **PayPal Webhook** - aktualizuje subskrypcję po płatności

## 🚫 Czy Odcina Sygnały?

**NIE - Sygnały są zawsze widoczne, ale szczegóły są ukryte**

### Co jest widoczne bez subskrypcji:
- ✅ Lista wszystkich sygnałów
- ✅ Instrument (EURUSD, GBPUSD, etc.)
- ✅ Typ sygnału (BUY/SELL)
- ✅ Status (Active/Closed)
- ✅ Data utworzenia

### Co jest ukryte bez subskrypcji:
- ❌ Entry Price (cena wejścia)
- ❌ Stop Loss
- ❌ Take Profit (TP1, TP2, TP3)
- ❌ Risk/Reward ratio
- ❌ Probability (prawdopodobieństwo)

### Co jest ukryte bez Premium (tylko Trial):
- ❌ DCF Levered
- ❌ COT Analysis
- ❌ Holidays
- ❌ Indicators
- ❌ Senate Trading

## 📊 Logika Sprawdzania

### Warunki dla Aktywnej Subskrypcji:
1. ✅ Użytkownik jest zalogowany (`user !== null`)
2. ✅ Subskrypcja istnieje (`subscription !== null`)
3. ✅ Status = "active"
4. ✅ `expires_at > teraz` (nie wygasła)

### Warunki dla Premium:
1. ✅ Wszystkie warunki aktywnej subskrypcji
2. ✅ `subscription_type === "premium"`

### Warunki dla Trial:
1. ✅ Wszystkie warunki aktywnej subskrypcji
2. ✅ `subscription_type === "trial"`

## 🔄 Automatyczne Tworzenie Subskrypcji

### Przy Rejestracji:
```sql
-- Trigger w Supabase (scripts/supabase-schema.sql)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Funkcja tworzy:
1. user_profiles (profil użytkownika)
2. user_subscriptions (subskrypcja 'free', expires_at = NOW() + 100 lat)
```

**Domyślna subskrypcja:** `free` z wygaśnięciem za 100 lat (praktycznie na zawsze)

## ⚠️ Ważne Uwagi

1. **Źródło Prawdy:** Tabela `user_subscriptions` jest jedynym źródłem prawdy o subskrypcji
2. **Tabela `premium_subscriptions`:** To tylko log płatności PayPal, nie używa się do sprawdzania dostępu
3. **Sprawdzanie wygaśnięcia:** Zawsze sprawdzane jest `expires_at > NOW()` - subskrypcja automatycznie wygasa
4. **UNIQUE constraint:** Jeden użytkownik może mieć tylko jedną subskrypcję (UPSERT przy aktualizacji)
5. **PayPal Webhook:** Musi być skonfigurowany w PayPal Dashboard i wskazywać na `/api/paypal/webhook`

## 🔐 Bezpieczeństwo

1. **RLS (Row Level Security):** Użytkownicy widzą tylko swoje subskrypcje
2. **Weryfikacja PayPal:** Webhook weryfikuje podpis przed przetworzeniem
3. **Rate Limiting:** Wszystkie endpointy mają rate limiting
4. **Walidacja:** Wszystkie dane są walidowane przed zapisem

## 📝 Podsumowanie

- **Trial:** $0, 1 dzień, aktywacja natychmiastowa
- **Premium 1 dzień:** $1, aktywacja po PayPal webhook
- **Premium 7 dni:** $7, aktywacja po PayPal webhook
- **Sprawdzanie:** Frontend (hooks) + Backend (API routes)
- **Ukrywanie:** Szczegóły sygnałów ukryte, lista sygnałów widoczna
- **Źródło prawdy:** Tabela `user_subscriptions` w Supabase

