-- Runs once when the PostgreSQL container is first created.
-- Drizzle migrations handle the actual schema; this just ensures extensions are available.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for full-text search on title/content
