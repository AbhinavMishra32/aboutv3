"use client";

import { useEffect, useState } from "react";

export function ViewCounter({ slug, initialViews }: { slug: string; initialViews: number }) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    let cancelled = false;
    const bump = async () => {
      try {
        const res = await fetch("/api/blog/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as { views?: number };
        if (!cancelled && typeof data.views === "number") {
          setViews(data.views);
        }
      } catch {
        // noop
      }
    };
    bump();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return <span>{views.toLocaleString()} views</span>;
}
