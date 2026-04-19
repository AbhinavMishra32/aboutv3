"use client";

import { useEffect, useState } from "react";
import { Monitor, MoonStar, SunMedium } from "lucide-react";

type ThemePreference = "system" | "light" | "dark";
type SiteThemeToggleProps = {
  variant?: "full" | "compact";
};

const STORAGE_KEY = "site-theme-preference";
const THEME_ORDER: ThemePreference[] = ["system", "light", "dark"];

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

function getThemeIcon(theme: ThemePreference) {
  if (theme === "light") {
    return SunMedium;
  }

  if (theme === "dark") {
    return MoonStar;
  }

  return Monitor;
}

export function SiteThemeToggle({ variant = "full" }: SiteThemeToggleProps) {
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

  function cycleTheme() {
    const nextIndex = (THEME_ORDER.indexOf(theme) + 1) % THEME_ORDER.length;
    setPreference(THEME_ORDER[nextIndex]);
  }

  if (variant === "compact") {
    const ThemeIcon = getThemeIcon(theme);

    return (
      <button
        type="button"
        className="theme-toggle-icon"
        onClick={cycleTheme}
        aria-label={`Theme preference is ${theme}. Click to cycle theme.`}
        title={`Theme: ${theme}`}
      >
        <ThemeIcon size={16} strokeWidth={1.8} />
      </button>
    );
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
