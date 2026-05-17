import { db } from '../../db';
import { reports, districts, user } from '../../db/schema';
import { eq, and, asc, desc, sql } from 'drizzle-orm';

// ── Overview dashboard ────────────────────────────────────────────────────────

export async function getAdminOverview() {
  const [
    [statusRow],
    coldDistricts,
    staleDrafts,
    recentActivity,
    categoryWeek,
  ] = await Promise.all([
    // All report counts in a single pass
    db.select({
      total:    sql<number>`count(*)`.mapWith(Number),
      published: sql<number>`count(case when status = 'published' then 1 end)`.mapWith(Number),
      draft:    sql<number>`count(case when status = 'draft' then 1 end)`.mapWith(Number),
      archived: sql<number>`count(case when status = 'archived' then 1 end)`.mapWith(Number),
      thisWeek: sql<number>`count(case when status = 'published' and published_at > now() - interval '7 days' then 1 end)`.mapWith(Number),
      today:    sql<number>`count(case when status = 'published' and published_at > now() - interval '24 hours' then 1 end)`.mapWith(Number),
    }).from(reports),

    // Cold districts: no published report in last 30 days (or ever)
    db.select({
      name:   districts.name,
      slug:   districts.slug,
      lastAt: sql<string | null>`max(${reports.publishedAt})`,
    })
    .from(districts)
    .leftJoin(reports, and(
      eq(districts.id, reports.districtId),
      eq(reports.status, 'published'),
    ))
    .groupBy(districts.id, districts.name, districts.slug)
    .having(sql`max(${reports.publishedAt}) < now() - interval '30 days' or max(${reports.publishedAt}) is null`)
    .orderBy(sql`max(${reports.publishedAt}) asc nulls first`)
    .limit(4),

    // Stale drafts: not touched in 7+ days
    db.select({
      id:        reports.id,
      title:     reports.title,
      updatedAt: reports.updatedAt,
    })
    .from(reports)
    .where(and(
      eq(reports.status, 'draft'),
      sql`${reports.updatedAt} < now() - interval '7 days'`,
    ))
    .orderBy(asc(reports.updatedAt))
    .limit(3),

    // Recent publishing activity
    db.select({
      id:           reports.id,
      title:        reports.title,
      category:     reports.category,
      publishedAt:  reports.publishedAt,
      districtName: districts.name,
    })
    .from(reports)
    .leftJoin(districts, eq(reports.districtId, districts.id))
    .where(eq(reports.status, 'published'))
    .orderBy(desc(reports.publishedAt))
    .limit(6),

    // Category breakdown this week
    db.select({
      category: reports.category,
      count:    sql<number>`count(*)`.mapWith(Number),
    })
    .from(reports)
    .where(and(
      eq(reports.status, 'published'),
      sql`${reports.publishedAt} > now() - interval '7 days'`,
    ))
    .groupBy(reports.category)
    .orderBy(sql`count(*) desc`)
    .limit(6),
  ]);

  return {
    reports:       statusRow  ?? { total: 0, published: 0, draft: 0, archived: 0, thisWeek: 0, today: 0 },
    coldDistricts,
    staleDrafts,
    recentActivity,
    categoryWeek,
  };
}

// ── Reports list ──────────────────────────────────────────────────────────────

export async function getAdminReportsList(status?: string) {
  const statusCondition =
    status === 'published' ? eq(reports.status, 'published') :
    status === 'draft'     ? eq(reports.status, 'draft')     :
    status === 'archived'  ? eq(reports.status, 'archived')  :
    undefined;

  const [rows, [countsRow]] = await Promise.all([
    db.select({
      id:           reports.id,
      title:        reports.title,
      slug:         reports.slug,
      status:       reports.status,
      category:     reports.category,
      publishedAt:  reports.publishedAt,
      updatedAt:    reports.updatedAt,
      authorName:   user.name,
      districtName: districts.name,
    })
    .from(reports)
    .innerJoin(user, eq(reports.authorId, user.id))
    .leftJoin(districts, eq(reports.districtId, districts.id))
    .where(statusCondition)
    .orderBy(desc(reports.updatedAt)),

    db.select({
      all:      sql<number>`count(*)`.mapWith(Number),
      published: sql<number>`count(case when status = 'published' then 1 end)`.mapWith(Number),
      draft:    sql<number>`count(case when status = 'draft' then 1 end)`.mapWith(Number),
      archived: sql<number>`count(case when status = 'archived' then 1 end)`.mapWith(Number),
    }).from(reports),
  ]);

  return {
    rows,
    counts: countsRow ?? { all: 0, published: 0, draft: 0, archived: 0 },
  };
}
