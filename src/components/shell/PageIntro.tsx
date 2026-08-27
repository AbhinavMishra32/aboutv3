import type { ReactNode } from "react";

/**
 * Hero band for interior pages: eyebrow, serif title, lead paragraph.
 */
export function PageIntro({
  eyebrow,
  title,
  lead,
  meta,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  meta?: ReactNode;
}) {
  return (
    <div className="col px-6 pb-8 pt-12 sm:px-8 sm:pt-16">
      <div className="animate-rise">
        <p className="label">{eyebrow}</p>
        <h1 className="serif mt-3 text-[36px] leading-[1.08] text-[var(--fg)] sm:text-[48px]">
          {title}
        </h1>
        {lead ? (
          <p className="copy mt-4 max-w-[62ch]">{lead}</p>
        ) : null}
        {meta ? (
          <div className="mono mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] uppercase tracking-[0.12em] text-[var(--soft)]">
            {meta}
          </div>
        ) : null}
      </div>
    </div>
  );
}
