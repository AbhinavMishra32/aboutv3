"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "aboutv3-intro-seen";

const INTRO_ROWS = [
  ["01", "systems signal", "APIs, data, automations"],
  ["02", "product taste", "quiet UI, sharp edges"],
  ["03", "ship mode", "reliable, fast, owned"],
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
        <div className="site-intro-kicker">portfolio boot</div>
        <div className="site-intro-name" aria-hidden="true">
          <span>Abhinav</span>
          <span>Mishra</span>
        </div>
        <p className="site-intro-role">Full-stack product engineering / backend systems / AI workflows</p>

        <div className="site-intro-console">
          {INTRO_ROWS.map(([index, label, value]) => (
            <div key={label} className="site-intro-row">
              <span>{index}</span>
              <strong>{label}</strong>
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
