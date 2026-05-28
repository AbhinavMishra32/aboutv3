import type { Metadata } from "next";
import { BlogStudioClient } from "@/components/studio/BlogStudioClient";
import { PortfolioShell } from "@/components/site/PortfolioShell";
import { requireAdmin } from "@/lib/admin-auth";
import { getStudioPosts } from "@/lib/blog-db";
import { STUDIO_SEED_POSTS } from "@/lib/blog-studio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog Studio | Abhinav Mishra",
  description: "Private portfolio writing studio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function StudioPage() {
  await requireAdmin("/studio");
  const dbPosts = await getStudioPosts();
  const posts = dbPosts.length ? dbPosts : STUDIO_SEED_POSTS;

  return (
    <PortfolioShell active="overview" tagline="Private writing workspace.">
      <BlogStudioClient initialPosts={posts} hasDatabase={Boolean(process.env.POSTGRES_URL)} />
    </PortfolioShell>
  );
}
