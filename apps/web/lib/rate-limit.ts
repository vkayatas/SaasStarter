import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { RATE_LIMITS } from '@saas/shared/constants';

let _redis: Redis | undefined;

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL) return null;
  if (!_redis) {
    _redis = Redis.fromEnv();
  }
  return _redis;
}

function createLimiter(prefix: string, limit: number, window: string) {
  const redis = getRedis();
  if (!redis) return null;

  return new Ratelimit({
    redis,
    prefix: `ratelimit:${prefix}`,
    limiter: Ratelimit.slidingWindow(limit, window as Parameters<typeof Ratelimit.slidingWindow>[1]),
  });
}

// Lazy singletons - only created when Redis is configured
let _public: Ratelimit | null | undefined;
let _authenticated: Ratelimit | null | undefined;
let _sensitive: Ratelimit | null | undefined;

export function getPublicLimiter() {
  if (_public === undefined) {
    _public = createLimiter('public', RATE_LIMITS.PUBLIC.limit, RATE_LIMITS.PUBLIC.window);
  }
  return _public;
}

export function getAuthenticatedLimiter() {
  if (_authenticated === undefined) {
    _authenticated = createLimiter('auth', RATE_LIMITS.AUTHENTICATED.limit, RATE_LIMITS.AUTHENTICATED.window);
  }
  return _authenticated;
}

export function getSensitiveLimiter() {
  if (_sensitive === undefined) {
    _sensitive = createLimiter('sensitive', RATE_LIMITS.SENSITIVE.limit, RATE_LIMITS.SENSITIVE.window);
  }
  return _sensitive;
}
