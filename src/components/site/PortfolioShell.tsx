import type { ReactNode } from "react";
import { Icon } from "@iconify/react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteIntro } from "@/components/site/SiteIntro";
import { CONTACT_LINKS } from "@/lib/portfolio";

export function PortfolioShell({
  active,
  children,
  tagline,
  article = false,
}: {
  active: "overview" | "story" | "work" | "projects" | "blog";
  children: ReactNode;
  tagline?: string;
  article?: boolean;
}) {
  return (
    <div className="blog-page">
      <SiteIntro />
      <div className="site-shell">
        <SiteHeader active={active} tagline={tagline} />

        <main className={`site-main ${article ? "site-main--article" : ""}`}>{children}</main>

        <footer className="site-footer site-footer-compact">
          <div className="footer-inline">
            <div className="footer-inline-icons">
              {CONTACT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="contact-icon-link footer-icon-link"
                  aria-label={link.label}
                  title={link.label}
                >
                  <Icon icon={link.icon} className="contact-icon-glyph" />
                </a>
              ))}
            </div>
            <a href="mailto:abhinavmishra3322@gmail.com" className="footer-email">
              abhinavmishra3322@gmail.com
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
