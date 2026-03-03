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

// TODO: Implement when DB is wired up
// export async function checkOrphanedRecords(db: Database): Promise<QualityCheckResult> {
//   return { name: 'orphaned-records', issues: [], severity: 'info', checkedAt: new Date() };
// }

export function checkOrphanedRecords(): QualityCheckResult {
  return {
    name: 'orphaned-records',
    issues: [],
    severity: 'info',
    checkedAt: new Date(),
  };
}
