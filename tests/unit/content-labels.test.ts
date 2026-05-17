import { describe, it, expect } from 'vitest';
import {
  CATEGORY_DISPLAY,
  CATEGORY_LABELS,
  CATEGORY_TO_CARD,
  FEED_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
} from '@/lib/content-labels';

describe('CATEGORY_DISPLAY', () => {
  it('gives every category a name, slug, and hex colour', () => {
    for (const [key, meta] of Object.entries(CATEGORY_DISPLAY)) {
      expect(meta.name, key).toBeTruthy();
      expect(meta.slug, key).toBeTruthy();
      expect(meta.color, key).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('uses unique slugs across categories', () => {
    const slugs = Object.values(CATEGORY_DISPLAY).map((m) => m.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('CATEGORY_LABELS', () => {
  it('is derived 1:1 from CATEGORY_DISPLAY names', () => {
    expect(Object.keys(CATEGORY_LABELS).sort()).toEqual(
      Object.keys(CATEGORY_DISPLAY).sort(),
    );
    for (const [key, meta] of Object.entries(CATEGORY_DISPLAY)) {
      expect(CATEGORY_LABELS[key]).toBe(meta.name);
    }
  });
});

describe('CATEGORY_TO_CARD', () => {
  it('maps every display category to a card type', () => {
    for (const key of Object.keys(CATEGORY_DISPLAY)) {
      expect(CATEGORY_TO_CARD[key], key).toBeTruthy();
    }
  });
});

describe('FEED_COLORS', () => {
  it('exposes the five non-empty feed colours', () => {
    expect(FEED_COLORS).toHaveLength(5);
    expect(new Set(FEED_COLORS).size).toBe(5);
  });
});

describe('status metadata', () => {
  it('labels the three content statuses', () => {
    expect(Object.keys(STATUS_LABELS).sort()).toEqual([
      'archived',
      'draft',
      'published',
    ]);
  });

  it('keeps STATUS_COLORS aligned with STATUS_LABELS', () => {
    expect(Object.keys(STATUS_COLORS).sort()).toEqual(
      Object.keys(STATUS_LABELS).sort(),
    );
  });
});
