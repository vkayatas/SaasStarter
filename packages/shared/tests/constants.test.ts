import { describe, it, expect } from 'vitest';
import {
  APP_NAME,
  PAGINATION,
  RATE_LIMITS,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
} from '../src/constants';

describe('constants', () => {
  it('has a non-empty APP_NAME', () => {
    expect(APP_NAME).toBeTruthy();
    expect(typeof APP_NAME).toBe('string');
  });

  it('has valid PAGINATION defaults', () => {
    expect(PAGINATION.DEFAULT_PAGE_SIZE).toBeGreaterThan(0);
    expect(PAGINATION.MAX_PAGE_SIZE).toBeGreaterThanOrEqual(PAGINATION.DEFAULT_PAGE_SIZE);
  });

  it('has RATE_LIMITS for all tiers', () => {
    expect(RATE_LIMITS.PUBLIC.limit).toBeGreaterThan(0);
    expect(RATE_LIMITS.AUTHENTICATED.limit).toBeGreaterThan(RATE_LIMITS.PUBLIC.limit);
    expect(RATE_LIMITS.SENSITIVE.limit).toBeGreaterThan(0);
  });

  it('supports en and de locales', () => {
    expect(SUPPORTED_LOCALES).toContain('en');
    expect(SUPPORTED_LOCALES).toContain('de');
  });

  it('has en as default locale', () => {
    expect(DEFAULT_LOCALE).toBe('en');
  });
});
