import { PortfolioShell } from "@/components/site/PortfolioShell";
import { BrowseSection, HeroSection, WritingPreviewSection } from "@/components/site/PortfolioSections";
import { getAllPosts } from "@/lib/blog";

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <PortfolioShell active="overview">
      <HeroSection />
      <BrowseSection />
      <WritingPreviewSection posts={posts} />
    </PortfolioShell>
  );
}
