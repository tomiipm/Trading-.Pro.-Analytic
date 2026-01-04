import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Lista publicznych ścieżek, które nie wymagają logowania
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/signup',
  '/auth',
  '/privacy-policy',
  '/terms',
  '/about',
  '/contact',
  '/forex',
  '/economic-calendar',
  '/mobile-app',
  '/api',
]

export async function updateSession(request: NextRequest) {
  // Sprawdź, czy ścieżka jest publiczna
  const isPublicPath = PUBLIC_PATHS.some(path => 
    request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + '/')
  )

  // Jeśli ścieżka jest publiczna lub to API, pozwól na dostęp bez sprawdzania autoryzacji
  if (isPublicPath || request.nextUrl.pathname.startsWith('/api/')) {
    // Jeśli Supabase jest skonfigurowany, spróbuj odświeżyć sesję (ale nie wymuszaj)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        let supabaseResponse = NextResponse.next({
          request,
        })

        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          {
            cookies: {
              getAll() {
                return request.cookies.getAll()
              },
              setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                supabaseResponse = NextResponse.next({
                  request,
                })
                cookiesToSet.forEach(({ name, value, options }) =>
                  supabaseResponse.cookies.set(name, value, options)
                )
              },
            },
          }
        )

        // Odśwież sesję, ale nie wymuszaj logowania
        await supabase.auth.getUser().catch(() => {
          // Ignoruj błędy autoryzacji dla publicznych ścieżek
        })

        return supabaseResponse
      } catch (error) {
        // Jeśli wystąpi błąd z Supabase, po prostu kontynuuj bez autoryzacji
        return NextResponse.next()
      }
    }

    return NextResponse.next()
  }

  // Dla chronionych ścieżek, sprawdź autoryzację tylko jeśli Supabase jest skonfigurowany
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Jeśli Supabase nie jest skonfigurowany, pozwól na dostęp (dla rozwoju)
    return NextResponse.next()
  }

  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Jeśli użytkownik nie jest zalogowany, przekieruj do logowania
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    // Jeśli wystąpi błąd z Supabase, przekieruj do logowania
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
}

