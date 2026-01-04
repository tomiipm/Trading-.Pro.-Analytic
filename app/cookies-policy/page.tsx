import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cookie } from "lucide-react"

export const metadata = {
  title: "Polityka Ciasteczek - Trading Pro Analytics",
  description: "Polityka ciasteczek Trading Pro Analytics - jak używamy plików cookie na naszej stronie",
}

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Cookie className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl">Cookies Policy</CardTitle>
            </div>
            <p className="text-muted-foreground mt-2">
              Last updated: January 01, 2026
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <p className="text-muted-foreground leading-relaxed">
                This Cookies Policy explains what Cookies are and how We use them. You should read this policy so You can understand what type of cookies We use, or the information We collect using Cookies and how that information is used.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Cookies do not typically contain any information that personally identifies a user, but personal information that we store about You may be linked to the information stored in and obtained from Cookies. For further information on how We use, store and keep your personal data secure, see our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We do not store sensitive personal information, such as mailing addresses, account passwords, etc. in the Cookies We use.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Interpretation and Definitions</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Interpretation</h3>
              <p className="text-muted-foreground leading-relaxed">
                The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Definitions</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For the purposes of this Cookies Policy:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Cookies Policy) refers to Trading Pro Analytic.</li>
                <li><strong>Cookies</strong> means small files that are placed on Your computer, mobile device or any other device by a website, containing details of your browsing history on that website among its many uses.</li>
                <li><strong>Website</strong> refers to Trading Pro Analytic, accessible from this website.</li>
                <li><strong>You</strong> means the individual accessing or using the Website, or a company, or any legal entity on behalf of which such individual is accessing or using the Website, as applicable.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">The use of the Cookies</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Type of Cookies We Use</h3>
              <p className="text-muted-foreground leading-relaxed">
                Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close your web browser.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We use both Session and Persistent Cookies for the purposes set out below:
              </p>
              
              <div className="space-y-4 mt-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Necessary / Essential Cookies</h5>
                  <p className="text-sm text-muted-foreground mb-2"><strong>Type:</strong> Session Cookies</p>
                  <p className="text-sm text-muted-foreground mb-2"><strong>Administered by:</strong> Us</p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Purpose:</strong> These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Functionality Cookies</h5>
                  <p className="text-sm text-muted-foreground mb-2"><strong>Type:</strong> Persistent Cookies</p>
                  <p className="text-sm text-muted-foreground mb-2"><strong>Administered by:</strong> Us</p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Purpose:</strong> These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Your Choices Regarding Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                If You prefer to avoid the use of Cookies on the Website, first You must disable the use of Cookies in your browser and then delete the Cookies saved in your browser associated with this website. You may use this option for preventing the use of Cookies at any time.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                If You do not accept Our Cookies, You may experience some inconvenience in your use of the Website and some features may not function properly.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                If You'd like to delete Cookies or instruct your web browser to delete or refuse Cookies, please visit the help pages of your web browser or contact us for assistance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">More Information about Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                For more information about cookies and how we use them, please refer to our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Cookies Policy, You can contact us:
              </p>
              <div className="bg-muted p-4 rounded-lg mt-4">
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>By email: <a href="mailto:support@trading-pro-analytic.com" className="text-primary hover:underline">support@trading-pro-analytic.com</a></li>
                  <li>By visiting our <a href="/" className="text-primary hover:underline">homepage</a></li>
                </ul>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

