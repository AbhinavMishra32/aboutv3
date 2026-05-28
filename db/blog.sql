CREATE TABLE IF NOT EXISTS post_views (
  slug TEXT PRIMARY KEY,
  views BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Draft',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'pinned')),
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  content_html TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS blog_posts_status_updated_idx ON blog_posts (status, updated_at DESC);

CREATE TABLE IF NOT EXISTS blog_assets (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  byte_size INTEGER NOT NULL,
  data BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
