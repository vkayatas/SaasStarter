import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Auth check for protected routes (/dashboard/*)
  // TODO: Check session cookie/token via Better-Auth
  if (pathname.startsWith('/dashboard')) {
    // const session = await getSession(request);
    // if (!session) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
  }

  // 2. i18n locale detection
  // Handled by next-intl middleware — see i18n.ts

  // 3. Rate limiting (via Upstash Redis — Phase 2)

  // 4. Security headers — applied via next.config.ts headers()

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
