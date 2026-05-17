import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fmtRelative, fmtDate } from '@/lib/format';

// Both formatters compare against Date.now(), so freeze time for determinism.
const NOW = new Date('2026-05-17T12:00:00Z');
const minutesAgo = (m: number) => new Date(NOW.getTime() - m * 60_000);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('fmtRelative', () => {
  it('returns an empty string for nullish input', () => {
    expect(fmtRelative(null)).toBe('');
    expect(fmtRelative(undefined)).toBe('');
    expect(fmtRelative('')).toBe('');
  });

  it('reports "Ahora mismo" for sub-minute differences', () => {
    expect(fmtRelative(minutesAgo(0))).toBe('Ahora mismo');
  });

  it('reports minutes with the compact "m" suffix', () => {
    expect(fmtRelative(minutesAgo(5))).toBe('Hace 5m');
    expect(fmtRelative(minutesAgo(59))).toBe('Hace 59m');
  });

  it('rolls up to hours past 60 minutes', () => {
    expect(fmtRelative(minutesAgo(60))).toBe('Hace 1h');
    expect(fmtRelative(minutesAgo(200))).toBe('Hace 3h');
  });

  it('rolls up to days past 24 hours', () => {
    expect(fmtRelative(minutesAgo(1440))).toBe('Hace 1d');
    expect(fmtRelative(minutesAgo(3000))).toBe('Hace 2d');
  });

  it('accepts ISO date strings', () => {
    expect(fmtRelative(minutesAgo(5).toISOString())).toBe('Hace 5m');
  });
});

describe('fmtDate', () => {
  it('returns an empty string for nullish input', () => {
    expect(fmtDate(null)).toBe('');
    expect(fmtDate(undefined)).toBe('');
  });

  it('reports "Ahora mismo" for sub-minute differences', () => {
    expect(fmtDate(minutesAgo(0))).toBe('Ahora mismo');
  });

  it('reports minutes with the spaced "min" suffix', () => {
    expect(fmtDate(minutesAgo(12))).toBe('Hace 12 min');
  });

  it('rolls up to hours within the same day', () => {
    expect(fmtDate(minutesAgo(200))).toBe('Hace 3h');
  });

  it('falls back to a localized date past 24 hours', () => {
    const formatted = fmtDate(minutesAgo(5000));
    expect(formatted).not.toMatch(/Hace/);
    expect(formatted).toMatch(/\d/);
  });

  it('accepts ISO date strings', () => {
    expect(fmtDate(minutesAgo(12).toISOString())).toBe('Hace 12 min');
  });
});
