import { db } from '@saas/db';
import { sql } from 'drizzle-orm';
import type { QualityCheckResult, QualityIssue } from './orphaned-records';

const EXPECTED_TABLES = [
  'user',
  'session',
  'account',
  'verification',
  'collections',
  'notes',
  'resource_shares',
  'share_invites',
];

/**
 * Verify that all expected tables exist in the database.
 * Catches schema drift where migrations may have been missed.
 */
export async function checkSchemaConsistency(): Promise<QualityCheckResult> {
  const issues: QualityIssue[] = [];

  const result = await db.execute(
    sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
  );

  const existingTables = new Set(
    (result.rows as Array<{ table_name: string }>).map((r) => r.table_name),
  );

  const missingTables = EXPECTED_TABLES.filter((t) => !existingTables.has(t));

  if (missingTables.length > 0) {
    issues.push({
      table: missingTables.join(', '),
      description: `Missing expected tables: ${missingTables.join(', ')}`,
      count: missingTables.length,
    });
  }

  return {
    name: 'schema-consistency',
    issues,
    severity: missingTables.length > 0 ? 'error' : 'info',
    checkedAt: new Date(),
  };
}
