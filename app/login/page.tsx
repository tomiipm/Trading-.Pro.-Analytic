"use client"

import { useState, useRef, Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock } from "lucide-react"
import { toast } from "sonner"
import { ReCaptcha, type ReCaptchaRef } from "@/components/recaptcha"
import { useI18n } from "@/lib/i18n/context"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useI18n()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCaptchaRef>(null)

  // Get redirect URL from query params or default to profile/dashboard
  const redirectTo = searchParams?.get('redirect') || '/profile'
  
  // Check if email was confirmed
  useEffect(() => {
    const confirmed = searchParams?.get('confirmed')
    const errorParam = searchParams?.get('error')
    
    if (confirmed === 'true') {
      setSuccessMessage(t.loginPage.emailConfirmed)
      toast.success(t.loginPage.emailConfirmed)
    }
    
    const passwordReset = searchParams?.get('password_reset')
    if (passwordReset === 'true') {
      setSuccessMessage(t.loginPage.passwordResetSuccess)
      toast.success(t.loginPage.passwordResetSuccess)
    }
    
    if (errorParam === 'invalid_token') {
      setError(t.loginPage.invalidToken)
    } else if (errorParam === 'callback_error') {
      setError(t.loginPage.callbackError)
    }
  }, [searchParams])

  // Production reCAPTCHA site key
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  
  if (!recaptchaSiteKey) {
    console.error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable is not set")
  }

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token)
  }

  const handleRecaptchaExpire = () => {
    setRecaptchaToken(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // reCAPTCHA temporarily disabled
    // if (!recaptchaToken) {
    //   setError("Please complete the reCAPTCHA verification")
    //   return
    // }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password,
          // recaptchaToken: recaptchaToken || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Login failed")
        // Reset reCAPTCHA on error
        if (recaptchaRef.current) {
          recaptchaRef.current.reset()
        }
        setRecaptchaToken(null)
        return
      }

      toast.success(t.auth.loggedIn)
      // Redirect to profile/dashboard after login (best practice)
      router.push(redirectTo === '/' ? '/profile' : redirectTo)
      router.refresh()
    } catch (err) {
      setError("An error occurred. Please try again.")
      // Reset reCAPTCHA on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
      }
      setRecaptchaToken(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{t.loginPage.title}</CardTitle>
          <CardDescription>
            {t.loginPage.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {successMessage && (
              <Alert>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t.loginPage.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t.auth.password}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t.loginPage.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* reCAPTCHA temporarily disabled */}
            {/* <div className="space-y-2">
              <Label className="text-sm font-medium">Weryfikacja bezpieczeństwa</Label>
              <div className="flex justify-center py-2">
                <ReCaptcha
                  ref={recaptchaRef}
                  siteKey={recaptchaSiteKey}
                  onVerify={handleRecaptchaVerify}
                  onExpire={handleRecaptchaExpire}
                />
              </div>
              {!recaptchaToken && (
                <p className="text-xs text-muted-foreground text-center">
                  Zaznacz pole "Nie jestem robotem" aby kontynuować
                </p>
              )}
            </div> */}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.loginPage.loggingIn}
                </>
              ) : (
                t.loginPage.loginButton
              )}
            </Button>

            <div className="text-center text-sm space-y-2">
              <div>
                <Link href="/forgot-password" className="text-primary hover:underline">
                  {t.auth.forgotPassword}
                </Link>
              </div>
              <div>
                {t.auth.noAccount}{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  {t.nav.signup}
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
