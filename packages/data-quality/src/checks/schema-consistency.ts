import type { QualityCheckResult } from './orphaned-records';

export function checkSchemaConsistency(): QualityCheckResult {
  return {
    name: 'schema-consistency',
    issues: [],
    severity: 'info',
    checkedAt: new Date(),
  };
}
