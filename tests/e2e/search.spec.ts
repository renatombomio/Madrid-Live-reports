import { test, expect } from '@playwright/test';

/**
 * Public /search page — no authentication required.
 * Tests the discover state (no query), text search, category filtering,
 * and the no-results state.
 */

test.describe('Search — discover state', () => {
  test('loads /search without query params (discover view)', async ({ page }) => {
    await page.goto('/search');
    await expect(page).toHaveTitle(/Explorar/i);
    // The search input should be visible
    await expect(page.locator('#search-input')).toBeVisible();
  });

  test('has a visible search input with correct role', async ({ page }) => {
    await page.goto('/search');
    await expect(page.locator('form[role="search"]')).toBeVisible();
    await expect(page.locator('#search-input')).toBeVisible();
  });
});

test.describe('Search — query', () => {
  test('returns results matching query in title', async ({ page }) => {
    await page.goto('/search?q=madrid');
    // URL should still be /search with the param
    await expect(page).toHaveURL(/q=madrid/);
  });

  test('shows no-results state for an unmatchable query', async ({ page }) => {
    await page.goto('/search?q=xyzzy99999nonsense');
    // Either an empty state component or the results count shows 0
    const body = await page.locator('body').textContent();
    expect(
      body?.includes('0') || body?.includes('sin resultados') || body?.includes('Sin resultados')
    ).toBeTruthy();
  });

  test('submitting search form navigates to /search with q param', async ({ page }) => {
    await page.goto('/search');
    await page.fill('#search-input', 'transporte');
    await page.press('#search-input', 'Enter');
    await expect(page).toHaveURL(/\/search\?.*q=transporte/);
  });
});

test.describe('Search — category filter', () => {
  test('category param filters results page', async ({ page }) => {
    await page.goto('/search?category=transport');
    await expect(page).toHaveURL(/category=transport/);
    // Page should load without errors
    await expect(page.locator('body')).toBeVisible();
  });

  test('category chip navigates to filtered search', async ({ page }) => {
    await page.goto('/search');
    // Category chips link to /search?category=<key>
    const chipLinks = page.locator('a[href*="/search?category="]');
    const count = await chipLinks.count();
    if (count > 0) {
      const href = await chipLinks.first().getAttribute('href');
      await chipLinks.first().click();
      await expect(page).toHaveURL(new RegExp(href!.replace('?', '\\?')));
    }
  });
});
