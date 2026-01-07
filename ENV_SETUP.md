# Konfiguracja Zmiennych Środowiskowych

Ten dokument opisuje, jak skonfigurować zmienne środowiskowe dla aplikacji Trading Pro Analytic.

## 📋 Wymagane Zmienne Środowiskowe

### 1. Supabase Configuration

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Gdzie znaleźć:**
- Zaloguj się do [Supabase Dashboard](https://app.supabase.com)
- Wybierz swój projekt
- Przejdź do **Settings** → **API**
- Skopiuj:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ NIE udostępniaj tego klucza publicznie!)

### 2. Site URL Configuration (NOWE - WAŻNE!)

```bash
NEXT_PUBLIC_SITE_URL=https://trading-pro-analytic.com
```

**Dlaczego to ważne:**
- Używane do generowania linków w emailach (potwierdzenie konta, reset hasła)
- Używane do OAuth callbacks
- Używane do PayPal redirect URLs

**Ustawienia:**
- **Produkcja:** `https://trading-pro-analytic.com`
- **Development:** Możesz pominąć (aplikacja użyje `localhost:3000` automatycznie)

### 3. PayPal Configuration

```bash
PAYPAL_ENV=live
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id
```

**Gdzie znaleźć:**
- Zaloguj się do [PayPal Developer Dashboard](https://developer.paypal.com)
- Utwórz aplikację (lub użyj istniejącej)
- Skopiuj **Client ID** i **Secret**
- Dla webhook ID, utwórz webhook w PayPal i skopiuj jego ID

**Uwaga:** W produkcji zawsze używaj `PAYPAL_ENV=live`

### 4. Financial Modeling Prep API (Opcjonalne)

```bash
FMP_API_KEY=your_fmp_api_key
```

Używane do kalendarza ekonomicznego. Jeśli nie ustawisz, niektóre funkcje mogą nie działać.

## 🚀 Konfiguracja w Zależności od Hostingu

### Vercel

1. Przejdź do swojego projektu w [Vercel Dashboard](https://vercel.com)
2. Kliknij **Settings** → **Environment Variables**
3. Dodaj wszystkie zmienne z sekcji "Wymagane Zmienne Środowiskowe"
4. Upewnij się, że wybrałeś odpowiednie środowisko (Production, Preview, Development)
5. Kliknij **Save**
6. Zrestartuj deployment (Settings → Deployments → Redeploy)

### Netlify

1. Przejdź do swojego projektu w [Netlify Dashboard](https://app.netlify.com)
2. Kliknij **Site settings** → **Environment variables**
3. Dodaj wszystkie zmienne
4. Kliknij **Save**
5. Zrestartuj deployment (Deploys → Trigger deploy)

### Inne Hostingi (cPanel, VPS, itp.)

1. Utwórz plik `.env.local` w głównym katalogu projektu
2. Dodaj wszystkie zmienne w formacie:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_value
   NEXT_PUBLIC_SITE_URL=https://trading-pro-analytic.com
   ```
3. Upewnij się, że plik `.env.local` jest w `.gitignore` (nie commituj go!)
4. Zrestartuj aplikację

### Docker

1. Utwórz plik `.env` w głównym katalogu projektu
2. Dodaj wszystkie zmienne
3. W `docker-compose.yml` dodaj:
   ```yaml
   environment:
     - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
     - NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
     # ... pozostałe zmienne
   ```
4. Lub użyj `env_file: .env` w docker-compose.yml

## ✅ Weryfikacja Konfiguracji

Po ustawieniu zmiennych środowiskowych, sprawdź:

1. **Supabase Redirect URLs:**
   - Przejdź do Supabase Dashboard → Authentication → URL Configuration
   - Upewnij się, że są dodane:
     - `https://trading-pro-analytic.com/auth/callback`
     - `https://trading-pro-analytic.com/reset-password`
   - **Site URL** powinien być ustawiony na: `https://trading-pro-analytic.com`

2. **Testowanie:**
   - Spróbuj zarejestrować nowego użytkownika
   - Sprawdź, czy email z potwierdzeniem przychodzi z poprawnym linkiem
   - Spróbuj zresetować hasło
   - Sprawdź, czy link resetowania działa poprawnie

## 🔒 Bezpieczeństwo

⚠️ **NIGDY NIE COMMITUJ:**
- `.env.local`
- `.env`
- Plików zawierających klucze API

✅ **Zawsze dodawaj do `.gitignore`:**
```
.env.local
.env
.env*.local
```

## 📝 Przykładowy Plik .env.local

Skopiuj `.env.example` do `.env.local` i wypełnij wartościami:

```bash
cp .env.example .env.local
```

Następnie edytuj `.env.local` i dodaj swoje wartości.

## 🆘 Problemy?

Jeśli masz problemy z konfiguracją:

1. Sprawdź, czy wszystkie wymagane zmienne są ustawione
2. Sprawdź, czy wartości są poprawne (bez dodatkowych spacji)
3. Zrestartuj aplikację po zmianie zmiennych
4. Sprawdź logi aplikacji pod kątem błędów konfiguracji

