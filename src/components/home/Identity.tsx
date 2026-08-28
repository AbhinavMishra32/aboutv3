"use client";

import { MapPin, Search } from "lucide-react";
import { PROFILE } from "@/lib/site";
import { openCommandPalette } from "@/components/shell/CommandPalette";

/**
 * Masthead. The contour artwork lives here as a backdrop rather than as its own
 * banner slab — it bleeds in from the right and fades out well before the text,
 * so it reads as texture behind the name instead of a decorative block.
 */
function Contours() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 w-[70%] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_55%)]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cover-blueprint.svg"
        alt=""
        className="dark-only absolute inset-0 hidden h-full w-full object-cover object-right opacity-[0.55]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cover-blueprint-light.svg"
        alt=""
        className="light-only absolute inset-0 hidden h-full w-full object-cover object-right opacity-70"
      />
    </div>
  );
}

export function Identity() {
  return (
    <div className="col relative overflow-hidden px-6 pb-8 pt-12 sm:px-8 sm:pt-16">
      <Contours />

      <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="animate-rise flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--chip)] shadow-sm">
            <span className="serif select-none text-[38px] leading-none text-[var(--fg)]">AM</span>
          </div>

          <div>
            <h1 className="serif text-3xl leading-none text-[var(--fg)] sm:text-[38px]">
              {PROFILE.name}
            </h1>
            <p className="mono mt-1 text-[13px] text-[var(--muted)]">{PROFILE.role}</p>
            <p className="mono mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-[var(--soft)] sm:justify-start">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="shrink-0" />
                {PROFILE.location}
              </span>
              <span>·</span>
              <span>{PROFILE.education.short}</span>
              <span>·</span>
              <span>{PROFILE.education.period}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCommandPalette}
          className="mono flex shrink-0 items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--chip)] px-3 py-1.5 text-[11px] text-[var(--muted)] transition-colors hover:border-[var(--soft)] hover:text-[var(--fg)]"
        >
          <Search size={12} strokeWidth={2} />
          <kbd>⌘K</kbd>
        </button>
      </div>
    </div>
  );
}
