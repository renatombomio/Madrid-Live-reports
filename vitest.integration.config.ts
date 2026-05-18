import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    globals:     true,
    include:     ['tests/integration/**/*.test.ts'],
    setupFiles:  ['./tests/integration/setup.ts'],
    globalSetup: ['./tests/integration/global-setup.ts'],
    // singleFork: all test files share one process → clean sequential execution →
    // no concurrent truncations, DATABASE_URL override applies once to all imports
    pool:        'forks',
    poolOptions: {
      forks: { singleFork: true },
    },
    testTimeout: 15_000,
    hookTimeout: 30_000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include:  ['src/lib/data/**/*.ts'],
    },
  },
  resolve: {
    alias: {
      '@':   resolve(__dirname, './src'),
      '@db': resolve(__dirname, './src/db'),
    },
  },
});
