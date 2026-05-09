"use client";

import { useEffect, useId, useState } from "react";
import { KoreanHoverText, LanguageShiftText } from "@/components/site/LanguageShiftText";

const SIGNAL_ROWS = [
  ["프로필.신호", "profile.signal", "full-stack engineer with backend depth and product taste"],
  ["스택.초점", "stack.focus", "TypeScript products, NestJS systems, ML tooling direction"],
  ["디버그.깊이", "debug.depth", "APIs, data, edge cases, rollout paths, infra seams"],
  ["취향.레이어", "taste.layer", "quiet interfaces over loud dashboards"],
];

const SIGNAL_CHIPS = [
  ["네스트", "nestjs"],
  ["시스템", "systems"],
  ["제품감", "product"],
  ["저수준", "low-level"],
  ["ML도구", "ml"],
];

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
          <LanguageShiftText
            finalText="Abhinav Mishra"
            frames={["아비나브 미슈라", "अभिनव मिश्रा", "Abhinav Mishra"]}
            className="hero-name-text"
            delay={360}
          />
          <span className="hero-name-cursor" aria-hidden="true">
            _
          </span>
          <span className="hero-name-hint" aria-hidden="true">
            탐색
          </span>
        </button>
      </h1>
      <p className="hero-role">
        <LanguageShiftText
          finalText="Full-Stack Engineer"
          frames={["풀스택 엔지니어", "フルスタックエンジニア", "Full-Stack Engineer"]}
          delay={660}
        />
      </p>

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
            {SIGNAL_ROWS.map(([korean, english, value]) => (
              <div key={english} className="hero-signal-row">
                <span>
                  <KoreanHoverText korean={korean} english={english} />
                </span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="hero-signal-chips" aria-label="Engineering signal keywords">
            {SIGNAL_CHIPS.map(([korean, english]) => (
              <KoreanHoverText key={english} korean={korean} english={english} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
