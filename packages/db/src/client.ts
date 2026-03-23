import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Lazy singleton - avoids crashing at import time when DATABASE_URL is absent
// (e.g. during `next build` static analysis).
let _db: NeonHttpDatabase<typeof schema> | undefined;

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (!_db) {
    const sql = neon(process.env.DATABASE_URL!);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

/**
 * Default db instance for convenience.
 * Uses a Proxy so the connection is only created on first property access.
 */
export const db: NeonHttpDatabase<typeof schema> = new Proxy(
  {} as NeonHttpDatabase<typeof schema>,
  {
    get(_, prop) {
      return Reflect.get(getDb(), prop);
    },
  },
);
