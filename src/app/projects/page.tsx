import { PortfolioShell } from "@/components/site/PortfolioShell";
import { ProjectsSection } from "@/components/site/PortfolioSections";

export default function ProjectsPage() {
  return (
    <PortfolioShell
      active="projects"
      tagline="Selected builds with more concrete visual previews, cleaner cards, and the same site aesthetic."
    >
      <ProjectsSection page />
    </PortfolioShell>
  );
}
