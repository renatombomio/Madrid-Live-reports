import type { APIRoute } from 'astro';
import { eq, and, ne } from 'drizzle-orm';
import { auth } from '../../../../lib/auth';
import { db } from '../../../../db';
import { reports, reportTags } from '../../../../db/schema';
import { slugify } from '../../../../lib/slugify';

// PATCH — partial or full update of a report
export const PATCH: APIRoute = async ({ request, params }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role === 'viewer') return json({ error: 'No autorizado' }, 401);

  const { id } = params;
  if (!id) return json({ error: 'ID requerido' }, 400);

  const [existing] = await db.select().from(reports).where(eq(reports.id, id)).limit(1);
  if (!existing) return json({ error: 'Informe no encontrado' }, 404);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const { title, slug: rawSlug, summary, content, category, districtId, coverImage, status, tags: tagIds } = body as Record<string, unknown>;

  // Build the update set — only override fields present in the request
  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (title !== undefined) updates.title = String(title);
  if (summary !== undefined) updates.summary = String(summary);
  if (content !== undefined) updates.content = String(content);
  if (category !== undefined) updates.category = String(category);
  if (coverImage !== undefined) updates.coverImage = coverImage ? String(coverImage) : null;
  if (districtId !== undefined) updates.districtId = districtId ? String(districtId) : null;

  // Slug: re-derive if title changed and no explicit slug given
  if (rawSlug !== undefined || title !== undefined) {
    const candidateSlug = typeof rawSlug === 'string' && rawSlug.trim()
      ? rawSlug.trim()
      : slugify(String(title ?? existing.title));

    if (candidateSlug !== existing.slug) {
      const conflict = await db.select({ id: reports.id })
        .from(reports)
        .where(and(eq(reports.slug, candidateSlug), ne(reports.id, id)))
        .limit(1);
      if (conflict.length > 0) return json({ error: `El slug "${candidateSlug}" ya existe` }, 409);
    }
    updates.slug = candidateSlug;
  }

  // Status transition: set publishedAt when first publishing
  if (status !== undefined) {
    updates.status = String(status);
    if (status === 'published' && existing.status !== 'published') {
      updates.publishedAt = new Date();
    }
  }

  await db.transaction(async (tx) => {
    await tx.update(reports).set(updates as never).where(eq(reports.id, id));

    // Tags: only update if explicitly provided
    if (Array.isArray(tagIds)) {
      await tx.delete(reportTags).where(eq(reportTags.reportId, id));
      if (tagIds.length > 0) {
        await tx.insert(reportTags).values(
          tagIds.map((tagId) => ({ reportId: id, tagId: String(tagId) }))
        );
      }
    }
  });

  return json({ id, slug: updates.slug ?? existing.slug });
};

// DELETE — remove report and its tags (cascade handles reportTags)
export const DELETE: APIRoute = async ({ request, params }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role === 'viewer') return json({ error: 'No autorizado' }, 401);

  const { id } = params;
  if (!id) return json({ error: 'ID requerido' }, 400);

  const [existing] = await db.select({ id: reports.id }).from(reports).where(eq(reports.id, id)).limit(1);
  if (!existing) return json({ error: 'Informe no encontrado' }, 404);

  await db.delete(reports).where(eq(reports.id, id));

  return new Response(null, { status: 204 });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
