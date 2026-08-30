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
    <div className="col px-6 pb-7 pt-11 sm:px-8 sm:pt-14">
      <div className="animate-rise">
        <p className="label">{eyebrow}</p>
        <h1 className="mt-3 max-w-[24ch] text-[26px] font-semibold leading-[1.18] tracking-[-0.02em] text-[var(--fg)] sm:text-[30px]">
          {title}
        </h1>
        {lead ? (
          <p className="copy mt-3.5 max-w-[64ch]">{lead}</p>
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
