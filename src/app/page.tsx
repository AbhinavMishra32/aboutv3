import { SiteShell } from "@/components/shell/SiteShell";
import { SectionHead } from "@/components/shell/Band";
import { Identity } from "@/components/home/Identity";
import { About } from "@/components/home/About";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { Experience } from "@/components/home/Experience";
import { Recognition } from "@/components/home/Recognition";
import { StackSection } from "@/components/home/StackSection";
import { WritingSection } from "@/components/home/WritingSection";
import { GithubSection } from "@/components/home/GithubSection";
import { HOME_INDEX } from "@/lib/site";

export const revalidate = 3600;

export default function HomePage() {
  return (
    <SiteShell active="overview" index={HOME_INDEX}>
      <Identity />

      <SectionHead id="about" title="About" meta="01" />
      <About />

      <SectionHead id="projects" title="Projects" meta="02" />
      <ProjectsSection />

      <SectionHead id="experience" title="Experience" meta="03" />
      <Experience />

      <SectionHead id="recognition" title="Recognition" meta="04" />
      <Recognition />

      <SectionHead id="stack" title="Tech Stack" meta="05" />
      <StackSection />

      <SectionHead id="writing" title="Writing" meta="06" />
      <WritingSection />

      <SectionHead id="github" title="GitHub Activity" meta="07" />
      <GithubSection />
    </SiteShell>
  );
}
