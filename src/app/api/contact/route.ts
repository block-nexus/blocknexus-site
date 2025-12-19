import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { contactFormSchema } from '@/lib/validation';
import { sanitizeInput } from '@/lib/sanitize';
import { rateLimit, getClientIP } from '@/lib/rateLimit';
import { RATE_LIMITS, ERROR_MESSAGES } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(req.headers);
    const rateLimitResult = rateLimit(
      clientIP,
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

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.FORM_INVALID,
          details: 'Invalid JSON in request body',
        },
        { status: 400 }
      );
    }

    // Sanitize all string inputs
    const sanitizedBody = {
      name: sanitizeInput(body.name),
      email: sanitizeInput(body.email),
      message: sanitizeInput(body.message),
      company: sanitizeInput(body.company),
      phone: sanitizeInput(body.phone),
      service: sanitizeInput(body.service),
      consent: body.consent,
    };

    // Validate with Zod schema
    const validated = contactFormSchema.parse(sanitizedBody);

    // TODO: Send email notification or save to database
    // Example:
    // await sendEmail({
    //   to: 'contact@blocknexus.tech',
    //   subject: `New Contact Form Submission from ${validated.name}`,
    //   body: `Email: ${validated.email}\nMessage: ${validated.message}`,
    // });

    // Log successful submission (without sensitive data)
    console.log('Contact form submission received:', {
      name: validated.name,
      email: validated.email,
      service: validated.service,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! We will be in touch soon.',
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': String(RATE_LIMITS.CONTACT_FORM.MAX_REQUESTS),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        },
      }
    );
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.FORM_INVALID,
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
        },
        { status: 400 }
      );
    }

    // Log error for monitoring
    console.error('Contact form submission error:', error);

    // Return generic error to client (don't leak stack traces)
    return NextResponse.json(
      {
        error: ERROR_MESSAGES.FORM_SUBMISSION_FAILED,
      },
      { status: 500 }
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

