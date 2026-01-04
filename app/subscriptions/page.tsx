"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown, Sparkles, Check, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n/context"

function SubscriptionsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, subscription, loading: authLoading, refreshUserData } = useAuth()
  const { t } = useI18n()
  const [activating, setActivating] = useState<string | null>(null)

  // Obsługa powrotu z PayPal
  useEffect(() => {
    const success = searchParams.get("success")
    const canceled = searchParams.get("canceled")
    
    if (success === "true") {
      toast.success(t.subscriptionsPage.paymentSuccess)
      refreshUserData()
      // Usuń parametr z URL
      router.replace("/subscriptions")
    } else if (canceled === "true") {
      toast.info(t.subscriptionsPage.paymentCanceled)
      router.replace("/subscriptions")
    }
  }, [searchParams, router, refreshUserData])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const handleActivateTrial = async () => {
    setActivating("trial")
    try {
      const response = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionType: "trial",
          days: 1,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || t.subscriptionsPage.activationFailed)
        return
      }

      toast.success(t.subscriptionsPage.trialActivated)
      refreshUserData()
    } catch (error) {
      toast.error("Wystąpił błąd. Spróbuj ponownie.")
    } finally {
      setActivating(null)
    }
  }

  const handleActivatePremium = async (days: number) => {
    setActivating(`premium-${days}`)
    try {
      const amount = days === 1 ? 1 : 7
      
      // Utwórz zamówienie PayPal
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: "USD",
          days,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || t.subscriptionsPage.createOrderFailed)
        return
      }

      // Przekieruj użytkownika do PayPal
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl
      } else {
        toast.error("Brak URL płatności PayPal")
      }
    } catch (error) {
      toast.error("Wystąpił błąd. Spróbuj ponownie.")
    } finally {
      setActivating(null)
    }
  }

  const isTrialActive = subscription?.subscription_type === "trial" && subscription?.status === "active"
  const isPremiumActive = subscription?.subscription_type === "premium" && subscription?.status === "active"
  const hasActiveSubscription = subscription && new Date(subscription.expires_at) > new Date()
  
  // Sprawdź czy trial wygasł (minął 1 dzień od wygaśnięcia trial)
  const hasTrialExpired = () => {
    if (!subscription) {
      // Jeśli użytkownik nie ma subskrypcji, premium nie jest dostępne
      return false
    }
    
    // Jeśli ma trial, sprawdź czy wygasł
    if (subscription.subscription_type === "trial") {
      const expiresAt = new Date(subscription.expires_at)
      return expiresAt <= new Date()
    }
    // Jeśli użytkownik nie ma triala, premium nie jest dostępne
    return false
  }
  
  // Premium widoczne tylko gdy:
  // 1. Użytkownik ma premium (aktywny)
  // 2. Trial wygasł (minął 1 dzień)
  const canSeePremium = hasTrialExpired() || isPremiumActive

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t.subscriptionsPage.title || t.premiumSection.title}</h1>
          <p className="text-muted-foreground text-lg">
            {t.premiumSection.description}
          </p>
        </div>

        {hasActiveSubscription && (
          <Alert className="mb-8">
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{t.subscriptions.active} {t.subscriptions.title || "Subscription"}</p>
                  <p className="text-sm text-muted-foreground">
                    {subscription.subscription_type === "premium" && t.subscriptions.premium}
                    {subscription.subscription_type === "trial" && t.subscriptions.trial}
                    {subscription.subscription_type === "free" && (t.subscriptions.trial || "Free")}
                    {subscription.subscription_type === "one_day" && t.premiumSection.oneDay}
                    {" - "}
                    {t.profile.expires || "Expires"}: {new Date(subscription.expires_at).toLocaleDateString(t.language === "pl" ? "pl-PL" : t.language === "de" ? "de-DE" : t.language === "fr" ? "fr-FR" : t.language === "es" ? "es-ES" : t.language === "it" ? "it-IT" : t.language === "pt" ? "pt-PT" : t.language === "ru" ? "ru-RU" : t.language === "zh-CN" ? "zh-CN" : t.language === "ja" ? "ja-JP" : "en-US")}
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Trial Subscription */}
          <Card className={isTrialActive ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-blue-500" />
                  {t.subscriptions.trial}
                </CardTitle>
                {isTrialActive && <Badge variant="default">{t.subscriptions.active}</Badge>}
              </div>
              <CardDescription>{t.premiumSection.trialDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{t.premiumSection.fullAccessToSignals}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{t.premiumSection.economicCalendar}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{t.premiumSection.allPairsAndIndices}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{t.premiumSection.technicalSupport}</span>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-3xl font-bold mb-2">{t.common.success === "Sukces" ? "Darmowe" : "Free"}</p>
                <p className="text-sm text-muted-foreground">{t.premiumSection.oneDay} {t.common.success === "Sukces" ? "próbny" : "trial"}</p>
              </div>

              <Button
                className="w-full"
                variant={isTrialActive ? "outline" : "default"}
                disabled={isTrialActive || activating !== null}
                onClick={handleActivateTrial}
              >
                {activating === "trial" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.subscriptions.activate || "Activating..."}
                  </>
                ) : isTrialActive ? (
                  t.subscriptions.active
                ) : (
                  t.subscriptionsPage.activateTrial
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Premium Subscription - Widoczne tylko po wygaśnięciu trial lub gdy użytkownik ma premium */}
          {canSeePremium && (
            <Card className={isPremiumActive ? "border-primary border-2" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Crown className="h-6 w-6 text-yellow-500" />
                    {t.subscriptions.premium}
                  </CardTitle>
                  {isPremiumActive && <Badge variant="default">{t.subscriptions.active}</Badge>}
                </div>
                <CardDescription>{t.premiumSection.premiumDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{t.premiumSection.everythingFromTrial}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{t.premiumSection.prioritySignals}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{t.premiumSection.advancedAI}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{t.premiumSection.premiumSupport}</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{t.premiumSection.oneDay}</p>
                      <p className="text-sm text-muted-foreground">{t.premiumSection.fullAccess}</p>
                    </div>
                    <p className="text-2xl font-bold">$1</p>
                  </div>
                  <Button
                    className="w-full"
                    variant={isPremiumActive ? "outline" : "default"}
                    disabled={isPremiumActive || activating !== null}
                    onClick={() => handleActivatePremium(1)}
                  >
                    {activating === "premium-1" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.subscriptions.activate || "Activating..."}
                      </>
                    ) : isPremiumActive ? (
                      t.subscriptions.active
                    ) : (
                      t.subscriptionsPage.activateOneDay || `Buy for $1`
                    )}
                  </Button>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{t.premiumSection.sevenDays}</p>
                      <p className="text-sm text-muted-foreground">{t.premiumSection.fullAccess}</p>
                    </div>
                    <p className="text-2xl font-bold">$7</p>
                  </div>
                  <Button
                    className="w-full"
                    variant={isPremiumActive ? "outline" : "default"}
                    disabled={isPremiumActive || activating !== null}
                    onClick={() => handleActivatePremium(7)}
                  >
                    {activating === "premium-7" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.subscriptions.activate || "Activating..."}
                      </>
                    ) : isPremiumActive ? (
                      t.subscriptions.active
                    ) : (
                      t.subscriptionsPage.activateSevenDays || `Buy for $7`
                    )}
                  </Button>
                </div>
              </div>

              <div className="pt-2 text-center">
                <p className="text-xs text-muted-foreground">
                  {t.premiumSection.paymentInfo}
                </p>
              </div>
            </CardContent>
          </Card>
          )}
          
          {/* Informacja gdy premium nie jest jeszcze dostępne */}
          {!canSeePremium && (
            <Card className="border-blue-500/30 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  {t.subscriptions.premium} {t.common.available || "Available"} {t.common.after || "After"} {t.subscriptions.trial} {t.common.expires || "Expires"}
                </CardTitle>
                <CardDescription>
                  {t.premiumSection.description || "After trial period ends, you can activate Premium subscription"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• {t.premiumSection.activateTrial}</p>
                  <p>• {t.premiumSection.goToPremium}</p>
                  <p>• {t.premiumSection.premiumDescription}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Masz pytania? Skontaktuj się z nami pod adresem{" "}
            <a href="mailto:support@trading-pro-analytic.com" className="text-primary hover:underline">
              support@trading-pro-analytic.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <SubscriptionsContent />
    </Suspense>
  )
}
