import { sql } from "@vercel/postgres";
import type { BlogPostDraft, BlogPostStatus } from "@/lib/blog-studio";

const hasDatabase = Boolean(process.env.POSTGRES_URL);

type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  status: BlogPostStatus;
  tags: string[];
  content_html: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

type BlogAssetRow = {
  id: string;
  mime_type: string;
  data: Buffer;
};

function rowToPost(row: BlogPostRow): BlogPostDraft {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    status: row.status,
    tags: row.tags ?? [],
    contentHtml: row.content_html,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

async function ensureBlogPostsTable() {
  if (!hasDatabase) return;

  await sql`
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
  `;

  await sql`CREATE INDEX IF NOT EXISTS blog_posts_status_updated_idx ON blog_posts (status, updated_at DESC);`;
}

async function ensureBlogAssetsTable() {
  if (!hasDatabase) return;

  await sql`
    CREATE TABLE IF NOT EXISTS blog_assets (
      id TEXT PRIMARY KEY,
      file_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      byte_size INTEGER NOT NULL,
      data BYTEA NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

export async function getPostViews(slug: string): Promise<number> {
  if (!hasDatabase) return 0;
  const { rows } = await sql<{ views: number }>`SELECT views FROM post_views WHERE slug = ${slug}`;
  return rows[0]?.views ?? 0;
}

export async function incrementPostViews(slug: string): Promise<number> {
  if (!hasDatabase) return 0;
  const { rows } = await sql<{ views: number }>`
    INSERT INTO post_views (slug, views)
    VALUES (${slug}, 1)
    ON CONFLICT (slug)
    DO UPDATE SET views = post_views.views + 1, updated_at = NOW()
    RETURNING views;
  `;
  return rows[0]?.views ?? 0;
}

export async function getStudioPosts(): Promise<BlogPostDraft[]> {
  if (!hasDatabase) return [];
  await ensureBlogPostsTable();

  const { rows } = await sql<BlogPostRow>`
    SELECT id, slug, title, excerpt, category, status, tags, content_html, created_at, updated_at, published_at
    FROM blog_posts
    ORDER BY updated_at DESC;
  `;

  return rows.map(rowToPost);
}

export async function getPublishedDbPosts(): Promise<BlogPostDraft[]> {
  if (!hasDatabase) return [];
  await ensureBlogPostsTable();

  const { rows } = await sql<BlogPostRow>`
    SELECT id, slug, title, excerpt, category, status, tags, content_html, created_at, updated_at, published_at
    FROM blog_posts
    WHERE status IN ('published', 'pinned')
    ORDER BY COALESCE(published_at, updated_at) DESC;
  `;

  return rows.map(rowToPost);
}

export async function getPublishedDbPostBySlug(slug: string): Promise<BlogPostDraft | null> {
  if (!hasDatabase) return null;
  await ensureBlogPostsTable();

  const { rows } = await sql<BlogPostRow>`
    SELECT id, slug, title, excerpt, category, status, tags, content_html, created_at, updated_at, published_at
    FROM blog_posts
    WHERE slug = ${slug} AND status IN ('published', 'pinned')
    LIMIT 1;
  `;

  return rows[0] ? rowToPost(rows[0]) : null;
}

export async function upsertStudioPost(post: BlogPostDraft) {
  if (!hasDatabase) {
    throw new Error("POSTGRES_URL is required to save blog posts.");
  }

  await ensureBlogPostsTable();

  const publishedAt = post.status === "published" || post.status === "pinned" ? new Date().toISOString() : null;

  await sql`
    INSERT INTO blog_posts (
      id,
      slug,
      title,
      excerpt,
      category,
      status,
      tags,
      content_html,
      created_at,
      updated_at,
      published_at
    )
    VALUES (
      ${post.id},
      ${post.slug},
      ${post.title},
      ${post.excerpt},
      ${post.category},
      ${post.status},
      ${JSON.stringify(post.tags)}::jsonb,
      ${post.contentHtml},
      ${post.createdAt},
      NOW(),
      ${publishedAt}
    )
    ON CONFLICT (id)
    DO UPDATE SET
      slug = EXCLUDED.slug,
      title = EXCLUDED.title,
      excerpt = EXCLUDED.excerpt,
      category = EXCLUDED.category,
      status = EXCLUDED.status,
      tags = EXCLUDED.tags,
      content_html = EXCLUDED.content_html,
      updated_at = NOW(),
      published_at = CASE
        WHEN EXCLUDED.status IN ('published', 'pinned') THEN COALESCE(blog_posts.published_at, NOW())
        ELSE NULL
      END;
  `;
}

export async function deleteStudioPost(id: string) {
  if (!hasDatabase) {
    throw new Error("POSTGRES_URL is required to delete blog posts.");
  }

  await ensureBlogPostsTable();
  await sql`DELETE FROM blog_posts WHERE id = ${id};`;
}

export async function createBlogAsset({
  id,
  fileName,
  mimeType,
  data,
}: {
  id: string;
  fileName: string;
  mimeType: string;
  data: Buffer;
}) {
  if (!hasDatabase) {
    throw new Error("POSTGRES_URL is required to upload blog images.");
  }

  await ensureBlogAssetsTable();
  const encodedData = data.toString("base64");

  await sql`
    INSERT INTO blog_assets (id, file_name, mime_type, byte_size, data)
    VALUES (${id}, ${fileName}, ${mimeType}, ${data.length}, decode(${encodedData}, 'base64'))
    ON CONFLICT (id)
    DO UPDATE SET
      file_name = EXCLUDED.file_name,
      mime_type = EXCLUDED.mime_type,
      byte_size = EXCLUDED.byte_size,
      data = EXCLUDED.data;
  `;
}

export async function getBlogAsset(id: string) {
  if (!hasDatabase) return null;
  await ensureBlogAssetsTable();

  const { rows } = await sql<BlogAssetRow>`
    SELECT id, mime_type, data
    FROM blog_assets
    WHERE id = ${id}
    LIMIT 1;
  `;

  return rows[0] ?? null;
}
