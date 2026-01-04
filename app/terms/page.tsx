import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export const metadata = {
  title: "Regulamin - Trading Pro Analytic",
  description: "Regulamin korzystania z usług Trading Pro Analytic",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl">Regulamin</CardTitle>
            </div>
            <p className="text-muted-foreground mt-2">
              Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Postanowienia Ogólne</h2>
              <p className="text-muted-foreground leading-relaxed">
                Niniejszy Regulamin określa zasady korzystania z serwisu internetowego Trading Pro Analytic 
                dostępnego pod adresem trading-pro-analytic.com (zwany dalej "Serwisem"). Korzystanie z Serwisu 
                oznacza akceptację wszystkich postanowień niniejszego Regulaminu.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Definicje</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Serwis:</strong> Strona internetowa Trading Pro Analytic</li>
                <li><strong>Użytkownik:</strong> Osoba korzystająca z Serwisu</li>
                <li><strong>Usługodawca:</strong> Trading Pro Analytic</li>
                <li><strong>Sygnały handlowe:</strong> Informacje i rekomendacje dotyczące rynków finansowych</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Charakter Usług</h2>
              <p className="text-muted-foreground leading-relaxed">
                Serwis dostarcza informacje i sygnały handlowe generowane przez zaawansowane algorytmy 
                sztucznej inteligencji. Usługi mają charakter wyłącznie informacyjny i nie stanowią:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-4">
                <li>Porady inwestycyjnej w rozumieniu przepisów prawa</li>
                <li>Rekomendacji inwestycyjnych</li>
                <li>Gwarancji zysku</li>
                <li>Zobowiązania do osiągnięcia określonych wyników</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Ostrzeżenie o Ryzyku</h2>
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                <p className="text-muted-foreground leading-relaxed">
                  Handel na rynkach finansowych wiąże się z wysokim ryzykiem utraty kapitału. 
                  Przeszłe wyniki nie gwarantują przyszłych rezultatów. Przed podjęciem jakichkolwiek 
                  decyzji handlowych należy dokładnie przeanalizować ryzyko i skonsultować się z 
                  niezależnym doradcą finansowym. Zawsze handluj odpowiedzialnie i tylko takim kapitałem, 
                  którego utratę możesz sobie pozwolić.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Zasady Korzystania z Serwisu</h2>
              <p className="text-muted-foreground leading-relaxed">
                Użytkownik zobowiązuje się do:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-4">
                <li>Korzystania z Serwisu zgodnie z prawem i dobrymi obyczajami</li>
                <li>Niepodejmowania działań mogących zakłócić funkcjonowanie Serwisu</li>
                <li>Nieprzekazywania treści nielegalnych, obraźliwych lub naruszających prawa osób trzecich</li>
                <li>Respektowania praw własności intelektualnej</li>
                <li>Nieodtwarzania, kopiowania ani rozpowszechniania treści bez zgody</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Odpowiedzialność</h2>
              <p className="text-muted-foreground leading-relaxed">
                Usługodawca nie ponosi odpowiedzialności za:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-4">
                <li>Decyzje handlowe podjęte na podstawie informacji z Serwisu</li>
                <li>Straty finansowe wynikające z korzystania z sygnałów handlowych</li>
                <li>Dokładność, kompletność lub aktualność informacji</li>
                <li>Działania osób trzecich</li>
                <li>Przerwy w działaniu Serwisu spowodowane czynnikami zewnętrznymi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Własność Intelektualna</h2>
              <p className="text-muted-foreground leading-relaxed">
                Wszystkie treści dostępne w Serwisie, w tym sygnały handlowe, algorytmy, grafiki, 
                teksty i oprogramowanie, są chronione prawem autorskim i stanowią własność Usługodawcy 
                lub jego licencjodawców. Zabronione jest ich kopiowanie, modyfikowanie lub rozpowszechnianie 
                bez pisemnej zgody.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Zmiany w Regulaminie</h2>
              <p className="text-muted-foreground leading-relaxed">
                Usługodawca zastrzega sobie prawo do wprowadzania zmian w Regulaminie. 
                O zmianach użytkownicy będą informowani poprzez publikację na stronie Serwisu. 
                Kontynuowanie korzystania z Serwisu po wprowadzeniu zmian oznacza akceptację nowego Regulaminu.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Postanowienia Końcowe</h2>
              <p className="text-muted-foreground leading-relaxed">
                W sprawach nieuregulowanych niniejszym Regulaminem mają zastosowanie przepisy prawa polskiego. 
                Wszelkie spory będą rozstrzygane przez właściwe sądy polskie.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Kontakt</h2>
              <p className="text-muted-foreground leading-relaxed">
                W sprawach dotyczących Regulaminu prosimy o kontakt:
              </p>
              <div className="bg-muted p-4 rounded-lg mt-4">
                <p className="font-semibold">Trading Pro Analytic</p>
                <p>Email: support@trading-pro-analytic.com</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

