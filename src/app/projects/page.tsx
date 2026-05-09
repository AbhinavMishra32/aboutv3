import { PortfolioShell } from "@/components/site/PortfolioShell";
import { ProjectsSection } from "@/components/site/PortfolioSections";

export default function ProjectsPage() {
  return (
    <PortfolioShell
      active="projects"
      tagline="Products, experiments, and backend-heavy builds I have shipped."
    >
      <ProjectsSection page />
    </PortfolioShell>
  );
}
