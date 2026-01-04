# Deployment Guide - Contabo Server

## Quick Start - Wdrożenie na Contabo

### 1. Przygotowanie serwera

```bash
# Aktualizacja systemu
sudo apt update && sudo apt upgrade -y

# Instalacja Node.js (przez nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Instalacja PM2
npm install -g pm2

# Instalacja Nginx
sudo apt install nginx -y
```

### 2. Konfiguracja aplikacji

```bash
# Sklonuj repozytorium
cd /var/www
git clone <twoje-repo-url> trading-pro-analytic
cd trading-pro-analytic

# Zainstaluj zależności
npm install

# Utwórz plik .env.local
nano .env.local
```

**Zawartość `.env.local` (PRODUKCJA):**
```env
# Supabase - SPRAWDŹ CZY PRODUKCYJNE!
NEXT_PUBLIC_SUPABASE_URL=https://dphmuweftyvabsxhtbyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj_produkcyjny_anon_key
SUPABASE_SERVICE_ROLE_KEY=twoj_produkcyjny_service_role_key

# API Sygnałów (produkcyjne)
SIGNALS_API_URL=https://api.signal.iplinseparable.com/api/signals
CHART_API_URL=https://api.signal.iplinseparable.com/api

# FMP API - SPRAWDŹ KLUCZ!
FMP_API_URL=https://financialmodelingprep.com/api/v3
FMP_API_KEY=twoj_produkcyjny_fmp_key

# reCAPTCHA - WYMAGANE PRODUKCYJNE KLUCZE!
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=twoj_produkcyjny_site_key
RECAPTCHA_SECRET_KEY=twoj_produkcyjny_secret_key

# PayPal (jeśli zaimplementowane)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=twoj_paypal_client_id
PAYPAL_CLIENT_SECRET=twoj_paypal_secret

# Next.js
NODE_ENV=production
```

### 3. Build i uruchomienie

```bash
# Build aplikacji
npm run build

# Uruchom z PM2
pm2 start npm --name "trading-pro-analytic" -- start
pm2 save
pm2 startup
```

### 4. Konfiguracja Nginx

```bash
sudo nano /etc/nginx/sites-available/trading-pro-analytic
```

**Zawartość:**
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

```bash
# Aktywuj konfigurację
sudo ln -s /etc/nginx/sites-available/trading-pro-analytic /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL Certificate

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d trading-pro-analytic.com -d www.trading-pro-analytic.com
```

### 6. Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 7. DNS Configuration

W panelu DNS domeny dodaj:
- **A Record:** `@` → IP serwera Contabo
- **A Record:** `www` → IP serwera Contabo

---

## 🔄 Aktualizacja aplikacji

```bash
cd /var/www/trading-pro-analytic
git pull
npm install
npm run build
pm2 restart trading-pro-analytic
```

---

## 📊 Monitoring

```bash
# Status aplikacji
pm2 status

# Logi
pm2 logs trading-pro-analytic

# Monitorowanie w czasie rzeczywistym
pm2 monit
```

---

## 🚨 Troubleshooting

### Aplikacja nie startuje
```bash
pm2 logs trading-pro-analytic --lines 50
```

### Błąd połączenia z bazą
- Sprawdź zmienne środowiskowe w `.env.local`
- Sprawdź czy Supabase pozwala na połączenia z IP serwera

### Błąd reCAPTCHA
- Sprawdź czy klucze są produkcyjne
- Sprawdź czy domena jest dodana w Google reCAPTCHA

---

## ✅ Final Checklist

- [ ] Node.js 20 zainstalowany
- [ ] PM2 zainstalowany i skonfigurowany
- [ ] Nginx skonfigurowany
- [ ] SSL certyfikat zainstalowany
- [ ] `.env.local` z produkcyjnymi wartościami
- [ ] Aplikacja zbudowana (`npm run build`)
- [ ] PM2 uruchomiony (`pm2 start`)
- [ ] DNS skonfigurowany
- [ ] Firewall skonfigurowany
- [ ] Test strony: https://trading-pro-analytic.com

