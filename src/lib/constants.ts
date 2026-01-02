/**
 * Application constants
 * Centralized configuration values
 */

export const TIMEOUTS = {
  FORM_SUBMISSION: 30000, // 30 seconds for API calls
  HASH_SCROLL_DELAY: 100, // ms delay for hash scrolling
  RATE_LIMIT_WINDOW: 3600000, // 1 hour in ms
} as const;

export const RATE_LIMITS = {
  CONTACT_FORM: {
    MAX_REQUESTS: 3,
    WINDOW_MS: 3600000, // 1 hour
  },
} as const;

export const INPUT_LIMITS = {
  NAME_MAX: 100,
  EMAIL_MAX: 255,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 5000,
  COMPANY_MAX: 200,
  PHONE_MAX: 20,
} as const;

export const ERROR_MESSAGES = {
  FORM_REQUIRED: 'Please fill in all required fields.',
  FORM_SUBMISSION_FAILED: 'Failed to submit form. Please try again.',
  FORM_RATE_LIMIT: 'Too many submissions. Please wait before trying again.',
  FORM_INVALID: 'Please check your input and try again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
} as const;

export const SECURITY_CONFIG = {
  MAX_BODY_SIZE: 10 * 1024, // 10KB
  ALLOWED_ORIGINS: [
    'https://blocknexus.tech',
    // Allow Vercel preview deployments
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    // Allow custom domain if set
    process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin : null,
    // Development
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
  ].filter(Boolean) as string[],
} as const;

