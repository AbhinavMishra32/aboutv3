"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, className, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal
            className={cn(
              "relative w-[92vw] max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-neutral-950 p-4 text-neutral-100 shadow-2xl",
              "md:p-6",
              className
            )}
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            <div className="flex items-start gap-3 pb-3 md:pb-4 border-b border-white/10">
              {title && <h3 className="text-lg md:text-xl font-semibold tracking-tight">{title}</h3>}
              <button
                aria-label="Close"
                onClick={onClose}
                className="ml-auto rounded-lg p-2 hover:bg-white/5 text-neutral-300 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="pt-4 md:pt-6 text-sm leading-relaxed">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


