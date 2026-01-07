# Folder Backend

## Status: Pusty - Nie używany

Ten folder jest obecnie pusty i **nie jest używany** przez aplikację.

## Architektura Aplikacji

Ta aplikacja używa **Next.js App Router** z wbudowanymi **API Routes**, które znajdują się w folderze `app/api/`.

### Gdzie są endpointy API?

Wszystkie endpointy API znajdują się w:
```
app/api/
├── auth/          # Autentykacja (login, signup, reset password)
├── paypal/        # Integracja PayPal
├── signals/       # Sygnały tradingowe
├── economic-calendar/  # Kalendarz ekonomiczny
├── profile/       # Profil użytkownika
├── subscriptions/ # Subskrypcje
└── chart/         # Wykresy
```

### Dlaczego nie ma osobnego backendu?

Next.js App Router pozwala na tworzenie API endpoints bezpośrednio w aplikacji Next.js:
- ✅ Wszystko w jednym projekcie
- ✅ Łatwiejsze wdrożenie
- ✅ Lepsza integracja z frontendem
- ✅ Serverless functions (Vercel, Netlify)

### Kiedy użyć osobnego backendu?

Osobny backend (folder `backend/`) byłby potrzebny, gdyby:
- Używać innego frameworka (Express, FastAPI, NestJS)
- Potrzebować długotrwałych połączeń (WebSockets)
- Mieć bardzo złożoną logikę biznesową wymagającą osobnego serwera
- Używać mikroserwisów

### Co zrobić z tym folderem?

**Opcja 1: Usunąć folder** (zalecane)
```bash
rm -rf backend
```

**Opcja 2: Zostawić pusty** (jeśli planujesz dodać backend w przyszłości)
- Folder może pozostać pusty
- Możesz dodać tutaj backend w przyszłości, jeśli będzie potrzebny

**Opcja 3: Dodać .gitkeep**
- Jeśli chcesz zachować folder w repozytorium, dodaj plik `.gitkeep`:
```bash
touch backend/.gitkeep
```

## Aktualna Architektura

```
┌─────────────────────────────────────┐
│     Next.js Application             │
│                                     │
│  ┌─────────────┐  ┌──────────────┐ │
│  │   Frontend  │  │  API Routes  │ │
│  │  (React)    │  │  (app/api/)  │ │
│  └─────────────┘  └──────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   External Services           │ │
│  │  - Supabase (Database/Auth)   │ │
│  │  - PayPal API                 │ │
│  │  - FMP API                    │ │
│  │  - Signals API                │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Podsumowanie

✅ **Folder `backend/` można bezpiecznie usunąć** - nie jest używany  
✅ **Wszystkie API endpoints są w `app/api/`**  
✅ **Aplikacja działa poprawnie bez tego folderu**

