"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { DisclosureToggle } from "@/components/shell/DisclosureToggle";
import type { Project } from "@/lib/portfolio";

export type ProjectRepoStat = {
  totalCommits: number;
  activeDays: number;
  pushedAt: string;
};

const STATUS_LABEL = {
  live: "Live",
  "in-progress": "In progress",
  archived: "Archived",
} as const;

function relativeTime(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

/** Corner brackets + camera readout. Only visible on hover, by design. */
function Viewfinder() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <span className="absolute left-2.5 top-2.5 size-2.5 border-l border-t border-[var(--fg)]/45" />
      <span className="absolute right-2.5 top-2.5 size-2.5 border-r border-t border-[var(--fg)]/45" />
      <span className="absolute bottom-2.5 left-2.5 size-2.5 border-b border-l border-[var(--fg)]/45" />
      <span className="absolute bottom-2.5 right-2.5 size-2.5 border-b border-r border-[var(--fg)]/45" />
      <span className="mono absolute bottom-2.5 left-7 text-[8px] tracking-[0.14em] text-[var(--soft)]">
        50MM
      </span>
      <span className="mono absolute bottom-2.5 right-7 text-[8px] tracking-[0.14em] text-[var(--soft)]">
        ISO 400
      </span>
    </div>
  );
}

export function ProjectCard({
  project,
  stat,
}: {
  project: Project;
  stat?: ProjectRepoStat;
}) {
  const [open, setOpen] = useState(false);
  // The wrapper owns the plate geometry, so the light/dark fallback variants
  // below can never drift in size from each other or from a real screenshot.
  const hasPlate = Boolean(project.shot ?? project.previewDarkImage ?? project.previewImage);

  return (
    <article
      id={project.slug}
      className="card card-interactive group flex h-full scroll-mt-16 flex-col p-5"
    >
      {/* Media stage: gradient ground, striped, screenshot floating off the corner */}
      <div className="relative mb-4 h-40 w-full shrink-0 overflow-hidden rounded-lg border border-[var(--line)] bg-gradient-to-br from-[var(--chip)] via-[var(--card)] to-[var(--bg)]/40 p-3">
        <div className="stripes pointer-events-none absolute inset-0 opacity-40" />
        <span
          aria-hidden="true"
          className="serif pointer-events-none absolute -bottom-4 left-3 select-none text-[80px] leading-none text-[var(--fg)]/[0.055]"
        >
          {project.iconLabel ?? project.name.slice(0, 1)}
        </span>
        <Viewfinder />

        <div className="relative z-20 flex items-center justify-between gap-2">
          <span className="mono flex items-center gap-1.5 rounded border border-[var(--line)] bg-[var(--bg)]/70 px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-[var(--muted)] backdrop-blur-md">
            <span
              className={`size-1.5 rounded-full ${
                project.status === "archived" ? "bg-[var(--soft)]" : "bg-[var(--fg)]"
              }`}
            />
            {STATUS_LABEL[project.status]}
          </span>
          {project.featured ? (
            <span className="mono rounded border border-[var(--line)] px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-[var(--soft)]">
              Featured
            </span>
          ) : null}
        </div>

        {hasPlate ? (
          <div className="pointer-events-none absolute -bottom-4 -right-8 h-28 w-52 overflow-hidden rounded-lg border-4 border-[var(--bg)]/40 shadow-xl transition-all duration-300 group-hover:-bottom-2 group-hover:-right-6">
            {project.shot ? (
              <Image
                src={project.shot}
                alt={`${project.name} preview`}
                width={640}
                height={360}
                sizes="220px"
                className="plate h-full w-full object-cover object-left-top"
              />
            ) : (
              <>
                <Image
                  src={project.previewDarkImage ?? project.previewImage!}
                  alt={`${project.name} preview`}
                  width={640}
                  height={360}
                  sizes="220px"
                  className="dark-only plate hidden h-full w-full object-cover object-left-top"
                />
                <Image
                  src={project.previewImage ?? project.previewDarkImage!}
                  alt={`${project.name} preview`}
                  width={640}
                  height={360}
                  sizes="220px"
                  className="light-only plate hidden h-full w-full object-cover object-left-top"
                />
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[16px] font-semibold tracking-[0.025em] text-[var(--fg)]">
          {project.name}
        </h3>
        <span className="mono shrink-0 text-[11px] text-[var(--soft)]">{project.year}</span>
      </div>

      <p className="copy mt-2">{project.summary}</p>

      {/* Disclosure — the depth lives here, not on the surface */}
      <div className="mt-3">
        <DisclosureToggle
          open={open}
          onToggle={() => setOpen((value) => !value)}
          label="Engineering details"
          openLabel="Hide engineering details"
          count={project.bullets.length}
        />

        <div
          className="grid transition-[grid-template-rows,opacity] duration-[400ms] ease-out"
          style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
        >
          <div className="overflow-hidden">
            <ul className="mt-3 space-y-2 border-t border-dashed border-[var(--line)] pt-3">
              {project.bullets.map((bullet) => (
                <li key={bullet} className="copy flex gap-2 text-[13.5px]">
                  <span aria-hidden="true" className="select-none text-[var(--soft)]">
                    ·
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {stat ? (
              <div className="mono mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[var(--soft)]">
                <span>{stat.totalCommits.toLocaleString()} commits</span>
                <span>{stat.activeDays} active days</span>
                <span>pushed {relativeTime(stat.pushedAt)}</span>
              </div>
            ) : project.repoNote ? (
              <p className="mono mt-3 text-[10px] leading-relaxed text-[var(--soft)]">
                {project.repoNote}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Stack */}
      <div className="mb-4 mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <span key={tech} className="chip">
            {tech}
          </span>
        ))}
      </div>

      {project.live || project.source ? (
        <div className="mono mt-auto flex items-center gap-4 border-t border-dashed border-[var(--line)] pt-3 text-[10.5px]">
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              Visit
              <ArrowUpRight size={11} strokeWidth={2} />
            </a>
          ) : null}
          {project.source ? (
            <a
              href={project.source}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              <Github size={11} />
              Source
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
