import { checkOrphanedRecords, type QualityCheckResult } from '../checks';
import { checkSchemaConsistency } from '../checks';

export interface QualityReport {
  timestamp: string;
  checks: QualityCheckResult[];
  summary: {
    total: number;
    passing: number;
    warnings: number;
    errors: number;
  };
}

export function generateQualityReport(): QualityReport {
  const checks = [checkOrphanedRecords(), checkSchemaConsistency()];

  return {
    timestamp: new Date().toISOString(),
    checks,
    summary: {
      total: checks.length,
      passing: checks.filter((c) => c.issues.length === 0).length,
      warnings: checks.filter((c) => c.severity === 'warning').length,
      errors: checks.filter((c) => c.severity === 'error').length,
    },
  };
}
