# Production Deployment Checklist - Trading Pro Analytic

## 🔴 KRYTYCZNE - WYMAGANE PRZED WDROŻENIEM

### 1. reCAPTCHA - WYMAGANE PRODUKCYJNE KLUCZE ⚠️
**Status:** ⚠️ Używa test keys jako fallback (tylko dla developmentu)
**Lokalizacja:** 
- `lib/recaptcha.ts` - linia 6-7
- `app/login/page.tsx` - linia 30
- `app/signup/page.tsx` - linia 27

**✅ WAŻNE:** reCAPTCHA jest **CAŁKOWICIE DARMOWE** - brak opłat!

**⚠️ DZIAŁANIE:**
1. Zarejestruj się na https://www.google.com/recaptcha/admin
2. Wybierz reCAPTCHA v2 "I'm not a robot" Checkbox
3. Dodaj domenę: `trading-pro-analytic.com` (i `www.trading-pro-analytic.com`)
4. Skopiuj klucze do `.env.local`:
   ```
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=twoj_prawdziwy_site_key
   RECAPTCHA_SECRET_KEY=twoj_prawdziwy_secret_key
   ```

**📖 Szczegółowa instrukcja:** Zobacz `RECAPTCHA_SETUP.md`

---

### 2. PayPal Integration - NIE ZAIMPLEMENTOWANE ⚠️
**Status:** ❌ TODO - brak integracji
**Lokalizacja:** `app/subscriptions/page.tsx` - linia 64

**Obecny stan:**
- Subskrypcje są aktywowane bezpośrednio (bez płatności)
- Komentarz: `// TODO: Integracja z PayPal - przekierowanie do płatności`

**⚠️ DZIAŁANIE:**
1. Utwórz konto PayPal Business
2. Skonfiguruj PayPal SDK
3. Dodaj zmienne środowiskowe:
   ```
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=twoj_paypal_client_id
   PAYPAL_CLIENT_SECRET=twoj_paypal_secret
   ```
4. Zaimplementuj płatności w `app/api/subscriptions/create/route.ts`

---

### 3. FMP API Key - PRZENIESIONY DO ZMIENNYCH ŚRODOWISKOWYCH ✅
**Status:** ✅ Klucz wymagany w zmiennych środowiskowych (bez fallback)
**Lokalizacja:** Wszystkie pliki w `app/api/economic-calendar/`

**✅ ZROBIONE:**
- Usunięto hardcoded klucz z kodu
- Klucz jest teraz wymagany w zmiennych środowiskowych
- Aplikacja zwróci błąd, jeśli klucz nie będzie ustawiony

**⚠️ DZIAŁANIE:**
1. Dodaj do `.env.local`:
   ```
   FMP_API_KEY=G1iuFutsBehNPt8vgEbCx2hXMrQzjYdh
   FMP_API_URL=https://financialmodelingprep.com/api/v3
   ```
2. Upewnij się, że klucz jest dodany na serwerze produkcyjnym

---

## ✅ PRODUKCYJNE - DZIAŁA

### 1. Supabase - PRODUKCYJNE ✅
**Status:** ✅ Prawdziwe dane produkcyjne
**Lokalizacja:** `ENV_SETUP.md`

**Obecne wartości:**
- URL: `https://dphmuweftyvabsxhtbyk.supabase.co`
- Anon Key: (w ENV_SETUP.md)
- Service Role Key: (w ENV_SETUP.md)

**✅ WERYFIKACJA:**
- Sprawdź czy to produkcyjne czy testowe środowisko Supabase
- Jeśli testowe - utwórz nowe produkcyjne środowisko

---

### 2. API Sygnałów - PRODUKCYJNE ✅
**Status:** ✅ Prawdziwe API produkcyjne
**Lokalizacja:** `app/api/signals/route.ts` - linia 5

**URL:** `https://api.signal.iplinseparable.com/api/signals`

**✅ DZIAŁA:** API jest produkcyjne i działa

---

### 3. Baza Danych - PRODUKCYJNA ✅
**Status:** ✅ Supabase PostgreSQL
**Lokalizacja:** `scripts/supabase-schema.sql`

**Tabele:**
- `user_subscriptions` - ✅
- `user_profiles` - ✅
- `premium_subscriptions` - ✅ (dla PayPal)

**✅ WERYFIKACJA:**
- Upewnij się, że wszystkie tabele są utworzone w produkcyjnej bazie
- Sprawdź RLS (Row Level Security) policies

---

## 📋 ZMIENNE ŚRODOWISKOWE - PRODUKCJA

### Wymagane zmienne dla produkcji:

```env
# Supabase (sprawdź czy produkcyjne)
NEXT_PUBLIC_SUPABASE_URL=https://dphmuweftyvabsxhtbyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj_anon_key
SUPABASE_SERVICE_ROLE_KEY=twoj_service_role_key

# API Sygnałów (produkcyjne)
SIGNALS_API_URL=https://api.signal.iplinseparable.com/api/signals
CHART_API_URL=https://api.signal.iplinseparable.com/api

# FMP API (sprawdź klucz)
FMP_API_URL=https://financialmodelingprep.com/api/v3
FMP_API_KEY=twoj_produkcyjny_klucz

# reCAPTCHA (WYMAGANE - produkcyjne klucze)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=twoj_produkcyjny_site_key
RECAPTCHA_SECRET_KEY=twoj_produkcyjny_secret_key

# PayPal (WYMAGANE - jeśli implementujesz płatności)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=twoj_paypal_client_id
PAYPAL_CLIENT_SECRET=twoj_paypal_secret
```

---

## 🔧 KONFIGURACJA SERWERA CONTABO

### 1. Node.js i PM2
```bash
# Zainstaluj Node.js (najlepiej przez nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# Zainstaluj PM2
npm install -g pm2
```

### 2. Build aplikacji
```bash
# Sklonuj repozytorium
git clone <twoje-repo>
cd professional-trading-signals

# Zainstaluj zależności
npm install

# Utwórz .env.local z produkcyjnymi wartościami
nano .env.local

# Zbuduj aplikację
npm run build
```

### 3. Uruchomienie z PM2
```bash
# Uruchom aplikację
pm2 start npm --name "trading-pro-analytic" -- start

# Zapisz konfigurację PM2
pm2 save
pm2 startup
```

### 4. Nginx Configuration
```nginx
server {
    listen 80;
    server_name trading-pro-analytic.com www.trading-pro-analytic.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5. SSL Certificate (Let's Encrypt)
```bash
# Zainstaluj certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Uzyskaj certyfikat
sudo certbot --nginx -d trading-pro-analytic.com -d www.trading-pro-analytic.com
```

---

## 🚨 PRZED WDROŻENIEM - CHECKLIST

- [ ] **reCAPTCHA:** Utworzono produkcyjne klucze i dodano do `.env.local`
- [ ] **PayPal:** Zaimplementowano integrację płatności (lub wyłączono subskrypcje premium)
- [ ] **FMP API:** Sprawdzono czy klucz jest produkcyjny
- [ ] **Supabase:** Zweryfikowano czy środowisko jest produkcyjne
- [ ] **Zmienne środowiskowe:** Wszystkie dodane do `.env.local` na serwerze
- [ ] **Baza danych:** Wszystkie tabele utworzone w produkcyjnej bazie
- [ ] **Domain:** DNS skonfigurowany (A record → IP serwera Contabo)
- [ ] **SSL:** Certyfikat SSL zainstalowany (Let's Encrypt)
- [ ] **Nginx:** Skonfigurowany reverse proxy
- [ ] **PM2:** Aplikacja uruchomiona i skonfigurowana do auto-restart
- [ ] **Firewall:** Porty 80, 443 otwarte, 3000 tylko lokalnie
- [ ] **Backup:** Skonfigurowany backup bazy danych Supabase
- [ ] **Monitoring:** Skonfigurowany monitoring (opcjonalnie)

---

## 📝 NOTATKI

### Obecne problemy:
1. **reCAPTCHA używa test keys** - wymaga natychmiastowej zmiany przed produkcją
2. **PayPal nie zaimplementowany** - subskrypcje premium działają bez płatności
3. **FMP API key hardcoded** - sprawdź czy produkcyjny

### Zalecenia:
1. Utwórz osobne środowisko Supabase dla produkcji
2. Użyj zmiennych środowiskowych zamiast hardcoded wartości
3. Dodaj logging i monitoring
4. Skonfiguruj backup automatyczny
5. Dodaj rate limiting dla API endpoints

---

## 🔗 PRZYDATNE LINKI

- Supabase Dashboard: https://supabase.com/dashboard
- Google reCAPTCHA: https://www.google.com/recaptcha/admin
- PayPal Developer: https://developer.paypal.com
- FMP API: https://financialmodelingprep.com/developer/docs
- Let's Encrypt: https://letsencrypt.org
- PM2 Documentation: https://pm2.keymetrics.io/docs

