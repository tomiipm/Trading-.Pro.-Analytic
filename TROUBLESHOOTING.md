# Rozwiązywanie problemów z rejestracją

## Najczęstsze problemy i rozwiązania

### 1. Błąd: "Missing Supabase environment variables"

**Problem:** Brakuje zmiennych środowiskowych Supabase.

**Rozwiązanie:**
1. Utwórz plik `.env.local` w głównym katalogu projektu
2. Dodaj następujące zmienne:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://dphmuweftyvabsxhtbyk.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Zrestartuj serwer deweloperski (`npm run dev`)

### 2. Błąd: "This email is already registered"

**Problem:** Próbujesz zarejestrować się na email, który już istnieje w bazie.

**Rozwiązanie:**
- Użyj innego adresu email
- Lub spróbuj się zalogować, jeśli masz już konto

### 3. Błąd: "Please complete the reCAPTCHA verification"

**Problem:** reCAPTCHA nie została ukończona lub nie jest skonfigurowana.

**Rozwiązanie:**
- Jeśli reCAPTCHA jest widoczna, zaznacz checkbox "Nie jestem robotem"
- Jeśli reCAPTCHA nie jest widoczna i chcesz ją włączyć:
  1. Zdobądź klucze z https://www.google.com/recaptcha/admin
  2. Dodaj do `.env.local`:
     ```env
     NEXT_PUBLIC_RECAPTCHA_SITE_KEY=twoj_site_key
     RECAPTCHA_SECRET_KEY=twoj_secret_key
     ```
  3. Zrestartuj serwer

### 4. Błąd: "Database connection error"

**Problem:** Problem z połączeniem do Supabase.

**Rozwiązanie:**
- Sprawdź, czy klucze Supabase są poprawne
- Sprawdź, czy masz połączenie z internetem
- Sprawdź, czy projekt Supabase jest aktywny

### 5. Błąd: "Invalid email or password format"

**Problem:** Format emaila lub hasła jest nieprawidłowy.

**Rozwiązanie:**
- Email musi być w formacie: `example@domain.com`
- Hasło musi mieć minimum 6 znaków

### 6. Błąd: "An error occurred during signup"

**Problem:** Ogólny błąd serwera.

**Rozwiązanie:**
- Sprawdź konsolę przeglądarki (F12) dla szczegółów błędu
- Sprawdź logi serwera deweloperskiego
- Upewnij się, że wszystkie zmienne środowiskowe są ustawione
- Sprawdź, czy schemat bazy danych został uruchomiony w Supabase

## Sprawdzanie konfiguracji

### Sprawdź zmienne środowiskowe:

1. Otwórz `.env.local` w głównym katalogu projektu
2. Upewnij się, że masz wszystkie wymagane zmienne:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (opcjonalne dla niektórych funkcji)

### Sprawdź schemat bazy danych:

1. Otwórz Supabase Dashboard
2. Przejdź do SQL Editor
3. Uruchom skrypt z `scripts/supabase-schema.sql`
4. Upewnij się, że tabele zostały utworzone:
   - `user_profiles`
   - `user_subscriptions`
   - `premium_subscriptions` (opcjonalne)

### Sprawdź logi:

1. Otwórz konsolę przeglądarki (F12)
2. Sprawdź zakładkę "Console" dla błędów JavaScript
3. Sprawdź zakładkę "Network" dla błędów API
4. Sprawdź logi serwera deweloperskiego w terminalu

## Kontakt

Jeśli problem nadal występuje, skontaktuj się z support@trading-pro-analytic.com


