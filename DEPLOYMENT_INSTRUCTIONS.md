# Instrukcje Wdrożenia - Trading Pro Analytic

## Co Zostało Naprawione

### 1. System Autentykacji
- ✅ Usunięto wymaganie potwierdzenia emaila z kodu logowania
- ✅ Naprawiono formularz resetowania hasła (zawsze się pokazuje)
- ✅ Naprawiono błąd kompilacji w stronie rejestracji

### 2. Konfiguracja
- ✅ Wszystkie zmienne środowiskowe w `.env.local`
- ✅ Port zmieniony na 5000 (dla Contabo)

### 3. Supabase
- ✅ Email confirmation wyłączone w panelu Supabase

## Pliki Zmienione

1. `/app/api/auth/login/route.ts` - usunięto sprawdzanie email_confirmed_at
2. `/app/reset-password/page.tsx` - formularz zawsze się pokazuje
3. `/app/signup/page.tsx` - naprawiono błąd kompilacji (duplicate data variable)
4. `/package.json` - zmieniono port na 5000
5. `/.env.local` - dodano wszystkie zmienne środowiskowe

## Wdrożenie na Contabo

### Krok 1: Backup
```bash
cd /path/to/your/app
cp -r . ../trading-pro-backup-$(date +%Y%m%d)
```

### Krok 2: Skopiuj Nowe Pliki
Skopiuj wszystkie pliki z tego folderu do Twojego serwera Contabo.

### Krok 3: Zainstaluj Zależności
```bash
npm install
```

### Krok 4: Zbuduj Aplikację
```bash
npm run build
```

### Krok 5: Restart PM2
```bash
pm2 restart trading-pro-analytic
# lub
pm2 restart all
```

### Krok 6: Sprawdź Logi
```bash
pm2 logs trading-pro-analytic
```

## Testowanie

### 1. Rejestracja
- Otwórz: `https://trading-pro-analytic.com/signup`
- Wypełnij formularz
- Rozwiąż reCAPTCHA
- Kliknij "Zarejestruj się"
- **Oczekiwany rezultat:** Przekierowanie do `/login` z komunikatem sukcesu

### 2. Logowanie
- Otwórz: `https://trading-pro-analytic.com/login`
- Wpisz email i hasło
- Rozwiąż reCAPTCHA
- Kliknij "Zaloguj się"
- **Oczekiwany rezultat:** Przekierowanie do strony głównej jako zalogowany użytkownik

### 3. Reset Hasła
- Otwórz: `https://trading-pro-analytic.com/forgot-password`
- Wpisz email
- Kliknij "Wyślij link resetujący"
- Sprawdź email
- Kliknij link z emaila
- **Oczekiwany rezultat:** Formularz do wpisania nowego hasła
- Wpisz nowe hasło
- Kliknij "Zmień hasło"
- **Oczekiwany rezultat:** Przekierowanie do `/login` z komunikatem sukcesu

## Konfiguracja Supabase

### Redirect URLs
Upewnij się że w panelu Supabase (Authentication → URL Configuration) masz:

**Redirect URLs:**
- `https://trading-pro-analytic.com/auth/callback`
- `http://localhost:5000/auth/callback` (dla development)

**Site URL:**
- `https://trading-pro-analytic.com`

### Email Templates
W panelu Supabase (Authentication → Email Templates) sprawdź:

**Confirm signup:**
- Disabled (wyłączone)

**Reset password:**
- Enabled (włączone)
- Redirect URL: `https://trading-pro-analytic.com/reset-password`

## Troubleshooting

### Problem: "Cannot login"
**Rozwiązanie:**
1. Sprawdź czy w Supabase "Confirm email" jest wyłączone
2. Sprawdź czy użytkownik istnieje w tabeli `auth.users`
3. Sprawdź logi PM2: `pm2 logs`

### Problem: "Reset password nie działa"
**Rozwiązanie:**
1. Sprawdź czy redirect URL w Supabase jest poprawny
2. Sprawdź czy email przychodzi (sprawdź spam)
3. Sprawdź logi PM2

### Problem: "reCAPTCHA error"
**Rozwiązanie:**
1. Sprawdź czy klucze reCAPTCHA są poprawne w `.env.local`
2. Sprawdź czy domena jest dodana w Google reCAPTCHA console

## Wsparcie

Jeśli masz problemy:
1. Sprawdź logi: `pm2 logs trading-pro-analytic`
2. Sprawdź czy port 5000 jest wolny: `lsof -i :5000`
3. Sprawdź czy wszystkie zmienne środowiskowe są ustawione

## Zmienne Środowiskowe

Plik `.env.local` zawiera wszystkie niezbędne zmienne. **NIE commituj tego pliku do git!**

Dodaj do `.gitignore`:
```
.env.local
.env*.local
```
