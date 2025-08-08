"use client";

import React from "react";
import { Code2 } from "lucide-react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/cn";
import { Dock, DockIcon } from "@/components/magicui/dock";

type DockItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  imageUrl?: string;
  href?: string;
  onClick?: () => void;
};

export function MacDock({ className, onLaunch }: { className?: string; onLaunch?: (key: string) => void }) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Use Iconify SVGs for stable icons
  const items: DockItem[] = [
    {
      key: "finder",
      label: "Finder",
      imageUrl: undefined,
    },
    {
      key: "safari",
      label: "Safari",
      imageUrl: undefined,
      onClick: () => onLaunch?.("safari"),
    },
    {
      key: "mail",
      label: "Mail",
      imageUrl: undefined,
      href: "mailto:abhinavmishra3322@gmail.com",
    },
    {
      key: "vscode",
      label: "VSCode",
      imageUrl: undefined,
    },
    {
      key: "terminal",
      label: "Terminal",
      imageUrl: undefined,
    },
    {
      key: "settings",
      label: "Settings",
      imageUrl: undefined,
    },
    {
      key: "trash",
      label: "Trash",
      imageUrl: undefined,
    },
  ];

  // MagicUI Dock handles scaling and overflow; we simply wrap icons

  return (
    <div className={cn("pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center", className)}>
      <Dock
        ref={containerRef as unknown as React.Ref<HTMLDivElement>}
        className="pointer-events-auto supports-backdrop-blur:bg-white/10 bg-neutral-900/40 border-white/10 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
        direction="bottom"
        iconSize={44}
        iconMagnification={76}
        iconDistance={140}
      >
        {items.map((it) => (
          <DockIcon key={it.key} className="rounded-2xl bg-white/5 border border-white/10" onClick={it.onClick}>
            <a href={it.href} target={it.href ? "_blank" : undefined} rel={it.href ? "noreferrer" : undefined} className="flex items-center justify-center">
              {renderIcon(it.key)}
            </a>
          </DockIcon>
        ))}
      </Dock>
    </div>
  );
}

// Legacy placeholder kept to avoid breaking imports; not used now that MagicUI Dock is in place
function DockButton({
  children,
  label,
  index,
  mouseX,
  containerLeft,
  containerRight,
  href,
  imageUrl,
  onClick,
  onOverflow,
}: {
  children: React.ReactNode;
  label: string;
  index: number;
  mouseX: number | null;
  containerLeft: number;
  containerRight: number;
  href?: string;
  imageUrl?: string;
  onClick?: () => void;
  onOverflow?: (leftExtra: number, rightExtra: number) => void;
}) {
  return null;
}

function renderIcon(key: string) {
  const common = "h-7 w-7";
  switch (key) {
    case "finder":
      return <Icon icon="logos:apple-finder" className={common} />;
    case "safari":
      return <Icon icon="logos:safari" className={common} />;
    case "mail":
      return <Icon icon="logos:apple-mail" className={common} />;
    case "vscode":
      return <Icon icon="logos:visual-studio-code" className={common} />;
    case "terminal":
      return <Icon icon="ph:terminal-bold" className={common} />;
    case "settings":
      return <Icon icon="solar:settings-bold" className={common} />;
    case "trash":
      return <Icon icon="mdi:trash-can-outline" className={common} />;
    default:
      return <Code2 className={common} />;
  }
}


