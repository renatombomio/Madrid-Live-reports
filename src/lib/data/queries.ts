import { db } from '../../db';
import { reports, news, districts } from '../../db/schema';
import { eq, desc, and, or, ilike, sql } from 'drizzle-orm';
import { CATEGORY_TO_CARD, FEED_COLORS } from '../content-labels';
import { fmtRelative } from '../format';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// ── Homepage ──────────────────────────────────────────────────────────────────

export async function getHomepageData() {
  const [
    featuredRaw,
    recentNewsRaw,
    [totalReportsRow],
    [totalDistrictsRow],
    districtStatsRaw,
    categoryStatsRaw,
    liveCardsRaw,
  ] = await Promise.all([

    // Latest 3 published reports
    db.select({
      title:        reports.title,
      slug:         reports.slug,
      summary:      reports.summary,
      publishedAt:  reports.publishedAt,
      districtName: districts.name,
    })
    .from(reports)
    .leftJoin(districts, eq(reports.districtId, districts.id))
    .where(eq(reports.status, 'published'))
    .orderBy(desc(reports.publishedAt))
    .limit(3),

    // Latest 5 news items for sidebar feed
    db.select({
      title:       news.title,
      publishedAt: news.publishedAt,
      source:      news.source,
    })
    .from(news)
    .where(eq(news.status, 'published'))
    .orderBy(desc(news.publishedAt))
    .limit(5),

    // Total published reports
    db.select({ n: sql<number>`count(*)`.mapWith(Number) })
      .from(reports)
      .where(eq(reports.status, 'published')),

    // Total districts
    db.select({ n: sql<number>`count(*)`.mapWith(Number) })
      .from(districts),

    // Top 8 districts — report count, latest activity, this-week count
    db.select({
      name:        districts.name,
      slug:        districts.slug,
      reportCount: sql<number>`count(${reports.id})`.mapWith(Number),
      latestAt:    sql<string | null>`max(${reports.publishedAt})`,
      weekCount:   sql<number>`count(case when ${reports.publishedAt} > now() - interval '7 days' then 1 end)`.mapWith(Number),
    })
    .from(districts)
    .leftJoin(reports, and(
      eq(districts.id, reports.districtId),
      eq(reports.status, 'published'),
    ))
    .groupBy(districts.id, districts.name, districts.slug)
    .orderBy(sql`count(${reports.id}) desc`)
    .limit(8),

    // Category distribution
    db.select({
      category: reports.category,
      count:    sql<number>`count(*)`.mapWith(Number),
    })
    .from(reports)
    .where(eq(reports.status, 'published'))
    .groupBy(reports.category),

    // Latest 4 reports for LiveCards
    db.select({
      title:        reports.title,
      category:     reports.category,
      publishedAt:  reports.publishedAt,
      districtName: districts.name,
    })
    .from(reports)
    .leftJoin(districts, eq(reports.districtId, districts.id))
    .where(eq(reports.status, 'published'))
    .orderBy(desc(reports.publishedAt))
    .limit(4),
  ]);

  const totalReports   = totalReportsRow?.n   ?? 0;
  const totalDistricts = totalDistrictsRow?.n  ?? 0;
  const activeReports  = liveCardsRaw.filter(
    r => r.publishedAt && (Date.now() - r.publishedAt.getTime()) < ONE_WEEK_MS
  ).length;

  return {
    totalReports,
    totalDistricts,
    activeReports,

    featuredReports: featuredRaw.map(r => ({
      title:       r.title,
      excerpt:     r.summary,
      slug:        r.slug,
      district:    r.districtName ?? undefined,
      publishedAt: r.publishedAt  ?? undefined,
    })),

    liveCards: liveCardsRaw.length > 0
      ? liveCardsRaw.map(r => ({
          category: CATEGORY_TO_CARD[r.category] ?? 'alert',
          title:    r.title,
          district: r.districtName ?? 'Madrid',
          time:     fmtRelative(r.publishedAt),
        }))
      : undefined,

    feedItems: recentNewsRaw.length > 0
      ? recentNewsRaw.map((item, i) => ({
          text:  item.title,
          time:  fmtRelative(item.publishedAt),
          color: FEED_COLORS[i % FEED_COLORS.length],
        }))
      : undefined,

    districtItems: districtStatsRaw.length > 0
      ? districtStatsRaw.map(d => ({
          name:           d.name,
          slug:           d.slug,
          reportCount:    d.reportCount,
          weekCount:      d.weekCount,
          latestActivity: d.latestAt ? fmtRelative(d.latestAt) : undefined,
        }))
      : undefined,

    categoryItems: categoryStatsRaw.length > 0
      ? categoryStatsRaw.map(c => ({ category: c.category, count: c.count }))
      : undefined,
  };
}

// ── Reports ───────────────────────────────────────────────────────────────────

export async function getAllPublishedReports() {
  const [rows, [countRow]] = await Promise.all([
    db.select({
      title:        reports.title,
      slug:         reports.slug,
      summary:      reports.summary,
      category:     reports.category,
      publishedAt:  reports.publishedAt,
      districtName: districts.name,
    })
    .from(reports)
    .leftJoin(districts, eq(reports.districtId, districts.id))
    .where(eq(reports.status, 'published'))
    .orderBy(desc(reports.publishedAt)),

    db.select({ n: sql<number>`count(*)`.mapWith(Number) })
      .from(reports)
      .where(eq(reports.status, 'published')),
  ]);

  return { rows, total: countRow?.n ?? 0 };
}

// ── News ──────────────────────────────────────────────────────────────────────

export async function getAllPublishedNews() {
  const [rows, [countRow]] = await Promise.all([
    db.select({
      id:           news.id,
      title:        news.title,
      slug:         news.slug,
      summary:      news.summary,
      coverImage:   news.coverImage,
      publishedAt:  news.publishedAt,
      source:       news.source,
      districtName: districts.name,
      // authorName is still joined in the page — kept separate to avoid schema import
    })
    .from(news)
    .leftJoin(districts, eq(news.districtId, districts.id))
    .where(eq(news.status, 'published'))
    .orderBy(desc(news.publishedAt)),

    db.select({ n: sql<number>`count(*)`.mapWith(Number) })
      .from(news)
      .where(eq(news.status, 'published')),
  ]);

  return { rows, total: countRow?.n ?? 0 };
}

// ── Districts ─────────────────────────────────────────────────────────────────

export async function getDistrictsWithStats() {
  return db.select({
    id:          districts.id,
    name:        districts.name,
    slug:        districts.slug,
    description: districts.description,
    reportCount: sql<number>`count(${reports.id})`.mapWith(Number),
  })
  .from(districts)
  .leftJoin(reports, and(
    eq(districts.id, reports.districtId),
    eq(reports.status, 'published'),
  ))
  .groupBy(districts.id, districts.name, districts.slug, districts.description)
  .orderBy(districts.name);
}

export async function getDistrictDetail(slug: string) {
  const [district] = await db
    .select()
    .from(districts)
    .where(eq(districts.slug, slug))
    .limit(1);

  if (!district) return null;

  const [districtReports, categoryBreakdown, [{ n: totalCount }]] = await Promise.all([
    db.select({
      title:       reports.title,
      slug:        reports.slug,
      summary:     reports.summary,
      category:    reports.category,
      publishedAt: reports.publishedAt,
    })
    .from(reports)
    .where(and(eq(reports.districtId, district.id), eq(reports.status, 'published')))
    .orderBy(desc(reports.publishedAt)),

    db.select({
      category: reports.category,
      count:    sql<number>`count(*)`.mapWith(Number),
    })
    .from(reports)
    .where(and(eq(reports.districtId, district.id), eq(reports.status, 'published')))
    .groupBy(reports.category)
    .orderBy(sql`count(*) desc`),

    db.select({ n: sql<number>`count(*)`.mapWith(Number) })
      .from(reports)
      .where(and(eq(reports.districtId, district.id), eq(reports.status, 'published'))),
  ]);

  return { district, reports: districtReports, categories: categoryBreakdown, total: totalCount };
}

// ── Search ────────────────────────────────────────────────────────────────────

interface SearchParams {
  q?: string;       // text query
  category?: string; // report_category enum key
}

export async function searchContent({ q = '', category = '' }: SearchParams = {}) {
  const trimmed  = q.trim();
  const hasQuery = trimmed.length >= 2;

  // Need at least one filter active
  if (!hasQuery && !category) return { reportResults: [], newsResults: [] };

  const pattern = `%${trimmed}%`;

  const textCondition = hasQuery
    ? or(
        ilike(reports.title,   pattern),
        ilike(reports.summary, pattern),
        ilike(reports.content, pattern),
      )
    : undefined;

  const catCondition = category
    ? sql`${reports.category}::text = ${category}`
    : undefined;

  const [reportResults, newsResults] = await Promise.all([
    db.select({
      title:        reports.title,
      slug:         reports.slug,
      summary:      reports.summary,
      districtName: districts.name,
      publishedAt:  reports.publishedAt,
      category:     reports.category,
    })
    .from(reports)
    .leftJoin(districts, eq(reports.districtId, districts.id))
    .where(and(eq(reports.status, 'published'), textCondition, catCondition))
    .orderBy(desc(reports.publishedAt))
    .limit(30),

    // News: only search when text query is active (news has no category enum)
    hasQuery
      ? db.select({
          title:       news.title,
          slug:        news.slug,
          summary:     news.summary,
          source:      news.source,
          publishedAt: news.publishedAt,
        })
        .from(news)
        .where(and(
          eq(news.status, 'published'),
          or(ilike(news.title, pattern), ilike(news.summary, pattern)),
        ))
        .orderBy(desc(news.publishedAt))
        .limit(10)
      : Promise.resolve([] as Array<{
          title: string; slug: string; summary: string;
          source: string | null; publishedAt: Date | null;
        }>),
  ]);

  return { reportResults, newsResults };
}

export async function getSearchSuggestions() {
  const [recentReports, categoryStats, topDistricts] = await Promise.all([
    db.select({
      title:        reports.title,
      slug:         reports.slug,
      summary:      reports.summary,
      category:     reports.category,
      publishedAt:  reports.publishedAt,
      districtName: districts.name,
    })
    .from(reports)
    .leftJoin(districts, eq(reports.districtId, districts.id))
    .where(eq(reports.status, 'published'))
    .orderBy(desc(reports.publishedAt))
    .limit(5),

    db.select({
      category: reports.category,
      count:    sql<number>`count(*)`.mapWith(Number),
    })
    .from(reports)
    .where(eq(reports.status, 'published'))
    .groupBy(reports.category)
    .orderBy(sql`count(*) desc`),

    db.select({
      name:        districts.name,
      slug:        districts.slug,
      reportCount: sql<number>`count(${reports.id})`.mapWith(Number),
    })
    .from(districts)
    .leftJoin(reports, and(
      eq(districts.id, reports.districtId),
      eq(reports.status, 'published'),
    ))
    .groupBy(districts.id, districts.name, districts.slug)
    .orderBy(sql`count(${reports.id}) desc`)
    .limit(8),
  ]);

  return { recentReports, categoryStats, topDistricts };
}
