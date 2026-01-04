# Environment Variables Setup

Utwórz plik `.env.local` w głównym katalogu projektu z następującymi zmiennymi:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://dphmuweftyvabsxhtbyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwaG11d2VmdHl2YWJzeGh0YnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMzI1NTQsImV4cCI6MjA4MjcwODU1NH0.MdlWUeXbuTFReEKxVqXaFlarZVH-9jQI9n-7C5X35dc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwaG11d2VmdHl2YWJzeGh0YnlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzEzMjU1NCwiZXhwIjoyMDgyNzA4NTU0fQ.25hOnH_YlmA2zy0Ck3-3Qo-e0_4IrHfox9SkhXdB5kI

# API Configuration (Hidden from users - server-side only)
SIGNALS_API_URL=https://api.signal.iplinseparable.com/api/signals
CHART_API_URL=https://api.signal.iplinseparable.com/api
FMP_API_URL=https://financialmodelingprep.com/api/v3
FMP_API_KEY=G1iuFutsBehNPt8vgEbCx2hXMrQzjYdh

# reCAPTCHA Configuration (Required - for bot protection)
# ✅ reCAPTCHA jest DARMOWE - nie ma żadnych opłat!
# Klucze produkcyjne są już ustawione w kodzie jako fallback
# Możesz je nadpisać przez zmienne środowiskowe:
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Ldpjj0sAAAAAEf479CD34Cs3JhqGOWM_ZHOWmJ7
RECAPTCHA_SECRET_KEY=6Ldpjj0sAAAAAOQFdhU_LPNSjVPwJ5STSCiITKXZ

# PayPal Configuration (Required - for payment processing)
# Get your credentials from: https://developer.paypal.com
# For testing, use Sandbox credentials
# For production, use Live credentials
PAYPAL_ENV=sandbox
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id
```

## Instrukcje:

1. Skopiuj powyższą zawartość
2. Utwórz plik `.env.local` w głównym katalogu projektu
3. Wklej zawartość do pliku
4. Zapisz plik

**UWAGA:** Plik `.env.local` jest w `.gitignore` i nie będzie commitowany do repozytorium.

