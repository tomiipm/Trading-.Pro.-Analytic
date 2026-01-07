import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/lib/i18n/context"
import { Toaster } from "sonner"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ErrorBoundary } from "@/components/error-boundary"
import { validateEnvironmentVariables } from "@/lib/config"

const inter = Inter({ subsets: ["latin"] })

// Validate environment variables at startup (only in production)
if (process.env.NODE_ENV === "production") {
  const validation = validateEnvironmentVariables()
  if (!validation.isValid) {
    console.error(
      `[FATAL] Missing required environment variables: ${validation.missing.join(", ")}`
    )
    // In production, we should fail fast if required env vars are missing
    // But we'll just log the error to avoid breaking the app
    // The app will handle missing vars gracefully in each component
  }
}

export const metadata: Metadata = {
  title: "Trading Pro Analytic - Professional Trading Signals | AI-Powered Forex Signals",
  description: "Profesjonalne sygnały handlowe generowane przez zaawansowaną sztuczną inteligencję. Real-time forex signals, kalendarz ekonomiczny i analiza rynków finansowych. Handel z precyzją AI.",
  keywords: "trading signals, forex signals, AI trading, sztuczna inteligencja, sygnały handlowe, forex, trading, machine learning, deep learning, kalendarz ekonomiczny, analiza techniczna",
  authors: [{ name: "Trading Pro Analytic" }],
  creator: "Trading Pro Analytic",
  publisher: "Trading Pro Analytic",
  robots: "index, follow",
  metadataBase: new URL("https://trading-pro-analytic.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-dark-32x32.png", type: "image/png", sizes: "32x32", media: "(prefers-color-scheme: dark)" },
      { url: "/icon-light-32x32.png", type: "image/png", sizes: "32x32", media: "(prefers-color-scheme: light)" },
      { url: "/logo.png", type: "image/png", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Trading Pro Analytic - Professional Trading Signals",
    description: "Real-time trading signals with advanced AI and machine learning",
    type: "website",
    locale: "pl_PL",
    url: "https://trading-pro-analytic.com",
    siteName: "Trading Pro Analytic",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trading Pro Analytic - Professional Trading Signals",
    description: "Real-time trading signals with advanced AI and machine learning",
  },
  alternates: {
    canonical: "https://trading-pro-analytic.com",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <I18nProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <ErrorBoundary>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster position="top-right" />
            </ErrorBoundary>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
