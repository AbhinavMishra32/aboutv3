import { PortfolioShell } from "@/components/site/PortfolioShell";
import { HeroSection, ProjectsSection, WorkSection, WritingPreviewSection } from "@/components/site/PortfolioSections";

export default function HomePage() {
  return (
    <PortfolioShell active="overview">
      <HeroSection />
      <WorkSection />
      <ProjectsSection />
      <WritingPreviewSection />
    </PortfolioShell>
  );
}
