"use client";

import { useEffect } from "react";

const SEEN_KEY = "intro-played";
const DURATION = 1400;

/**
 * There is no splash sheet and no name card — the page itself is the intro.
 * The document is revealed top-down while each band settles in behind it and
 * the section rules sweep out from the left, so what you watch is the real
 * layout being typeset rather than a curtain hiding it.
 *
 * This renders nothing; the sequence is pure CSS keyed off `data-intro`, which
 * the inline script in the layout sets before first paint. All this does is
 * retire the flag once the run is over.
 */
export function Intro() {
  useEffect(() => {
    if (document.documentElement.dataset.intro !== "playing") return;

    const timer = window.setTimeout(() => {
      document.documentElement.dataset.intro = "done";
      window.sessionStorage.setItem(SEEN_KEY, "1");
    }, DURATION);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
