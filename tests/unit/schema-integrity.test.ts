import { describe, it, expect } from 'vitest';
import { getTableColumns } from 'drizzle-orm';
import {
  reports,
  news,
  reportTags,
  newsTags,
  user,
  reportCategoryEnum,
  contentStatusEnum,
} from '@db/schema';
import {
  CATEGORY_DISPLAY,
  STATUS_LABELS,
  CATEGORY_TO_CARD,
} from '@/lib/content-labels';

// These tests pin the schema enums to the display metadata. If someone adds a
// category to the DB enum without updating content-labels.ts (or vice versa),
// these fail — catching a class of bug that would otherwise surface as a
// missing label in the UI.

describe('content enums vs. label metadata', () => {
  it('report categories match CATEGORY_DISPLAY exactly', () => {
    expect([...reportCategoryEnum.enumValues].sort()).toEqual(
      Object.keys(CATEGORY_DISPLAY).sort(),
    );
  });

  it('content statuses match STATUS_LABELS exactly', () => {
    expect([...contentStatusEnum.enumValues].sort()).toEqual(
      Object.keys(STATUS_LABELS).sort(),
    );
  });

  it('every report category has a LiveCard mapping', () => {
    for (const category of reportCategoryEnum.enumValues) {
      expect(CATEGORY_TO_CARD[category], category).toBeTruthy();
    }
  });
});

describe('reports table', () => {
  const cols = getTableColumns(reports);

  it('exposes the editorial columns', () => {
    for (const c of [
      'id',
      'title',
      'slug',
      'summary',
      'content',
      'status',
      'category',
      'districtId',
      'authorId',
      'publishedAt',
    ]) {
      expect(cols, c).toHaveProperty(c);
    }
  });
});

describe('news table', () => {
  it('carries external-source columns', () => {
    const cols = getTableColumns(news);
    expect(cols).toHaveProperty('source');
    expect(cols).toHaveProperty('sourceUrl');
  });
});

describe('tag join tables', () => {
  it('reportTags links reports and tags', () => {
    const cols = getTableColumns(reportTags);
    expect(cols).toHaveProperty('reportId');
    expect(cols).toHaveProperty('tagId');
  });

  it('newsTags links news and tags', () => {
    const cols = getTableColumns(newsTags);
    expect(cols).toHaveProperty('newsId');
    expect(cols).toHaveProperty('tagId');
  });
});

describe('user table', () => {
  it('has the role column authorization depends on', () => {
    expect(getTableColumns(user)).toHaveProperty('role');
  });
});
