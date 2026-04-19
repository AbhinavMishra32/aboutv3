"use client";

import { useEffect, useState } from "react";

type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "site-theme-preference";

function resolveTheme(preference: ThemePreference) {
  if (preference !== "system") {
    return preference;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(preference: ThemePreference) {
  const root = document.documentElement;
  root.dataset.themePreference = preference;
  root.dataset.theme = resolveTheme(preference);
}

export function SiteThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>("system");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const nextTheme =
      stored === "light" || stored === "dark" || stored === "system" ? stored : "system";

    setTheme(nextTheme);
    applyTheme(nextTheme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const current = (window.localStorage.getItem(STORAGE_KEY) as ThemePreference | null) ?? "system";
      if (current === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, []);

  function setPreference(nextTheme: ThemePreference) {
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <div className="theme-switcher" aria-label="Theme switcher">
      <span className="theme-label">Theme →</span>
      {(["system", "light", "dark"] as const).map((option) => (
        <button
          key={option}
          type="button"
          className={`theme-option ${theme === option ? "is-active" : ""}`}
          onClick={() => setPreference(option)}
        >
          {option[0].toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
  );
}
