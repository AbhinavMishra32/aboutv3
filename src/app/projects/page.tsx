import { PortfolioShell } from "@/components/site/PortfolioShell";
import { ProjectsSection } from "@/components/site/PortfolioSections";

export default function ProjectsPage() {
  return (
    <PortfolioShell
      active="projects"
      tagline="Products, experiments, and systems I have built."
    >
      <ProjectsSection page />
    </PortfolioShell>
  );
}
