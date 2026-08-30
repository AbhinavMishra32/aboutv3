import { ArrowUpRight } from "lucide-react";
import { WORK_ITEMS, type WorkItem } from "@/lib/portfolio";
import { Reveal } from "@/components/shell/Reveal";

/**
 * Roles are read, not clicked. Everything a reader needs is on the surface —
 * the work is the substance of the page, so hiding it behind a toggle only
 * made it look like there was nothing to see.
 */
function Role({ item, index, isLast }: { item: WorkItem; index: number; isLast: boolean }) {
  return (
    <Reveal delay={index * 90}>
      <article className="relative pl-7 sm:pl-9">
        {/* Timeline rail */}
        <span
          aria-hidden="true"
          className="absolute left-[3px] top-2 h-[7px] w-[7px] rounded-full bg-[var(--fg)] ring-4 ring-[var(--bg)]"
        />
        <span
          aria-hidden="true"
          className={`absolute left-[6px] top-4 w-px ${
            isLast
              ? "bottom-10 bg-gradient-to-b from-[var(--line)] to-transparent"
              : "bottom-0 bg-[var(--line)]"
          }`}
        />

        <header className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
          <h3 className="flex items-center gap-2.5">
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group/link inline-flex items-center gap-1.5 text-[19px] font-semibold leading-none tracking-[-0.01em] text-[var(--fg)] transition-opacity hover:opacity-70 sm:text-[21px]"
              >
                {item.company}
                <ArrowUpRight
                  size={13}
                  className="mt-0.5 text-[var(--soft)] transition-all group-hover/link:-translate-y-px group-hover/link:translate-x-px"
                />
              </a>
            ) : (
              <span className="text-[19px] font-semibold leading-none tracking-[-0.01em] text-[var(--fg)] sm:text-[21px]">
                {item.company}
              </span>
            )}
            {item.current ? (
              <span className="mono rounded-full border border-[var(--line)] bg-[var(--chip)] px-2 py-[3px] text-[9px] uppercase tracking-[0.14em] text-[var(--soft)]">
                Current
              </span>
            ) : null}
          </h3>
          <span className="mono shrink-0 text-[11.5px] tabular-nums text-[var(--soft)]">
            {item.period}
          </span>
        </header>

        <p className="mono mt-2 text-[11.5px] text-[var(--muted)]">
          {item.title}
          <span className="text-[var(--faint)]"> · </span>
          {item.employment}
          <span className="text-[var(--faint)]"> · </span>
          {item.location}
        </p>

        <p className="mt-4 max-w-[62ch] text-[15.5px] leading-[1.65] text-[var(--fg)]/85">
          {item.summary}
        </p>

        <ul className="mt-5 space-y-3.5 border-t border-dashed border-[var(--line)] pt-5">
          {item.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3.5">
              <span
                aria-hidden="true"
                className="mt-[11px] h-px w-3 shrink-0 bg-[var(--faint)]"
              />
              <span className="copy max-w-[64ch]">{highlight}</span>
            </li>
          ))}
        </ul>

        <div className={`mt-5 flex flex-wrap gap-1.5 ${isLast ? "pb-9" : "pb-12"}`}>
          {item.stack.map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>
      </article>
    </Reveal>
  );
}

export function Experience() {
  return (
    <div className="col px-6 py-9 sm:px-8">
      <div>
        {WORK_ITEMS.map((item, index) => (
          <Role
            key={item.company}
            item={item}
            index={index}
            isLast={index === WORK_ITEMS.length - 1}
          />
        ))}
      </div>

    </div>
  );
}
