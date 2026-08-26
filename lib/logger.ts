/**
 * Centralized logging utility for the application
 * Replaces direct console.log usage with structured logging
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
    this.isProduction = process.env.NODE_ENV === "production";
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log warnings and errors
    if (this.isProduction) {
      return level === "warn" || level === "error";
    }
    // In development, log everything
    return true;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog("info")) {
      console.info(this.formatMessage("info", message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, context));
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog("error")) {
      const errorContext = error instanceof Error
        ? { ...context, error: error.message, stack: error.stack }
        : { ...context, error };
      console.error(this.formatMessage("error", message, errorContext));
    }
  }

  // API-specific logging methods
  apiRequest(method: string, path: string, context?: LogContext): void {
    this.info(`API ${method} ${path}`, context);
  }

  apiResponse(method: string, path: string, status: number, context?: LogContext): void {
    const level = status >= 400 ? "error" : "info";
    this[level](`API ${method} ${path} - ${status}`, context);
  }

  // Database operation logging
  dbOperation(operation: string, collection: string, context?: LogContext): void {
    this.debug(`DB ${operation} on ${collection}`, context);
  }

  // Authentication logging
  authEvent(event: string, context?: LogContext): void {
    this.info(`Auth: ${event}`, context);
  }

  // Job processing logging
  jobEvent(event: string, context?: LogContext): void {
    this.info(`Job: ${event}`, context);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience methods for direct import
export const { debug, info, warn, error, apiRequest, apiResponse, dbOperation, authEvent, jobEvent } = logger;
