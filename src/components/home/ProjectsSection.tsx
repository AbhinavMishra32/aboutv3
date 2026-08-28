import { PROJECTS } from "@/lib/portfolio";
import { getRepoDetailSafe } from "@/lib/github";
import { ProjectsList } from "@/components/home/ProjectsList";
import type { ProjectRepoStat } from "@/components/home/ProjectCard";

export async function ProjectsSection() {
  const entries = await Promise.all(
    PROJECTS.map(async (project) => {
      const detail = project.repo ? await getRepoDetailSafe(project.slug) : null;
      if (!detail) return null;
      return [
        project.slug,
        {
          totalCommits: detail.totalCommits,
          activeDays: detail.activeDays,
          pushedAt: detail.pushedAt,
        } satisfies ProjectRepoStat,
      ] as const;
    })
  );

  const stats = Object.fromEntries(entries.filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)));

  return <ProjectsList projects={PROJECTS} stats={stats} />;
}
