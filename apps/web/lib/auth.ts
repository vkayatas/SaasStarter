import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@saas/db';
import * as schema from '@saas/db/schema';

function createAuth() {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    secret: process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET,
    trustedOrigins: process.env.NODE_ENV === 'development'
      ? ['http://localhost:*']            // accept any localhost port in dev
      : [process.env.NEXT_PUBLIC_APP_URL ?? ''],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: !!process.env.RESEND_API_KEY,
      sendVerificationEmail: process.env.RESEND_API_KEY
        ? async ({ user, url }) => {
            const { Resend } = await import('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
              from: process.env.EMAIL_FROM ?? 'noreply@example.com',
              to: user.email,
              subject: 'Verify your email address',
              html: `<p>Click <a href="${url}">here</a> to verify your email address.</p>`,
            });
          }
        : undefined,
    },
    socialProviders: {
      ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {}),
      ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
        ? {
            github: {
              clientId: process.env.GITHUB_CLIENT_ID,
              clientSecret: process.env.GITHUB_CLIENT_SECRET,
            },
          }
        : {}),
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // 5 min client cache
      },
    },
  });
}

// Lazy singleton - only initializes on first access, not at import time
let _auth: ReturnType<typeof createAuth> | undefined;
export function getAuth() {
  if (!_auth) _auth = createAuth();
  return _auth;
}

// Proxy to maintain `auth.xxx` usage everywhere and support auth(request) calls
export const auth: ReturnType<typeof createAuth> = new Proxy(
  function () {} as unknown as ReturnType<typeof createAuth>,
  {
    get(_, prop) { return Reflect.get(getAuth(), prop); },
    apply(_, thisArg, args) { return Reflect.apply(getAuth() as unknown as Function, thisArg, args); },
  },
);

export type Session = Awaited<ReturnType<ReturnType<typeof createAuth>['api']['getSession']>>;
