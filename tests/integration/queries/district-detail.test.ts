import { describe, it, expect, beforeEach } from 'vitest';
import { getDistrictDetail } from '../../../src/lib/data/queries';
import { truncateAll }       from '../helpers/truncate';
import {
  insertUser, insertDistrict, insertReport,
  hoursAgo, daysAgo,
} from '../helpers/seed';

describe('getDistrictDetail', () => {
  beforeEach(async () => {
    await truncateAll();
    await insertUser();
  });

  // ── Unknown slug ────────────────────────────────────────────────────────────

  it('returns null for an unknown slug', async () => {
    const result = await getDistrictDetail('does-not-exist');
    expect(result).toBeNull();
  });

  // ── Empty district ──────────────────────────────────────────────────────────

  it('returns district with zeroed stats when no reports exist', async () => {
    const district = await insertDistrict({ name: 'Centro', slug: 'centro' });

    const result = await getDistrictDetail('centro');

    expect(result).not.toBeNull();
    expect(result!.district.id).toBe(district.id);
    expect(result!.reports).toHaveLength(0);
    expect(result!.total).toBe(0);
    expect(result!.weeklyActivity).toEqual({ thisWeek: 0, lastWeek: 0 });
    expect(result!.relatedDistricts).toHaveLength(0);
  });

  // ── Status filtering ────────────────────────────────────────────────────────

  it('excludes draft and archived reports from all aggregates', async () => {
    const district = await insertDistrict({ name: 'Retiro', slug: 'retiro' });

    await insertReport({ districtId: district.id, status: 'published' });
    await insertReport({ districtId: district.id, status: 'draft' });
    await insertReport({ districtId: district.id, status: 'archived' });

    const result = await getDistrictDetail('retiro');

    expect(result!.total).toBe(1);
    expect(result!.reports).toHaveLength(1);
  });

  // ── Temporal windows ────────────────────────────────────────────────────────

  it('weeklyActivity.thisWeek counts only reports from the last 7 days', async () => {
    const district = await insertDistrict({ name: 'Chamartín', slug: 'chamartin' });

    await insertReport({ districtId: district.id, publishedAt: hoursAgo(12) }); // this week
    await insertReport({ districtId: district.id, publishedAt: daysAgo(6) });   // this week
    await insertReport({ districtId: district.id, publishedAt: daysAgo(8) });   // older

    const result = await getDistrictDetail('chamartin');

    expect(result!.weeklyActivity.thisWeek).toBe(2);
  });

  it('weeklyActivity.lastWeek counts reports published 8–14 days ago', async () => {
    const district = await insertDistrict({ name: 'Hortaleza', slug: 'hortaleza' });

    await insertReport({ districtId: district.id, publishedAt: daysAgo(2) });   // this week
    await insertReport({ districtId: district.id, publishedAt: daysAgo(9) });   // last week
    await insertReport({ districtId: district.id, publishedAt: daysAgo(13) });  // last week
    await insertReport({ districtId: district.id, publishedAt: daysAgo(16) });  // too old

    const result = await getDistrictDetail('hortaleza');

    expect(result!.weeklyActivity.thisWeek).toBe(1);
    expect(result!.weeklyActivity.lastWeek).toBe(2);
  });

  // ── Category breakdown ──────────────────────────────────────────────────────

  it('categories are ordered by count descending', async () => {
    const district = await insertDistrict({ name: 'Usera', slug: 'usera' });

    await insertReport({ districtId: district.id, category: 'culture' });
    await insertReport({ districtId: district.id, category: 'transport' });
    await insertReport({ districtId: district.id, category: 'transport' });
    await insertReport({ districtId: district.id, category: 'transport' });

    const result = await getDistrictDetail('usera');

    expect(result!.categories[0].category).toBe('transport');
    expect(result!.categories[0].count).toBe(3);
    expect(result!.categories[1].category).toBe('culture');
    expect(result!.categories[1].count).toBe(1);
  });

  // ── Related districts ───────────────────────────────────────────────────────

  it('relatedDistricts shares the top category and excludes the current district', async () => {
    const distA = await insertDistrict({ name: 'Latina',     slug: 'latina' });
    const distB = await insertDistrict({ name: 'Villaverde', slug: 'villaverde' });
    const distC = await insertDistrict({ name: 'Vallecas',   slug: 'vallecas' });

    // distA: environment is the top category
    await insertReport({ districtId: distA.id, category: 'environment' });
    await insertReport({ districtId: distA.id, category: 'environment' });
    await insertReport({ districtId: distA.id, category: 'transport' });

    // distB and distC also have environment reports → should appear as related
    await insertReport({ districtId: distB.id, category: 'environment' });
    await insertReport({ districtId: distC.id, category: 'environment' });

    const result      = await getDistrictDetail('latina');
    const relatedSlugs = result!.relatedDistricts.map(d => d.slug);

    expect(relatedSlugs).not.toContain('latina');
    expect(relatedSlugs).toContain('villaverde');
    expect(relatedSlugs).toContain('vallecas');
  });

  it('relatedDistricts is empty when no other district shares the top category', async () => {
    const district = await insertDistrict({ name: 'Barajas', slug: 'barajas' });
    await insertReport({ districtId: district.id, category: 'tourism' });

    const result = await getDistrictDetail('barajas');
    expect(result!.relatedDistricts).toHaveLength(0);
  });

  // ── Report ordering ─────────────────────────────────────────────────────────

  it('reports list is ordered newest-first', async () => {
    const district = await insertDistrict({ name: 'Moncloa', slug: 'moncloa' });

    await insertReport({ districtId: district.id, title: 'Old',    publishedAt: daysAgo(5) });
    await insertReport({ districtId: district.id, title: 'Recent', publishedAt: daysAgo(1) });
    await insertReport({ districtId: district.id, title: 'Newest', publishedAt: hoursAgo(1) });

    const result = await getDistrictDetail('moncloa');

    expect(result!.reports[0].title).toBe('Newest');
    expect(result!.reports[2].title).toBe('Old');
  });
});
