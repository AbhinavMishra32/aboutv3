import { PortfolioShell } from "@/components/site/PortfolioShell";
import { WorkSection } from "@/components/site/PortfolioSections";

export default function WorkPage() {
  return (
    <PortfolioShell
      active="work"
      article
      tagline="Backend systems, product engineering, and real ownership across shipping teams."
    >
      <WorkSection page />
    </PortfolioShell>
  );
}
