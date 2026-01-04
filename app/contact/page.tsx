import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageSquare, HelpCircle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Kontakt - Trading Pro Analytic",
  description: "Skontaktuj się z Trading Pro Analytic - jesteśmy tutaj, aby pomóc",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Kontakt</CardTitle>
            <p className="text-muted-foreground mt-2">
              Skontaktuj się z nami - chętnie odpowiemy na Twoje pytania
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Informacje Kontaktowe</h2>
              <div className="grid gap-6 md:grid-cols-1">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <MessageSquare className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">Wsparcie</h3>
                        <p className="text-muted-foreground mb-2">support@trading-pro-analytic.com</p>
                        <p className="text-sm text-muted-foreground">
                          Wszystkie zapytania, wsparcie techniczne, pytania o funkcjonalność platformy
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Często Zadawane Pytania</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Jak działają sygnały handlowe?</h3>
                    <p className="text-muted-foreground text-sm">
                      Nasze sygnały są generowane przez zaawansowane algorytmy sztucznej inteligencji, które analizują 
                      dane rynkowe w czasie rzeczywistym. Więcej informacji znajdziesz na stronie{" "}
                      <Link href="/about" className="text-primary hover:underline">O Nas</Link>.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Czy sygnały są gwarancją zysku?</h3>
                    <p className="text-muted-foreground text-sm">
                      Nie. Handel na rynkach finansowych zawsze wiąże się z ryzykiem. Nasze sygnały są narzędziami 
                      informacyjnymi i nie stanowią porady inwestycyjnej. Zawsze handluj odpowiedzialnie.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Jak często aktualizowane są sygnały?</h3>
                    <p className="text-muted-foreground text-sm">
                      Sygnały są generowane i aktualizowane w czasie rzeczywistym, 24/7. System automatycznie 
                      monitoruje rynki i publikuje nowe sygnały natychmiast po ich wykryciu.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Inne Przydatne Linki</h2>
              <div className="flex flex-wrap gap-4">
                <Link href="/about">
                  <Button variant="outline">O Nas</Button>
                </Link>
                <Link href="/privacy-policy">
                  <Button variant="outline">Polityka Prywatności</Button>
                </Link>
                <Link href="/economic-calendar">
                  <Button variant="outline">Kalendarz Ekonomiczny</Button>
                </Link>
                <Link href="/forex">
                  <Button variant="outline">Sygnały Forex</Button>
                </Link>
              </div>
            </section>

            <section>
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Czas Odpowiedzi</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Staramy się odpowiadać na wszystkie zapytania w ciągu 24-48 godzin w dni robocze. 
                  W przypadku pilnych spraw technicznych, prosimy o oznaczenie wiadomości jako "pilne".
                </p>
                <p className="text-muted-foreground text-sm">
                  <strong>Godziny pracy:</strong> Poniedziałek - Piątek, 9:00 - 17:00 (CET)
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

