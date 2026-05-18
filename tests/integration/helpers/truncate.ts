import { sql }    from 'drizzle-orm';
import { testDb } from './db';

/**
 * Wipes all content tables in dependency order.
 * CASCADE handles FK constraints; call this in beforeEach for a clean slate.
 */
export async function truncateAll(): Promise<void> {
  await testDb.execute(sql`
    TRUNCATE TABLE
      report_tags,
      news_tags,
      reports,
      news,
      districts,
      tags,
      "user",
      session,
      account,
      verification
    CASCADE
  `);
}
