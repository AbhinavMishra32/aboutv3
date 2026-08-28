"use client";

import { ChevronDown } from "lucide-react";

/**
 * A disclosure that actually looks like a control. The earlier bare text link
 * read as decoration, so people assumed there was nothing more to open — this
 * carries a border, a fill, and a count so the hidden depth is advertised.
 */
export function DisclosureToggle({
  open,
  onToggle,
  label,
  openLabel,
  count,
}: {
  open: boolean;
  onToggle: () => void;
  label: string;
  openLabel?: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="mono group/dt flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-[var(--line)] bg-[var(--chip)] px-3 py-2 text-[11px] text-[var(--muted)] outline-none transition-colors hover:border-[var(--soft)] hover:bg-[var(--chip-strong)] hover:text-[var(--fg)]"
    >
      <span className="flex min-w-0 items-center gap-2">
        {typeof count === "number" ? (
          <span className="grid size-[18px] shrink-0 place-items-center rounded border border-[var(--line)] bg-[var(--bg)] text-[9.5px] tabular-nums text-[var(--soft)] transition-colors group-hover/dt:text-[var(--fg)]">
            {count}
          </span>
        ) : null}
        <span className="truncate">{open ? (openLabel ?? "Hide") : label}</span>
      </span>
      <ChevronDown
        size={13}
        strokeWidth={2}
        className={`shrink-0 text-[var(--soft)] transition-transform duration-300 group-hover/dt:text-[var(--fg)] ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}
