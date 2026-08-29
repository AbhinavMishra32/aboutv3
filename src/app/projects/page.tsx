import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/SiteShell";
import { PageIntro } from "@/components/shell/PageIntro";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { PROJECTS } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Products, experiments, and backend-heavy builds — AI-native tooling, adaptive systems, and a blockchain written from scratch.",
};

export default function ProjectsPage() {
  const live = PROJECTS.filter((project) => project.status === "live").length;
  const building = PROJECTS.filter((project) => project.status === "in-progress").length;

  return (
    <SiteShell active="projects">
      <PageIntro
        eyebrow="Projects"
        title="Things I built to find out how they work."
        lead="Products, experiments, and systems shaped by what happens underneath the interface. Each card opens into the engineering decisions that actually mattered."
        meta={
          <>
            <span>{PROJECTS.length} projects</span>
            <span className="text-[var(--faint)]">·</span>
            <span>{live} live</span>
            <span className="text-[var(--faint)]">·</span>
            <span>{building} in progress</span>
          </>
        }
      />
      <ProjectsSection />
    </SiteShell>
  );
}
