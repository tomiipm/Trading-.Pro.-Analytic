"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { Mail, Copyright } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export function Footer() {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Logo showText={false} size="sm" />
            <p className="text-sm text-muted-foreground">
              {t.footer.description}
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@trading-pro-analytic.com" className="hover:text-primary transition-colors">
                  support@trading-pro-analytic.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/forex" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.forexSignals}
                </Link>
              </li>
              <li>
                <Link href="/economic-calendar" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.economicCalendar}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.about}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link href="/cookies-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.cookiePolicy}
                </Link>
              </li>
              <li>
                <Link href="/mobile-app" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.mobileApp}
                </Link>
              </li>
              <li>
                <Link href="/mobile-app/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.mobileAppPrivacy}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Trading Pro Analytic. {t.footer.copyright}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-end text-sm text-muted-foreground">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                {t.footer.privacyPolicy}
              </Link>
              <span className="hidden md:inline">•</span>
              <Link href="/cookies-policy" className="hover:text-primary transition-colors">
                {t.footer.cookiePolicy}
              </Link>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            {t.footer.riskWarning}
          </p>
          <div className="border-t-2 border-red-500/30 mt-4 pt-4 bg-red-500/5 rounded-lg p-4">
            <div className="flex items-center justify-center gap-3">
              <Copyright className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm md:text-base text-red-500 font-semibold text-center">
                {t.footer.copyrightNotice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

