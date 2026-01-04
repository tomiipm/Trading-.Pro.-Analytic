# PayPal Integration Guide

## Overview

Aplikacja używa PayPal do przetwarzania płatności za subskrypcje premium. Integracja składa się z dwóch głównych komponentów:

1. **Tworzenie zamówienia** (`/api/paypal/create-order`) - tworzy zamówienie PayPal i zwraca URL do płatności
2. **Webhook** (`/api/paypal/webhook`) - odbiera powiadomienia od PayPal o zakończonych płatnościach

## Konfiguracja

### 1. Zmienne środowiskowe

Dodaj następujące zmienne do `.env.local`:

```env
# PayPal Configuration
PAYPAL_ENV=sandbox  # lub "live" dla produkcji
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id

# Supabase Service Role Key (wymagany dla webhooka)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Konfiguracja PayPal Developer Dashboard

1. Zaloguj się do [PayPal Developer Dashboard](https://developer.paypal.com)
2. Utwórz aplikację (Sandbox dla testów, Live dla produkcji)
3. Skopiuj `Client ID` i `Secret`
4. Utwórz Webhook:
   - URL: `https://yourdomain.com/api/paypal/webhook`
   - Subskrybuj eventy:
     - `CHECKOUT.ORDER.APPROVED`
     - `PAYMENT.CAPTURE.COMPLETED`
   - Skopiuj `Webhook ID`

### 3. Baza danych

Tabela `premium_subscriptions` jest już utworzona w schemacie Supabase i służy do logowania płatności.

## Przepływ płatności

### 1. Użytkownik wybiera subskrypcję

```typescript
// app/subscriptions/page.tsx
const handleActivatePremium = async (days: number) => {
  const amount = days === 1 ? 1 : 7
  
  const response = await fetch("/api/paypal/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency: "USD", days }),
  })
  
  const { approvalUrl } = await response.json()
  window.location.href = approvalUrl // Przekierowanie do PayPal
}
```

### 2. PayPal przetwarza płatność

Użytkownik jest przekierowany do PayPal, gdzie:
- Loguje się i potwierdza płatność
- PayPal przekierowuje z powrotem do aplikacji (`/subscriptions?success=true`)

### 3. Webhook aktualizuje subskrypcję

PayPal wysyła webhook do `/api/paypal/webhook`, który:
1. Weryfikuje podpis webhooka
2. Znajduje użytkownika po emailu z PayPal
3. Zapisuje płatność do `premium_subscriptions`
4. Aktualizuje `user_subscriptions` (źródło prawdy)

## Cennik

- **$1** = 1 dzień premium
- **$7** = 7 dni premium

## Bezpieczeństwo

### Weryfikacja podpisu

Webhook weryfikuje każdą wiadomość od PayPal używając:
- `paypal-auth-algo`
- `paypal-cert-url`
- `paypal-transmission-id`
- `paypal-transmission-sig`
- `paypal-transmission-time`
- `PAYPAL_WEBHOOK_ID`

### Rate Limiting

Webhook nie używa rate limitingu, ponieważ:
- PayPal wysyła webhooki z zaufanych IP
- Każdy webhook jest weryfikowany podpisem
- Webhooki są idempotentne (można je bezpiecznie przetworzyć wielokrotnie)

## Testowanie

### Sandbox

1. Użyj Sandbox credentials w `.env.local`
2. Utwórz testowe konto w [PayPal Sandbox](https://developer.paypal.com/dashboard/accounts)
3. Użyj testowych kart kredytowych:
   - Visa: `4111111111111111`
   - CVV: dowolny 3-cyfrowy kod
   - Data wygaśnięcia: dowolna przyszła data

### Webhook Testing

PayPal udostępnia narzędzie do testowania webhooków:
1. Przejdź do Webhooks w Developer Dashboard
2. Kliknij "Send Test Event"
3. Wybierz event `CHECKOUT.ORDER.APPROVED`
4. Sprawdź logi aplikacji

## Troubleshooting

### Webhook nie działa

1. **Sprawdź URL webhooka** - musi być publicznie dostępny
2. **Sprawdź weryfikację podpisu** - upewnij się, że `PAYPAL_WEBHOOK_ID` jest poprawny
3. **Sprawdź logi** - webhook loguje wszystkie błędy

### Użytkownik nie został znaleziony

Webhook szuka użytkownika po emailu z PayPal. Upewnij się, że:
- Email w PayPal jest taki sam jak w `user_profiles`
- Użytkownik ma utworzony profil w bazie danych

### Subskrypcja nie została aktywowana

1. Sprawdź logi webhooka
2. Sprawdź, czy `user_subscriptions` zostało zaktualizowane
3. Sprawdź, czy `premium_subscriptions` zawiera wpis o płatności

## Produkcja

Przed wdrożeniem na produkcję:

1. ✅ Zmień `PAYPAL_ENV` na `live`
2. ✅ Użyj Live credentials z PayPal
3. ✅ Zaktualizuj Webhook URL na produkcję
4. ✅ Przetestuj pełny przepływ płatności
5. ✅ Skonfiguruj monitoring i alerty

## API Endpoints

### POST `/api/paypal/create-order`

Tworzy zamówienie PayPal.

**Request:**
```json
{
  "amount": 1,
  "currency": "USD",
  "days": 1
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "5O190127TN364715T",
  "approvalUrl": "https://www.sandbox.paypal.com/checkoutnow?token=..."
}
```

### POST `/api/paypal/webhook`

Odbiera webhooki od PayPal (tylko dla PayPal, nie dla użytkowników).

**Headers:**
- `paypal-auth-algo`
- `paypal-cert-url`
- `paypal-transmission-id`
- `paypal-transmission-sig`
- `paypal-transmission-time`

**Response:**
```json
{
  "success": true
}
```

