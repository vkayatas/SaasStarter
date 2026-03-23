import { db } from '@saas/db';
import { notes, collections } from '@saas/db/schema';
import { sql, isNull } from 'drizzle-orm';

export interface QualityIssue {
  table: string;
  description: string;
  count: number;
}

export interface QualityCheckResult {
  name: string;
  issues: QualityIssue[];
  severity: 'info' | 'warning' | 'error';
  checkedAt: Date;
}

/**
 * Check for orphaned records - e.g. notes referencing non-existent collections.
 * Also checks for notes with null collectionId where that may indicate data drift.
 */
export async function checkOrphanedRecords(): Promise<QualityCheckResult> {
  const issues: QualityIssue[] = [];

  // Notes with a collectionId that doesn't match any collection
  const orphanedNotes = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(notes)
    .leftJoin(collections, sql`${notes.collectionId} = ${collections.id}`)
    .where(
      sql`${notes.collectionId} IS NOT NULL AND ${collections.id} IS NULL`,
    );

  const orphanCount = orphanedNotes[0]?.count ?? 0;
  if (orphanCount > 0) {
    issues.push({
      table: 'notes',
      description: 'Notes referencing non-existent collections',
      count: orphanCount,
    });
  }

  // Notes without any collection assignment (informational)
  const unassignedNotes = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(notes)
    .where(isNull(notes.collectionId));

  const unassignedCount = unassignedNotes[0]?.count ?? 0;
  if (unassignedCount > 0) {
    issues.push({
      table: 'notes',
      description: 'Notes not assigned to any collection',
      count: unassignedCount,
    });
  }

  return {
    name: 'orphaned-records',
    issues,
    severity: orphanCount > 0 ? 'warning' : 'info',
    checkedAt: new Date(),
  };
}
