"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/cn";

type DesktopIconItem = {
  key: string;
  label: string;
  href?: string;
  onClick?: () => void;
};

type IconPos = { top: number; left: number };

const TILE_SIZE = 64; // icon tile size (px)
const ROW_GAP = 96; // vertical spacing including label
const STORAGE_KEY = "desktop-icon-positions:v1";

export function DesktopIcons({ className, onLaunch }: { className?: string; onLaunch?: (key: string) => void }) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const items: DesktopIconItem[] = [
    { key: "vscode", label: "VSCode", onClick: () => onLaunch?.("vscode") },
    { key: "safari", label: "Safari", onClick: () => onLaunch?.("safari") },
    { key: "pong", label: "Pong", onClick: () => onLaunch?.("pong") },
    { key: "starfield", label: "Starfield", onClick: () => onLaunch?.("starfield") },
    { key: "github", label: "GitHub", href: "https://github.com/AbhinavMishra32" },
    { key: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/im-abhinavmishra" },
  ];

  const [positions, setPositions] = React.useState<Record<string, IconPos>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    } catch {}
  }, [positions]);

  // Provide sensible defaults: vertical stack on the right side
  const getDefaultPos = (index: number): IconPos => {
    const container = containerRef.current;
    const rect = container?.getBoundingClientRect();
    const left = rect ? Math.max(12, rect.width - 24 - TILE_SIZE) : 24; // right aligned
    return { top: 24 + index * ROW_GAP, left };
  };

  const clampToBounds = (pos: IconPos): IconPos => {
    const container = containerRef.current;
    if (!container) return pos;
    const rect = container.getBoundingClientRect();
    const maxLeft = Math.max(0, rect.width - TILE_SIZE - 24);
    const maxTop = Math.max(0, rect.height - ROW_GAP);
    return {
      left: Math.min(Math.max(12, pos.left), maxLeft),
      top: Math.min(Math.max(12, pos.top), maxTop),
    };
  };

  // After mount, if some icons have no stored position, seed defaults (right side)
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let changed = false;
    const next = { ...positions } as Record<string, IconPos>;
    items.forEach((it, idx) => {
      if (!next[it.key]) {
        next[it.key] = clampToBounds(getDefaultPos(idx));
        changed = true;
      }
    });
    if (changed) setPositions(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef.current]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 z-20",
        className
      )}
    >
      {items.map((it, idx) => {
        const pos = positions[it.key] ?? getDefaultPos(idx);
        return (
          <DraggableIcon
            key={it.key}
            label={it.label}
            href={it.href}
            onClick={it.onClick}
            position={pos}
            containerRef={containerRef}
            onDragEnd={(p) => setPositions((prev) => ({ ...prev, [it.key]: clampToBounds(p) }))}
          />
        );
      })}
    </div>
  );
}

function DraggableIcon({ label, href, onClick, position, onDragEnd, containerRef }: { label: string; href?: string; onClick?: () => void; position: IconPos; onDragEnd: (p: IconPos) => void; containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [dragging, setDragging] = React.useState(false);
  const [pos, setPos] = React.useState<IconPos>(position);
  const startRef = React.useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const movedRef = React.useRef(false);
  const lastUpTs = React.useRef(0);
  const pointerOffsetRef = React.useRef<{ offX: number; offY: number } | null>(null);

  React.useEffect(() => setPos(position), [position]);

  const onPointerDown = (e: React.PointerEvent) => {
    // Only primary button
    if (e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const tileRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    pointerOffsetRef.current = { offX: e.clientX - tileRect.left, offY: e.clientY - tileRect.top };
    // Fallback to previous method if container rect missing
    startRef.current = { x: e.clientX, y: e.clientY, left: pos.left, top: pos.top };
    if (containerRect) {
      setPos({
        left: tileRect.left - containerRect.left,
        top: tileRect.top - containerRect.top,
      });
    }
    setDragging(true);
    movedRef.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !startRef.current) return;
    const containerRect = containerRef.current?.getBoundingClientRect();
    const po = pointerOffsetRef.current;
    if (containerRect && po) {
      const left = e.clientX - containerRect.left - po.offX;
      const top = e.clientY - containerRect.top - po.offY;
      if (Math.abs(left - pos.left) > 2 || Math.abs(top - pos.top) > 2) movedRef.current = true;
      setPos({ left, top });
    } else {
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) movedRef.current = true;
      setPos({ left: startRef.current.left + dx, top: startRef.current.top + dy });
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const wasDragging = dragging;
    setDragging(false);
    if (wasDragging) onDragEnd(pos);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    // Double-click to open; ignore if a drag occurred
    if (!movedRef.current) {
      const now = Date.now();
      if (now - lastUpTs.current < 300) {
        // double click detected
        if (href) {
          try { window.open(href, "_blank", "noreferrer"); } catch {}
        } else {
          onClick?.();
        }
        lastUpTs.current = 0;
      } else {
        lastUpTs.current = now;
      }
    }
  };

  const content = (
    <div
      className="pointer-events-auto inline-flex select-none flex-col items-center gap-2"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={(e) => dragging && onPointerUp(e)}
      onDoubleClick={() => {
        if (dragging || movedRef.current) return;
        if (href) {
          try { window.open(href, "_blank", "noreferrer"); } catch {}
        } else {
          onClick?.();
        }
      }}
      style={{ position: "absolute", left: `${Math.round(pos.left)}px`, top: `${Math.round(pos.top)}px` }}
    >
      <div className="grid place-items-center h-16 w-16 rounded-xl border border-white/10 bg-neutral-900/40 backdrop-blur-md">
        {renderIcon(label)}
      </div>
      <span className="mt-1 text-[11px] text-neutral-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        {label}
      </span>
    </div>
  );

  return content;
}

function renderIcon(label: string) {
  const cls = "h-7 w-7 text-neutral-100";
  switch (label.toLowerCase()) {
    case "vscode":
      return <Icon icon="mdi:microsoft-visual-studio-code" className={cls} />;
    case "safari":
      return <Icon icon="mdi:compass" className={cls} />;
    case "pong":
      return <Icon icon="mdi:tennis-ball" className={cls} />;
    case "starfield":
      return <Icon icon="mdi:star-four-points" className={cls} />;
    case "github":
      return <Icon icon="mdi:github" className={cls} />;
    case "linkedin":
      return <Icon icon="mdi:linkedin" className={cls} />;
    default:
      return <Icon icon="mdi:folder" className={cls} />;
  }
}


