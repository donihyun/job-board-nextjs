import { NextRequest, NextResponse } from "next/server";
import { logger } from "./logger";

/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up old entries every 5 minutes
    if (typeof window === "undefined") {
      this.cleanupInterval = setInterval(() => {
        this.cleanup();
      }, 5 * 60 * 1000);
    }
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier for the requester (IP, user ID, etc.)
   * @param limit - Maximum number of requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns Whether the request is allowed
   */
  check(identifier: string, limit: number, windowMs: number): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      const resetTime = now + windowMs;
      this.requests.set(identifier, {
        count: 1,
        resetTime,
      });
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime,
      };
    }

    if (entry.count >= limit) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment count
    entry.count++;
    this.requests.set(identifier, entry);

    return {
      allowed: true,
      remaining: limit - entry.count,
      resetTime: entry.resetTime,
    };
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

/**
 * Rate limit configuration presets
 */
export const RateLimitPresets = {
  // Strict limits for write operations (POST, PUT, DELETE)
  strict: {
    limit: 10,
    windowMs: 60 * 1000, // 10 requests per minute
  },
  // Moderate limits for API routes
  moderate: {
    limit: 30,
    windowMs: 60 * 1000, // 30 requests per minute
  },
  // Relaxed limits for read operations
  relaxed: {
    limit: 100,
    windowMs: 60 * 1000, // 100 requests per minute
  },
  // Very strict for sensitive operations (auth, webhooks)
  veryStrict: {
    limit: 5,
    windowMs: 60 * 1000, // 5 requests per minute
  },
};

/**
 * Get identifier from request (IP address or user ID)
 */
function getIdentifier(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || "unknown";

  return ip;
}

/**
 * Middleware factory for rate limiting
 */
export function createRateLimitMiddleware(options: {
  limit: number;
  windowMs: number;
  keyPrefix?: string;
}) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const identifier = getIdentifier(request);
    const key = options.keyPrefix
      ? `${options.keyPrefix}:${identifier}`
      : identifier;

    const result = rateLimiter.check(key, options.limit, options.windowMs);

    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);

      logger.warn("Rate limit exceeded", {
        identifier: key,
        path: request.nextUrl.pathname,
        retryAfter,
      });

      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          message: "You have exceeded the rate limit. Please try again later.",
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": options.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": result.resetTime.toString(),
          },
        }
      );
    }

    // Add rate limit headers to response (will be added in the actual route)
    logger.debug("Rate limit check passed", {
      identifier: key,
      remaining: result.remaining,
    });

    return null; // Allow request to proceed
  };
}

/**
 * Simplified rate limit check for use within API routes
 */
export async function checkRateLimit(
  request: NextRequest,
  preset: keyof typeof RateLimitPresets = "moderate"
): Promise<{
  allowed: boolean;
  response?: NextResponse;
}> {
  const config = RateLimitPresets[preset];
  const middleware = createRateLimitMiddleware(config);
  const response = await middleware(request);

  return {
    allowed: response === null,
    response: response || undefined,
  };
}

/**
 * Add rate limit headers to a response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  limit: number,
  remaining: number,
  resetTime: number
): NextResponse {
  response.headers.set("X-RateLimit-Limit", limit.toString());
  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  response.headers.set("X-RateLimit-Reset", resetTime.toString());
  return response;
}

export { rateLimiter };
