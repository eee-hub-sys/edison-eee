import { Ratelimit } from "@upstash/ratelimit";
import type { Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Fallback in-memory cache for development or if Upstash is not configured
const memoryCache = new Map<string, number>();

export const rateLimit = async (identifier: string, limit: number = 5, window: string = "60 s") => {
    // Try Upstash Redis if environment variables are present
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        try {
            const redis = new Redis({
                url: process.env.UPSTASH_REDIS_REST_URL,
                token: process.env.UPSTASH_REDIS_REST_TOKEN,
            });

            const ratelimit = new Ratelimit({
                redis: redis,
                limiter: Ratelimit.slidingWindow(limit, window as Duration),
                analytics: true,
            });

            const result = await ratelimit.limit(identifier);
            return {
                success: result.success,
                limit: result.limit,
                remaining: result.remaining,
                reset: result.reset,
            };
        } catch (error) {
            console.error("Upstash RateLimit Error:", error);
            // Fallback to memory if Upstash fails
        }
    }

    // Basic In-Memory Rate Limiting (Fallback)
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window for fallback
    const key = `${identifier}:${Math.floor(now / windowMs)}`;

    const currentCount = memoryCache.get(key) || 0;

    if (currentCount >= limit) {
        return { success: false, limit, remaining: 0, reset: now + windowMs };
    }

    memoryCache.set(key, currentCount + 1);

    // Cleanup old keys occasionally
    if (memoryCache.size > 1000) memoryCache.clear();

    return { success: true, limit, remaining: limit - currentCount - 1, reset: now + windowMs };
};
