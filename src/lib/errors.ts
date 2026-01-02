/**
 * Custom error classes and RFC 7807 Problem Details formatter
 * @see https://datatracker.ietf.org/doc/html/rfc7807
 * 
 * Security Principle: Never expose internal implementation details
 * Similar to how firewalls send generic "Connection Refused" vs detailed ACL info
 */

import { logger } from './logger';

/**
 * Error categories for classification and monitoring
 * Similar to syslog facility codes
 */
export enum ErrorCategory {
  /** Client-side error (4xx) - invalid input, auth failure */
  CLIENT_ERROR = 'CLIENT_ERROR',
  /** Server-side error (5xx) - database failure, timeout */
  SERVER_ERROR = 'SERVER_ERROR',
  /** Security event - CSRF, rate limit, suspicious activity */
  SECURITY_EVENT = 'SECURITY_EVENT',
  /** Validation error - failed schema validation */
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

/**
 * RFC 7807 Problem Details response
 * Standard format for HTTP API errors
 */
export interface ProblemDetails {
  /** A URI reference that identifies the problem type */
  type: string;
  /** A short, human-readable summary */
  title: string;
  /** HTTP status code */
  status: number;
  /** Human-readable explanation specific to this occurrence */
  detail: string;
  /** A URI reference that identifies the specific occurrence */
  instance: string;
  /** Additional problem-specific extension members */
  [key: string]: unknown;
}

/**
 * Base API error class
 * Extends Error with structured metadata for logging and responses
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly category: ErrorCategory;
  public readonly isOperational: boolean;
  public readonly requestId?: string;
  public readonly metadata?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number = 500,
    category: ErrorCategory = ErrorCategory.SERVER_ERROR,
    isOperational: boolean = true,
    requestId?: string,
    metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.category = category;
    this.isOperational = isOperational;
    this.requestId = requestId;
    this.metadata = metadata;

    // Maintain proper stack trace (V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Validation error (400 Bad Request)
 * Used for schema validation failures
 */
export class ValidationError extends ApiError {
  public readonly validationErrors?: Array<{
    field: string;
    message: string;
  }>;

  constructor(
    message: string,
    requestId?: string,
    validationErrors?: Array<{ field: string; message: string }>
  ) {
    super(
      message,
      400,
      ErrorCategory.VALIDATION_ERROR,
      true,
      requestId,
      { validationErrors }
    );
    this.validationErrors = validationErrors;
  }
}

/**
 * Rate limit error (429 Too Many Requests)
 */
export class RateLimitError extends ApiError {
  public readonly retryAfter: number;
  public readonly resetTime: number;

  constructor(
    message: string,
    retryAfter: number,
    resetTime: number,
    requestId?: string
  ) {
    super(
      message,
      429,
      ErrorCategory.SECURITY_EVENT,
      true,
      requestId,
      { retryAfter, resetTime }
    );
    this.retryAfter = retryAfter;
    this.resetTime = resetTime;
  }
}

/**
 * CSRF/Security error (403 Forbidden)
 */
export class SecurityError extends ApiError {
  constructor(message: string, requestId?: string, metadata?: Record<string, unknown>) {
    super(
      message,
      403,
      ErrorCategory.SECURITY_EVENT,
      true,
      requestId,
      metadata
    );
  }
}

/**
 * Request too large error (413 Payload Too Large)
 */
export class PayloadTooLargeError extends ApiError {
  constructor(message: string, requestId?: string, maxSize?: number) {
    super(
      message,
      413,
      ErrorCategory.CLIENT_ERROR,
      true,
      requestId,
      { maxSize }
    );
  }
}

/**
 * Unsupported media type (415)
 */
export class UnsupportedMediaTypeError extends ApiError {
  constructor(message: string, requestId?: string, expectedType?: string) {
    super(
      message,
      415,
      ErrorCategory.CLIENT_ERROR,
      true,
      requestId,
      { expectedType }
    );
  }
}

/**
 * Method not allowed (405)
 */
export class MethodNotAllowedError extends ApiError {
  constructor(message: string, requestId?: string, allowedMethods?: string[]) {
    super(
      message,
      405,
      ErrorCategory.CLIENT_ERROR,
      true,
      requestId,
      { allowedMethods }
    );
  }
}

/**
 * Convert error to RFC 7807 Problem Details format
 * Security: Sanitizes internal error details in production
 */
export function toProblemDetails(
  error: Error | ApiError,
  requestId: string,
  includeStackTrace: boolean = false
): ProblemDetails {
  // Default values for unknown errors
  let statusCode = 500;
  let title = 'Internal Server Error';
  let detail = 'An unexpected error occurred. Please try again later.';
  const type = `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${statusCode}`;

  // If it's our custom ApiError, extract details
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    detail = error.message;
    
    // Map status code to title
    switch (statusCode) {
      case 400:
        title = 'Bad Request';
        break;
      case 403:
        title = 'Forbidden';
        break;
      case 405:
        title = 'Method Not Allowed';
        break;
      case 413:
        title = 'Payload Too Large';
        break;
      case 415:
        title = 'Unsupported Media Type';
        break;
      case 429:
        title = 'Too Many Requests';
        break;
      case 500:
        title = 'Internal Server Error';
        break;
      case 503:
        title = 'Service Unavailable';
        break;
      default:
        title = 'Error';
    }
  }

  // Build problem details response
  const problemDetails: ProblemDetails = {
    type,
    title,
    status: statusCode,
    detail,
    instance: `/request/${requestId}`,
  };

  // Add metadata for specific error types
  if (error instanceof ValidationError && error.validationErrors) {
    // Only include validation details in development
    if (includeStackTrace) {
      problemDetails.errors = error.validationErrors;
    }
  }

  if (error instanceof RateLimitError) {
    problemDetails.retryAfter = error.retryAfter;
    problemDetails.resetTime = error.resetTime;
  }

  if (error instanceof ApiError && error.metadata) {
    // Selectively include safe metadata
    Object.keys(error.metadata).forEach((key) => {
      // Don't include sensitive keys
      if (!['password', 'token', 'secret', 'apiKey'].includes(key)) {
        problemDetails[key] = error.metadata![key];
      }
    });
  }

  // Include stack trace only in development
  if (includeStackTrace && error.stack) {
    problemDetails.stack = error.stack;
  }

  return problemDetails;
}

/**
 * Log error with appropriate severity
 * Maps error categories to log levels
 */
export function logError(
  error: Error | ApiError,
  requestId: string,
  additionalContext?: Record<string, unknown>
): void {
  const context: Record<string, unknown> = {
    requestId,
    error: error.message,
    errorName: error.name,
    stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    ...additionalContext,
  };

  if (error instanceof ApiError) {
    context.metadata = error.metadata;

    // Security events and server errors are critical
    if (error.category === ErrorCategory.SECURITY_EVENT) {
      logger.warn(`Security Event: ${error.message}`, context);
    } else if (error.category === ErrorCategory.SERVER_ERROR) {
      logger.error(`Server Error: ${error.message}`, context);
    } else {
      // Client errors are informational (user mistake, not our fault)
      logger.info(`Client Error: ${error.message}`, context);
    }
  } else {
    // Unknown error - treat as critical
    logger.critical(`Unexpected Error: ${error.message}`, context);
  }
}

/**
 * Check if error is operational (expected) vs programming error (bug)
 * Similar to differentiating between "route not found" vs "null pointer exception"
 */
export function isOperationalError(error: Error | ApiError): boolean {
  if (error instanceof ApiError) {
    return error.isOperational;
  }
  return false;
}
