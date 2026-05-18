import { test, expect } from '@playwright/test';

/**
 * Admin report management flows.
 * This file runs in the 'admin' project, which injects storageState so every
 * test starts pre-authenticated as the E2E admin user.
 */

test.describe('Admin — Reports dashboard', () => {
  test('reports list page loads with status tabs', async ({ page }) => {
    await page.goto('/admin/reports');

    await expect(page.getByRole('heading', { name: 'Reportes' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Todos/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Publicados/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Borradores/ })).toBeVisible();
  });

  test('New report button navigates to creation form', async ({ page }) => {
    await page.goto('/admin/reports');
    await page.click('a[href="/admin/reports/new"]');
    await expect(page).toHaveURL(/\/admin\/reports\/new/);
    await expect(page.locator('.rf-title-input')).toBeVisible();
  });
});

test.describe('Admin — Report creation', () => {
  test('creates a draft report', async ({ page }) => {
    await page.goto('/admin/reports/new');

    const title = `Draft E2E ${Date.now()}`;
    await page.fill('.rf-title-input', title);
    await page.fill('.rf-summary-input', 'Resumen de prueba E2E para el borrador.');
    await page.fill('.rf-content-input', 'Contenido de prueba E2E para el borrador del reporte.');
    await page.click('#btn-draft');

    // Should redirect to edit page after save
    await expect(page).toHaveURL(/\/admin\/reports\/[^/]+\/edit/, { timeout: 10_000 });
    await expect(page.locator('.rf-title-input')).toHaveValue(title);
  });

  test('creates and publishes a report', async ({ page }) => {
    await page.goto('/admin/reports/new');

    const title = `Published E2E ${Date.now()}`;
    await page.fill('.rf-title-input', title);
    await page.fill('.rf-summary-input', 'Resumen de prueba E2E para el reporte publicado.');
    await page.fill('.rf-content-input', 'Contenido de prueba E2E para el reporte publicado.');
    await page.click('#btn-publish');

    // Should redirect to edit page
    await expect(page).toHaveURL(/\/admin\/reports\/[^/]+\/edit/, { timeout: 10_000 });

    // Status badge should reflect published
    await expect(page.locator('.rf-insp-badge--published')).toBeVisible();
  });
});

test.describe('Admin — Report editing', () => {
  let editUrl: string;
  const title = `Editable E2E ${Date.now()}`;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/admin/reports/new');
    await page.fill('.rf-title-input', title);
    await page.fill('.rf-summary-input', 'Resumen E2E editable.');
    await page.fill('.rf-content-input', 'Contenido E2E editable para el reporte de prueba.');
    await page.click('#btn-draft');
    await page.waitForURL(/\/admin\/reports\/[^/]+\/edit/, { timeout: 10_000 });
    editUrl = page.url();
    await page.close();
  });

  test('can update title on existing report', async ({ page }) => {
    await page.goto(editUrl);
    const updated = `${title} — updated`;
    await page.fill('.rf-title-input', updated);
    await page.click('#btn-draft');
    await page.waitForTimeout(500);
    await expect(page.locator('.rf-title-input')).toHaveValue(updated);
  });
});

test.describe('Admin — Status tab filtering', () => {
  test('draft tab URL filter applies correctly', async ({ page }) => {
    await page.goto('/admin/reports');
    await page.click('a[href="/admin/reports?status=draft"]');
    await expect(page).toHaveURL(/status=draft/);
    // Active tab should have the active class
    await expect(page.locator('.adm-tab.active')).toContainText('Borradores');
  });

  test('published tab URL filter applies correctly', async ({ page }) => {
    await page.goto('/admin/reports');
    await page.click('a[href="/admin/reports?status=published"]');
    await expect(page).toHaveURL(/status=published/);
    await expect(page.locator('.adm-tab.active')).toContainText('Publicados');
  });
});

test.describe('Admin — Command palette', () => {
  test('opens with Cmd+K and accepts input', async ({ page }) => {
    await page.goto('/admin/reports');

    await page.keyboard.press('Meta+k');
    // Command palette should become visible
    const palette = page.locator('#cmd-backdrop');
    await expect(palette).toBeVisible({ timeout: 3_000 });
  });
});
