import { describe, it, expect, beforeEach } from 'vitest';
import { getHomepageData } from '../../../src/lib/data/queries';
import { truncateAll }     from '../helpers/truncate';
import {
  insertUser, insertDistrict, insertReport, insertNews,
  hoursAgo, daysAgo,
} from '../helpers/seed';

describe('getHomepageData', () => {
  beforeEach(async () => {
    await truncateAll();
    await insertUser();
  });

  // ── Empty state ─────────────────────────────────────────────────────────────

  it('returns zero counts and undefined optional items when the database is empty', async () => {
    const data = await getHomepageData();

    expect(data.totalReports).toBe(0);
    expect(data.totalDistricts).toBe(0);
    expect(data.activeReports).toBe(0);
    expect(data.featuredReports).toHaveLength(0);
    expect(data.liveCards).toBeUndefined();
    expect(data.feedItems).toBeUndefined();
    expect(data.districtItems).toBeUndefined();
    expect(data.categoryItems).toBeUndefined();
  });

  // ── Status filtering ────────────────────────────────────────────────────────

  it('totalReports counts only published reports, not drafts or archived', async () => {
    await insertReport({ status: 'published' });
    await insertReport({ status: 'draft' });
    await insertReport({ status: 'archived' });

    const data = await getHomepageData();
    expect(data.totalReports).toBe(1);
  });

  // ── Temporal window ─────────────────────────────────────────────────────────

  it('activeReports counts only reports published within the last 7 days', async () => {
    await insertReport({ publishedAt: hoursAgo(1) });    // 1 h ago  → active
    await insertReport({ publishedAt: hoursAgo(100) });  // 4 d ago  → active
    await insertReport({ publishedAt: daysAgo(8) });     // 8 d ago  → excluded

    const data = await getHomepageData();
    expect(data.activeReports).toBe(2);
  });

  // ── Featured reports ────────────────────────────────────────────────────────

  it('featuredReports returns at most 3, ordered newest-first', async () => {
    await insertReport({ title: 'Oldest',  publishedAt: daysAgo(5) });
    await insertReport({ title: 'Middle',  publishedAt: daysAgo(3) });
    await insertReport({ title: 'Recent',  publishedAt: daysAgo(1) });
    await insertReport({ title: 'Newest',  publishedAt: hoursAgo(2) });

    const data = await getHomepageData();

    expect(data.featuredReports).toHaveLength(3);
    expect(data.featuredReports[0].title).toBe('Newest');
    expect(data.featuredReports[2].title).toBe('Middle');
  });

  it('featuredReports excludes draft reports', async () => {
    await insertReport({ title: 'Published',  status: 'published' });
    await insertReport({ title: 'Draft',      status: 'draft' });

    const data = await getHomepageData();
    expect(data.featuredReports).toHaveLength(1);
    expect(data.featuredReports[0].title).toBe('Published');
  });

  // ── District aggregation ────────────────────────────────────────────────────

  it('totalDistricts counts all districts regardless of report activity', async () => {
    await insertDistrict({ name: 'Quiet District', slug: 'quiet' });
    await insertDistrict({ name: 'Busy District',  slug: 'busy' });

    const data = await getHomepageData();
    expect(data.totalDistricts).toBe(2);
  });

  it('district reportCount includes all published reports; weekCount only last 7 days', async () => {
    const district = await insertDistrict({ name: 'Salamanca', slug: 'salamanca' });

    await insertReport({ districtId: district.id, publishedAt: hoursAgo(2) });  // this week
    await insertReport({ districtId: district.id, publishedAt: daysAgo(3) });   // this week
    await insertReport({ districtId: district.id, publishedAt: daysAgo(10) });  // older

    const data = await getHomepageData();
    const stat = data.districtItems?.find(d => d.slug === 'salamanca');

    expect(stat?.reportCount).toBe(3);
    expect(stat?.weekCount).toBe(2);
  });

  // ── Category distribution ───────────────────────────────────────────────────

  it('categoryItems reflects published report counts per category', async () => {
    await insertReport({ category: 'transport', status: 'published' });
    await insertReport({ category: 'transport', status: 'published' });
    await insertReport({ category: 'culture',   status: 'draft' });     // must not appear

    const data = await getHomepageData();
    const transport = data.categoryItems?.find(c => c.category === 'transport');
    const culture   = data.categoryItems?.find(c => c.category === 'culture');

    expect(transport?.count).toBe(2);
    expect(culture).toBeUndefined();
  });

  // ── Feed items ──────────────────────────────────────────────────────────────

  it('feedItems comes from published news; draft news is excluded', async () => {
    await insertNews({ title: 'Breaking news', status: 'published' });
    await insertNews({ title: 'Draft news',    status: 'draft' });

    const data = await getHomepageData();

    expect(data.feedItems).toHaveLength(1);
    expect(data.feedItems![0].text).toBe('Breaking news');
  });

  // ── Live cards ──────────────────────────────────────────────────────────────

  it('liveCards returns at most 4 most-recent published reports', async () => {
    for (let i = 0; i < 6; i++) {
      await insertReport({ publishedAt: hoursAgo(i + 1) });
    }

    const data = await getHomepageData();
    expect(data.liveCards).toHaveLength(4);
  });
});
