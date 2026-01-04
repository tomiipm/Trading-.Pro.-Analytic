# Konfiguracja Lokalnej Domeny

Aby uruchomić stronę lokalnie pod domeną `trading-pro-analytic.com`, wykonaj następujące kroki:

## Krok 1: Edycja pliku hosts (wymaga uprawnień administratora)

1. Otwórz Notatnik (lub inny edytor tekstu) **jako administrator**:
   - Kliknij prawym przyciskiem na Notatnik
   - Wybierz "Uruchom jako administrator"

2. Otwórz plik hosts:
   - Naciśnij `Ctrl + O`
   - Przejdź do: `C:\Windows\System32\drivers\etc\`
   - Zmień typ pliku na "Wszystkie pliki (*.*)"
   - Wybierz plik `hosts`

3. Dodaj na końcu pliku następującą linię:
   ```
   127.0.0.1    trading-pro-analytic.com
   ```

4. Zapisz plik (`Ctrl + S`)

## Krok 2: Uruchomienie serwera

Serwer Next.js jest już uruchomiony na porcie 3000.

## Krok 3: Otwarcie strony w przeglądarce

Otwórz przeglądarkę i przejdź do:
- **http://trading-pro-analytic.com:3000**

Lub jeśli chcesz użyć portu 80 (bez :3000):
- **http://trading-pro-analytic.com**

(Uwaga: port 80 wymaga uprawnień administratora do uruchomienia serwera)

## Alternatywa: Użycie localhost z konfiguracją

Jeśli nie możesz edytować pliku hosts, możesz użyć:
- **http://localhost:3000**

Ale niektóre funkcje mogą nie działać poprawnie, jeśli kod oczekuje domeny `trading-pro-analytic.com`.

