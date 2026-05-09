"use client";

import { useEffect, useState } from "react";
import { KoreanHoverText, LanguageShiftText } from "@/components/site/LanguageShiftText";

const STORAGE_KEY = "aboutv3-intro-seen";

const INTRO_ROWS = [
  ["01", "백엔드 신호", "backend signal", "APIs, queues, data, architecture"],
  ["02", "스택 깊이", "stack depth", "TypeScript, NestJS, Go, low-level curiosity"],
  ["03", "출시 모드", "ship mode", "reliable, fast, owned"],
];

export function SiteIntro() {
  const [shouldRender, setShouldRender] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadySeen = window.sessionStorage.getItem(STORAGE_KEY);

    if (alreadySeen) {
      root.removeAttribute("data-intro-state");
      return;
    }

    window.sessionStorage.setItem(STORAGE_KEY, "true");
    root.dataset.introState = "active";
    setShouldRender(true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const leaveDelay = prefersReducedMotion ? 350 : 1800;
    const removeDelay = prefersReducedMotion ? 700 : 2700;

    const leaveTimer = window.setTimeout(() => {
      root.dataset.introState = "leaving";
      setIsLeaving(true);
    }, leaveDelay);

    const removeTimer = window.setTimeout(() => {
      setShouldRender(false);
      document.body.style.overflow = previousOverflow;
      root.removeAttribute("data-intro-state");
    }, removeDelay);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = previousOverflow;
      root.removeAttribute("data-intro-state");
    };
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`site-intro ${isLeaving ? "is-leaving" : ""}`}
      role="status"
      aria-label="Opening Abhinav Mishra portfolio"
      aria-live="polite"
    >
      <div className="site-intro-grid" aria-hidden="true" />
      <div className="site-intro-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="site-intro-core">
        <div className="site-intro-kicker">
          <LanguageShiftText
            finalText="portfolio boot"
            frames={["포트폴리오 부팅", "ポートフォリオ起動", "portfolio boot"]}
          />
        </div>
        <div className="site-intro-name" aria-hidden="true">
          <LanguageShiftText finalText="Abhinav" frames={["아비나브", "अभिनव", "Abhinav"]} />
          <LanguageShiftText finalText="Mishra" frames={["미슈라", "मिश्रा", "Mishra"]} delay={120} />
        </div>
        <p className="site-intro-role">
          <LanguageShiftText
            finalText="TypeScript products / NestJS backend / ML tooling direction"
            frames={[
              "타입스크립트 제품 / NestJS 백엔드 / ML 툴링 방향",
              "TypeScript 제품 / NestJS systems / ML tooling",
              "TypeScript products / NestJS backend / ML tooling direction",
            ]}
            delay={240}
          />
        </p>

        <div className="site-intro-console">
          {INTRO_ROWS.map(([index, korean, english, value]) => (
            <div key={english} className="site-intro-row">
              <span>{index}</span>
              <strong>
                <KoreanHoverText korean={korean} english={english} />
              </strong>
              <em>{value}</em>
            </div>
          ))}
        </div>

        <div className="site-intro-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
