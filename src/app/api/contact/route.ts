import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID, createHash } from 'crypto';
import { contactFormSchema } from '@/lib/validation';
import { sanitizeInput } from '@/lib/sanitize';
import { rateLimit, getClientIP } from '@/lib/rateLimit';
import { RATE_LIMITS, ERROR_MESSAGES, SECURITY_CONFIG } from '@/lib/constants';

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
      return NextResponse.json(
        { error: 'Origin or Referer header required' },
        { status: 403, headers: { 'X-Request-ID': requestId } }
      );
    }
    
    // Reject if origin is present but invalid, and referer is also invalid or missing
    if (origin && !isValidOrigin && !isValidReferer) {
      return NextResponse.json(
        { error: 'Invalid origin' },
        { status: 403, headers: { 'X-Request-ID': requestId } }
      );
    }
    
    // If no origin but referer is present and invalid, reject
    if (!origin && referer && !isValidReferer) {
      return NextResponse.json(
        { error: 'Invalid referer' },
        { status: 403, headers: { 'X-Request-ID': requestId } }
      );
    }
    
    // Content-Type validation
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 415, headers: { 'X-Request-ID': requestId } }
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
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.FORM_RATE_LIMIT,
          resetTime: rateLimitResult.resetTime,
        },
        {
          status: 429,
          headers: {
            'X-Request-ID': requestId,
            'X-RateLimit-Limit': String(RATE_LIMITS.CONTACT_FORM.MAX_REQUESTS),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.resetTime),
            'Retry-After': String(
              Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    // FIX: Check Content-Length header first to prevent reading large bodies into memory
    const contentLength = req.headers.get('content-length');
    if (contentLength) {
      const contentLengthNum = parseInt(contentLength, 10);
      if (!isNaN(contentLengthNum) && contentLengthNum > SECURITY_CONFIG.MAX_BODY_SIZE) {
        return NextResponse.json(
          { error: 'Request too large' },
          { status: 413, headers: { 'X-Request-ID': requestId } }
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
        return NextResponse.json(
          { error: 'Request too large' },
          { status: 413, headers: { 'X-Request-ID': requestId } }
        );
      }
    } catch (err) {
      // FIX: Preserve error context for logging while not exposing to client
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Body read error:', { requestId, error: errorMessage });
      
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.FORM_INVALID,
          details: 'Invalid request body or timeout',
        },
        { status: 400, headers: { 'X-Request-ID': requestId } }
      );
    }

    // Parse JSON from body text
    let body: unknown;
    try {
      body = JSON.parse(bodyText);
    } catch (err) {
      // FIX: Log JSON parse errors for debugging
      console.error('JSON parse error:', { requestId, error: err instanceof Error ? err.message : 'Unknown error' });
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.FORM_INVALID,
          details: 'Invalid JSON in request body',
        },
        { status: 400, headers: { 'X-Request-ID': requestId } }
      );
    }

    // Validate types before sanitization (prevent type confusion attacks)
    // Explicitly reject arrays and null (only allow plain objects)
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORM_INVALID },
        { status: 400, headers: { 'X-Request-ID': requestId } }
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
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORM_INVALID },
        { status: 400, headers: { 'X-Request-ID': requestId } }
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
      // FIX: Log sanitization errors for monitoring
      console.error('Sanitization error:', { requestId, error: err instanceof Error ? err.message : 'Unknown error' });
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.FORM_INVALID,
          details: 'Input too large',
        },
        { status: 400, headers: { 'X-Request-ID': requestId } }
      );
    }

    // Validate with Zod schema
    let validated;
    try {
      validated = contactFormSchema.parse(sanitizedBody);
    } catch (err) {
      // FIX: Handle Zod errors before they reach outer catch (prevents 500 errors)
      if (err instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: ERROR_MESSAGES.FORM_INVALID,
            // Only expose details in development
            ...(process.env.NODE_ENV === 'development' && {
              details: err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
            }),
          },
          { status: 400, headers: { 'X-Request-ID': requestId } }
        );
      }
      throw err; // Re-throw non-Zod errors
    }

    // Note: Email notification or database persistence should be implemented here
    // For production, integrate with email service (Resend, SendGrid, etc.) or database

    // Log successful submission (with PII redaction)
    // Only log in development or if structured logging is configured
    if (process.env.NODE_ENV === 'development') {
      // FIX: Safe substring operation - handle names shorter than 2 characters
      const nameRedacted = validated.name.length >= 2 
        ? validated.name.substring(0, 2) + '***'
        : '***';
      const emailHash = createHash('sha256')
        .update(validated.email)
        .digest('hex')
        .substring(0, 8);
      
      console.log('Contact form submission received:', {
        requestId,
        name: nameRedacted,
        emailHash: `sha256:${emailHash}`,
        service: validated.service,
        timestamp: new Date().toISOString(),
      });
    }

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
    // FIX: Zod errors should already be handled above, but keep as fallback
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.FORM_INVALID,
          // Only expose details in development
          ...(process.env.NODE_ENV === 'development' && {
            details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
          }),
        },
        { status: 400, headers: { 'X-Request-ID': requestId } }
      );
    }

    // Log error for monitoring (with request ID for correlation)
    // FIX: Enhanced error logging with stack trace in development
    console.error('Contact form submission error:', {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // Return generic error to client (don't leak stack traces)
    return NextResponse.json(
      {
        error: ERROR_MESSAGES.FORM_SUBMISSION_FAILED,
      },
      { status: 500, headers: { 'X-Request-ID': requestId } }
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

