import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.PUBLIC_APP_URL ?? 'http://localhost:4321';

export default defineConfig({
  testDir:       './tests/e2e',
  fullyParallel: false,   // auth flow must complete before dependent tests
  forbidOnly:    !!process.env.CI,
  retries:       process.env.CI ? 2 : 0,
  workers:       process.env.CI ? 1 : undefined,
  reporter:      process.env.CI ? 'github' : 'html',

  // Runs once before all projects — creates E2E admin user in the app DB
  globalSetup: './tests/e2e/setup/global.ts',

  use: {
    baseURL: BASE_URL,
    trace:   'on-first-retry',
  },

  projects: [
    // ── 1. Auth setup ──────────────────────────────────────────────────────────
    {
      name:      'setup',
      testMatch: '**/setup/auth.setup.ts',
    },

    // ── 2. Public / unauthenticated tests ─────────────────────────────────────
    {
      name: 'chromium',
      use:  { ...devices['Desktop Chrome'] },
      testMatch: [
        '**/home.spec.ts',
        '**/auth.spec.ts',
        '**/search.spec.ts',
        '**/districts.spec.ts',
      ],
    },

    // ── 3. Admin / authenticated tests ────────────────────────────────────────
    {
      name:         'admin',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/e2e/.auth/admin.json',
      },
      testMatch:    [
        '**/admin-reports.spec.ts',
        '**/publishing.spec.ts',
      ],
      dependencies: ['setup'],
    },
  ],

  webServer: {
    command:             'pnpm dev',
    url:                 BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout:             60_000,
  },
});
