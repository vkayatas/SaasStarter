// Next.js instrumentation - runs once on server startup
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Sentry server-side initialization
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      await import('./sentry.server.config');
    }

    const { runStartupChecks } = await import('./lib/api');
    await runStartupChecks();
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      await import('./sentry.server.config');
    }
  }
}
