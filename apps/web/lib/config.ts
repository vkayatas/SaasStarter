import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters'),
  CORS_ORIGINS: z.string().transform((s) => s.split(',')),
  ADMIN_EMAILS: z
    .string()
    .optional()
    .transform((s) => s?.split(',') ?? []),
  UPSTASH_REDIS_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().optional(),
});

// In development, provide defaults for optional services
const env = {
  ...process.env,
  // Ensure required vars have fallbacks in dev for initial setup
  DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/saas_dev',
  AUTH_SECRET:
    process.env.AUTH_SECRET ?? 'dev_secret_key_for_development_only_32chars!',
  CORS_ORIGINS: process.env.CORS_ORIGINS ?? 'http://localhost:3000',
};

export const config = envSchema.parse(env);
export type Config = z.infer<typeof envSchema>;
