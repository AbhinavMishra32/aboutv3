import { ActivitySection } from "@/components/site/ActivitySection";
import { PortfolioShell } from "@/components/site/PortfolioShell";
import { HeroSection, ProjectsSection, WorkSection, WritingPreviewSection } from "@/components/site/PortfolioSections";

export const revalidate = 900;

export default function HomePage() {
  return (
    <PortfolioShell active="overview">
      <HeroSection />
      <ActivitySection />
      <WorkSection />
      <ProjectsSection />
      <WritingPreviewSection />
    </PortfolioShell>
  );
}
