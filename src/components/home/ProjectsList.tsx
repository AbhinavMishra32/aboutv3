"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectCategory } from "@/lib/portfolio";
import { ProjectCard, type ProjectRepoStat } from "@/components/home/ProjectCard";

const FILTERS: Array<"All" | ProjectCategory> = ["All", "AI", "Product", "Systems"];

export function ProjectsList({
  projects,
  stats,
}: {
  projects: Project[];
  stats: Record<string, ProjectRepoStat>;
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const visible = useMemo(
    () =>
      filter === "All"
        ? projects
        : projects.filter((project) => project.category.includes(filter)),
    [filter, projects]
  );

  return (
    <div className="col px-6 py-6 sm:px-8">
      {/* Filter tabs */}
      <div
        className="mb-5 flex items-center gap-1 overflow-x-auto"
        role="tablist"
        aria-label="Filter projects"
      >
        {FILTERS.map((option) => {
          const isActive = filter === option;
          const count =
            option === "All"
              ? projects.length
              : projects.filter((project) => project.category.includes(option)).length;
          return (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(option)}
              className={`mono flex shrink-0 items-center gap-1.5 rounded border px-2.5 py-1 text-[10.5px] transition-colors ${
                isActive
                  ? "border-[var(--line-strong)] bg-[var(--chip)] text-[var(--fg)]"
                  : "border-transparent text-[var(--soft)] hover:text-[var(--fg)]"
              }`}
            >
              {option}
              <span className="text-[var(--soft)]">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} stat={stats[project.slug]} />
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mono py-10 text-center text-[12px] text-[var(--soft)]">
          Nothing in this category yet.
        </p>
      ) : null}
    </div>
  );
}
