import { PortfolioShell } from "@/components/site/PortfolioShell";
import { WorkSection } from "@/components/site/PortfolioSections";

export default function WorkPage() {
  return (
    <PortfolioShell
      active="work"
      article
      tagline="Recent product engineering across frontend systems, rollout safety, and interface ownership."
    >
      <WorkSection page />
    </PortfolioShell>
  );
}
