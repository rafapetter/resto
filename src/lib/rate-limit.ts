/**
 * Simple in-memory sliding-window rate limiter.
 * Edge-runtime compatible (no setInterval — cleanup on access).
 */

type RateLimitEntry = { count: number; resetAt: number };

const store = new Map<string, RateLimitEntry>();
let lastCleanup = Date.now();

function cleanupIfNeeded(now: number) {
  // Cleanup at most once per 60 seconds to avoid overhead
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now >= entry.resetAt) store.delete(key);
  }
}

export function rateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): { success: boolean; remaining: number } {
  const now = Date.now();
  cleanupIfNeeded(now);

  const entry = store.get(options.key);

  if (!entry || now >= entry.resetAt) {
    store.set(options.key, { count: 1, resetAt: now + options.windowMs });
    return { success: true, remaining: options.limit - 1 };
  }

  if (entry.count >= options.limit) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: options.limit - entry.count };
}
