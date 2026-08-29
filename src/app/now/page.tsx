import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/SiteShell";
import { PageIntro } from "@/components/shell/PageIntro";
import { SectionHead } from "@/components/shell/Band";
import { NowDesk } from "@/components/home/NowDesk";
import { GithubSection } from "@/components/home/GithubSection";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Now",
  description: "A live desk for what I'm building, learning, and shipping right now.",
};

const INDEX = [
  { id: "desk", label: "Desk" },
  { id: "github", label: "GitHub" },
];

export default function NowPage() {
  return (
    <SiteShell active="now" index={INDEX}>
      <PageIntro
        eyebrow="Now"
        title="What I'm shipping this week."
        lead="A live desk wired to GitHub, current builds, and recent writing. It updates itself, which is more honest than a hand-written status page."
      />

      <SectionHead id="desk" title="Live desk" meta="01" />
      <NowDesk />

      <SectionHead id="github" title="GitHub Activity" meta="02" />
      <GithubSection />
    </SiteShell>
  );
}
