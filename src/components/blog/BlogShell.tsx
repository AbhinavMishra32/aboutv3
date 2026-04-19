import type { ReactNode } from "react";
import Link from "next/link";
import { SiteThemeToggle } from "@/components/SiteThemeToggle";

export function BlogShell({ children }: { children: ReactNode }) {
  return (
    <div className="blog-page">
      <div className="site-shell site-shell--article">
        <header className="site-header">
          <div className="site-brand">
            <Link href="/" className="site-name">
              Abhinav Mishra
            </Link>
            <p className="site-tagline">Notes on software, product clarity, and the craft behind dependable systems.</p>
          </div>

          <nav className="site-nav" aria-label="Blog navigation">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/blog" className="nav-link">
              Blog
            </Link>
            <a href="mailto:abhinavmishra3322@gmail.com" className="nav-link">
              Contact
            </a>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <p className="footer-note">Writing space for product lessons, engineering systems, and release notes from ongoing work.</p>
          <SiteThemeToggle />
        </footer>
      </div>
    </div>
  );
}
