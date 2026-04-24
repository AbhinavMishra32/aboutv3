"use client";

import { useEffect, useId, useState } from "react";

const SIGNAL_ROWS = [
  ["profile.signal", "full-stack product engineer with backend-systems instincts"],
  ["ship.mode", "ambiguous brief -> dependable product surface"],
  ["debug.depth", "APIs, data, edge cases, rollout paths, UI seams"],
  ["taste.layer", "quiet interfaces over loud dashboards"],
];

const SIGNAL_CHIPS = ["ownership", "systems", "reliability", "AI workflows", "polish"];

export function HeroSignal() {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={`hero-signal ${isOpen ? "is-open" : ""}`}>
      <h1 className="hero-name">
        <button
          type="button"
          className="hero-name-button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="hero-name-text">Abhinav Mishra</span>
          <span className="hero-name-cursor" aria-hidden="true">
            _
          </span>
          <span className="hero-name-hint" aria-hidden="true">
            inspect
          </span>
        </button>
      </h1>
      <p className="hero-role">Software Engineer</p>

      <div id={panelId} className="hero-signal-panel" aria-hidden={!isOpen}>
        <div
          className="hero-signal-terminal"
          role={isOpen ? "status" : undefined}
          aria-live={isOpen ? "polite" : undefined}
        >
          <div className="hero-signal-bar" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="hero-signal-command">
            <span className="hero-signal-path">~/portfolio</span>
            <span className="hero-signal-caret">$</span>
            <span>inspect --signal</span>
          </div>
          <div className="hero-signal-output">
            {SIGNAL_ROWS.map(([label, value]) => (
              <div key={label} className="hero-signal-row">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="hero-signal-chips" aria-label="Engineering signal keywords">
            {SIGNAL_CHIPS.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
