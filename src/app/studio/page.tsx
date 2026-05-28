import type { Metadata } from "next";
import { BlogStudioClient } from "@/components/studio/BlogStudioClient";
import { PortfolioShell } from "@/components/site/PortfolioShell";
import { requireAdmin } from "@/lib/admin-auth";
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

  return (
    <PortfolioShell active="overview" tagline="Private writing workspace.">
      <BlogStudioClient initialPosts={STUDIO_SEED_POSTS} />
    </PortfolioShell>
  );
}
