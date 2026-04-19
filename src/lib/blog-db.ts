import { sql } from "@vercel/postgres";

const hasDatabase = Boolean(process.env.POSTGRES_URL);

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
