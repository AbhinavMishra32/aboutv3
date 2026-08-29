"use client";

import { useEffect, useState } from "react";

/** Thin progress bar pinned under the top nav while reading an article. */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed left-0 top-12 z-50 h-px w-full bg-transparent" aria-hidden="true">
      <div
        className="h-px origin-left bg-[var(--fg)] transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})`, width: "100%" }}
      />
    </div>
  );
}
