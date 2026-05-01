"use client";

import { useEffect, useState } from "react";

const FADE_THRESHOLD = 10;

export function HeaderTagline({ children }: { children: string }) {
  const [isFaded, setIsFaded] = useState(false);

  useEffect(() => {
    let frame = 0;

    const syncTagline = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setIsFaded(window.scrollY > FADE_THRESHOLD);
      });
    };

    syncTagline();
    window.addEventListener("scroll", syncTagline, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", syncTagline);
    };
  }, []);

  return <p className={`site-tagline ${isFaded ? "is-faded" : ""}`}>{children}</p>;
}
