import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    // Load .env before tests so DATABASE_URL is available
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/db/seed.ts', 'src/env.d.ts'],
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      '@db': '/src/db',
    },
  },
});
