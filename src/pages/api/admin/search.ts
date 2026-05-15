import type { APIRoute } from 'astro';
import { desc, ilike } from 'drizzle-orm';
import { auth } from '../../../lib/auth';
import { db } from '../../../db';
import { reports } from '../../../db/schema';

export const GET: APIRoute = async ({ request, url }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role === 'viewer') {
    return new Response('Unauthorized', { status: 401 });
  }

  const q = url.searchParams.get('q')?.trim() ?? '';
  const pattern = `%${q}%`;

  const rows = await db
    .select({
      id:        reports.id,
      title:     reports.title,
      status:    reports.status,
      category:  reports.category,
      updatedAt: reports.updatedAt,
    })
    .from(reports)
    .where(q.length >= 1 ? ilike(reports.title, pattern) : undefined)
    .orderBy(desc(reports.updatedAt))
    .limit(7);

  return new Response(JSON.stringify({ reports: rows }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
