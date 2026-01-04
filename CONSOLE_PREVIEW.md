# Podgląd Konsoli - Trading Pro Analytic

## Status Serwera

**Serwer Next.js działa:**
- ✅ Port: 3000
- ✅ PID: 22984
- ✅ URL: http://localhost:3000
- ✅ URL z domeną: http://trading-pro-analytic.com:3000

## Jak sprawdzić konsolę:

### 1. Konsola Przeglądarki (Client-side)
1. Otwórz stronę w przeglądarce: http://localhost:3000
2. Naciśnij **F12** lub **Ctrl+Shift+I** (Windows/Linux) / **Cmd+Option+I** (Mac)
3. Przejdź do zakładki **Console**
4. Zobaczysz logi JavaScript, błędy i ostrzeżenia

### 2. Konsola Serwera (Server-side)
Logi serwera Next.js są wyświetlane w terminalu, gdzie uruchomiłeś `npm run dev`.

Typowe logi:
- `✓ Ready in X ms` - serwer gotowy
- `○ Compiling /page` - kompilacja strony
- `✓ Compiled /page in X ms` - kompilacja zakończona
- Błędy kompilacji TypeScript/JavaScript
- Błędy API routes

### 3. Network Tab (Zakładka Sieć)
1. Otwórz DevTools (F12)
2. Przejdź do zakładki **Network**
3. Zobaczysz wszystkie żądania HTTP:
   - API calls (`/api/signals`, `/api/economic-calendar`, etc.)
   - Status codes (200, 404, 500, etc.)
   - Czas odpowiedzi
   - Rozmiar odpowiedzi

### 4. Typowe Logi w Aplikacji

#### Komponenty z logowaniem:
- **ForexChart**: `[ForexChart] Loading chart data...`
- **BackgroundSignalRunner**: Polling sygnałów co 30 sekund
- **ForexSignals**: Fetching signals from API

#### API Routes:
- `/api/signals` - pobieranie sygnałów handlowych
- `/api/economic-calendar` - kalendarz ekonomiczny
- `/api/auth/login` - logowanie użytkownika
- `/api/auth/signup` - rejestracja użytkownika

## Sprawdzanie błędów:

### Błędy w konsoli przeglądarki:
- Czerwone komunikaty = błędy JavaScript
- Żółte komunikaty = ostrzeżenia
- Błędy 404 = brakujące pliki/API endpoints
- Błędy 500 = błędy serwera

### Błędy w terminalu:
- Błędy kompilacji TypeScript
- Błędy importów
- Błędy API routes
- Błędy połączenia z bazą danych (Supabase)

## Debugowanie:

1. **Sprawdź konsolę przeglądarki** - błędy client-side
2. **Sprawdź terminal** - błędy server-side
3. **Sprawdź Network tab** - problemy z API
4. **Sprawdź zmienne środowiskowe** - `.env.local`

## Szybkie testy:

```bash
# Sprawdź czy serwer działa
curl http://localhost:3000

# Sprawdź API sygnałów
curl http://localhost:3000/api/signals

# Sprawdź status procesu
Get-Process -Id 22984
```

