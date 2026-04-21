import type { ReactNode } from "react";
import { PortfolioShell } from "@/components/site/PortfolioShell";

export function BlogShell({ children }: { children: ReactNode }) {
  return (
    <PortfolioShell
      active="blog"
      article
      tagline="A backend-heavy full-stack blog is dropping soon."
    >
      {children}
    </PortfolioShell>
  );
}
