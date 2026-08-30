import type { Project } from "@/lib/portfolio";
import { ProjectRow, type ProjectRepoStat } from "@/components/home/ProjectRow";

export function ProjectsList({
  projects,
  stats,
  detailed = false,
}: {
  projects: Project[];
  stats: Record<string, ProjectRepoStat>;
  detailed?: boolean;
}) {
  return (
    <div className="col px-6 py-2 sm:px-8">
      {projects.map((project) => (
        <ProjectRow
          key={project.slug}
          project={project}
          stat={stats[project.slug]}
          detailed={detailed}
        />
      ))}
    </div>
  );
}
