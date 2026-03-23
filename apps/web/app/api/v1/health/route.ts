import { db } from '@saas/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  let dbStatus: 'ok' | 'error' = 'ok';
  let dbLatencyMs: number | null = null;

  try {
    const start = performance.now();
    await db.execute(sql`SELECT 1`);
    dbLatencyMs = Math.round(performance.now() - start);
  } catch {
    dbStatus = 'error';
  }

  const overallStatus = dbStatus === 'ok' ? 'ok' : 'degraded';

  const checks = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
    uptime: process.uptime(),
    database: { status: dbStatus, latencyMs: dbLatencyMs },
  };

  return Response.json(checks, { status: overallStatus === 'ok' ? 200 : 503 });
}
