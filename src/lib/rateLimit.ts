/**
 * Simple in-memory rate limiting
 * For production, use Redis-based solution (Upstash, etc.)
 */

import { isIP } from 'net';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Cleanup interval for expired rate limit entries
let cleanupInterval: NodeJS.Timeout | null = null;

/**
 * Initialize periodic cleanup of expired rate limit entries
 * Prevents memory leaks in long-running processes
 */
function initializeCleanup(): void {
  if (cleanupInterval || typeof global === 'undefined') return;
  
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach(key => {
      if (store[key].resetTime < now) {
        delete store[key];
      }
    });
  }, 60000); // Clean up every minute
  
  // Clear interval on process exit (for graceful shutdown and hot-reload)
  if (typeof process !== 'undefined') {
    const cleanup = () => {
      if (cleanupInterval) {
        clearInterval(cleanupInterval);
        cleanupInterval = null;
      }
    };
    
    process.on('SIGTERM', cleanup);
    process.on('SIGINT', cleanup);
    // Handle hot-reload in development
    if (process.env.NODE_ENV === 'development') {
      process.on('beforeExit', cleanup);
    }
  }
}

// Initialize cleanup on module load
if (typeof global !== 'undefined') {
  initializeCleanup();
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Simple rate limiter using sliding window
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param maxRequests - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 */
export function rateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  // Clean up expired entries
  if (store[key] && store[key].resetTime < now) {
    delete store[key];
  }

  // Initialize or get existing entry
  if (!store[key]) {
    store[key] = {
      count: 0,
      resetTime: now + windowMs,
    };
  }

  const entry = store[key];

  // Check if limit exceeded
  if (entry.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count += 1;

  return {
    success: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client IP from request headers
 * Validates IP format to prevent spoofing
 * @param headers - Request headers
 * @param trustedProxies - Optional list of trusted proxy IPs
 */
export function getClientIP(headers: Headers, trustedProxies?: string[]): string {
  // Use Node.js built-in IP validation (more efficient than regex)
  // isIP returns 4 for IPv4, 6 for IPv6, 0 for invalid
  
  // Only trust X-Forwarded-For if we have a trusted proxy
  const realIP = headers.get('x-real-ip');
  const forwardedFor = headers.get('x-forwarded-for');
  
  // If we have a trusted proxy and real-ip, use forwarded-for
  if (forwardedFor && realIP && (!trustedProxies || trustedProxies.includes(realIP))) {
    const firstIP = forwardedFor.split(',')[0].trim();
    if (isIP(firstIP)) {
      return firstIP;
    }
  }
  
  // Use real-ip if valid
  if (realIP && isIP(realIP)) {
    return realIP;
  }
  
  // Fallback to anonymous (should use req.ip in Next.js when available)
  return 'anonymous';
}

