"use client";

import { useEffect, useState } from "react";

export function LanguageShiftText({
  finalText,
  frames,
  className,
  delay = 0,
}: {
  finalText: string;
  frames: string[];
  className?: string;
  delay?: number;
}) {
  const [text, setText] = useState(frames[0] ?? finalText);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || frames.length === 0) {
      setText(finalText);
      return;
    }

    const timers = frames.map((frame, index) =>
      window.setTimeout(
        () => {
          setText(frame);
        },
        delay + index * 155
      )
    );

    const finalTimer = window.setTimeout(() => {
      setText(finalText);
    }, delay + frames.length * 155 + 80);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(finalTimer);
    };
  }, [delay, finalText, frames]);

  return (
    <span className={`language-shift-text ${className ?? ""}`} aria-label={finalText}>
      {text}
    </span>
  );
}

export function KoreanHoverText({
  korean,
  english,
  className,
}: {
  korean: string;
  english: string;
  className?: string;
}) {
  return (
    <span className={`korean-hover ${className ?? ""}`} tabIndex={0} aria-label={english}>
      <span className="korean-hover-english">{english}</span>
      <span className="korean-hover-native" aria-hidden="true">
        {korean}
      </span>
    </span>
  );
}
