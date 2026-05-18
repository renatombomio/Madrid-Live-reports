/**
 * Runs once in the main Vitest process before any worker is spawned.
 * - Creates the test database if it does not already exist.
 * - Applies Drizzle migrations so the schema is up to date.
 * - Sets process.env.DATABASE_URL so forked workers inherit the test URL.
 */

import { config } from 'dotenv';
import { resolve }  from 'node:path';

config({ path: resolve(process.cwd(), '.env') });

export async function setup() {
  const testUrl = process.env.TEST_DATABASE_URL;
  if (!testUrl) {
    throw new Error(
      'TEST_DATABASE_URL is not set.\n' +
      'Add it to .env, e.g.:\n' +
      '  TEST_DATABASE_URL=postgresql://madrid:madrid123@localhost:5432/madrid_live_test'
    );
  }

  // Forks inherit env from the parent process at spawn time.
  // Setting it here ensures every worker connects to the test DB.
  process.env.DATABASE_URL = testUrl;

  const { default: postgres } = await import('postgres');

  // ── Create test database if missing ────────────────────────────────────────
  const dbName   = testUrl.split('/').at(-1)!.split('?')[0];
  const adminUrl = testUrl.replace(/\/[^/?]+(\?.*)?$/, '/postgres');
  const adminPg  = postgres(adminUrl, { max: 1, connect_timeout: 10 });

  try {
    await adminPg.unsafe(`CREATE DATABASE "${dbName}"`);
  } catch (err) {
    if (!String(err).includes('already exists')) throw err;
  } finally {
    await adminPg.end();
  }

  // ── Apply migrations ────────────────────────────────────────────────────────
  const { drizzle } = await import('drizzle-orm/postgres-js');
  const { migrate } = await import('drizzle-orm/postgres-js/migrator');

  const migPg = postgres(testUrl, { max: 1, connect_timeout: 10 });
  const db    = drizzle(migPg);

  try {
    await migrate(db, { migrationsFolder: resolve(process.cwd(), 'drizzle') });
  } finally {
    await migPg.end();
  }
}
