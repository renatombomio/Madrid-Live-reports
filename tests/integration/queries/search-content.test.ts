import { describe, it, expect, beforeEach } from 'vitest';
import { searchContent } from '../../../src/lib/data/queries';
import { truncateAll }   from '../helpers/truncate';
import { insertUser, insertReport, insertNews } from '../helpers/seed';

describe('searchContent', () => {
  beforeEach(async () => {
    await truncateAll();
    await insertUser();
  });

  // ── Guard: no active filter ─────────────────────────────────────────────────

  it('returns empty when neither query nor category is provided', async () => {
    await insertReport({ title: 'Madrid traffic' });

    const result = await searchContent({});
    expect(result.reportResults).toHaveLength(0);
    expect(result.newsResults).toHaveLength(0);
  });

  it('returns empty when query is less than 2 characters and category is absent', async () => {
    await insertReport({ title: 'Metro expansion' });

    const result = await searchContent({ q: 'M' });
    expect(result.reportResults).toHaveLength(0);
  });

  // ── Text search ─────────────────────────────────────────────────────────────

  it('matches reports by title (case-insensitive)', async () => {
    await insertReport({ title: 'Madrid traffic congestion' });
    await insertReport({ title: 'Unrelated topic' });

    const result = await searchContent({ q: 'madrid traffic' });

    expect(result.reportResults).toHaveLength(1);
    expect(result.reportResults[0].title).toBe('Madrid traffic congestion');
  });

  it('matches reports by summary', async () => {
    await insertReport({
      title:   'Generic title',
      summary: 'Flooding in the Retiro district after heavy rains',
    });
    await insertReport({
      title:   'Another title',
      summary: 'Nothing relevant here',
    });

    const result = await searchContent({ q: 'Retiro' });

    expect(result.reportResults).toHaveLength(1);
    expect(result.reportResults[0].summary).toContain('Retiro');
  });

  it('matches reports by content body', async () => {
    await insertReport({ content: 'The Puerta del Sol renovation project began this spring.' });
    await insertReport({ content: 'Completely different subject matter.' });

    const result = await searchContent({ q: 'Sol renovation' });

    expect(result.reportResults).toHaveLength(1);
  });

  // ── Category-only filter ────────────────────────────────────────────────────

  it('category-only filter returns matching reports without requiring a text query', async () => {
    await insertReport({ category: 'transport', title: 'Bus routes update' });
    await insertReport({ category: 'transport', title: 'Metro expansion' });
    await insertReport({ category: 'culture',   title: 'New museum opens' });

    const result = await searchContent({ category: 'transport' });

    expect(result.reportResults).toHaveLength(2);
  });

  it('category-only filter returns no news results (news has no category enum)', async () => {
    await insertNews({ title: 'Transport news item' });

    const result = await searchContent({ category: 'transport' });
    expect(result.newsResults).toHaveLength(0);
  });

  // ── Combined filter ─────────────────────────────────────────────────────────

  it('combined query + category applies AND logic', async () => {
    await insertReport({ title: 'Metro expansion plan', category: 'transport' });
    await insertReport({ title: 'Bus route update',     category: 'transport' });
    await insertReport({ title: 'Metro art exhibition', category: 'culture' });

    const result = await searchContent({ q: 'metro', category: 'transport' });

    expect(result.reportResults).toHaveLength(1);
    expect(result.reportResults[0].title).toBe('Metro expansion plan');
  });

  // ── Status filtering ────────────────────────────────────────────────────────

  it('excludes draft and archived reports from results', async () => {
    await insertReport({ title: 'Published metro report', status: 'published' });
    await insertReport({ title: 'Draft metro report',     status: 'draft' });
    await insertReport({ title: 'Archived metro report',  status: 'archived' });

    const result = await searchContent({ q: 'metro' });

    expect(result.reportResults).toHaveLength(1);
    expect(result.reportResults[0].title).toBe('Published metro report');
  });

  // ── News search ─────────────────────────────────────────────────────────────

  it('returns news results when text query is active', async () => {
    await insertNews({ title: 'Madrid flooding event', status: 'published' });
    await insertNews({ title: 'Unrelated news item',   status: 'published' });

    const result = await searchContent({ q: 'flooding' });

    expect(result.newsResults).toHaveLength(1);
    expect(result.newsResults[0].title).toBe('Madrid flooding event');
  });

  it('excludes draft news from search results', async () => {
    await insertNews({ title: 'Madrid news published', status: 'published' });
    await insertNews({ title: 'Madrid news draft',     status: 'draft' });

    const result = await searchContent({ q: 'madrid' });

    const titles = result.newsResults.map(n => n.title);
    expect(titles).toContain('Madrid news published');
    expect(titles).not.toContain('Madrid news draft');
  });

  // ── Edge: 1-char query + category ──────────────────────────────────────────

  it('1-char query + category behaves as category-only (text guard is per-field, not global)', async () => {
    await insertReport({ title: 'Environment report', category: 'environment' });

    // q='e' (1 char) → hasQuery=false; category is set → NOT early-returned → queries by category
    const result = await searchContent({ q: 'e', category: 'environment' });

    expect(result.reportResults).toHaveLength(1);
  });
});
