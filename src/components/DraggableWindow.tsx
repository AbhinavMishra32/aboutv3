"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rnd } from "react-rnd";
import { cn } from "@/lib/cn";

type DraggableWindowProps = {
  title?: string;
  open: boolean;
  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
  constraintsRef?: React.RefObject<HTMLDivElement | null>;
  zIndex?: number;
  onActivate?: () => void;
  isActive?: boolean;
};

export function DraggableWindow({ title, open, onClose, className, children, constraintsRef, zIndex, onActivate, isActive }: DraggableWindowProps) {
  const [size, setSize] = React.useState<{ width: number; height: number }>(() => {
    if (typeof window !== "undefined") {
      const vw = Math.min(1400, Math.floor(window.innerWidth * 0.92));
      const vh = Math.floor(window.innerHeight * 0.78);
      return { width: vw, height: vh };
    }
    return { width: 960, height: 640 };
  });

  // Responsively adjust window size on viewport resize
  React.useEffect(() => {
    const onResize = () => {
      const vw = Math.min(1400, Math.floor(window.innerWidth * 0.92));
      const vh = Math.floor(window.innerHeight * 0.78);
      setSize(prev => ({
        width: Math.max(320, Math.min(vw, prev.width > vw ? vw : prev.width)),
        height: Math.max(260, Math.min(vh, prev.height > vh ? vh : prev.height)),
      }));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!open) return null;

  return (
    <Rnd
      style={{ zIndex, position: "absolute" }}
      default={{ x: 40, y: 40, width: size.width, height: size.height }}
      size={{ width: size.width, height: size.height }}
      onResizeStop={(_, __, ref) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
      }}
      onDragStop={onActivate ? () => onActivate() : undefined}
      minWidth={320}
      minHeight={260}
      bounds="parent"
      dragHandleClassName="win-drag"
      enableResizing={{ top: true, right: true, bottom: true, left: true, topRight: true, bottomRight: true, bottomLeft: true, topLeft: true }}
      className={cn(
        "rounded-2xl overflow-hidden border border-white/10 bg-neutral-950/85 backdrop-blur-xl",
        isActive ? "shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]" : "shadow-[0_20px_60px_-25px_rgba(0,0,0,0.6)]",
        className
      )}
      onMouseDown={onActivate}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{ width: "100%", height: "100%" }}
      >
        {children}
      </motion.div>
    </Rnd>
  );
}


