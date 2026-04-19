import { PortfolioShell } from "@/components/site/PortfolioShell";
import { StorySection } from "@/components/site/PortfolioSections";

export default function StoryPage() {
  return (
    <PortfolioShell
      active="story"
      article
      tagline="The solo builds, debugging moments, and product decisions that shaped how I work."
    >
      <StorySection />
    </PortfolioShell>
  );
}
