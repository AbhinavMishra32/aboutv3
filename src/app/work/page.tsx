import { PortfolioShell } from "@/components/site/PortfolioShell";
import { WorkSection } from "@/components/site/PortfolioSections";

export default function WorkPage() {
  return (
    <PortfolioShell
      active="work"
      article
      tagline="Backend systems, rollout safety, automation, and product ownership across real teams."
    >
      <WorkSection page />
    </PortfolioShell>
  );
}
