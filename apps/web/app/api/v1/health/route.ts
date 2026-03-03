export async function GET() {
  const checks = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
    uptime: process.uptime(),
    // TODO: Add database connectivity check
    // database: await checkDatabase(),
  };

  return Response.json(checks, { status: 200 });
}
