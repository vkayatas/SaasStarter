import { config } from './config';

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
  if (env !== 'development') {
    if (config.CORS_ORIGINS.includes('*')) {
      throw new Error('Wildcard CORS origin (*) is not allowed in staging/production');
    }
    if (config.AUTH_SECRET.length < 32) {
      throw new Error('AUTH_SECRET is too short for staging/production');
    }
  }

  // 2. Database connectivity check (when DB is configured)
  // TODO: Uncomment when DB package is wired up
  // await db.execute(sql`SELECT 1`);

  // 3. Schema migration check (when migrations are configured)
  // TODO: Uncomment when migration versioning is in place
  // if (env !== 'development') {
  //   const applied = await getAppliedMigrationVersion();
  //   const expected = getExpectedMigrationVersion();
  //   if (applied !== expected) {
  //     throw new Error(`DB schema mismatch: applied=${applied}, expected=${expected}`);
  //   }
  // }

  console.log(`[startup] All checks passed (env=${env})`);
}
