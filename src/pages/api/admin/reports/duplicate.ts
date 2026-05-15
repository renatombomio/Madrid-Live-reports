import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { auth } from '../../../../lib/auth';
import { db } from '../../../../db';
import { reports } from '../../../../db/schema';

export const POST: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role === 'viewer') return json({ error: 'No autorizado' }, 401);

  let body: { id?: unknown };
  try { body = await request.json(); }
  catch { return json({ error: 'JSON inválido' }, 400); }

  const sourceId = String(body.id ?? '');
  if (!sourceId) return json({ error: 'ID requerido' }, 400);

  const [original] = await db.select().from(reports).where(eq(reports.id, sourceId)).limit(1);
  if (!original) return json({ error: 'Informe no encontrado' }, 404);

  // Find a unique slug
  const base = `copia-${original.slug}`;
  let finalSlug = base;
  let n = 1;
  while (true) {
    const conflict = await db
      .select({ id: reports.id })
      .from(reports)
      .where(eq(reports.slug, finalSlug))
      .limit(1);
    if (conflict.length === 0) break;
    finalSlug = `${base}-${n++}`;
  }

  const newId = crypto.randomUUID();
  await db.insert(reports).values({
    id:         newId,
    title:      `Copia de ${original.title}`,
    slug:       finalSlug,
    summary:    original.summary,
    content:    original.content,
    category:   original.category,
    districtId: original.districtId,
    coverImage: original.coverImage,
    status:     'draft',
    publishedAt: null,
    authorId:   session.user.id,
  });

  return json({ id: newId, slug: finalSlug }, 201);
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
