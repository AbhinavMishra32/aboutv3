"use client";

import { useEffect, useRef, useState } from "react";

type RailItem = { id: string; label: string; year: string };

/**
 * Sticky chapter rail. A single line fills as you move through the story and
 * the active chapter's tick extends — the whole thing is driven by one scroll
 * handler writing to a ref, so it stays cheap.
 */
export function StoryRail({ items }: { items: RailItem[] }) {
  const [active, setActive] = useState(0);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const nodes = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!nodes.length) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const anchor = window.innerHeight * 0.35;

      let current = 0;
      nodes.forEach((node, index) => {
        if (node.getBoundingClientRect().top - anchor <= 0) current = index;
      });
      setActive(current);

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const start = first.offsetTop;
      const end = last.offsetTop + last.offsetHeight;
      const span = Math.max(1, end - start - window.innerHeight * 0.35);
      const progress = Math.min(1, Math.max(0, (window.scrollY - start + anchor) / span));

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${progress})`;
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav
      aria-label="Story chapters"
      className="pointer-events-none fixed right-0 top-0 z-40 hidden h-screen w-[calc((100vw-760px)/2)] xl:block"
    >
      <div className="pointer-events-auto absolute left-9 top-1/2 flex -translate-y-1/2 gap-4">
        {/* Progress line */}
        <div className="relative w-px shrink-0 bg-[var(--line)]">
          <span
            ref={fillRef}
            className="absolute inset-x-0 top-0 h-full origin-top bg-[var(--fg)] transition-transform duration-150 ease-out"
            style={{ transform: "scaleY(0)" }}
          />
        </div>

        <ol className="space-y-3.5">
          {items.map((item, index) => {
            const isActive = index === active;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="group block"
                  aria-current={isActive ? "true" : undefined}
                >
                  <span
                    className={`mono block text-[9px] uppercase tracking-[0.16em] transition-colors duration-500 ${
                      isActive ? "text-[var(--soft)]" : "text-[var(--faint)]"
                    }`}
                  >
                    {item.year}
                  </span>
                  <span
                    className={`mono block text-[11.5px] transition-all duration-500 ${
                      isActive
                        ? "translate-x-0 text-[var(--fg)]"
                        : "-translate-x-0.5 text-[var(--soft)] group-hover:translate-x-0 group-hover:text-[var(--muted)]"
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
