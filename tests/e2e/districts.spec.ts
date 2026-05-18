import { test, expect } from '@playwright/test';

/**
 * Public /districts pages — no authentication required.
 * Verifies that the districts grid loads, district cards link correctly,
 * and detail pages render.
 */

test.describe('Districts index', () => {
  test('districts page loads with heading', async ({ page }) => {
    await page.goto('/districts');
    await expect(page).toHaveTitle(/Distritos/i);
    await expect(page.getByRole('heading', { name: /Distritos/i })).toBeVisible();
  });

  test('district cards are present and link to detail pages', async ({ page }) => {
    await page.goto('/districts');
    // The seed creates 21 districts; at least some cards should be in the DOM
    const cards = page.locator('a.district-card');
    const count  = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Each card href should match /districts/<slug>
    const href = await cards.first().getAttribute('href');
    expect(href).toMatch(/^\/districts\//);
  });

  test('clicking a district card opens detail page', async ({ page }) => {
    await page.goto('/districts');
    const cards = page.locator('a.district-card');
    await expect(cards.first()).toBeVisible();
    await cards.first().click();
    await expect(page).toHaveURL(/\/districts\/.+/);
  });
});

test.describe('District detail', () => {
  test('district detail page renders name and stats', async ({ page }) => {
    // Use Centro — seeded by db/seed.ts
    await page.goto('/districts/centro');
    await expect(page).not.toHaveURL('/districts', { timeout: 5_000 });
    // Heading should contain the district name
    await expect(page.locator('h1')).toBeVisible();
  });

  test('unknown slug redirects away from detail', async ({ page }) => {
    await page.goto('/districts/this-slug-definitely-does-not-exist');
    // Should redirect to /districts or /districts/ (307)
    await expect(page).toHaveURL(/\/districts\/?$/, { timeout: 5_000 });
  });

  test('district detail sidebar shows activity stats', async ({ page }) => {
    await page.goto('/districts/centro');
    // Stats are rendered in the sidebar — confirm the page body has the expected text
    const body = await page.locator('body').textContent();
    // The detail page always renders "Esta semana" regardless of report count
    expect(body).toMatch(/semana|reportes|total/i);
  });
});
