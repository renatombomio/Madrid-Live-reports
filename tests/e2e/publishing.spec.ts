import { test, expect } from '@playwright/test';

/**
 * Publishing and unpublishing flows — verifies that:
 * - A published report appears on the public /reports page
 * - The report's detail page (/reports/[slug]) is accessible
 * - Unpublishing hides the report from public routes
 * - A published report is findable via the /search page
 *
 * Runs in the 'admin' project (pre-authenticated).
 */

// Unique marker so this test's reports don't clash with other test runs
const MARKER = `pubtest-${Date.now()}`;

test.describe('Publishing flow', () => {
  let slug: string;
  let editUrl: string;

  test('published report appears on public /reports page', async ({ page }) => {
    // Create and publish
    await page.goto('/admin/reports/new');
    await page.fill('.rf-title-input', `E2E Published ${MARKER}`);
    await page.fill('.rf-summary-input', 'Resumen E2E de reporte publicado.');
    await page.fill('.rf-content-input', 'Contenido E2E del reporte publicado para prueba de visibilidad.');
    await page.click('#btn-publish');
    await page.waitForURL(/\/admin\/reports\/[^/]+\/edit/, { timeout: 10_000 });
    editUrl = page.url();

    // Slug lives in the URL input field, not the path (path has the report ID)
    slug = await page.locator('.rf-url-slug').inputValue();

    // Public list
    await page.goto('/reports');
    await expect(page.getByText(`E2E Published ${MARKER}`)).toBeVisible({ timeout: 5_000 });
  });

  test('published report detail page is accessible', async ({ page }) => {
    // The slug was set by the previous test — for isolation guard, skip if not set
    if (!slug) test.skip();

    await page.goto(`/reports/${slug}`);
    await expect(page).not.toHaveURL(/\/reports\/?$/, { timeout: 5_000 });
    await expect(page.getByRole('heading', { name: `E2E Published ${MARKER}` })).toBeVisible();
  });

  test('unpublishing hides report from public /reports', async ({ page }) => {
    if (!editUrl) test.skip();

    // Go back to edit page and save as draft
    await page.goto(editUrl);
    await page.click('#btn-draft');
    await page.waitForTimeout(800);

    // Public list should not contain the report title
    await page.goto('/reports');
    await expect(page.getByText(`E2E Published ${MARKER}`)).not.toBeVisible({ timeout: 5_000 });
  });
});

test.describe('Search visibility after publish', () => {
  const searchMarker = `searchable-${Date.now()}`;

  test('published report is findable via /search', async ({ page }) => {
    // Create and publish
    await page.goto('/admin/reports/new');
    await page.fill('.rf-title-input', searchMarker);
    await page.fill('.rf-summary-input', 'Resumen E2E para prueba de búsqueda.');
    await page.fill('.rf-content-input', 'Contenido E2E del reporte para verificar visibilidad en búsqueda.');
    await page.click('#btn-publish');
    await page.waitForURL(/\/admin\/reports\/[^/]+\/edit/, { timeout: 10_000 });

    // Search — check result card heading (getByText would also match the filter pill)
    await page.goto(`/search?q=${encodeURIComponent(searchMarker)}`);
    await expect(page.getByRole('heading', { name: searchMarker })).toBeVisible({ timeout: 5_000 });
  });
});
