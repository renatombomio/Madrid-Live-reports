import { describe, it, expect } from 'vitest';
import { reports, news, districts, tags, user } from '@db/schema';
import { getTableName } from 'drizzle-orm';

describe('Drizzle schema', () => {
  it('reports table has correct name', () => {
    expect(getTableName(reports)).toBe('reports');
  });

  it('news table has correct name', () => {
    expect(getTableName(news)).toBe('news');
  });

  it('districts table has correct name', () => {
    expect(getTableName(districts)).toBe('districts');
  });

  it('tags table has correct name', () => {
    expect(getTableName(tags)).toBe('tags');
  });

  it('user table has correct name (better-auth convention)', () => {
    expect(getTableName(user)).toBe('user');
  });
});
