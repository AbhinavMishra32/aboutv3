import type { ReactNode } from "react";
import { PortfolioShell } from "@/components/site/PortfolioShell";

export function BlogShell({ children }: { children: ReactNode }) {
  return (
    <PortfolioShell active="blog" article tagline="Notes on building software that holds up.">
      {children}
    </PortfolioShell>
  );
}
