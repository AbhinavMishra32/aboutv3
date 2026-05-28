import { PortfolioShell } from "@/components/site/PortfolioShell";
import {
  BlobStudioPreviewSection,
  HeroSection,
  ProjectsSection,
  WorkSection,
  WritingPreviewSection,
} from "@/components/site/PortfolioSections";

export default function HomePage() {
  return (
    <PortfolioShell active="overview">
      <HeroSection />
      <WorkSection />
      <ProjectsSection />
      <BlobStudioPreviewSection />
      <WritingPreviewSection />
    </PortfolioShell>
  );
}
