import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID, createHash } from 'crypto';
import { contactFormSchema } from '@/lib/validation';
import { sanitizeInput } from '@/lib/sanitize';
import { rateLimit, getClientIP } from '@/lib/rateLimit';
import { RATE_LIMITS, ERROR_MESSAGES, SECURITY_CONFIG } from '@/lib/constants';
import { logger, createLogContext, type LogContext } from '@/lib/logger';
import {
  ApiError,
  ValidationError,
  RateLimitError,
  SecurityError,
  PayloadTooLargeError,
  UnsupportedMediaTypeError,
  toProblemDetails,
  logError,
} from '@/lib/errors';
import { sendContactFormNotification, sendContactFormConfirmation } from '@/lib/email';

// FIX: Helper to validate referer URL to prevent subdomain spoofing attacks
// Validates that referer exactly matches an allowed origin or is a subpath of it
function isValidRefererUrl(referer: string, allowedOrigins: readonly string[]): boolean {
  try {
    const refererUrl = new URL(referer);
    const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
    
    // FIX: Use exact match or proper path validation instead of startsWith
    // This prevents attacks like "https://blocknexus.tech.evil.com"
    return allowedOrigins.some(allowed => {
      if (refererOrigin === allowed) return true;
      // Allow subpaths of allowed origins (e.g., https://blocknexus.tech/contact)
      try {
        const allowedUrl = new URL(allowed);
        return allowedUrl.host === refererUrl.host && 
               allowedUrl.protocol === refererUrl.protocol;
      } catch {
        return false;
      }
    });
  } catch {
    // Invalid URL format
    return false;
  }
}

// FIX: Generate unique rate limit identifier to prevent shared rate limit buckets
// Uses request ID + IP to ensure each request gets unique tracking
function getRateLimitIdentifier(req: NextRequest, requestId: string): string {
  const clientIP = req.ip || getClientIP(req.headers);
  // FIX: Prevent 'anonymous' fallback from creating shared rate limit bucket
  // Use request ID as part of identifier when IP is unavailable
  if (clientIP === 'anonymous' || !clientIP) {
    // In production, this should be logged as a security event
    // For now, use request ID to ensure unique tracking
    return `req-${requestId}`;
  }
  return clientIP;
}

export async function POST(req: NextRequest) {
  const requestId = randomUUID();
  const startTime = Date.now();
  
  // Initialize request context for logging
  const logContext: LogContext = createLogContext(req, requestId);
  
  logger.info('Contact form request received', logContext);
  
  try {
    // CSRF Protection: Validate Origin and Referer
    // Require at least one valid Origin or Referer header for POST requests
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    
    // FIX: Validate origin with exact match (prevents subdomain spoofing)
    const isValidOrigin = origin && SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin);
    
    // FIX: Validate referer with proper URL parsing (prevents subdomain bypass)
    const isValidReferer = referer ? isValidRefererUrl(referer, SECURITY_CONFIG.ALLOWED_ORIGINS) : false;
    
    // Reject if both origin and referer are missing (CSRF protection)
    if (!origin && !referer) {
      throw new SecurityError(
        'Origin or Referer header required',
        requestId,
        { missingHeaders: ['origin', 'referer'] }
      );
    }
    
    // Reject if origin is present but invalid, and referer is also invalid or missing
    if (origin && !isValidOrigin && !isValidReferer) {
      throw new SecurityError(
        'Invalid origin',
        requestId,
        { origin, expectedOrigins: SECURITY_CONFIG.ALLOWED_ORIGINS }
      );
    }
    
    // If no origin but referer is present and invalid, reject
    if (!origin && referer && !isValidReferer) {
      throw new SecurityError(
        'Invalid referer',
        requestId,
        { referer }
      );
    }
    
    // Content-Type validation
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new UnsupportedMediaTypeError(
        'Invalid content type',
        requestId,
        'application/json'
      );
    }
    
    // FIX: Use improved rate limit identifier to prevent shared buckets
    const rateLimitIdentifier = getRateLimitIdentifier(req, requestId);
    const rateLimitResult = rateLimit(
      rateLimitIdentifier,
      RATE_LIMITS.CONTACT_FORM.MAX_REQUESTS,
      RATE_LIMITS.CONTACT_FORM.WINDOW_MS
    );

    if (!rateLimitResult.success) {
      const retryAfterSeconds = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
      throw new RateLimitError(
        ERROR_MESSAGES.FORM_RATE_LIMIT,
        retryAfterSeconds,
        rateLimitResult.resetTime,
        requestId
      );
    }

    // FIX: Check Content-Length header first to prevent reading large bodies into memory
    const contentLength = req.headers.get('content-length');
    if (contentLength) {
      const contentLengthNum = parseInt(contentLength, 10);
      if (!isNaN(contentLengthNum) && contentLengthNum > SECURITY_CONFIG.MAX_BODY_SIZE) {
        throw new PayloadTooLargeError(
          'Request too large',
          requestId,
          SECURITY_CONFIG.MAX_BODY_SIZE
        );
      }
    }

    // Parse and validate request body with size limit and timeout
    // Read body as text first to check actual size (prevents Content-Length spoofing)
    let bodyText: string;
    try {
      // FIX: Use Promise.race for timeout (Next.js Request doesn't support AbortSignal)
      // Note: This doesn't cancel the underlying stream, but Content-Length check prevents large reads
      bodyText = await Promise.race([
        req.text(),
        new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        ),
      ]);
      
      // FIX: Check actual body size after reading (defense in depth)
      if (bodyText.length > SECURITY_CONFIG.MAX_BODY_SIZE) {
        throw new PayloadTooLargeError(
          'Request body exceeds size limit',
          requestId,
          SECURITY_CONFIG.MAX_BODY_SIZE
        );
      }
    } catch (err) {
      // Handle timeout or read errors
      if (err instanceof ApiError) {
        throw err; // Re-throw our custom errors
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Failed to read request body', {
        requestId,
        metadata: { error: errorMessage },
      });
      
      throw new ValidationError(
        'Invalid request body or timeout',
        requestId
      );
    }

    // Parse JSON from body text
    let body: unknown;
    try {
      body = JSON.parse(bodyText);
    } catch (err) {
      logger.warn('JSON parse error', {
        requestId,
        metadata: { error: err instanceof Error ? err.message : 'Unknown error' },
      });
      
      throw new ValidationError(
        'Invalid JSON in request body',
        requestId
      );
    }

    // Validate types before sanitization (prevent type confusion attacks)
    // Explicitly reject arrays and null (only allow plain objects)
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      throw new ValidationError(
        'Request body must be a JSON object',
        requestId
      );
    }

    const bodyObj = body as Record<string, unknown>;
    
    // FIX: Check consent field exists before comparison (prevents TypeError)
    // Validate all required fields are strings (or correct types)
    if (typeof bodyObj.name !== 'string' ||
        typeof bodyObj.email !== 'string' ||
        typeof bodyObj.message !== 'string' ||
        (bodyObj.company !== undefined && typeof bodyObj.company !== 'string') ||
        (bodyObj.phone !== undefined && typeof bodyObj.phone !== 'string') ||
        (bodyObj.service !== undefined && typeof bodyObj.service !== 'string') ||
        bodyObj.consent !== 'on') {
      throw new ValidationError(
        'Invalid field types or missing consent',
        requestId
      );
    }

    // FIX: Type narrowing - we've validated types above, so these are guaranteed strings
    const nameStr = bodyObj.name;
    const emailStr = bodyObj.email;
    const messageStr = bodyObj.message;
    const companyStr = typeof bodyObj.company === 'string' ? bodyObj.company : '';
    const phoneStr = typeof bodyObj.phone === 'string' ? bodyObj.phone : '';
    const serviceStr = typeof bodyObj.service === 'string' ? bodyObj.service : '';

    // Sanitize all string inputs (with error handling for length limits)
    let sanitizedBody;
    try {
      sanitizedBody = {
        name: sanitizeInput(nameStr),
        email: sanitizeInput(emailStr),
        message: sanitizeInput(messageStr),
        company: sanitizeInput(companyStr),
        phone: sanitizeInput(phoneStr),
        service: sanitizeInput(serviceStr),
        consent: bodyObj.consent,
      };
    } catch (err) {
      logger.warn('Sanitization error', {
        requestId,
        metadata: { error: err instanceof Error ? err.message : 'Unknown error' },
      });
      
      throw new ValidationError(
        'Input too large or contains invalid characters',
        requestId
      );
    }

    // Validate with Zod schema
    let validated;
    try {
      validated = contactFormSchema.parse(sanitizedBody);
    } catch (err) {
      // Handle Zod validation errors
      if (err instanceof z.ZodError) {
        const validationErrors = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        
        logger.info('Form validation failed', {
          requestId,
          metadata: { validationErrors },
        });
        
        throw new ValidationError(
          ERROR_MESSAGES.FORM_INVALID,
          requestId,
          validationErrors
        );
      }
      throw err; // Re-throw non-Zod errors
    }

    // Send email notifications
    try {
      // Send notification to admin (await to ensure it completes)
      await sendContactFormNotification({
        name: validated.name,
        email: validated.email,
        message: validated.message,
        company: validated.company,
        phone: validated.phone,
        service: validated.service,
      });

      // Send confirmation to user (fire and forget - don't await)
      // If confirmation fails, we still want to return success
      sendContactFormConfirmation({
        name: validated.name,
        email: validated.email,
        message: validated.message,
        company: validated.company,
        phone: validated.phone,
        service: validated.service,
      }).catch((error) => {
        // Log confirmation email failures but don't fail the request
        logger.warn('Failed to send confirmation email', {
          requestId,
          metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        });
      });
    } catch (error) {
      // If admin notification fails, log but don't fail the request
      // This ensures form submissions still succeed even if email service is down
      logger.error('Failed to send contact form notification email', {
        requestId,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      
      // In production, we might want to queue the email for retry
      // For now, we'll log and continue
    }

    // Log successful submission (with PII redaction)
    const nameRedacted = validated.name.length >= 2 
      ? validated.name.substring(0, 2) + '***'
      : '***';
    const emailHash = createHash('sha256')
      .update(validated.email)
      .digest('hex')
      .substring(0, 8);
    
    logger.info('Contact form submitted successfully', {
      requestId,
      metadata: {
        nameRedacted,
        emailHash: `sha256:${emailHash}`,
        service: validated.service,
        hasCompany: !!validated.company,
        hasPhone: !!validated.phone,
      },
    });

    // Log successful request completion
    const durationMs = Date.now() - startTime;
    logger.logRequest({
      ...logContext,
      statusCode: 200,
      durationMs,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! We will be in touch soon.',
      },
      {
        status: 200,
        headers: {
          'X-Request-ID': requestId,
          'X-RateLimit-Limit': String(RATE_LIMITS.CONTACT_FORM.MAX_REQUESTS),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        },
      }
    );
  } catch (error) {
    const durationMs = Date.now() - startTime;
    
    // Handle our custom API errors
    if (error instanceof ApiError) {
      logError(error, requestId);
      
      const problemDetails = toProblemDetails(
        error,
        requestId,
        process.env.NODE_ENV === 'development'
      );

      // Build response headers
      const headers: Record<string, string> = {
        'X-Request-ID': requestId,
        'Content-Type': 'application/problem+json',
      };

      // Add rate limit headers if applicable
      if (error instanceof RateLimitError) {
        headers['X-RateLimit-Limit'] = String(RATE_LIMITS.CONTACT_FORM.MAX_REQUESTS);
        headers['X-RateLimit-Remaining'] = '0';
        headers['X-RateLimit-Reset'] = String(error.resetTime);
        headers['Retry-After'] = String(error.retryAfter);
      }

      // Log error response
      logger.logRequest({
        ...logContext,
        statusCode: error.statusCode,
        durationMs,
      });

      return NextResponse.json(problemDetails, {
        status: error.statusCode,
        headers,
      });
    }

    // Handle unexpected errors (Zod errors should already be caught)
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      
      const validationError = new ValidationError(
        ERROR_MESSAGES.FORM_INVALID,
        requestId,
        validationErrors
      );
      
      logError(validationError, requestId);
      
      const problemDetails = toProblemDetails(
        validationError,
        requestId,
        process.env.NODE_ENV === 'development'
      );

      logger.logRequest({
        ...logContext,
        statusCode: 400,
        durationMs,
      });

      return NextResponse.json(problemDetails, {
        status: 400,
        headers: {
          'X-Request-ID': requestId,
          'Content-Type': 'application/problem+json',
        },
      });
    }

    // Unknown error - treat as internal server error
    const unexpectedError = error instanceof Error ? error : new Error('Unknown error');
    logError(unexpectedError, requestId, { unexpected: true });
    
    const problemDetails = toProblemDetails(
      new ApiError(
        ERROR_MESSAGES.FORM_SUBMISSION_FAILED,
        500,
        undefined,
        false,
        requestId
      ),
      requestId,
      process.env.NODE_ENV === 'development'
    );

    logger.logRequest({
      ...logContext,
      statusCode: 500,
      durationMs,
    });

    return NextResponse.json(problemDetails, {
      status: 500,
      headers: {
        'X-Request-ID': requestId,
        'Content-Type': 'application/problem+json',
      },
    });
  }
}

// Only allow POST requests
export async function GET() {
  const requestId = randomUUID();
  const error = new ApiError(
    'Method not allowed',
    405,
    undefined,
    true,
    requestId
  );
  
  logError(error, requestId);
  
  const problemDetails = toProblemDetails(error, requestId);
  
  return NextResponse.json(problemDetails, {
    status: 405,
    headers: {
      'X-Request-ID': requestId,
      'Content-Type': 'application/problem+json',
      'Allow': 'POST',
    },
  });
}

