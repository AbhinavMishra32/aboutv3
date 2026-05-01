import type { Metadata } from "next";
import { ActivitySection } from "@/components/site/ActivitySection";
import { PortfolioShell } from "@/components/site/PortfolioShell";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Now | Abhinav Mishra",
  description: "A live desk for what Abhinav Mishra is building, learning, writing, and shipping.",
};

export default function NowPage() {
  return (
    <PortfolioShell active="now" tagline="What I am building, learning, writing, and shipping right now.">
      <ActivitySection page />
    </PortfolioShell>
  );
}
