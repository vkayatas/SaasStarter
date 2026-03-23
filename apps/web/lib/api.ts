import { config } from './config';
import { db } from '@saas/db';
import { sql } from 'drizzle-orm';

/**
 * Server-side API helper for making internal API requests.
 * Used in Server Components and Server Actions.
 */
export async function serverFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Startup checks - called from instrumentation.ts
 */
export async function runStartupChecks() {
  const env = config.NODE_ENV;

  // 1. Fail-fast on dangerous config in real-data environments
  if (env !== 'development' && env !== 'test') {
    if (config.CORS_ORIGINS.includes('*')) {
      throw new Error('Wildcard CORS origin (*) is not allowed in staging/production');
    }
    if (config.AUTH_SECRET.length < 32) {
      throw new Error('AUTH_SECRET is too short for staging/production');
    }
  }

  // 2. Database connectivity check
  try {
    await db.execute(sql`SELECT 1`);
  } catch (e) {
    throw new Error(`Database connectivity check failed: ${e instanceof Error ? e.message : e}`);
  }

  console.log(`[startup] All checks passed (env=${env})`);
}
