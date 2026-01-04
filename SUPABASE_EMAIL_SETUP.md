# Konfiguracja Custom Email w Supabase

Aby emaile autoryzacyjne przychodziły z Twojej domeny zamiast Supabase, musisz skonfigurować custom SMTP w Supabase Dashboard.

## Krok po kroku:

### 1. Zaloguj się do Supabase Dashboard
- Przejdź na: https://supabase.com/dashboard
- Wybierz swój projekt

### 2. Przejdź do ustawień Email
- W menu bocznym kliknij **Settings** (Ustawienia)
- Wybierz **Auth** (Autoryzacja)
- Przejdź do sekcji **Email Templates** (Szablony email)

### 3. Skonfiguruj Custom SMTP (opcjonalne, ale zalecane)
- W sekcji **SMTP Settings** kliknij **Enable Custom SMTP**
- Wypełnij następujące pola:
  - **Host**: smtp.twoja-domena.com (np. smtp.trading-pro-analytic.com)
  - **Port**: 587 (dla TLS) lub 465 (dla SSL)
  - **Username**: Twój email SMTP (np. noreply@trading-pro-analytic.com)
  - **Password**: Hasło do konta SMTP
  - **Sender email**: noreply@trading-pro-analytic.com
  - **Sender name**: Trading Pro Analytic

### 4. Dostawcy SMTP (przykłady):

#### Gmail (dla domeny Google Workspace):
- Host: `smtp.gmail.com`
- Port: `587`
- Username: `twoj-email@trading-pro-analytic.com`
- Password: Hasło aplikacji Gmail

#### SendGrid:
- Host: `smtp.sendgrid.net`
- Port: `587`
- Username: `apikey`
- Password: Twój API key z SendGrid

#### Mailgun:
- Host: `smtp.mailgun.org`
- Port: `587`
- Username: Twój Mailgun username
- Password: Twój Mailgun password

#### Resend (zalecane dla Next.js):
- Host: `smtp.resend.com`
- Port: `587`
- Username: `resend`
- Password: Twój Resend API key

### 5. Dostosuj szablony email

W sekcji **Email Templates** możesz dostosować:

#### Confirmation Email (Email potwierdzający):
```
Temat: Potwierdź swój email - Trading Pro Analytic

Treść:
Witaj!

Dziękujemy za rejestrację w Trading Pro Analytic.

Kliknij poniższy link, aby potwierdzić swój adres email:
{{ .ConfirmationURL }}

Jeśli nie rejestrowałeś się na naszej stronie, zignoruj tę wiadomość.

Pozdrawiamy,
Zespół Trading Pro Analytic
```

#### Magic Link Email:
```
Temat: Link do logowania - Trading Pro Analytic

Treść:
Witaj!

Kliknij poniższy link, aby zalogować się do Trading Pro Analytic:
{{ .ConfirmationURL }}

Ten link jest ważny przez 1 godzinę.

Jeśli nie prosiłeś o link do logowania, zignoruj tę wiadomość.

Pozdrawiamy,
Zespół Trading Pro Analytic
```

#### Password Reset Email:
```
Temat: Reset hasła - Trading Pro Analytic

Treść:
Witaj!

Otrzymaliśmy prośbę o reset hasła do Twojego konta w Trading Pro Analytic.

Kliknij poniższy link, aby zresetować hasło:
{{ .ConfirmationURL }}

Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość.

Pozdrawiamy,
Zespół Trading Pro Analytic
```

### 6. Zmień Site URL

W sekcji **URL Configuration**:
- **Site URL**: `https://trading-pro-analytic.com`
- **Redirect URLs**: Dodaj:
  - `https://trading-pro-analytic.com/auth/callback`
  - `https://trading-pro-analytic.com/**`

### 7. Testowanie

1. Zarejestruj nowe konto testowe
2. Sprawdź skrzynkę email
3. Upewnij się, że email przychodzi z Twojej domeny
4. Sprawdź, czy link działa poprawnie

## Uwagi:

- **Dla produkcji**: Użyj profesjonalnego dostawcy SMTP (Resend, SendGrid, Mailgun)
- **Dla rozwoju**: Możesz użyć Gmail, ale zalecane jest użycie Resend lub podobnego
- **DNS**: Upewnij się, że Twoja domena ma poprawnie skonfigurowane rekordy SPF, DKIM i DMARC
- **Rate Limits**: Sprawdź limity wysyłki emaili u Twojego dostawcy SMTP

## Rekomendacja: Resend

Resend jest doskonałym wyborem dla aplikacji Next.js:
- Darmowy plan: 3000 emaili/miesiąc
- Łatwa integracja z Next.js
- Dobra deliverability
- API-first approach

Aby skonfigurować Resend:
1. Zarejestruj się na: https://resend.com
2. Zweryfikuj swoją domenę
3. Użyj danych SMTP w Supabase:
   - Host: `smtp.resend.com`
   - Port: `587`
   - Username: `resend`
   - Password: Twój Resend API key


