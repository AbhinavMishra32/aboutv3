import { PortfolioShell } from "@/components/site/PortfolioShell";
import { WorkSection } from "@/components/site/PortfolioSections";

export default function WorkPage() {
  return (
    <PortfolioShell
      active="work"
      article
      tagline="Recent product engineering across backend systems, rollout safety, automation, and product ownership."
    >
      <WorkSection page />
    </PortfolioShell>
  );
}
