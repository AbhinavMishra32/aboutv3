import Link from "next/link";
import { SiteThemeToggle } from "@/components/SiteThemeToggle";
import { HeaderTagline } from "@/components/site/HeaderTagline";

type NavKey = "overview" | "now" | "story" | "work" | "projects" | "blog";

const NAV_ITEMS: Array<{ key: NavKey; label: string; href: string }> = [
  { key: "overview", label: "Overview", href: "/" },
  { key: "now", label: "Now", href: "/now" },
  { key: "story", label: "Story", href: "/story" },
  { key: "work", label: "Work", href: "/work" },
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "blog", label: "Blog", href: "/blog" },
];

export function SiteHeader({
  active,
  tagline,
}: {
  active: NavKey;
  tagline?: string;
}) {
  return (
    <header className="site-header">
      <div className="site-brand">
        <Link href="/" className="site-name">
          Abhinav Mishra
        </Link>
        {tagline ? <HeaderTagline>{tagline}</HeaderTagline> : null}
      </div>

      <div className="header-actions">
        <nav className="site-nav site-nav-tabs" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`nav-link nav-link-tab ${active === item.key ? "is-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <SiteThemeToggle variant="compact" />
      </div>
    </header>
  );
}
