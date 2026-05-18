import { test, expect } from '@playwright/test';
import { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } from './setup/credentials';

test.describe('Authentication', () => {
  // ── Login form ──────────────────────────────────────────────────────────────

  test('login page renders form elements', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByRole('heading', { name: 'Acceder' })).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('shows error with invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');

    await page.fill('#email',    'nobody@example.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');

    const errorMsg = page.locator('#error-msg');
    await expect(errorMsg).toBeVisible({ timeout: 5_000 });
    await expect(errorMsg).not.toBeEmpty();
  });

  test('successful login redirects to /admin', async ({ page }) => {
    await page.goto('/admin/login');

    await page.fill('#email',    E2E_ADMIN_EMAIL);
    await page.fill('#password', E2E_ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/admin$/, { timeout: 10_000 });
  });

  // ── Auth guards ─────────────────────────────────────────────────────────────

  test('/admin redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('/admin/reports redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin/reports');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('/admin/reports/new redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin/reports/new');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  // ── Already-logged-in redirect ──────────────────────────────────────────────

  test('visiting /admin/login while authenticated redirects to /admin', async ({ page }) => {
    // Log in first
    await page.goto('/admin/login');
    await page.fill('#email',    E2E_ADMIN_EMAIL);
    await page.fill('#password', E2E_ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin$/, { timeout: 10_000 });

    // Revisit login — should bounce back to admin
    await page.goto('/admin/login');
    await expect(page).toHaveURL(/\/admin$/);
  });
});
