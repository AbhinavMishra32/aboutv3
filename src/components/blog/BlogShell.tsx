import type { ReactNode } from "react";
import { PortfolioShell } from "@/components/site/PortfolioShell";

export function BlogShell({ children }: { children: ReactNode }) {
  return (
    <PortfolioShell active="blog" article tagline="Backend-heavy full-stack notes from the workbench.">
      {children}
    </PortfolioShell>
  );
}
