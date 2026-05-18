import { testDb }                          from './db';
import { reports, districts, user, news } from '../../../src/db/schema';
import type { InferInsertModel }           from 'drizzle-orm';

type InsertReport   = InferInsertModel<typeof reports>;
type InsertDistrict = InferInsertModel<typeof districts>;
type InsertUser     = InferInsertModel<typeof user>;
type InsertNews     = InferInsertModel<typeof news>;

// ── Time helpers ──────────────────────────────────────────────────────────────

export const hoursAgo = (n: number): Date =>
  new Date(Date.now() - n * 60 * 60 * 1000);

export const daysAgo = (n: number): Date =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000);

// ── Stable test author ────────────────────────────────────────────────────────

export const TEST_AUTHOR_ID = 'test-author-seed-001';

export async function insertUser(overrides: Partial<InsertUser> = {}) {
  const row: InsertUser = {
    id:            TEST_AUTHOR_ID,
    name:          'Test Author',
    email:         'test@madrid-live.test',
    emailVerified: false,
    role:          'admin',
    ...overrides,
  };
  await testDb.insert(user).values(row).onConflictDoNothing();
  return row;
}

// ── ID generator — unique within a process lifetime ───────────────────────────

let _seq = 0;
const nextId = () => `t${String(++_seq).padStart(4, '0')}-${Date.now()}`;

// ── Entity factories ──────────────────────────────────────────────────────────

export async function insertDistrict(overrides: Partial<InsertDistrict> = {}) {
  const id = nextId();
  const row: InsertDistrict = {
    id,
    name:        `District ${id}`,
    slug:        `district-${id}`,
    description: null,
    ...overrides,
  };
  await testDb.insert(districts).values(row);
  return row;
}

export async function insertReport(overrides: Partial<InsertReport> = {}) {
  const id = nextId();
  const row: InsertReport = {
    id,
    title:       `Report ${id}`,
    slug:        `report-${id}`,
    summary:     `Summary for ${id}`,
    content:     `Content for ${id}`,
    status:      'published',
    category:    'general',
    authorId:    TEST_AUTHOR_ID,
    districtId:  null,
    publishedAt: new Date(),
    ...overrides,
  };
  await testDb.insert(reports).values(row);
  return row;
}

export async function insertNews(overrides: Partial<InsertNews> = {}) {
  const id = nextId();
  const row: InsertNews = {
    id,
    title:       `News ${id}`,
    slug:        `news-${id}`,
    summary:     `Summary for news ${id}`,
    content:     `Content for news ${id}`,
    status:      'published',
    source:      'TestSource',
    authorId:    TEST_AUTHOR_ID,
    districtId:  null,
    publishedAt: new Date(),
    ...overrides,
  };
  await testDb.insert(news).values(row);
  return row;
}
