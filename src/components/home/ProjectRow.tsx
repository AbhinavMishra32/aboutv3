import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/lib/portfolio";
import { TechIcon } from "@/components/shell/TechIcon";

export type ProjectRepoStat = {
  totalCommits: number;
  activeDays: number;
  pushedAt: string;
};

/** The domain, as it should be read aloud — no protocol, no www, no slash. */
function domainOf(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

const STATUS_LABEL = {
  live: "live",
  "in-progress": "building",
  archived: "archived",
} as const;

function TechList({ stack }: { stack: string[] }) {
  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
      {stack.map((tech) => (
        <span
          key={tech}
          className="mono flex items-center gap-1.5 text-[10.5px] text-[var(--soft)]"
        >
          <TechIcon name={tech} size={11} />
          {tech}
        </span>
      ))}
    </div>
  );
}

/**
 * Index row, not a product card. A small screenshot anchors each entry, but the
 * badges, viewfinder marks, and gradient stage are gone — those read as a
 * landing page rather than a list of work.
 */
export function ProjectRow({
  project,
  stat,
  detailed = false,
}: {
  project: Project;
  stat?: ProjectRepoStat;
  detailed?: boolean;
}) {
  const shot = project.shot;
  const fallbackDark = project.previewDarkImage ?? project.previewImage;
  const fallbackLight = project.previewImage ?? project.previewDarkImage;

  return (
    <article
      id={project.slug}
      className="group grid scroll-mt-16 grid-cols-[96px_1fr] gap-4 border-b border-dashed border-[var(--line)] py-5 last:border-b-0 sm:grid-cols-[132px_1fr] sm:gap-5"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-[var(--line)] bg-[var(--chip)]">
        {shot ? (
          <Image
            src={shot}
            alt={`${project.name} preview`}
            fill
            sizes="132px"
            className="object-cover object-left-top"
          />
        ) : fallbackDark ? (
          <>
            <Image
              src={fallbackDark}
              alt={`${project.name} preview`}
              fill
              sizes="132px"
              className="dark-only hidden object-cover object-left-top"
            />
            <Image
              src={fallbackLight!}
              alt={`${project.name} preview`}
              fill
              sizes="132px"
              className="light-only hidden object-cover object-left-top"
            />
          </>
        ) : null}
      </div>

      {/* Body */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <h3 className="text-[15.5px] font-semibold tracking-[-0.005em] text-[var(--fg)]">
            {project.name}
          </h3>
          <span className="mono text-[10.5px] text-[var(--soft)]">
            {STATUS_LABEL[project.status]}
            <span className="text-[var(--faint)]"> · </span>
            {project.year}
          </span>
        </div>

        {project.live ? (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className="mono group/domain mt-1 inline-flex items-center gap-1 text-[12px] text-[var(--fg)]"
          >
            <span className="relative">
              {domainOf(project.live)}
              <span className="absolute -bottom-0.5 left-0 h-px w-full bg-[var(--line-strong)] transition-colors duration-300 group-hover/domain:bg-[var(--fg)]" />
            </span>
            <ArrowUpRight
              size={11}
              strokeWidth={2}
              className="text-[var(--soft)] transition-all duration-300 group-hover/domain:-translate-y-px group-hover/domain:translate-x-px group-hover/domain:text-[var(--fg)]"
            />
          </a>
        ) : null}

        <p className="copy mt-1.5 max-w-[62ch] text-[14px]">{project.summary}</p>

        {detailed ? (
          <ul className="mt-3 space-y-2">
            {project.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-[10px] h-px w-2.5 shrink-0 bg-[var(--faint)]"
                />
                <span className="copy max-w-[62ch] text-[13.5px]">{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <TechList stack={project.stack} />

        <div className="mono mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] text-[var(--soft)]">
          {project.source ? (
            <a
              href={project.source}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              <Github size={10.5} />
              source
            </a>
          ) : null}
          {stat ? (
            <span>
              {stat.totalCommits.toLocaleString()} commits
              <span className="text-[var(--faint)]"> · </span>
              {stat.activeDays} active days
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
