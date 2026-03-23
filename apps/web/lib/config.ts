import { z } from 'zod';

/** Treat empty strings as undefined so `.optional()` kicks in */
const emptyToUndefined = z.literal('').transform(() => undefined);

const optionalUrl = z.union([emptyToUndefined, z.string().url()]).optional();
const optionalStr = z.union([emptyToUndefined, z.string()]).optional();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  BETTER_AUTH_URL: optionalUrl,
  CORS_ORIGINS: z.string().transform((s) => s.split(',')),
  ADMIN_EMAILS: optionalStr.transform((s) => s?.split(',') ?? []),
  UPSTASH_REDIS_URL: optionalUrl,
  RESEND_API_KEY: optionalStr,
});

// Lazy config - only validates on first access, not at import time
let _config: z.infer<typeof envSchema> | undefined;

export function getConfig() {
  if (!_config) {
    const env = {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/saas_dev',
      AUTH_SECRET:
        process.env.AUTH_SECRET ?? 'dev_secret_key_for_development_only_32chars!',
      CORS_ORIGINS: process.env.CORS_ORIGINS ?? 'http://localhost:3000',
    };
    _config = envSchema.parse(env);
  }
  return _config;
}

export const config = new Proxy({} as z.infer<typeof envSchema>, {
  get(_, prop) {
    return Reflect.get(getConfig(), prop);
  },
});

export type Config = z.infer<typeof envSchema>;
