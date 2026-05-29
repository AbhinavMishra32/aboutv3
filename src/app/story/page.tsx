import { PortfolioShell } from "@/components/site/PortfolioShell";
import { StorySection } from "@/components/site/PortfolioSections";

export default function StoryPage() {
  return (
    <PortfolioShell
      active="story"
      article
      tagline="The builds and debugging moments that shaped how I work."
    >
      <StorySection />
    </PortfolioShell>
  );
}
