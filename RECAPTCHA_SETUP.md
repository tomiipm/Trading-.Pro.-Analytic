# reCAPTCHA Setup Guide

## ✅ reCAPTCHA jest DARMOWE!

Google reCAPTCHA jest całkowicie darmowe dla wszystkich użytkowników. Nie ma żadnych opłat ani limitów dla standardowego użycia.

## Krok po kroku - Konfiguracja reCAPTCHA

### 1. Zarejestruj się w Google reCAPTCHA
- Przejdź na: https://www.google.com/recaptcha/admin
- Zaloguj się kontem Google

### 2. Utwórz nową stronę
- Kliknij "+" (Create) w prawym górnym rogu
- Wypełnij formularz:
  - **Label:** Trading Pro Analytic (lub dowolna nazwa)
  - **reCAPTCHA type:** Wybierz **reCAPTCHA v2** → **"I'm not a robot" Checkbox**
  - **Domains:** Dodaj:
    - `trading-pro-analytic.com`
    - `www.trading-pro-analytic.com`
    - `localhost` (dla testów lokalnych - opcjonalnie)
  - Zaakceptuj warunki użytkowania
  - Kliknij **Submit**

### 3. Skopiuj klucze
Po utworzeniu strony zobaczysz:
- **Site Key** (klucz publiczny)
- **Secret Key** (klucz prywatny)

### 4. Dodaj klucze do `.env.local`
```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=twoj_site_key_tutaj
RECAPTCHA_SECRET_KEY=twoj_secret_key_tutaj
```

### 5. Restart aplikacji
Po dodaniu kluczy zrestartuj aplikację, aby załadować nowe zmienne środowiskowe.

## Ważne informacje

- ✅ **Darmowe** - brak opłat
- ✅ **Bez limitów** - dla standardowego użycia
- ✅ **Bezpieczne** - ochrona przed botami
- ⚠️ **Wymagane** - aplikacja nie będzie działać poprawnie bez produkcyjnych kluczy

## Testowanie

Dla testów lokalnych możesz użyć Google test keys (zawsze przechodzą weryfikację):
- Site Key: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- Secret Key: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

**UWAGA:** W produkcji MUSISZ używać prawdziwych kluczy!

## Wsparcie

Jeśli masz problemy:
- Dokumentacja: https://developers.google.com/recaptcha/docs/display
- FAQ: https://developers.google.com/recaptcha/docs/faq

