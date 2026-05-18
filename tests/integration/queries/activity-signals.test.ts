import { describe, it, expect, beforeEach } from 'vitest';
import { getActivitySignals } from '../../../src/lib/data/queries';
import { truncateAll }        from '../helpers/truncate';
import {
  insertUser, insertDistrict, insertReport,
  hoursAgo, daysAgo,
} from '../helpers/seed';

describe('getActivitySignals', () => {
  beforeEach(async () => {
    await truncateAll();
    await insertUser();
  });

  // ── Empty state ─────────────────────────────────────────────────────────────

  it('returns zeroed state when no published reports exist', async () => {
    const data = await getActivitySignals();

    expect(data.happeningNow).toBe(0);
    expect(data.weekTotal).toBe(0);
    expect(data.trendingDistricts).toHaveLength(0);
    expect(data.hotCategories).toHaveLength(0);
  });

  it('ignores draft and archived reports in all signal computations', async () => {
    await insertReport({ status: 'draft',    publishedAt: hoursAgo(1), category: 'transport' });
    await insertReport({ status: 'archived', publishedAt: hoursAgo(2), category: 'transport' });

    const data = await getActivitySignals();

    expect(data.happeningNow).toBe(0);
    expect(data.weekTotal).toBe(0);
    expect(data.hotCategories).toHaveLength(0);
  });

  // ── happeningNow temporal window ────────────────────────────────────────────

  it('happeningNow counts only reports published in the last 24 hours', async () => {
    await insertReport({ publishedAt: hoursAgo(1) });   // within 24 h → counted
    await insertReport({ publishedAt: hoursAgo(23) });  // within 24 h → counted
    await insertReport({ publishedAt: hoursAgo(25) });  // outside 24 h → excluded

    const data = await getActivitySignals();
    expect(data.happeningNow).toBe(2);
  });

  // ── weekTotal temporal window ───────────────────────────────────────────────

  it('weekTotal counts only reports published in the last 7 days', async () => {
    await insertReport({ publishedAt: hoursAgo(1) });   // this week
    await insertReport({ publishedAt: daysAgo(6) });    // this week
    await insertReport({ publishedAt: daysAgo(8) });    // older → excluded

    const data = await getActivitySignals();
    expect(data.weekTotal).toBe(2);
  });

  // ── Boundary precision ──────────────────────────────────────────────────────

  it('a report from 25 h ago counts in weekTotal but NOT in happeningNow', async () => {
    await insertReport({ publishedAt: hoursAgo(25) });

    const data = await getActivitySignals();

    expect(data.happeningNow).toBe(0);
    expect(data.weekTotal).toBe(1);
  });

  // ── trendingDistricts ───────────────────────────────────────────────────────

  it('trendingDistricts excludes districts with zero activity this week', async () => {
    const active  = await insertDistrict({ name: 'Active',  slug: 'active-dist' });
    const dormant = await insertDistrict({ name: 'Dormant', slug: 'dormant-dist' });

    await insertReport({ districtId: active.id,  publishedAt: hoursAgo(2) });  // this week
    await insertReport({ districtId: dormant.id, publishedAt: daysAgo(10) }); // too old → weekCount=0

    const data  = await getActivitySignals();
    const slugs = data.trendingDistricts.map(d => d.slug);

    expect(slugs).toContain('active-dist');
    expect(slugs).not.toContain('dormant-dist');
  });

  it('trendingDistricts is ordered by weekCount descending', async () => {
    const high = await insertDistrict({ name: 'High', slug: 'high-dist' });
    const low  = await insertDistrict({ name: 'Low',  slug: 'low-dist' });

    await insertReport({ districtId: high.id, publishedAt: hoursAgo(1) });
    await insertReport({ districtId: high.id, publishedAt: hoursAgo(2) });
    await insertReport({ districtId: high.id, publishedAt: hoursAgo(3) });
    await insertReport({ districtId: low.id,  publishedAt: hoursAgo(4) });

    const data = await getActivitySignals();

    expect(data.trendingDistricts[0].slug).toBe('high-dist');
    expect(data.trendingDistricts[0].weekCount).toBe(3);
    expect(data.trendingDistricts[1].weekCount).toBe(1);
  });

  it('trendingDistricts returns at most 3 entries', async () => {
    for (let i = 0; i < 5; i++) {
      const d = await insertDistrict({ name: `D${i}`, slug: `dist-${i}` });
      await insertReport({ districtId: d.id, publishedAt: hoursAgo(i + 1) });
    }

    const data = await getActivitySignals();
    expect(data.trendingDistricts.length).toBeLessThanOrEqual(3);
  });

  // ── hotCategories ───────────────────────────────────────────────────────────

  it('hotCategories excludes categories with zero activity this week', async () => {
    await insertReport({ category: 'transport', publishedAt: hoursAgo(2) });   // this week
    await insertReport({ category: 'culture',   publishedAt: daysAgo(10) });   // too old → weekCount=0

    const data = await getActivitySignals();
    const cats = data.hotCategories.map(c => c.category);

    expect(cats).toContain('transport');
    expect(cats).not.toContain('culture');
  });

  it('hotCategories.dayCount counts only reports from the last 24 hours', async () => {
    await insertReport({ category: 'safety', publishedAt: hoursAgo(1) });
    await insertReport({ category: 'safety', publishedAt: hoursAgo(2) });
    await insertReport({ category: 'safety', publishedAt: daysAgo(3) }); // week but not day

    const data   = await getActivitySignals();
    const safety = data.hotCategories.find(c => c.category === 'safety');

    expect(safety?.weekCount).toBe(3);
    expect(safety?.dayCount).toBe(2);
  });

  it('hotCategories returns at most 3 entries', async () => {
    const categories = ['transport', 'culture', 'environment', 'economy', 'safety'] as const;
    for (const category of categories) {
      await insertReport({ category, publishedAt: hoursAgo(1) });
    }

    const data = await getActivitySignals();
    expect(data.hotCategories.length).toBeLessThanOrEqual(3);
  });
});
