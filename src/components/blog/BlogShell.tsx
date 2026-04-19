import type { ReactNode } from "react";
import { PortfolioShell } from "@/components/site/PortfolioShell";

export function BlogShell({ children }: { children: ReactNode }) {
  return (
    <PortfolioShell
      active="blog"
      article
      tagline="Notes on software, product clarity, and the craft behind dependable systems."
    >
      {children}
    </PortfolioShell>
  );
}
