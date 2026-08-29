import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { CONTACT_LINKS, PROJECTS } from "@/lib/portfolio";
import { NAV_ITEMS, PROFILE, type NavKey } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { Band } from "@/components/shell/Band";
import { TopNav } from "@/components/shell/TopNav";
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
    {
      id: "page-now",
      label: "Now",
      hint: "/now",
      href: "/now",
      group: "Pages" as const,
    },
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
      <TopNav active={active} />
      {index ? <IndexRail items={index} /> : null}
      <CommandPalette items={commandItems} />

      <main className="relative pb-0">{children}</main>

      {/* Footer */}
      <Band as="footer" className="border-t border-dashed border-[var(--line)] px-6 pb-10 pt-7 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="serif text-[22px] leading-tight text-[var(--fg)]">
              Let&apos;s build something that holds up.
            </p>
            <a
              href={`mailto:${PROFILE.email}`}
              className="mono mt-2 inline-flex items-center gap-1.5 text-[11.5px] text-[var(--muted)] underline decoration-[var(--line-strong)] underline-offset-4 transition-colors hover:text-[var(--fg)] hover:decoration-[var(--fg)]"
            >
              {PROFILE.email}
            </a>
          </div>

          <div className="flex items-center gap-1.5">
            {CONTACT_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={link.label}
                title={link.label}
                className="grid size-8 place-items-center rounded-lg border border-[var(--line)] bg-[var(--chip)] text-[var(--muted)] transition-colors hover:border-[var(--soft)] hover:text-[var(--fg)]"
              >
                <Icon icon={link.icon} width={15} height={15} />
              </a>
            ))}
          </div>
        </div>

        <div className="mono mt-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-dashed border-[var(--line)] pt-4 text-[10.5px] uppercase tracking-[0.12em] text-[var(--soft)]">
          <span>
            © {year} {PROFILE.name}
          </span>
          <span className="flex items-center gap-3">
            <Link href="/now" className="transition-colors hover:text-[var(--fg)]">
              Now
            </Link>
            <span className="text-[var(--faint)]">·</span>
            <span>Built with Next.js</span>
            <span className="text-[var(--faint)]">·</span>
            <span>Open to work</span>
          </span>
        </div>
      </Band>

      <div className="h-16" />
    </div>
  );
}
