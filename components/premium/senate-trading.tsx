"use client"

import { PremiumGate } from "@/components/PremiumGate"
import { useSubscription } from "@/hooks/useSubscription"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, ExternalLink, Users } from "lucide-react"
import { toast } from "sonner"

interface SenateTransaction {
  symbol?: string
  disclosureDate?: string
  transactionDate?: string
  firstName?: string
  lastName?: string
  office?: string
  district?: string
  owner?: string
  assetDescription?: string
  assetType?: string
  type?: string
  amount?: string
  comment?: string
  link?: string
}

export function SenateTradingComponent() {
  const { isPremium, loading: subscriptionLoading } = useSubscription()

  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState<SenateTransaction[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterAssetType, setFilterAssetType] = useState<string>("all")

  const fetchSenateData = async () => {
    if (!isPremium) return

    setLoading(true)
    try {
      const response = await fetch("/api/economic-calendar/senate")
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Nie udało się pobrać danych o transakcjach senatorów")
        return
      }

      if (data.success) {
        setTransactions(Array.isArray(data.data) ? data.data : [])
        setLastUpdated(new Date())
        if (data.data.length === 0) {
          toast.info("Brak danych o transakcjach senatorów")
        } else {
          toast.success(`Pobrano ${data.data.length} transakcji`)
        }
      }
    } catch {
      toast.error("Wystąpił błąd podczas pobierania danych")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isPremium || subscriptionLoading) return

    fetchSenateData()

    const interval = setInterval(() => {
      fetchSenateData()
    }, 30 * 60 * 1000)

    return () => clearInterval(interval)
  }, [isPremium, subscriptionLoading])

  const filteredTransactions = transactions.filter((transaction) => {
    if (filterType !== "all" && transaction.type !== filterType) return false
    if (filterAssetType !== "all" && transaction.assetType !== filterAssetType) return false
    return true
  })

  const uniqueTypes = Array.from(new Set(transactions.map((t) => t.type).filter(Boolean)))
  const uniqueAssetTypes = Array.from(new Set(transactions.map((t) => t.assetType).filter(Boolean)))

  const getTypeBadgeColor = (type?: string) => {
    if (!type) return "bg-gray-500"
    const t = type.toLowerCase()
    if (t.includes("purchase") || t.includes("buy")) return "bg-green-500"
    if (t.includes("sale")) return "bg-red-500"
    return "bg-gray-500"
  }

  return (
    <PremiumGate>
      <Card className="p-8 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-6 w-6 text-cyan-500" />
            Senate Trading
          </CardTitle>
          <CardDescription>
            Najnowsze transakcje senatorów USA na rynkach finansowych
            {lastUpdated && (
              <span className="block text-xs text-muted-foreground mt-1">
                Ostatnia aktualizacja: {lastUpdated.toLocaleTimeString("pl-PL")}
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Typ transakcji</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type || ""}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Typ aktywa</label>
              <Select value={filterAssetType} onValueChange={setFilterAssetType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  {uniqueAssetTypes.map((assetType) => (
                    <SelectItem key={assetType} value={assetType || ""}>
                      {assetType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Znaleziono: {filteredTransactions.length} transakcji
            </div>
            <Button onClick={fetchSenateData} disabled={loading} variant="outline" size="sm">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Odświeżanie...
                </>
              ) : (
                "Odśwież"
              )}
            </Button>
          </div>

          {loading && transactions.length === 0 ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-cyan-500" />
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="space-y-4">
              {filteredTransactions.slice(0, 100).map((transaction, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-lg">{transaction.symbol}</span>
                          <Badge className={getTypeBadgeColor(transaction.type)}>
                            {transaction.type}
                          </Badge>
                          {transaction.assetType && (
                            <Badge variant="outline">{transaction.assetType}</Badge>
                          )}
                        </div>
                        {transaction.assetDescription && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {transaction.assetDescription}
                          </p>
                        )}
                      </div>
                      {transaction.link && (
                        <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                          <a
                            href={transaction.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Dokument
                          </a>
                        </Button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      {transaction.firstName && transaction.lastName && (
                        <div>
                          <span className="text-muted-foreground">Senator: </span>
                          <span className="font-medium">
                            {transaction.firstName} {transaction.lastName}
                          </span>
                          {transaction.district && (
                            <span className="text-muted-foreground">
                              {" "}
                              ({transaction.district})
                            </span>
                          )}
                        </div>
                      )}
                      {transaction.owner && (
                        <div>
                          <span className="text-muted-foreground">Właściciel: </span>
                          <span className="font-medium">{transaction.owner}</span>
                        </div>
                      )}
                      {transaction.transactionDate && (
                        <div>
                          <span className="text-muted-foreground">Data transakcji: </span>
                          <span className="font-medium">
                            {new Date(transaction.transactionDate).toLocaleDateString("pl-PL")}
                          </span>
                        </div>
                      )}
                      {transaction.disclosureDate && (
                        <div>
                          <span className="text-muted-foreground">Data ujawnienia: </span>
                          <span className="font-medium">
                            {new Date(transaction.disclosureDate).toLocaleDateString("pl-PL")}
                          </span>
                        </div>
                      )}
                      {transaction.amount && (
                        <div>
                          <span className="text-muted-foreground">Kwota: </span>
                          <span className="font-medium">{transaction.amount}</span>
                        </div>
                      )}
                    </div>

                    {transaction.comment && transaction.comment !== "--" && (
                      <div className="text-sm text-muted-foreground italic border-t pt-2">
                        Uwaga: {transaction.comment}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Brak transakcji dla wybranych filtrów</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PremiumGate>
  )
}
