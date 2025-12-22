/**
 * Comprehensive test suite for contact form API route
 * Tests all security fixes and edge cases identified in the 6-phase review
 */

import { POST, GET } from './route';
import { NextRequest } from 'next/server';
import { RATE_LIMITS, SECURITY_CONFIG, ERROR_MESSAGES } from '@/lib/constants';

// Mock dependencies
jest.mock('@/lib/rateLimit', () => ({
  rateLimit: jest.fn(),
  getClientIP: jest.fn(),
}));

jest.mock('@/lib/sanitize', () => ({
  sanitizeInput: jest.fn((input: string) => input || ''),
}));

jest.mock('@/lib/validation', () => ({
  contactFormSchema: {
    parse: jest.fn((data: unknown) => data),
  },
}));

jest.mock('@/lib/constants', () => ({
  RATE_LIMITS: {
    CONTACT_FORM: {
      MAX_REQUESTS: 3,
      WINDOW_MS: 3600000,
    },
  },
  ERROR_MESSAGES: {
    FORM_REQUIRED: 'Please fill in all required fields.',
    FORM_SUBMISSION_FAILED: 'Failed to submit form. Please try again.',
    FORM_RATE_LIMIT: 'Too many submissions. Please wait before trying again.',
    FORM_INVALID: 'Please check your input and try again.',
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  },
  SECURITY_CONFIG: {
    MAX_BODY_SIZE: 10 * 1024,
    ALLOWED_ORIGINS: [
      'https://blocknexus.tech',
      'http://localhost:3000',
    ],
  },
}));

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'test-request-id'),
  createHash: jest.fn(() => ({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn(() => 'abcdef1234567890'),
  })),
}));

import { rateLimit, getClientIP } from '@/lib/rateLimit';
import { sanitizeInput } from '@/lib/sanitize';
import { contactFormSchema } from '@/lib/validation';

const mockRateLimit = rateLimit as jest.MockedFunction<typeof rateLimit>;
const mockGetClientIP = getClientIP as jest.MockedFunction<typeof getClientIP>;
const mockSanitizeInput = sanitizeInput as jest.MockedFunction<typeof sanitizeInput>;
const mockContactFormSchema = contactFormSchema as { parse: jest.MockedFunction<typeof contactFormSchema.parse> };

// Helper to create NextRequest with proper URL
function createRequest(options: {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: string | object;
  ip?: string;
}): NextRequest {
  const {
    method = 'POST',
    url = 'http://localhost:3000/api/contact',
    headers = {},
    body,
    ip,
  } = options;

  const request = new NextRequest(url, {
    method,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: typeof body === 'string' ? body : body ? JSON.stringify(body) : undefined,
  });

  // Mock the ip property
  if (ip !== undefined) {
    Object.defineProperty(request, 'ip', {
      value: ip,
      writable: false,
    });
  }

  return request;
}

describe('Contact Form API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
    mockGetClientIP.mockReturnValue('192.168.1.1');
    mockRateLimit.mockReturnValue({
      success: true,
      remaining: 2,
      resetTime: Date.now() + 3600000,
    });
    mockSanitizeInput.mockImplementation((input) => input || '');
    mockContactFormSchema.parse.mockImplementation((data) => data);
  });

  describe('CSRF Protection', () => {
    it('should reject requests without origin or referer headers', async () => {
      const req = createRequest({
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message with enough characters',
          consent: 'on',
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Origin or Referer header required');
    });

    it('should accept requests with valid origin header', async () => {
      const req = createRequest({
        headers: { origin: 'http://localhost:3000' },
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message with enough characters',
          consent: 'on',
        },
      });

      const response = await POST(req);
      expect(response.status).toBe(200);
    });

    it('should reject requests with invalid origin header', async () => {
      const req = createRequest({
        headers: { origin: 'https://evil.com' },
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message with enough characters',
          consent: 'on',
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Invalid origin');
    });

    it('should prevent subdomain spoofing attacks', async () => {
      const req = createRequest({
        headers: { referer: 'https://blocknexus.tech.evil.com/contact' },
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message with enough characters',
          consent: 'on',
        },
      });

      const response = await POST(req);
      const data = await response.json();

      // Should reject because host doesn't match exactly
      expect(response.status).toBe(403);
      expect(data.error).toBe('Invalid referer');
    });

    it('should accept valid referer with subpath', async () => {
      const req = createRequest({
        headers: { referer: 'http://localhost:3000/contact' },
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message with enough characters',
          consent: 'on',
        },
      });

      const response = await POST(req);
      expect(response.status).toBe(200);
    });
  });

  describe('Content-Type Validation', () => {
    it('should reject requests without JSON content-type', async () => {
      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
          'content-type': 'text/plain',
        },
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
          consent: 'on',
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(415);
      expect(data.error).toBe('Invalid content type');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      mockRateLimit.mockReturnValue({
        success: false,
        remaining: 0,
        resetTime: Date.now() + 3600000,
      });

      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
        },
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message with enough characters',
          consent: 'on',
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toBe(ERROR_MESSAGES.FORM_RATE_LIMIT);
      expect(response.headers.get('Retry-After')).toBeTruthy();
    });

    it('should use unique identifier when IP is unavailable', async () => {
      mockGetClientIP.mockReturnValue('anonymous');

      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
        },
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message with enough characters',
          consent: 'on',
        },
      });

      await POST(req);

      // Should call rateLimit with request ID-based identifier
      expect(mockRateLimit).toHaveBeenCalledWith(
        expect.stringContaining('req-'),
        RATE_LIMITS.CONTACT_FORM.MAX_REQUESTS,
        RATE_LIMITS.CONTACT_FORM.WINDOW_MS
      );
    });
  });

  describe('Request Body Size Validation', () => {
    it('should reject requests exceeding Content-Length limit', async () => {
      const largeSize = SECURITY_CONFIG.MAX_BODY_SIZE + 1;
      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
          'content-length': String(largeSize),
        },
        body: { test: 'data' },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(413);
      expect(data.error).toBe('Request too large');
    });

    it('should reject requests with body exceeding size limit after reading', async () => {
      const largeBody = 'x'.repeat(SECURITY_CONFIG.MAX_BODY_SIZE + 1);
      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
        },
        body: { message: largeBody },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(413);
      expect(data.error).toBe('Request too large');
    });
  });

  describe('JSON Parsing', () => {
    it('should reject invalid JSON', async () => {
      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
        },
        body: 'invalid json{',
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(ERROR_MESSAGES.FORM_INVALID);
      expect(data.details).toBe('Invalid JSON in request body');
    });

    it('should reject non-object JSON (arrays)', async () => {
      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
        },
        body: '[1, 2, 3]',
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(ERROR_MESSAGES.FORM_INVALID);
    });

    it('should reject null JSON', async () => {
      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
        },
        body: 'null',
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(ERROR_MESSAGES.FORM_INVALID);
    });
  });

  describe('Field Validation', () => {
    it('should reject requests with missing consent field', async () => {
      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
        },
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message with enough characters',
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(ERROR_MESSAGES.FORM_INVALID);
    });

    it('should reject requests with wrong consent value', async () => {
      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
        },
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message with enough characters',
          consent: 'off',
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(ERROR_MESSAGES.FORM_INVALID);
    });

    it('should reject requests with non-string name field', async () => {
      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
        },
        body: {
          name: 123,
          email: 'test@example.com',
          message: 'Test message with enough characters',
          consent: 'on',
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(ERROR_MESSAGES.FORM_INVALID);
    });

    it('should handle short names safely (no substring crash)', async () => {
      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
        },
        body: {
          name: 'A',
          email: 'test@example.com',
          message: 'Test message with enough characters',
          consent: 'on',
        },
      });

      process.env.NODE_ENV = 'development';
      const response = await POST(req);

      // Should not crash, should return 200 or validation error
      expect([200, 400]).toContain(response.status);
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize all string inputs', async () => {
      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
        },
        body: {
          name: '<script>alert(1)</script>Test',
          email: 'test@example.com',
          message: 'Test message with enough characters',
          consent: 'on',
        },
      });

      await POST(req);

      expect(mockSanitizeInput).toHaveBeenCalledWith('<script>alert(1)</script>Test');
      expect(mockSanitizeInput).toHaveBeenCalledWith('test@example.com');
      expect(mockSanitizeInput).toHaveBeenCalledWith('Test message with enough characters');
    });

    it('should handle sanitization errors gracefully', async () => {
      mockSanitizeInput.mockImplementation(() => {
        throw new Error('Input too large');
      });

      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
        },
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message with enough characters',
          consent: 'on',
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(ERROR_MESSAGES.FORM_INVALID);
      expect(data.details).toBe('Input too large');
    });
  });

  describe('Zod Validation', () => {
    it('should handle Zod validation errors with 400 status', async () => {
      // Import z from zod to create proper ZodError
      const { z } = await import('zod');
      const zodError = new z.ZodError([
        {
          code: 'custom',
          path: ['email'],
          message: 'Invalid email',
        },
      ]);
      
      mockContactFormSchema.parse.mockImplementation(() => {
        throw zodError;
      });

      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
        },
        body: {
          name: 'Test User',
          email: 'invalid-email',
          message: 'Test message with enough characters',
          consent: 'on',
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe(ERROR_MESSAGES.FORM_INVALID);
    });
  });

  describe('Successful Submission', () => {
    it('should return success response for valid submission', async () => {
      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
        },
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message with enough characters',
          consent: 'on',
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Thank you! We will be in touch soon.');
      expect(response.headers.get('X-Request-ID')).toBe('test-request-id');
    });

    it('should include rate limit headers in success response', async () => {
      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
        },
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message with enough characters',
          consent: 'on',
        },
      });

      const response = await POST(req);

      expect(response.headers.get('X-RateLimit-Limit')).toBe(String(RATE_LIMITS.CONTACT_FORM.MAX_REQUESTS));
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('2');
    });
  });

  describe('Error Handling', () => {
    it('should return 500 for unexpected errors', async () => {
      mockContactFormSchema.parse.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const req = createRequest({
        headers: {
          origin: 'http://localhost:3000',
        },
        body: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message with enough characters',
          consent: 'on',
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe(ERROR_MESSAGES.FORM_SUBMISSION_FAILED);
    });

    it('should include request ID in error responses', async () => {
      const req = createRequest({
        body: {},
      });

      const response = await POST(req);

      expect(response.headers.get('X-Request-ID')).toBe('test-request-id');
    });
  });

  describe('GET Method', () => {
    it('should return 405 for GET requests', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(405);
      expect(data.error).toBe('Method not allowed');
    });
  });
});
