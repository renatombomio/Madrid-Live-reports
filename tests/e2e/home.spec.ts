import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and shows the hero', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Madrid Live Reports/);
    await expect(page.getByText('Madrid en')).toBeVisible();
  });

  test('navigation links are present', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Informes' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Noticias' }).first()).toBeVisible();
  });

  test('reports page loads', async ({ page }) => {
    await page.goto('/reports');
    await expect(page).toHaveTitle(/Informes/);
  });

  test('news page loads', async ({ page }) => {
    await page.goto('/news');
    await expect(page).toHaveTitle(/Noticias/);
  });

  test('login page is accessible', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByRole('heading', { name: 'Acceder' })).toBeVisible();
    await expect(page.getByLabel('Correo electrónico')).toBeVisible();
    await expect(page.getByLabel('Contraseña')).toBeVisible();
  });

  test('admin redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
