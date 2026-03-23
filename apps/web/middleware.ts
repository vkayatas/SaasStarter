import { type NextRequest, NextResponse } from 'next/server';
import { getPublicLimiter, getAuthenticatedLimiter, getSensitiveLimiter } from '@/lib/rate-limit';

async function applyRateLimit(request: NextRequest): Promise<NextResponse | null> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
  const { pathname } = request.nextUrl;

  const sessionCookie =
    request.cookies.get('better-auth.session_token') ??
    request.cookies.get('__Secure-better-auth.session_token');

  // Pick the appropriate limiter based on route sensitivity
  let limiter;
  if (pathname.startsWith('/api/auth')) {
    limiter = getSensitiveLimiter();
  } else if (sessionCookie?.value) {
    limiter = getAuthenticatedLimiter();
  } else {
    limiter = getPublicLimiter();
  }

  if (!limiter) return null; // Redis not configured - skip rate limiting

  const identifier = sessionCookie?.value
    ? `user:${sessionCookie.value.slice(0, 16)}`
    : `ip:${ip}`;

  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      },
    );
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Rate limiting (via Upstash Redis - skipped if UPSTASH_REDIS_URL not set)
  if (pathname.startsWith('/api/')) {
    const rateLimitResponse = await applyRateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;
  }

  // 2. Auth check for protected routes (/dashboard/*)
  if (pathname.startsWith('/dashboard')) {
    const sessionCookie =
      request.cookies.get('better-auth.session_token') ??
      request.cookies.get('__Secure-better-auth.session_token'); // production secure cookie
    if (!sessionCookie?.value) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Redirect authenticated users away from auth pages
  if (pathname === '/login' || pathname === '/register') {
    const sessionCookie =
      request.cookies.get('better-auth.session_token') ??
      request.cookies.get('__Secure-better-auth.session_token');
    if (sessionCookie?.value) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // 3. i18n locale detection - handled by next-intl middleware
  // 4. Security headers - applied via next.config.ts headers()

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
