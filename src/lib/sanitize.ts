/**
 * Sanitizes user input to prevent XSS attacks
 * Removes all HTML tags and dangerous characters
 */
export function sanitizeInput(input: string | null | undefined): string {
  if (!input) return '';
  
  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags and event handlers
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    // Remove dangerous characters
    .replace(/[<>]/g, '')
    // Normalize whitespace
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

