"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { NAV_ITEMS, type NavKey } from "@/lib/site";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { openCommandPalette } from "@/components/shell/CommandPalette";

/**
 * The header is part of the same ruled column as the rest of the page, so the
 * two dashed rules start at the very top of the viewport.
 */
export function TopNav({ active }: { active: NavKey }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [active]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="col flex items-center justify-between gap-3 bg-transparent px-6 py-3 sm:px-8">
        <Link
          href="/"
          className="serif shrink-0 text-lg leading-none text-[var(--fg)] transition-opacity hover:opacity-65"
        >
          Abhinav
        </Link>

        <nav className="hidden items-center gap-4 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`relative text-[13px] tracking-[0.01em] transition-colors ${
                active === item.key
                  ? "text-[var(--fg)]"
                  : "text-[var(--soft)] hover:text-[var(--fg)]"
              }`}
            >
              {item.label}
              {active === item.key ? (
                <span className="absolute -bottom-1 left-0 h-px w-full bg-[var(--fg)]" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Search (Command K)"
            className="text-[var(--soft)] transition-colors hover:text-[var(--fg)]"
          >
            <Search size={14} strokeWidth={1.9} />
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className="text-[var(--soft)] transition-colors hover:text-[var(--fg)] md:hidden"
          >
            {menuOpen ? <X size={15} strokeWidth={1.9} /> : <Menu size={15} strokeWidth={1.9} />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-dashed border-[var(--line)] md:hidden">
          <nav className="col px-6 py-2 sm:px-8" aria-label="Mobile">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block py-2 text-[13px] ${
                  active === item.key ? "text-[var(--fg)]" : "text-[var(--soft)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
