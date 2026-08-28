"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "site-theme-preference";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(current);
    setMounted(true);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.dataset.themePreference = next;
    root.dataset.theme = next;
    root.style.colorScheme = next;
    window.localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="grid size-7 place-items-center rounded-md text-[var(--soft)] transition-colors hover:bg-[var(--hover)] hover:text-[var(--fg)]"
    >
      <span className="sr-only">Toggle theme</span>
      {mounted && theme === "light" ? (
        <Moon size={14} strokeWidth={1.9} />
      ) : (
        <Sun size={14} strokeWidth={1.9} />
      )}
    </button>
  );
}
