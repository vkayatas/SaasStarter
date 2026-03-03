// Next.js instrumentation — runs once on server startup
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { runStartupChecks } = await import('./lib/api');
    await runStartupChecks();
  }
}
