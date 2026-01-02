/**
 * Structured logging utility following Google Cloud Logging standards
 * @see https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry
 * 
 * Severity Levels (RFC 5424 Syslog):
 * - DEBUG (100): Detailed debug information
 * - INFO (200): Informational messages
 * - WARN (400): Warning conditions
 * - ERROR (500): Error conditions
 * - CRITICAL (600): Critical conditions requiring immediate attention
 */

export enum LogSeverity {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export interface LogContext {
  /** Unique request identifier for correlation */
  requestId?: string;
  /** HTTP method */
  method?: string;
  /** Request path */
  path?: string;
  /** Client IP address (hashed for privacy) */
  clientIpHash?: string;
  /** User agent hash */
  userAgentHash?: string;
  /** Response status code */
  statusCode?: number;
  /** Request duration in milliseconds */
  durationMs?: number;
  /** Additional structured data */
  metadata?: Record<string, unknown>;
  /** Error stack trace (only in non-production) */
  stack?: string;
}

export interface LogEntry {
  severity: LogSeverity;
  message: string;
  timestamp: string;
  context?: LogContext;
}

/**
 * Hash sensitive data for logging (similar to ACL hashing in network devices)
 * Uses truncated SHA-256 to prevent log analysis attacks
 */
function hashSensitiveData(data: string): string {
  if (typeof window !== 'undefined') {
    // Client-side: use simple hash
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data.charCodeAt(i);
      hash |= 0;
    }
    return `hash:${Math.abs(hash).toString(16)}`;
  } else {
    // Server-side: use crypto
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require('crypto');
    return `sha256:${crypto.createHash('sha256').update(data).digest('hex').substring(0, 12)}`;
  }
}

/**
 * Redact PII from log messages
 * Similar to scrubbing sensitive data from syslog exports
 */
function redactPII(message: string): string {
  return message
    // Email addresses
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]')
    // Phone numbers (various formats)
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REDACTED]')
    // Credit card numbers
    .replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CC_REDACTED]')
    // IP addresses (partial redaction - keep first 2 octets)
    .replace(/\b(\d{1,3}\.\d{1,3})\.\d{1,3}\.\d{1,3}\b/g, '$1.x.x');
}

/**
 * Structured logger class
 * In production, this would output JSON logs to Cloud Logging/Datadog
 */
class Logger {
  private minSeverity: LogSeverity;
  private enableSampling: boolean;
  private sampleRate: number;

  constructor() {
    // Production: Only log WARN and above
    // Development: Log everything
    this.minSeverity = process.env.NODE_ENV === 'production' 
      ? LogSeverity.WARN 
      : LogSeverity.DEBUG;
    
    // Enable sampling for high-volume INFO logs in production
    this.enableSampling = process.env.NODE_ENV === 'production';
    this.sampleRate = 0.1; // 10% sampling for INFO logs
  }

  /**
   * Should this log entry be recorded? (implements sampling)
   */
  private shouldLog(severity: LogSeverity): boolean {
    // Always log WARN and above
    if (severity === LogSeverity.WARN || 
        severity === LogSeverity.ERROR || 
        severity === LogSeverity.CRITICAL) {
      return true;
    }

    // Sample INFO/DEBUG logs in production
    if (this.enableSampling && severity === LogSeverity.INFO) {
      return Math.random() < this.sampleRate;
    }

    // Check minimum severity
    const severityOrder = [LogSeverity.DEBUG, LogSeverity.INFO, LogSeverity.WARN, LogSeverity.ERROR, LogSeverity.CRITICAL];
    return severityOrder.indexOf(severity) >= severityOrder.indexOf(this.minSeverity);
  }

  /**
   * Format log entry for output
   * In production, this would be JSON; in dev, human-readable
   */
  private formatLogEntry(entry: LogEntry): string {
    if (process.env.NODE_ENV === 'production' || process.env.LOG_FORMAT === 'json') {
      // Structured JSON for log aggregation systems
      return JSON.stringify({
        severity: entry.severity,
        message: redactPII(entry.message),
        timestamp: entry.timestamp,
        ...entry.context,
      });
    } else {
      // Human-readable for development
      const contextStr = entry.context 
        ? ` | ${JSON.stringify(entry.context, null, 2)}` 
        : '';
      return `[${entry.timestamp}] ${entry.severity}: ${entry.message}${contextStr}`;
    }
  }

  /**
   * Write log entry to output
   * In production, this would push to Cloud Logging API
   */
  private write(severity: LogSeverity, message: string, context?: LogContext): void {
    if (!this.shouldLog(severity)) {
      return;
    }

    const entry: LogEntry = {
      severity,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    const formatted = this.formatLogEntry(entry);

    // Route to appropriate console method
    switch (severity) {
      case LogSeverity.DEBUG:
      case LogSeverity.INFO:
        console.log(formatted);
        break;
      case LogSeverity.WARN:
        console.warn(formatted);
        break;
      case LogSeverity.ERROR:
      case LogSeverity.CRITICAL:
        console.error(formatted);
        break;
    }

    // Note: For future monitoring integration (Sentry/Datadog), add hook here
    // if (severity === LogSeverity.ERROR || severity === LogSeverity.CRITICAL) {
    //   // Example: Sentry.captureMessage(entry.message, { level: 'error', extra: entry.context });
    // }
  }

  /**
   * Public logging methods
   */
  
  debug(message: string, context?: LogContext): void {
    this.write(LogSeverity.DEBUG, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.write(LogSeverity.INFO, message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.write(LogSeverity.WARN, message, context);
  }

  error(message: string, context?: LogContext): void {
    this.write(LogSeverity.ERROR, message, context);
  }

  critical(message: string, context?: LogContext): void {
    this.write(LogSeverity.CRITICAL, message, context);
  }

  /**
   * Log HTTP request completion (similar to access logs in web servers)
   */
  logRequest(context: LogContext): void {
    const severity = context.statusCode && context.statusCode >= 500 
      ? LogSeverity.ERROR 
      : context.statusCode && context.statusCode >= 400 
        ? LogSeverity.WARN 
        : LogSeverity.INFO;

    const message = `${context.method} ${context.path} ${context.statusCode} (${context.durationMs}ms)`;
    this.write(severity, message, context);
  }
}

// Singleton instance
export const logger = new Logger();

/**
 * Utility: Create safe log context from request
 * Hashes sensitive headers to prevent log injection attacks
 */
export function createLogContext(req: {
  method?: string;
  url?: string;
  headers?: Headers;
  ip?: string;
}, requestId: string): LogContext {
  const url = req.url ? new URL(req.url) : null;
  
  // Hash IP and user agent for privacy
  const clientIp = req.ip || req.headers?.get('x-real-ip') || 'unknown';
  const userAgent = req.headers?.get('user-agent') || 'unknown';

  return {
    requestId,
    method: req.method,
    path: url?.pathname,
    clientIpHash: hashSensitiveData(clientIp),
    userAgentHash: hashSensitiveData(userAgent),
  };
}
