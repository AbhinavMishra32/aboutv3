import { PortfolioShell } from "@/components/site/PortfolioShell";
import { HeroSection, ProjectsSection, WorkSection, WritingPreviewSection } from "@/components/site/PortfolioSections";
import { getAllPosts } from "@/lib/blog";

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <PortfolioShell active="overview">
      <HeroSection />
      <WorkSection />
      <ProjectsSection />
      <WritingPreviewSection posts={posts} />
    </PortfolioShell>
  );
}
