import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
} from '../src/formatting';

describe('formatCurrency', () => {
  it('formats EUR by default', () => {
    const result = formatCurrency(1234.5);
    expect(result).toContain('1.234,50');
  });

  it('formats USD with en-US locale', () => {
    const result = formatCurrency(1234.5, 'USD', 'en-US');
    expect(result).toContain('1,234.50');
  });

  it('handles zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0,00');
  });

  it('handles negative amounts', () => {
    const result = formatCurrency(-500);
    expect(result).toContain('500');
  });
});

describe('formatDate', () => {
  it('formats a Date object', () => {
    const result = formatDate(new Date('2025-06-15'));
    expect(result).toContain('2025');
    expect(result).toContain('15');
  });

  it('formats an ISO string', () => {
    const result = formatDate('2025-01-01T00:00:00Z');
    expect(result).toContain('2025');
  });
});

describe('formatNumber', () => {
  it('formats with de-DE locale by default', () => {
    const result = formatNumber(12345.67);
    expect(result).toBe('12.345,67');
  });

  it('respects custom options', () => {
    const result = formatNumber(0.5, 'en-US', { style: 'percent' });
    expect(result).toBe('50%');
  });
});

describe('formatPercent', () => {
  it('formats a decimal as a percentage', () => {
    const result = formatPercent(0.156);
    expect(result).toContain('15,6');
  });

  it('formats zero', () => {
    const result = formatPercent(0);
    expect(result).toContain('0,0');
  });
});
