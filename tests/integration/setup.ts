/**
 * Runs in every forked worker before any test module loads.
 * Overrides DATABASE_URL so that when src/db/index.ts is first imported,
 * it connects to the test database — not the production one.
 *
 * Why this works: dotenv/config in src/db/index.ts does NOT override an
 * already-set env variable, so our value wins.
 */

import { config } from 'dotenv';
import { resolve }  from 'node:path';

config({ path: resolve(process.cwd(), '.env') });

const testUrl = process.env.TEST_DATABASE_URL;
if (!testUrl) {
  throw new Error(
    'TEST_DATABASE_URL is not set — cannot run integration tests.\n' +
    'Add it to .env, e.g.:\n' +
    '  TEST_DATABASE_URL=postgresql://madrid:madrid123@localhost:5432/madrid_live_test'
  );
}

process.env.DATABASE_URL = testUrl;
