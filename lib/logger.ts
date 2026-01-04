/**
 * Production-ready logger
 * Replaces console.log/error/warn with structured logging
 */

type LogLevel = "error" | "warn" | "info" | "debug"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"
  private isProduction = process.env.NODE_ENV === "production"

  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(context && { context }),
      ...(error && { error: { message: error.message, stack: error.stack } }),
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry = this.formatMessage(level, message, context, error)

    // In development, use console with colors
    if (this.isDevelopment) {
      const colors = {
        error: "\x1b[31m", // Red
        warn: "\x1b[33m", // Yellow
        info: "\x1b[36m", // Cyan
        debug: "\x1b[90m", // Gray
      }
      const reset = "\x1b[0m"
      
      console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](
        `${colors[level]}[${level.toUpperCase()}]${reset} ${entry.timestamp} - ${message}`,
        ...(context ? [context] : []),
        ...(error ? [error] : [])
      )
      return
    }

    // In production, use structured JSON logging
    if (this.isProduction) {
      // TODO: Send to external logging service (Sentry, LogRocket, etc.)
      // For now, use console but in JSON format
      console.log(JSON.stringify(entry))
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
    if (this.isDevelopment) {
      this.log("debug", message, context)
    }
  }
}

export const logger = new Logger()

