"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { ReCaptcha, type ReCaptchaRef } from "@/components/recaptcha"
import { useI18n } from "@/lib/i18n/context"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useI18n()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [hasToken, setHasToken] = useState(false)
  const recaptchaRef = useRef<ReCaptchaRef>(null)

  // Production reCAPTCHA site key
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  
  if (!recaptchaSiteKey) {
    console.error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable is not set")
  }

  useEffect(() => {
    // Always show the form initially - let the API handle auth validation
    // This prevents the "no token" error when user comes from email link
    setHasToken(true)
    
    // Optional: Check auth status in background for better UX
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check-reset-token", {
          method: "GET",
          credentials: "include",
        })
        if (!response.ok) {
          console.warn("Auth check failed, but allowing form submission")
        }
      } catch (error) {
        console.warn("Auth check error, but allowing form submission", error)
      }
    }
    checkAuth()
  }, [])

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token)
  }

  const handleRecaptchaExpire = () => {
    setRecaptchaToken(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!password) {
      setError(t.resetPasswordPage.newPassword ? `${t.resetPasswordPage.newPassword} is required` : "Please enter your new password")
      return
    }

    if (password.length < 6) {
      setError(t.signupPage.passwordMinLength || "Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError(t.resetPasswordPage.passwordMismatch)
      return
    }

    // reCAPTCHA verification required for production
    if (!recaptchaToken) {
      setError(t.resetPasswordPage.recaptchaRequired || "Please complete the reCAPTCHA verification")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: include cookies for session
        body: JSON.stringify({ 
          password,
          recaptchaToken: recaptchaToken,
        }),
      })

      if (!response.ok) {
        let errorMessage = t.resetPasswordPage.error || "Failed to reset password"
        try {
          const data = await response.json()
          errorMessage = data.error || errorMessage
        } catch (parseError) {
          // If response is not JSON, use status text or default message
          if (response.status === 401) {
            errorMessage = t.resetPasswordPage.invalidToken || "Invalid or expired reset token. Please click the reset link from your email again."
          } else if (response.status === 429) {
            errorMessage = t.resetPasswordPage.tooManyAttempts || "Too many requests. Please try again later."
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
      
      // Verify we got a valid response
      if (!data.success) {
        setError(t.resetPasswordPage.error || "Failed to reset password. Please try again.")
        toast.error(t.resetPasswordPage.error || "Failed to reset password. Please try again.")
        // Reset reCAPTCHA on error
        if (recaptchaRef.current) {
          recaptchaRef.current.reset()
        }
        setRecaptchaToken(null)
        return
      }
      
      setSuccess(true)
      toast.success(data.message || t.loginPage.passwordResetSuccess || "Password has been reset successfully.")

      // Redirect to login after 2 seconds - user will log in and be redirected to profile
      setTimeout(() => {
        router.push("/login?password_reset=true")
      }, 2000)
    } catch (err) {
      console.error("Reset password error:", err)
      const errorMessage = err instanceof Error ? err.message : (t.resetPasswordPage.error || "An error occurred. Please try again.")
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
              Hasło zresetowane
            </CardTitle>
            <CardDescription>
              Twoje hasło zostało pomyślnie zmienione
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                {t.loginPage.passwordResetSuccess}
              </AlertDescription>
            </Alert>
            <Button 
              className="w-full"
              onClick={() => router.push("/login")}
            >
              {t.forgotPasswordPage.backToLogin}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-yellow-500" />
              {t.resetPasswordPage.noTokenMessage ? "No Token" : "Invalid Link"}
            </CardTitle>
            <CardDescription>
              {t.resetPasswordPage.noTokenMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {t.resetPasswordPage.noTokenMessage}
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => router.push("/forgot-password")}
              >
                {t.resetPasswordPage.requestNewLink}
              </Button>
              <Button 
                variant="default" 
                className="flex-1"
                onClick={() => router.push("/login")}
              >
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
          <CardTitle className="text-2xl">{t.resetPasswordPage.title}</CardTitle>
          <CardDescription>
            {t.resetPasswordPage.description}
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
              <Label htmlFor="password">{t.resetPasswordPage.newPassword}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t.resetPasswordPage.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t.signupPage.passwordMinLength}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.resetPasswordPage.confirmPassword}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t.resetPasswordPage.passwordPlaceholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>

            {/* reCAPTCHA verification */}
            {recaptchaSiteKey && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.resetPasswordPage.securityVerification || "Security Verification"}</Label>
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
                    {t.resetPasswordPage.recaptchaInstructions || "Please complete the reCAPTCHA verification to continue"}
                  </p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.resetPasswordPage.setting}
                </>
              ) : (
                t.resetPasswordPage.setPassword
              )}
            </Button>

            <div className="text-center text-sm">
              <Link href="/login" className="text-primary hover:underline">
                {t.forgotPasswordPage.backToLogin}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
