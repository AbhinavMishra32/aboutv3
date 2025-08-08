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
    { key: "safari", label: "Safari", onClick: () => onLaunch?.("safari") },
    { key: "vscode", label: "VSCode", onClick: () => onLaunch?.("vscode") },
    { key: "pong", label: "Pong", onClick: () => onLaunch?.("pong") },
    { key: "starfield", label: "Starfield", onClick: () => onLaunch?.("starfield") },
    { key: "github", label: "GitHub", href: "https://github.com/AbhinavMishra32" },
    { key: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/im-abhinavmishra" },
  ];

  // MagicUI Dock handles scaling and overflow; we simply wrap icons

  return (
    <div className={cn("pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center", className)}>
      <Dock
        ref={containerRef as unknown as React.Ref<HTMLDivElement>}
        className="pointer-events-auto supports-backdrop-blur:bg-white/10 bg-neutral-900/40 border-white/10 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] px-2"
        direction="bottom"
        iconSize={44}
        iconMagnification={72}
        iconDistance={120}
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
    case "safari":
      return <Icon icon="mdi:compass" className={common} />;
    case "github":
      return <Icon icon="mdi:github" className={common} />;
    case "linkedin":
      return <Icon icon="mdi:linkedin" className={common} />;
    case "vscode":
      return <Icon icon="mdi:microsoft-visual-studio-code" className={common} />;
    case "pong":
      return <Icon icon="mdi:tennis-ball" className={common} />;
    case "starfield":
      return <Icon icon="mdi:star-four-points" className={common} />;
    default:
      return <Code2 className={common} />;
  }
}


