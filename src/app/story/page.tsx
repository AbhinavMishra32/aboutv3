import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/shell/SiteShell";
import { PageIntro } from "@/components/shell/PageIntro";
import { Band } from "@/components/shell/Band";
import { Reveal } from "@/components/shell/Reveal";
import { STORY_BEATS } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Story",
  description:
    "The solo builds, internship work, and debugging moments that shaped how I approach engineering.",
};

export default function StoryPage() {
  return (
    <SiteShell
      active="story"
      index={STORY_BEATS.map((beat) => ({ id: `beat-${beat.step}`, label: beat.label }))}
    >
      <PageIntro
        eyebrow="Story"
        title="How I learned to build."
        lead="Most of my experience came from building alone. Solo projects taught me to turn rough ideas into working products; internships and hackathons taught me to bring that same ownership into real teams with real constraints."
      />

      {STORY_BEATS.map((beat, index) => (
        <Band key={beat.step} id={`beat-${beat.step}`} className="scroll-mt-16 px-6 py-8 sm:px-8">
          <Reveal>
            <div className="mono flex items-center gap-3 text-[10.5px] uppercase tracking-[0.14em] text-[var(--soft)]">
              <span className="grid size-6 place-items-center rounded border border-[var(--line)] bg-[var(--chip)] text-[var(--muted)]">
                {beat.step}
              </span>
              {beat.label}
              <span className="h-px flex-1 bg-[var(--line)]" />
            </div>

            <h2 className="serif mt-4 max-w-[34ch] text-[26px] leading-[1.16] text-[var(--fg)] sm:text-[30px]">
              {beat.title}
            </h2>

            <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--chip)]">
              <Image
                src={beat.image}
                alt={beat.imageAlt}
                fill
                sizes="(max-width: 700px) 100vw, 700px"
                className="plate object-cover object-center"
              />
              <div className="stripes pointer-events-none absolute inset-0 opacity-20" />
            </div>

            <div className="mt-5 space-y-3.5">
              {beat.paragraphs.map((paragraph) => (
                <p key={paragraph} className="copy">
                  {paragraph}
                </p>
              ))}
            </div>

            {beat.linkHref ? (
              <a
                href={beat.linkHref}
                target={beat.linkHref.startsWith("http") ? "_blank" : undefined}
                rel={beat.linkHref.startsWith("http") ? "noreferrer" : undefined}
                className="mono mt-5 inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--chip)] px-3 py-1.5 text-[11px] text-[var(--muted)] transition-colors hover:border-[var(--soft)] hover:text-[var(--fg)]"
              >
                {beat.linkLabel}
                <ArrowUpRight size={12} />
              </a>
            ) : null}
          </Reveal>

          {index < STORY_BEATS.length - 1 ? null : (
            <p className="serif mt-10 border-t border-dashed border-[var(--line)] pt-7 text-[20px] leading-[1.4] text-[var(--fg)]">
              I do my best work in high-agency environments — close to the product, close to the
              bugs, close to the people using it. That is where I learn fastest and build best.
            </p>
          )}
        </Band>
      ))}
    </SiteShell>
  );
}
