import { test as setup, expect } from '@playwright/test';
import { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } from './credentials';

const STORAGE_STATE = 'tests/e2e/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/admin/login');

  await page.fill('#email',    E2E_ADMIN_EMAIL);
  await page.fill('#password', E2E_ADMIN_PASSWORD);
  await page.click('button[type="submit"]');

  // Successful login redirects to /admin
  await expect(page).toHaveURL(/\/admin$/, { timeout: 10_000 });

  await page.context().storageState({ path: STORAGE_STATE });
});
