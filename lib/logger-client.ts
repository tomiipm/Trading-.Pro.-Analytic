/**
 * Client-side logger
 * For use in React components
 */

type LogLevel = "error" | "warn" | "info" | "debug"

class ClientLogger {
  private isDevelopment = process.env.NODE_ENV === "development"

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    // In production, only log errors
    if (!this.isDevelopment && level !== "error") {
      return
    }

    const timestamp = new Date().toISOString()
    const prefix = `[${level.toUpperCase()}] ${timestamp}`

    if (this.isDevelopment) {
      const colors = {
        error: "\x1b[31m",
        warn: "\x1b[33m",
        info: "\x1b[36m",
        debug: "\x1b[90m",
      }
      const reset = "\x1b[0m"
      
      console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](
        `${colors[level]}${prefix}${reset} - ${message}`,
        ...(context ? [context] : []),
        ...(error ? [error] : [])
      )
    } else {
      // In production, send to error tracking service
      if (level === "error") {
        // Client-side error logging for production
        // Future enhancement: Integrate with error tracking service (Sentry, LogRocket, etc.)
        // Current implementation uses console.error with JSON format
        console.error(JSON.stringify({ level, message, timestamp, context, error: error?.message }))
      }
    }
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log("error", message, error ? { ...context, error: error.message } : context, error)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log("warn", message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log("info", message, context)
  }

  debug(message: string, context?: Record<string, any>) {
    this.log("debug", message, context)
  }
}

export const clientLogger = new ClientLogger()

