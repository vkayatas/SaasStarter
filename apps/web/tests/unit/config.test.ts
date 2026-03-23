import { describe, it, expect } from 'vitest';
import { getConfig } from '@/lib/config';

describe('getConfig', () => {
  it('returns a config object with NODE_ENV', () => {
    const cfg = getConfig();
    expect(cfg.NODE_ENV).toBeDefined();
    expect(['development', 'test', 'staging', 'production']).toContain(cfg.NODE_ENV);
  });

  it('parses CORS_ORIGINS into an array', () => {
    const cfg = getConfig();
    expect(Array.isArray(cfg.CORS_ORIGINS)).toBe(true);
    expect(cfg.CORS_ORIGINS.length).toBeGreaterThan(0);
  });

  it('returns same instance on repeated calls (singleton)', () => {
    const a = getConfig();
    const b = getConfig();
    expect(a).toBe(b);
  });
});
