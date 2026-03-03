// TODO: Configure Better-Auth
// import { betterAuth } from 'better-auth';
// import { drizzleAdapter } from 'better-auth/adapters/drizzle';
// import { db } from '@saas/db';
// import { config } from './config';
//
// export const auth = betterAuth({
//   database: drizzleAdapter(db),
//   secret: config.AUTH_SECRET,
//   emailAndPassword: {
//     enabled: true,
//   },
//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     },
//     github: {
//       clientId: process.env.GITHUB_CLIENT_ID!,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//     },
//   },
// });
//
// export type Session = typeof auth.$Infer.Session;

export {};
