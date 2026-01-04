import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// In-memory rate limiter (fallback if Upstash Redis not configured)
class MemoryRateLimit {
  private requests: Map<string, number[]> = new Map()
  
  async limit(identifier: string, limit: number, window: number): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    const now = Date.now()
    const key = identifier
    const requests = this.requests.get(key) || []
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < window)
    
    if (validRequests.length >= limit) {
      const oldestRequest = Math.min(...validRequests)
      const reset = oldestRequest + window
      return {
        success: false,
        limit,
        remaining: 0,
        reset: Math.ceil(reset / 1000),
      }
    }
    
    // Add current request
    validRequests.push(now)
    this.requests.set(key, validRequests)
    
    return {
      success: true,
      limit,
      remaining: limit - validRequests.length,
      reset: Math.ceil((now + window) / 1000),
    }
  }
}

// Initialize rate limiter
let ratelimit: Ratelimit | MemoryRateLimit

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  // Use Upstash Redis if configured
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
  
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "10 s"), // Default: 10 requests per 10 seconds
    analytics: true,
  })
} else {
  // Use in-memory fallback
  ratelimit = new MemoryRateLimit()
}

export async function rateLimit(
  identifier: string,
  limit: number = 10,
  windowSeconds: number = 10
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  if (ratelimit instanceof MemoryRateLimit) {
    return ratelimit.limit(identifier, limit, windowSeconds * 1000)
  }
  
  const result = await ratelimit.limit(identifier)
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
}

// Predefined rate limiters for different endpoints
export const rateLimiters = {
  // Auth endpoints - stricter limits
  auth: (identifier: string) => rateLimit(identifier, 5, 60), // 5 requests per minute
  signup: (identifier: string) => rateLimit(identifier, 3, 60), // 3 requests per minute
  login: (identifier: string) => rateLimit(identifier, 5, 60), // 5 requests per minute
  
  // API endpoints
  signals: (identifier: string) => rateLimit(identifier, 30, 60), // 30 requests per minute
  subscriptions: (identifier: string) => rateLimit(identifier, 10, 60), // 10 requests per minute
  economicCalendar: (identifier: string) => rateLimit(identifier, 20, 60), // 20 requests per minute
  premium: (identifier: string) => rateLimit(identifier, 15, 60), // 15 requests per minute
  
  // Default
  default: (identifier: string) => rateLimit(identifier, 20, 60), // 20 requests per minute
}

