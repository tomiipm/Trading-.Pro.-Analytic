"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { Menu, X, User, LogOut, Crown, Sparkles, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { useI18n } from "@/lib/i18n/context"
import { LanguageToggle } from "@/components/language-toggle"
import { toast } from "sonner"


export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, subscription, loading, signOut, isPremium, isTrial } = useAuth()
  const { t } = useI18n()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success(t.auth.loggedOut)
    router.push("/")
    router.refresh()
  }

  const navigationItems = [
    { name: t.nav.forex, href: "/forex" },
    { name: t.nav.calendar, href: "/economic-calendar" },
    { name: t.nav.about, href: "/about" },
    { name: t.nav.mobileApp, href: "/mobile-app" },
  ]

  return (
    <header className="w-full border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center">
          <Logo size="md" />
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {!loading && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative">
                    <User className="h-4 w-4 mr-2" />
                    {user.email}
                    {isPremium() && <Crown className="h-3 w-3 ml-2 text-yellow-500" />}
                    {isTrial() && <Sparkles className="h-3 w-3 ml-2 text-blue-500" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.email}</p>
                      {subscription && (
                        <p className="text-xs text-muted-foreground">
                          {subscription.subscription_type === "premium" && "Premium"}
                          {subscription.subscription_type === "trial" && "Trial"}
                          {subscription.subscription_type === "free" && "Darmowe"}
                          {subscription.subscription_type === "one_day" && "Jednodniowe"}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <Settings className="mr-2 h-4 w-4" />
                      {t.nav.profile}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/subscriptions">
                      <Crown className="mr-2 h-4 w-4" />
                      {t.nav.subscriptions}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t.nav.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {!loading && !user && (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">{t.nav.login}</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">{t.nav.signup}</Link>
                </Button>
              </div>
            )}

            <LanguageToggle />
            <ThemeToggle />

            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-3">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {!user && (
              <>
                <Link
                  href="/login"
                  className="block py-2 text-sm font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/signup"
                  className="block py-2 text-sm font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav.signup}
                </Link>
              </>
            )}
            {user && (
              <>
                <Link
                  href="/profile"
                  className="block py-2 text-sm font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav.profile}
                </Link>
                <Link
                  href="/subscriptions"
                  className="block py-2 text-sm font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav.subscriptions}
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left py-2 text-sm font-medium hover:text-primary"
                >
                  {t.nav.logout}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
