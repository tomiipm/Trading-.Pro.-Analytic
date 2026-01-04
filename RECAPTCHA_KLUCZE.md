# reCAPTCHA - Który Klucz Gdzie Wpisać?

## Masz DWA klucze reCAPTCHA:

### 1. **Site Key (Klucz Witryny)** - PUBLICZNY
**Klucz:** `6Ldpjj0sAAAAAEf479CD34Cs3JhqGOWM_ZHOWmJ7`

**Gdzie wpisać:**
```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Ldpjj0sAAAAAEf479CD34Cs3JhqGOWM_ZHOWmJ7
```

**Co to jest:**
- To jest klucz PUBLICZNY (widoczny w HTML)
- Używany w przeglądarce użytkownika
- Nazwa zaczyna się od `NEXT_PUBLIC_` bo jest widoczny po stronie klienta

---

### 2. **Secret Key (Tajny Klucz)** - PRYWATNY
**Klucz:** `6Ldpjj0sAAAAAOQFdhU_LPNSjVPwJ5STSCiITKXZ`

**Gdzie wpisać:**
```env
RECAPTCHA_SECRET_KEY=6Ldpjj0sAAAAAOQFdhU_LPNSjVPwJ5STSCiITKXZ
```

**Co to jest:**
- To jest klucz PRYWATNY (tajny, nie widoczny)
- Używany tylko na serwerze do weryfikacji
- NIE zaczyna się od `NEXT_PUBLIC_` bo jest tylko po stronie serwera

---

## 📝 Pełna zawartość pliku `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://dphmuweftyvabsxhtbyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwaG11d2VmdHl2YWJzeGh0YnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMzI1NTQsImV4cCI6MjA4MjcwODU1NH0.MdlWUeXbuTFReEKxVqXaFlarZVH-9jQI9n-7C5X35dc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwaG11d2VmdHl2YWJzeGh0YnlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzEzMjU1NCwiZXhwIjoyMDgyNzA4NTU0fQ.25hOnH_YlmA2zy0Ck3-3Qo-e0_4IrHfox9SkhXdB5kI

# API Configuration
SIGNALS_API_URL=https://api.signal.iplinseparable.com/api/signals
CHART_API_URL=https://api.signal.iplinseparable.com/api
FMP_API_URL=https://financialmodelingprep.com/api/v3
FMP_API_KEY=G1iuFutsBehNPt8vgEbCx2hXMrQzjYdh

# reCAPTCHA Configuration
# Site Key (klucz witryny) - PUBLICZNY
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Ldpjj0sAAAAAEf479CD34Cs3JhqGOWM_ZHOWmJ7

# Secret Key (tajny klucz) - PRYWATNY
RECAPTCHA_SECRET_KEY=6Ldpjj0sAAAAAOQFdhU_LPNSjVPwJ5STSCiITKXZ
```

---

## ✅ Podsumowanie:

| Co | Klucz | Zmienna środowiskowa |
|---|---|---|
| **Site Key** (klucz witryny) | `6Ldpjj0sAAAAAEf479CD34Cs3JhqGOWM_ZHOWmJ7` | `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` |
| **Secret Key** (tajny klucz) | `6Ldpjj0sAAAAAOQFdhU_LPNSjVPwJ5STSCiITKXZ` | `RECAPTCHA_SECRET_KEY` |

---

## 🔍 Jak rozpoznać który to który?

W Google reCAPTCHA Admin:
- **Site Key** = "Klucz witryny" / "Site Key" - ten który jest wyświetlany w HTML
- **Secret Key** = "Tajny klucz" / "Secret Key" - ten który jest używany do weryfikacji

**Zapamiętaj:**
- `NEXT_PUBLIC_` = PUBLICZNY (widoczny w przeglądarce)
- Bez `NEXT_PUBLIC_` = PRYWATNY (tylko na serwerze)

