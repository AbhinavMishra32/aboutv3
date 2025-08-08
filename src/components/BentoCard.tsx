"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import React from "react";

type BentoCardProps = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

export function BentoCard({ title, subtitle, icon, className, onClick, children }: BentoCardProps) {
  return (
    <motion.button
      layout
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: "0 12px 30px -15px rgba(0,0,0,0.8)" }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative w-full overflow-hidden rounded-3xl glass bg-neutral-900/60 p-4 text-left",
        "md:p-5 lg:p-6",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)]",
        "transition-all duration-300",
        className
      )}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/3 to-transparent pointer-events-none" />
      <div className="flex items-center gap-3">
        {icon && <div className="shrink-0 text-violet-300/90">{icon}</div>}
        <div>
          <h3 className="text-base md:text-lg font-semibold tracking-tight text-neutral-100">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs md:text-sm text-neutral-400">{subtitle}</p>
          )}
        </div>
      </div>
      {children && <div className="mt-4 text-sm text-neutral-300/90 leading-relaxed">{children}</div>}
    </motion.button>
  );
}


