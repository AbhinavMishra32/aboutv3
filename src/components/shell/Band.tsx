import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A horizontal band of the ruled centre column. Every block on the page is a
 * Band, which is what keeps the two dashed vertical rules running unbroken
 * from the header to the footer.
 */
export function Band({
  children,
  className,
  pad = true,
  id,
  as: Tag = "div",
}: {
  children?: ReactNode;
  className?: string;
  pad?: boolean;
  id?: string;
  as?: "div" | "section" | "header" | "footer";
}) {
  return (
    <Tag id={id} className={cn("col", pad && "col-pad", className)}>
      {children}
    </Tag>
  );
}

/**
 * Section heading. A solid rule runs edge to edge across the viewport with a
 * striped ground, and the dashed column rules pass straight through it.
 */
export function SectionHead({
  title,
  meta,
  id,
}: {
  title: string;
  meta?: ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className="rule-row scroll-mt-14">
      <div className="col flex items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <h2 className="serif text-[26px] leading-8 text-[var(--fg)] sm:text-[28px]">{title}</h2>
        {meta ? <div className="tag shrink-0 uppercase">{meta}</div> : null}
      </div>
    </div>
  );
}
