"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { ReCaptcha, type ReCaptchaRef } from "@/components/recaptcha"
import { useI18n } from "@/lib/i18n/context"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
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

    // reCAPTCHA verification required for production
    if (!recaptchaToken) {
      setError(t.forgotPasswordPage.recaptchaRequired || "Please complete the reCAPTCHA verification")
      return
    }

    if (!email) {
      setError(t.auth.email ? `${t.auth.email} is required` : "Please enter your email address")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email,
          recaptchaToken: recaptchaToken,
        }),
      })

      if (!response.ok) {
        let errorMessage = t.common.error || "Failed to send reset email"
        try {
          const data = await response.json()
          errorMessage = data.error || errorMessage
        } catch (parseError) {
          // If response is not JSON, use status text or default message
          if (response.status === 429) {
            errorMessage = t.forgotPasswordPage.tooManyAttempts || "Too many requests. Please try again later."
          } else {
            errorMessage = response.statusText || errorMessage
          }
        }
        setError(errorMessage)
        toast.error(errorMessage)
        // Reset reCAPTCHA on error
        if (recaptchaRef.current) {
          recaptchaRef.current.reset()
        }
        setRecaptchaToken(null)
        return
      }

      const data = await response.json()
      
      // Always show success message (security best practice - don't reveal if email exists)
      setSuccess(true)
      toast.success(data.message || t.forgotPasswordPage.successMessage || "If an account with that email exists, we've sent a password reset link.")
    } catch (err) {
      console.error("Forgot password error:", err)
      const errorMessage = err instanceof Error ? err.message : (t.common.error || "An error occurred. Please try again.")
      setError(errorMessage)
      // Reset reCAPTCHA on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
      }
      setRecaptchaToken(null)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              {t.common.success}
            </CardTitle>
            <CardDescription>
              {t.forgotPasswordPage.successMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                {t.forgotPasswordPage.successMessage} <strong>{email}</strong>
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setSuccess(false)
                  setEmail("")
                  if (recaptchaRef.current) {
                    recaptchaRef.current.reset()
                  }
                  setRecaptchaToken(null)
                }}
              >
                {t.common.cancel || "Try Again"}
              </Button>
              <Button 
                variant="default" 
                className="flex-1"
                onClick={() => router.push("/login")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.forgotPasswordPage.backToLogin}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{t.forgotPasswordPage.title}</CardTitle>
          <CardDescription>
            {t.forgotPasswordPage.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t.forgotPasswordPage.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* reCAPTCHA verification */}
            {recaptchaSiteKey && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.forgotPasswordPage.securityVerification || "Security Verification"}</Label>
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
                    {t.forgotPasswordPage.recaptchaInstructions || "Please complete the reCAPTCHA verification to continue"}
                  </p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.forgotPasswordPage.sending}
                </>
              ) : (
                t.forgotPasswordPage.sendResetLink
              )}
            </Button>

            <div className="text-center text-sm">
              <Link href="/login" className="text-primary hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                {t.forgotPasswordPage.backToLogin}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

