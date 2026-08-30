"use client";

import { Search } from "lucide-react";
import { PROFILE } from "@/lib/site";
import { openCommandPalette } from "@/components/shell/CommandPalette";

export function Identity() {
  return (
    <div className="col px-6 pb-6 pt-10 sm:px-8 sm:pt-12">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--fg)]">{PROFILE.name}</h1>
          <p className="mono mt-1.5 text-[12px] text-[var(--muted)]">{PROFILE.role}</p>
          <p className="mono mt-1 text-[11px] text-[var(--soft)]">
            {PROFILE.location}
            <span className="text-[var(--faint)]"> · </span>
            {PROFILE.education.degree}
            <span className="text-[var(--faint)]"> · </span>
            {PROFILE.education.short}
          </p>
        </div>

        <button
          type="button"
          onClick={openCommandPalette}
          aria-label="Search (Command K)"
          className="mono mt-1 flex shrink-0 items-center gap-1.5 text-[11px] text-[var(--soft)] transition-colors hover:text-[var(--fg)]"
        >
          <Search size={12} strokeWidth={2} />
          <kbd>⌘K</kbd>
        </button>
      </div>
    </div>
  );
}
