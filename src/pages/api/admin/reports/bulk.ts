import type { APIRoute } from 'astro';
import { inArray } from 'drizzle-orm';
import { auth } from '../../../../lib/auth';
import { db } from '../../../../db';
import { reports, reportTags } from '../../../../db/schema';

export const PATCH: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role === 'viewer') return json({ error: 'No autorizado' }, 401);

  let body: { ids?: unknown; action?: unknown };
  try { body = await request.json(); }
  catch { return json({ error: 'JSON inválido' }, 400); }

  const { ids, action } = body;

  if (!Array.isArray(ids) || ids.length === 0) return json({ error: 'IDs requeridos' }, 400);
  if (!['publish', 'archive'].includes(String(action))) return json({ error: 'Acción inválida' }, 400);

  const stringIds = ids.map(String);
  const status = action === 'publish' ? 'published' : 'archived';
  const updates: Record<string, unknown> = { status, updatedAt: new Date() };
  if (action === 'publish') updates.publishedAt = new Date();

  await db.update(reports).set(updates as never).where(inArray(reports.id, stringIds));

  return json({ ok: true, count: stringIds.length });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
