# reCAPTCHA - Konfiguracja Produkcyjna

## ✅ Co zostało zrobione:

1. **Włączono reCAPTCHA we wszystkich formularzach:**
   - ✅ Login (`/login`)
   - ✅ Rejestracja (`/signup`)
   - ✅ Reset hasła - zapomniane (`/forgot-password`)
   - ✅ Reset hasła - ustawienie nowego (`/reset-password`)

2. **Włączono weryfikację po stronie serwera:**
   - ✅ API `/api/auth/login`
   - ✅ API `/api/auth/signup`
   - ✅ API `/api/auth/forgot-password`
   - ✅ API `/api/auth/reset-password`

3. **Zaktualizowano schematy walidacji:**
   - ✅ `recaptchaToken` jest teraz **wymagany** (nie opcjonalny)
   - ✅ Walidacja w `lib/validation.ts`

4. **Dodano tłumaczenia dla wszystkich języków:**
   - ✅ Polski (pl)
   - ✅ Angielski (en)
   - ✅ Niemiecki (de)
   - ✅ Francuski (fr)
   - ✅ Hiszpański (es)
   - ✅ Włoski (it)
   - ✅ Portugalski (pt)
   - ✅ Rosyjski (ru)
   - ✅ Chiński (zh-CN)
   - ✅ Japoński (ja)

## 🔑 Wymagane Zmienne Środowiskowe:

### 1. Frontend (Publiczne):
```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=twoj_klucz_site_key_z_google
```

### 2. Backend (Prywatne):
```env
RECAPTCHA_SECRET_KEY=twoj_klucz_secret_key_z_google
```

## 📝 Jak uzyskać klucze reCAPTCHA:

1. **Przejdź do Google reCAPTCHA Admin Console:**
   - https://www.google.com/recaptcha/admin

2. **Utwórz nową witrynę:**
   - Label: `Trading Pro Analytic Production`
   - reCAPTCHA type: **reCAPTCHA v2** → "I'm not a robot" Checkbox
   - Domains: `trading-pro-analytic.com` (i ewentualnie `www.trading-pro-analytic.com`)

3. **Skopiuj klucze:**
   - **Site Key** → użyj jako `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - **Secret Key** → użyj jako `RECAPTCHA_SECRET_KEY`

## ⚙️ Konfiguracja w Vercel/Netlify:

### Vercel:
1. Przejdź do projektu w Vercel Dashboard
2. Settings → Environment Variables
3. Dodaj:
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (Production)
   - `RECAPTCHA_SECRET_KEY` (Production)

### Netlify:
1. Przejdź do projektu w Netlify Dashboard
2. Site settings → Environment variables
3. Dodaj:
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - `RECAPTCHA_SECRET_KEY`

## 🔒 Bezpieczeństwo:

1. **Site Key (NEXT_PUBLIC_*):**
   - ✅ Może być publiczny (widoczny w kodzie frontend)
   - ✅ Używany do renderowania widgetu reCAPTCHA

2. **Secret Key:**
   - ⚠️ **NIGDY** nie udostępniaj publicznie
   - ⚠️ Tylko w zmiennych środowiskowych serwera
   - ⚠️ Używany do weryfikacji tokenu po stronie serwera

## ✅ Testowanie:

1. **Sprawdź czy widget się wyświetla:**
   - Otwórz `/login`, `/signup`, `/forgot-password`, `/reset-password`
   - Powinien pojawić się widget "Nie jestem robotem"

2. **Sprawdź czy weryfikacja działa:**
   - Spróbuj wysłać formularz bez zaznaczenia reCAPTCHA
   - Powinien pojawić się błąd: "Please complete the reCAPTCHA verification"
   - Zaznacz reCAPTCHA i wyślij ponownie - powinno działać

3. **Sprawdź logi serwera:**
   - Jeśli weryfikacja się nie powiedzie, w logach pojawi się: "reCAPTCHA verification failed"

## 🐛 Rozwiązywanie problemów:

### Widget się nie wyświetla:
- ✅ Sprawdź czy `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` jest ustawione
- ✅ Sprawdź czy domena jest dodana w Google reCAPTCHA Console
- ✅ Sprawdź konsolę przeglądarki pod kątem błędów

### Weryfikacja zawsze się nie powiedzie:
- ✅ Sprawdź czy `RECAPTCHA_SECRET_KEY` jest ustawione
- ✅ Sprawdź czy klucz secret jest poprawny
- ✅ Sprawdź logi serwera

### Błąd "reCAPTCHA verification failed":
- ✅ Sprawdź czy token nie wygasł (tokeny reCAPTCHA wygasają po ~2 minutach)
- ✅ Sprawdź czy domena w Google reCAPTCHA Console jest poprawna
- ✅ Sprawdź czy nie używasz testowych kluczy w produkcji

## 📋 Checklist przed wdrożeniem:

- [ ] Utworzono witrynę w Google reCAPTCHA Console
- [ ] Dodano domenę produkcyjną (`trading-pro-analytic.com`)
- [ ] Skopiowano Site Key i Secret Key
- [ ] Dodano `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` do zmiennych środowiskowych
- [ ] Dodano `RECAPTCHA_SECRET_KEY` do zmiennych środowiskowych
- [ ] Przetestowano na środowisku staging/preview
- [ ] Sprawdzono czy widget się wyświetla
- [ ] Sprawdzono czy weryfikacja działa poprawnie

## 🎯 Status:

✅ **reCAPTCHA jest włączone i gotowe do produkcji!**

Wszystkie formularze wymagają teraz weryfikacji reCAPTCHA przed wysłaniem. Upewnij się, że dodałeś odpowiednie klucze do zmiennych środowiskowych przed wdrożeniem.

