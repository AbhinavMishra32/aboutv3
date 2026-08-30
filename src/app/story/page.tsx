import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/shell/SiteShell";
import { Reveal } from "@/components/shell/Reveal";
import { StoryRail } from "@/components/story/StoryRail";
import { STORY_CHAPTERS, STORY_INTRO } from "@/lib/story";

export const metadata: Metadata = {
  title: "Story",
  description:
    "How I got here: a blockchain written from scratch, a national hackathon win, and the agent infrastructure I own today.",
};

export default function StoryPage() {
  return (
    <SiteShell active="story">
      <StoryRail
        items={STORY_CHAPTERS.map((chapter) => ({
          id: chapter.id,
          label: chapter.label,
          year: chapter.year,
        }))}
      />

      {/* Masthead */}
      <div className="col px-6 pb-9 pt-14 sm:px-8 sm:pt-20">
        <p className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--soft)]">Story</p>
        <h1 className="serif mt-4 max-w-[16ch] text-[38px] leading-[1.06] text-[var(--fg)] sm:text-[52px]">
          How I got here.
        </h1>
        <p className="copy mt-5 max-w-[58ch] text-[16px]">{STORY_INTRO}</p>
        <p className="mono mt-6 text-[10px] uppercase tracking-[0.14em] text-[var(--soft)]">
          {STORY_CHAPTERS.length} chapters · 2024 — now
        </p>
      </div>

      {STORY_CHAPTERS.map((chapter, index) => (
        <section
          key={chapter.id}
          id={chapter.id}
          className="col scroll-mt-14 border-t border-dashed border-[var(--line)] px-6 py-12 sm:px-8 sm:py-16"
        >
          <Reveal>
            {/* Chapter marker */}
            <div className="mono flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-[var(--soft)]">
              <span className="text-[var(--faint)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-6 bg-[var(--line)]" />
              <span>{chapter.year}</span>
            </div>

            <h2 className="serif mt-5 max-w-[24ch] text-[27px] leading-[1.16] text-[var(--fg)] sm:text-[33px]">
              {chapter.title}
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-6 space-y-4">
              {chapter.paragraphs.map((paragraph) => (
                <p key={paragraph} className="copy max-w-[64ch] text-[15.5px]">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          {chapter.pull ? (
            <Reveal delay={120}>
              <blockquote className="serif mt-9 max-w-[30ch] border-l border-[var(--line-strong)] pl-5 text-[22px] leading-[1.35] text-[var(--fg)] sm:text-[25px]">
                {chapter.pull}
              </blockquote>
            </Reveal>
          ) : null}

          {chapter.facts?.length ? (
            <Reveal delay={140}>
              <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-5">
                {chapter.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="serif text-[30px] leading-none tabular-nums text-[var(--fg)]">
                      {fact.value}
                    </dt>
                    <dd className="mono mt-2 text-[9.5px] uppercase tracking-[0.13em] text-[var(--soft)]">
                      {fact.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}

          {chapter.link ? (
            <Reveal delay={180}>
              {chapter.link.href.startsWith("http") ? (
                <a
                  href={chapter.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mono mt-8 inline-flex items-center gap-1.5 text-[11.5px] text-[var(--muted)] underline decoration-[var(--line-strong)] underline-offset-4 transition-colors hover:text-[var(--fg)] hover:decoration-[var(--fg)]"
                >
                  {chapter.link.label}
                  <ArrowUpRight size={12} />
                </a>
              ) : (
                <Link
                  href={chapter.link.href}
                  className="mono mt-8 inline-flex items-center gap-1.5 text-[11.5px] text-[var(--muted)] underline decoration-[var(--line-strong)] underline-offset-4 transition-colors hover:text-[var(--fg)] hover:decoration-[var(--fg)]"
                >
                  {chapter.link.label}
                  <ArrowUpRight size={12} />
                </Link>
              )}
            </Reveal>
          ) : null}
        </section>
      ))}
    </SiteShell>
  );
}
