"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CornerDownLeft,
  FileText,
  Hash,
  Layers,
  Mail,
  Search,
} from "lucide-react";

export type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  href: string;
  external?: boolean;
  group: "Pages" | "Projects" | "Writing" | "Elsewhere";
};

const OPEN_EVENT = "abhinav:open-command-palette";

export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

const GROUP_ICON = {
  Pages: Hash,
  Projects: Layers,
  Writing: FileText,
  Elsewhere: Mail,
} as const;

function score(query: string, item: CommandItem) {
  const q = query.toLowerCase().trim();
  if (!q) return 1;
  const haystack = `${item.label} ${item.hint ?? ""} ${item.group}`.toLowerCase();
  if (haystack.startsWith(q)) return 100;
  if (item.label.toLowerCase().includes(q)) return 60;
  if (haystack.includes(q)) return 30;
  // loose subsequence match
  let i = 0;
  for (const char of haystack) {
    if (char === q[i]) i += 1;
    if (i === q.length) return 10;
  }
  return 0;
}

export function CommandPalette({ items }: { items: CommandItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    return items
      .map((item) => ({ item, s: score(query, item) }))
      .filter((entry) => entry.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((entry) => entry.item)
      .slice(0, 24);
  }, [items, query]);

  const grouped = useMemo(() => {
    const order: CommandItem["group"][] = ["Pages", "Projects", "Writing", "Elsewhere"];
    const map = new Map<CommandItem["group"], CommandItem[]>();
    for (const item of results) {
      const bucket = map.get(item.group) ?? [];
      bucket.push(item);
      map.set(item.group, bucket);
    }
    return order
      .filter((group) => map.has(group))
      .map((group) => ({ group, items: map.get(group)! }));
  }, [results]);

  const flat = useMemo(() => grouped.flatMap((section) => section.items), [grouped]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  }, []);

  const run = useCallback(
    (item: CommandItem | undefined) => {
      if (!item) return;
      close();
      if (item.external) {
        window.open(item.href, "_blank", "noreferrer");
      } else {
        router.push(item.href);
      }
    },
    [close, router]
  );

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }
      if (!open) return;
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setCursor((value) => (flat.length ? (value + 1) % flat.length : 0));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setCursor((value) => (flat.length ? (value - 1 + flat.length) % flat.length : 0));
      }
      if (event.key === "Enter") {
        event.preventDefault();
        run(flat[cursor]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flat, cursor, close, run]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector<HTMLElement>("[data-active='true']");
    active?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  if (!open) return null;

  let index = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search this site"
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={close}
        className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-[2px]"
        style={{ animation: "fade .18s ease both" }}
      />

      <div
        className="relative w-full max-w-[520px] overflow-hidden rounded-xl border border-[var(--line-strong)] bg-[var(--card)] shadow-2xl"
        style={{ animation: "rise .22s cubic-bezier(.16,1,.3,1) both" }}
      >
        <div className="flex items-center gap-2.5 border-b border-dashed border-[var(--line)] px-3.5 py-3">
          <Search size={14} className="shrink-0 text-[var(--soft)]" strokeWidth={2} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages, projects, writing…"
            className="mono w-full bg-transparent text-[13px] text-[var(--fg)] outline-none placeholder:text-[var(--faint)]"
          />
          <kbd className="mono shrink-0 rounded border border-[var(--line)] bg-[var(--chip)] px-1.5 py-0.5 text-[10px] text-[var(--soft)]">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-1.5">
          {grouped.length === 0 ? (
            <p className="mono px-2.5 py-6 text-center text-[12px] text-[var(--soft)]">
              No matches for “{query}”
            </p>
          ) : (
            grouped.map((section) => {
              const Icon = GROUP_ICON[section.group];
              return (
                <div key={section.group} className="mb-1 last:mb-0">
                  <div className="label px-2.5 pb-1 pt-2">{section.group}</div>
                  {section.items.map((item) => {
                    index += 1;
                    const isActive = index === cursor;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-active={isActive}
                        onMouseEnter={() => setCursor(flat.indexOf(item))}
                        onClick={() => run(item)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                          isActive ? "bg-[var(--chip-strong)]" : "hover:bg-[var(--hover)]"
                        }`}
                      >
                        <Icon
                          size={13}
                          strokeWidth={1.9}
                          className="shrink-0 text-[var(--soft)]"
                        />
                        <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--fg)]">
                          {item.label}
                        </span>
                        {item.hint ? (
                          <span className="mono hidden shrink-0 truncate text-[10.5px] text-[var(--soft)] sm:block sm:max-w-[180px]">
                            {item.hint}
                          </span>
                        ) : null}
                        {item.external ? (
                          <ArrowUpRight size={12} className="shrink-0 text-[var(--faint)]" />
                        ) : isActive ? (
                          <CornerDownLeft size={12} className="shrink-0 text-[var(--soft)]" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <div className="mono flex items-center justify-between gap-3 border-t border-dashed border-[var(--line)] px-3.5 py-2 text-[10px] text-[var(--soft)]">
          <span>↑↓ navigate · ⏎ open</span>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
