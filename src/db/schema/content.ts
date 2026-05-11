import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  index,
  primaryKey,
  integer,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth';

// ─── Enums ─────────────────────────────────────────────────────────────────────

export const contentStatusEnum = pgEnum('content_status', [
  'draft',
  'published',
  'archived',
]);

export const reportCategoryEnum = pgEnum('report_category', [
  'urban_development',
  'transport',
  'culture',
  'environment',
  'economy',
  'safety',
  'health',
  'education',
  'tourism',
  'general',
]);

// ─── Districts ──────────────────────────────────────────────────────────────────
// Madrid's 21 official districts

export const districts = pgTable('districts', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
});

// ─── Tags ──────────────────────────────────────────────────────────────────────

export const tags = pgTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
});

// ─── Reports ───────────────────────────────────────────────────────────────────
// Long-form analysis pieces about Madrid city topics

export const reports = pgTable(
  'reports',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    summary: text('summary').notNull(),
    content: text('content').notNull(),
    coverImage: text('cover_image'),
    status: contentStatusEnum('status').notNull().default('draft'),
    category: reportCategoryEnum('category').notNull().default('general'),
    districtId: text('district_id').references(() => districts.id, {
      onDelete: 'set null',
    }),
    authorId: text('author_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    index('reports_status_idx').on(table.status),
    index('reports_published_at_idx').on(table.publishedAt),
    index('reports_category_idx').on(table.category),
    index('reports_district_idx').on(table.districtId),
  ]
);

export const reportTags = pgTable(
  'report_tags',
  {
    reportId: text('report_id')
      .notNull()
      .references(() => reports.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.reportId, table.tagId] })]
);

// ─── News ───────────────────────────────────────────────────────────────────────
// Shorter news items, potentially with an external source

export const news = pgTable(
  'news',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    summary: text('summary').notNull(),
    content: text('content').notNull(),
    coverImage: text('cover_image'),
    status: contentStatusEnum('status').notNull().default('draft'),
    source: text('source'),
    sourceUrl: text('source_url'),
    districtId: text('district_id').references(() => districts.id, {
      onDelete: 'set null',
    }),
    authorId: text('author_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    index('news_status_idx').on(table.status),
    index('news_published_at_idx').on(table.publishedAt),
    index('news_district_idx').on(table.districtId),
  ]
);

export const newsTags = pgTable(
  'news_tags',
  {
    newsId: text('news_id')
      .notNull()
      .references(() => news.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.newsId, table.tagId] })]
);

// ─── Relations ──────────────────────────────────────────────────────────────────

export const reportsRelations = relations(reports, ({ one, many }) => ({
  author: one(user, { fields: [reports.authorId], references: [user.id] }),
  district: one(districts, {
    fields: [reports.districtId],
    references: [districts.id],
  }),
  reportTags: many(reportTags),
}));

export const reportTagsRelations = relations(reportTags, ({ one }) => ({
  report: one(reports, {
    fields: [reportTags.reportId],
    references: [reports.id],
  }),
  tag: one(tags, { fields: [reportTags.tagId], references: [tags.id] }),
}));

export const newsRelations = relations(news, ({ one, many }) => ({
  author: one(user, { fields: [news.authorId], references: [user.id] }),
  district: one(districts, {
    fields: [news.districtId],
    references: [districts.id],
  }),
  newsTags: many(newsTags),
}));

export const newsTagsRelations = relations(newsTags, ({ one }) => ({
  news: one(news, { fields: [newsTags.newsId], references: [news.id] }),
  tag: one(tags, { fields: [newsTags.tagId], references: [tags.id] }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  reportTags: many(reportTags),
  newsTags: many(newsTags),
}));

export const districtsRelations = relations(districts, ({ many }) => ({
  reports: many(reports),
  news: many(news),
}));
