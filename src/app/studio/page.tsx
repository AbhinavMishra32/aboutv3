import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogStudioClient } from "@/components/studio/BlogStudioClient";
import { PortfolioShell } from "@/components/site/PortfolioShell";
import { STUDIO_SEED_POSTS } from "@/lib/blog-studio";

export const metadata: Metadata = {
  title: "Blog Studio | Abhinav Mishra",
  description: "Private portfolio writing studio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioPage() {
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_BLOG_STUDIO !== "true") {
    notFound();
  }

  return (
    <PortfolioShell active="overview" tagline="Private writing workspace.">
      <BlogStudioClient initialPosts={STUDIO_SEED_POSTS} />
    </PortfolioShell>
  );
}
