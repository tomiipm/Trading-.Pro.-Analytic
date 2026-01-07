"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Sparkles, Check, ArrowRight } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useI18n } from "@/lib/i18n/context"
import Link from "next/link"

export function PremiumSection() {
  const { user, subscription, isPremium, isTrial, loading } = useAuth()
  const { t, language } = useI18n()

  // Jeśli ładowanie trwa, nie pokazuj niczego (zapobiega blokowaniu strony)
  if (loading) {
    return null
  }

  // Jeśli użytkownik nie jest zalogowany, nie pokazuj sekcji
  if (!user) {
    return null
  }

  const hasActiveTrial = isTrial()
  const hasActivePremium = isPremium()
  const hasNoSubscription = !subscription

  return (
    <div className="mb-6">
      <Card className="border-2 border-gradient-to-r from-cyan-500/30 to-blue-500/30 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
              <Crown className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
              {t.premiumSection.title}
            </CardTitle>
            {hasActivePremium && (
              <Badge variant="default" className="bg-yellow-500 text-black">
                {t.premiumSection.premiumActive}
              </Badge>
            )}
            {hasActiveTrial && (
              <Badge variant="default" className="bg-blue-500">
                {t.premiumSection.trialActive}
              </Badge>
            )}
          </div>
          <CardDescription className="text-base">
            {t.premiumSection.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Trial Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <Sparkles className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t.premiumSection.trial}</h3>
                  <p className="text-sm text-muted-foreground">{t.premiumSection.trialDescription}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{t.premiumSection.fullAccessToSignals}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{t.premiumSection.economicCalendar}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{t.premiumSection.allPairsAndIndices}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{t.premiumSection.premiumFeatures}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{t.premiumSection.technicalSupport}</span>
                </div>
              </div>

              {hasNoSubscription && (
                <Button asChild className="w-full" variant="default">
                  <Link href="/subscriptions">
                    {t.premiumSection.activateTrial}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              {hasActiveTrial && (
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <p className="text-sm font-semibold text-blue-400">
                    {t.premiumSection.trialActiveUntil} {subscription && new Date(subscription.expires_at).toLocaleDateString(language === "pl" ? "pl-PL" : language === "de" ? "de-DE" : language === "fr" ? "fr-FR" : language === "es" ? "es-ES" : language === "it" ? "it-IT" : language === "pt" ? "pt-PT" : language === "ru" ? "ru-RU" : language === "zh-CN" ? "zh-CN" : language === "ja" ? "ja-JP" : "en-US")}
                  </p>
                </div>
              )}
            </div>

            {/* Premium Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-yellow-500/20">
                  <Crown className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t.premiumSection.premium}</h3>
                  <p className="text-sm text-muted-foreground">{t.premiumSection.premiumDescription}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{t.premiumSection.everythingFromTrial}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{t.premiumSection.prioritySignals}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{t.premiumSection.advancedAI}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{t.premiumSection.unlimitedAccess}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{t.premiumSection.premiumSupport}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{t.premiumSection.latestUpdates}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border">
                  <div>
                    <p className="font-semibold">{t.premiumSection.oneDay}</p>
                    <p className="text-xs text-muted-foreground">{t.premiumSection.fullAccess}</p>
                  </div>
                  <p className="text-xl font-bold">$1</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border">
                  <div>
                    <p className="font-semibold">{t.premiumSection.sevenDays}</p>
                    <p className="text-xs text-muted-foreground">{t.premiumSection.fullAccess}</p>
                  </div>
                  <p className="text-xl font-bold">$5</p>
                </div>
              </div>

              {hasActivePremium ? (
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-sm font-semibold text-yellow-400">
                    {t.premiumSection.premiumActiveUntil} {subscription && new Date(subscription.expires_at).toLocaleDateString(language === "pl" ? "pl-PL" : language === "de" ? "de-DE" : language === "fr" ? "fr-FR" : language === "es" ? "es-ES" : language === "it" ? "it-IT" : language === "pt" ? "pt-PT" : language === "ru" ? "ru-RU" : language === "zh-CN" ? "zh-CN" : language === "ja" ? "ja-JP" : "en-US")}
                  </p>
                </div>
              ) : (
                <Button asChild className="w-full" variant="default">
                  <Link href="/subscriptions">
                    {t.premiumSection.goToPremium}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-center text-muted-foreground">
              {t.premiumSection.paymentInfo}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

