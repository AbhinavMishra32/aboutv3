"use client";

import { useEffect, useState } from "react";

/**
 * Sticky right-hand table of contents. Tracks the section currently closest to
 * the top of the viewport and marks it active.
 */
export function IndexRail({ items }: { items: Array<{ id: string; label: string }> }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const nodes = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!nodes.length) return;

    const onScroll = () => {
      const anchor = window.innerHeight * 0.28;
      let current = nodes[0].id;
      for (const node of nodes) {
        if (node.getBoundingClientRect().top - anchor <= 0) {
          current = node.id;
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <nav
      aria-label="Section index"
      className="pointer-events-none fixed right-0 top-0 z-40 hidden h-screen w-[calc((100vw-760px)/2)] xl:block"
    >
      <div className="pointer-events-auto absolute left-8 top-1/2 -translate-y-1/2">
        <div className="label mb-3">Index</div>
        <ul className="space-y-1.5">
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`mono group flex items-center gap-2 text-[11.5px] transition-colors ${
                    isActive
                      ? "text-[var(--fg)]"
                      : "text-[var(--soft)] hover:text-[var(--muted)]"
                  }`}
                >
                  <span
                    className={`h-px transition-all duration-300 ${
                      isActive
                        ? "w-3.5 bg-[var(--fg)]"
                        : "w-1.5 bg-[var(--faint)] group-hover:w-3"
                    }`}
                  />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
