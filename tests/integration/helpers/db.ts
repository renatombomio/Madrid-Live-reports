/**
 * A dedicated DB connection for test helpers (truncate, seed).
 * Reads TEST_DATABASE_URL directly — does NOT go through src/db/index.ts,
 * so it always points at the test database regardless of module-load order.
 */

import { config }  from 'dotenv';
import { resolve } from 'node:path';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres     from 'postgres';
import * as schema  from '../../../src/db/schema';

config({ path: resolve(process.cwd(), '.env') });

const url    = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL!;
const client = postgres(url, { max: 3, idle_timeout: 5, connect_timeout: 10 });

export const testDb = drizzle(client, { schema });
export { client as testPgClient };
