import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/SiteShell";
import { PageIntro } from "@/components/shell/PageIntro";
import { SectionHead } from "@/components/shell/Band";
import { Experience } from "@/components/home/Experience";
import { Recognition } from "@/components/home/Recognition";
import { StackSection } from "@/components/home/StackSection";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Agent infrastructure at Lunacal.ai, PayEvenly at Ludotronics, and StudyBank at Expert Buddy — the systems work behind shipped products.",
};

const INDEX = [
  { id: "experience", label: "Experience" },
  { id: "recognition", label: "Recognition" },
  { id: "stack", label: "Stack" },
];

export default function WorkPage() {
  return (
    <SiteShell active="work" index={INDEX}>
      <PageIntro
        eyebrow="Experience"
        title="Backend systems, rollout safety, and agents with guardrails."
        lead="Three engineering roles across AI scheduling, fintech, and ed-tech. The through-line is infrastructure people don't see: deterministic releases, retry-aware pipelines, and tracing that makes failure legible."
        meta={
          <>
            <span>3 roles</span>
            <span className="text-[var(--faint)]">·</span>
            <span>Sep 2025 — Present</span>
            <span className="text-[var(--faint)]">·</span>
            <span>Currently at Lunacal.ai</span>
          </>
        }
      />

      <SectionHead id="experience" title="Roles" meta="01" />
      <Experience />

      <SectionHead id="recognition" title="Recognition" meta="02" />
      <Recognition />

      <SectionHead id="stack" title="Tech Stack" meta="03" />
      <StackSection />
    </SiteShell>
  );
}
