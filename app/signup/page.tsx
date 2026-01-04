"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, User } from "lucide-react"
import { toast } from "sonner"
import { ReCaptcha, type ReCaptchaRef } from "@/components/recaptcha"
import { useI18n } from "@/lib/i18n/context"

export default function SignupPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCaptchaRef>(null)

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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password, 
          fullName,
          // recaptchaToken: recaptchaToken || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || "Signup failed. Please try again."
        setError(errorMessage)
        toast.error(errorMessage)
        // Reset reCAPTCHA on error
        if (recaptchaRef.current) {
          recaptchaRef.current.reset()
        }
        setRecaptchaToken(null)
        return
      }

      toast.success(t.auth.signupSuccess)
      router.push("/login")
    } catch (err: any) {
      const errorMessage = err?.message || "An error occurred. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
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
          <CardTitle className="text-2xl">{t.signupPage.title}</CardTitle>
          <CardDescription>{t.signupPage.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">{t.signupPage.fullName}</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder={t.signupPage.fullNamePlaceholder}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t.signupPage.emailPlaceholder}
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
                  placeholder={t.signupPage.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-muted-foreground">{t.signupPage.passwordMinLength}</p>
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
                  {t.signupPage.creatingAccount}
                </>
              ) : (
                t.signupPage.createAccountButton
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {t.signupPage.alreadyHaveAccount}{" "}
              <Link href="/login" className="text-primary hover:underline">
                {t.signupPage.loginLink}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

