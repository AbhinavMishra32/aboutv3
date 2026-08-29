"use client";

import { useMemo, useState } from "react";
import { STACK_GROUPS, TECH_STACK, type StackGroup } from "@/lib/site";

const TABS: Array<"All" | StackGroup> = ["All", ...STACK_GROUPS];

export function StackSection() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");

  const visible = useMemo(
    () => (tab === "All" ? TECH_STACK : TECH_STACK.filter((tech) => tech.group === tab)),
    [tab]
  );

  return (
    <div className="col px-6 py-6 sm:px-8">
      <p className="mono mb-3 text-[10.5px] text-[var(--soft)]">( select a tab to filter )</p>

      <div
        className="mb-5 flex items-center gap-1 overflow-x-auto"
        role="tablist"
        aria-label="Filter tech stack"
      >
        {TABS.map((option) => {
          const isActive = tab === option;
          return (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(option)}
              className={`mono shrink-0 whitespace-nowrap rounded border px-2.5 py-1 text-[10.5px] transition-colors ${
                isActive
                  ? "border-[var(--line-strong)] bg-[var(--chip)] text-[var(--fg)]"
                  : "border-transparent text-[var(--soft)] hover:text-[var(--fg)]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <ul className="flex flex-wrap gap-1.5">
        {visible.map((tech, index) => (
          <li
            key={`${tech.group}-${tech.name}`}
            className="animate-rise"
            style={{ animationDelay: `${Math.min(index * 18, 320)}ms` }}
          >
            <span className="chip px-2 py-1 transition-colors hover:border-[var(--soft)] hover:text-[var(--fg)]">
              {tech.slug ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://cdn.simpleicons.org/${tech.slug}/9a9aa2`}
                  alt=""
                  aria-hidden="true"
                  width={12}
                  height={12}
                  loading="lazy"
                  className="size-3 shrink-0 opacity-80"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full bg-[var(--faint)]"
                />
              )}
              {tech.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
