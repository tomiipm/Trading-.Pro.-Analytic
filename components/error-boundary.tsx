"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error | null; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to external service in production
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to error tracking service (Sentry, etc.)
      // For now, use console.error as fallback
      console.error("ErrorBoundary caught an error:", error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback
        return <Fallback error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Coś poszło nie tak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę lub skontaktuj się z supportem, jeśli problem się powtarza.
              </p>
              {this.state.error && process.env.NODE_ENV === "development" && (
                <div className="bg-destructive/10 border border-destructive/50 rounded p-3">
                  <p className="text-sm font-mono text-destructive break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={this.resetError} variant="outline" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Spróbuj ponownie
                </Button>
                <Button onClick={() => window.location.href = "/"} variant="default" className="flex-1">
                  Strona główna
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

