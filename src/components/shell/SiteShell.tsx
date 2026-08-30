import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { CONTACT_LINKS, PROJECTS } from "@/lib/portfolio";
import { NAV_ITEMS, PROFILE, type NavKey } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { Band } from "@/components/shell/Band";
import { TopNav } from "@/components/shell/TopNav";
import { Intro } from "@/components/shell/Intro";
import { LocalTime } from "@/components/shell/LocalTime";
import { IndexRail } from "@/components/shell/IndexRail";
import { CommandPalette, type CommandItem } from "@/components/shell/CommandPalette";

async function buildCommandItems(): Promise<CommandItem[]> {
  const posts = await getAllPosts().catch(() => []);

  return [
    ...NAV_ITEMS.map((item) => ({
      id: `page-${item.key}`,
      label: item.label,
      hint: item.href,
      href: item.href,
      group: "Pages" as const,
    })),
    ...PROJECTS.map((project) => ({
      id: `project-${project.slug}`,
      label: project.name,
      hint: project.focus,
      href: `/projects#${project.slug}`,
      group: "Projects" as const,
    })),
    ...posts.slice(0, 12).map((post) => ({
      id: `post-${post.slug}`,
      label: post.title,
      hint: post.tags[0],
      href: `/blog/${post.slug}`,
      group: "Writing" as const,
    })),
    ...CONTACT_LINKS.map((link) => ({
      id: `link-${link.label}`,
      label: link.label,
      hint: link.href.replace(/^https?:\/\/(www\.)?|^mailto:/, ""),
      href: link.href,
      external: true,
      group: "Elsewhere" as const,
    })),
  ];
}

export async function SiteShell({
  active,
  children,
  index,
}: {
  active: NavKey;
  children: ReactNode;
  index?: Array<{ id: string; label: string }>;
}) {
  const commandItems = await buildCommandItems();
  const year = new Date().getFullYear();

  return (
    <div className="relative min-h-screen">
      <Intro />
      <TopNav active={active} />
      {index ? <IndexRail items={index} /> : null}
      <CommandPalette items={commandItems} />

      <main className="relative pb-0">{children}</main>

      {/* Footer */}
      <Band as="footer" className="border-t border-dashed border-[var(--line)] px-6 pb-12 pt-12 sm:px-8">
        <p className="serif whitespace-nowrap text-[28px] leading-none text-[var(--fg)] sm:text-[38px]">
          Building something hard?
        </p>
        <p className="copy mt-3 max-w-[46ch]">
          I&apos;m most useful on the parts that have to keep working — backend
          systems, rollout safety, agents with guardrails.
        </p>

        <a
          href={`mailto:${PROFILE.email}`}
          className="group mt-6 inline-flex items-baseline gap-2 text-[17px] text-[var(--fg)] sm:text-[19px]"
        >
          <span className="relative">
            {PROFILE.email}
            <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-100 bg-[var(--line-strong)] transition-colors duration-300 group-hover:bg-[var(--fg)]" />
          </span>
          <ArrowUpRight
            size={15}
            className="shrink-0 text-[var(--soft)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--fg)]"
          />
        </a>

        {/* Elsewhere — plain links, each with a rule that draws in on hover */}
        <ul className="mono mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[12px]">
          {CONTACT_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className="group relative inline-flex items-center gap-1.5 py-1 text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
              >
                {link.label}
                <ArrowUpRight
                  size={11}
                  className="text-[var(--faint)] transition-all duration-300 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-[var(--soft)]"
                />
                <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[var(--fg)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="mono mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-dashed border-[var(--line)] pt-5 text-[10px] uppercase tracking-[0.14em] text-[var(--soft)]">
          <span>© {year} {PROFILE.name}</span>
          <LocalTime />
        </div>
      </Band>

      <div className="h-16" />
    </div>
  );
}
