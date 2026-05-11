import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { auth } from '../../../../lib/auth';
import { db } from '../../../../db';
import { reports, reportTags } from '../../../../db/schema';
import { slugify } from '../../../../lib/slugify';

export const POST: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role === 'viewer') {
    return json({ error: 'No autorizado' }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const { title, slug: rawSlug, summary, content, category, districtId, coverImage, status, tags: tagIds } = body as Record<string, unknown>;

  if (!title || !summary || !content || !category) {
    return json({ error: 'Faltan campos obligatorios: title, summary, content, category' }, 400);
  }

  const finalSlug = typeof rawSlug === 'string' && rawSlug.trim()
    ? rawSlug.trim()
    : slugify(String(title));

  // Slug uniqueness check
  const existing = await db.select({ id: reports.id }).from(reports).where(eq(reports.slug, finalSlug)).limit(1);
  if (existing.length > 0) {
    return json({ error: `El slug "${finalSlug}" ya existe` }, 409);
  }

  const id = crypto.randomUUID();
  const isPublished = status === 'published';

  await db.transaction(async (tx) => {
    await tx.insert(reports).values({
      id,
      title: String(title),
      slug: finalSlug,
      summary: String(summary),
      content: String(content),
      category: String(category) as never,
      districtId: typeof districtId === 'string' && districtId ? districtId : null,
      coverImage: typeof coverImage === 'string' && coverImage ? coverImage : null,
      status: isPublished ? 'published' : 'draft',
      publishedAt: isPublished ? new Date() : null,
      authorId: session.user.id,
    });

    if (Array.isArray(tagIds) && tagIds.length > 0) {
      await tx.insert(reportTags).values(
        tagIds.map((tagId) => ({ reportId: id, tagId: String(tagId) }))
      );
    }
  });

  return json({ id, slug: finalSlug }, 201);
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
