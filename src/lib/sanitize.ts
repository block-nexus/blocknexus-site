/**
 * Maximum input length to prevent DoS attacks during sanitization
 */
const MAX_INPUT_LENGTH = 10000;

// Import DOMPurify for production-grade XSS prevention
// Use require for server-side (Node.js) - this is safe in API routes
type DOMPurifyType = {
  sanitize: (input: string, config: {
    ALLOWED_TAGS?: string[];
    ALLOWED_ATTR?: string[];
    KEEP_CONTENT?: boolean;
    FORBID_TAGS?: string[];
    FORBID_ATTR?: string[];
  }) => string;
};

let DOMPurify: DOMPurifyType | null = null;

function getDOMPurify(): DOMPurifyType | null {
  if (!DOMPurify) {
    try {
      // Use require for server-side (Node.js) - isomorphic-dompurify works synchronously
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
      const createDOMPurify = require('isomorphic-dompurify');
      const purify = (createDOMPurify.default || createDOMPurify) as DOMPurifyType;
      if (purify && typeof purify.sanitize === 'function') {
        DOMPurify = purify;
      }
    } catch {
      return null;
    }
  }
  return DOMPurify;
}

/**
 * Sanitizes user input to prevent XSS attacks
 * Uses DOMPurify for production-grade XSS prevention
 * @throws {Error} If input exceeds MAX_INPUT_LENGTH
 */
export function sanitizeInput(input: string | null | undefined): string {
  if (!input) return '';
  
  // Prevent DoS by limiting input size before processing
  if (input.length > MAX_INPUT_LENGTH) {
    throw new Error('Input exceeds maximum allowed length');
  }
  
  // Use DOMPurify for production-grade sanitization
  // DOMPurify handles Unicode, nested tags, encoding, and edge cases
  const purify = getDOMPurify();
  if (purify) {
    try {
      return purify.sanitize(input, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true,
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'style', 'link'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit'],
      }).trim();
    } catch {
      // Fall through to fallback if sanitization fails
    }
  }
  
  // Fallback to basic sanitization if DOMPurify fails or unavailable
  return input
    .trim()
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Sanitizes hash fragment for safe use in DOM queries
 * Only allows alphanumeric characters and hyphens
 */
export function sanitizeHash(hash: string): string {
  return hash.replace(/[^a-zA-Z0-9-]/g, '');
}

/**
 * Validates that a hash is safe (only contains allowed characters)
 */
export function isValidHash(hash: string): boolean {
  return /^[a-zA-Z0-9-]+$/.test(hash);
}

