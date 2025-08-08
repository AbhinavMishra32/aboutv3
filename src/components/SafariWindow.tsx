"use client";

import { motion } from "framer-motion";
import { Rnd } from "react-rnd";
import { X, ChevronLeft, ChevronRight, RefreshCw, Lock } from "lucide-react";
import { useState } from "react";

export function SafariWindow({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) {
  const [src, setSrc] = useState(url);
  return (
    <Rnd
      default={{ x: 40, y: 40, width: 900, height: 560 }}
      bounds="parent"
      minWidth={520}
      minHeight={360}
      dragHandleClassName="safari-drag"
      className="absolute z-30 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/85 backdrop-blur-xl shadow-[0_30px_90px_-20px_rgba(0,0,0,0.7)]"
    >
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="h-full w-full">
      {/* Safari toolbar */}
      <div className="safari-drag flex items-center gap-2 border-b border-white/10 bg-neutral-900/70 px-3 py-2 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-rose-500" onClick={onClose} />
          <span className="inline-block h-3 w-3 rounded-full bg-amber-400" />
          <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
        </div>
        <div className="ml-3 flex items-center gap-1 text-neutral-300">
          <button className="rounded-md p-1 hover:bg-white/10"><ChevronLeft className="size-4" /></button>
          <button className="rounded-md p-1 hover:bg-white/10"><ChevronRight className="size-4" /></button>
          <button className="rounded-md p-1 hover:bg-white/10" onClick={() => setSrc(src)}><RefreshCw className="size-4" /></button>
        </div>
        <div className="mx-3 flex min-w-0 flex-1 items-center gap-2 rounded-md bg-white/5 px-3 py-1.5 text-sm text-neutral-300">
          <Lock className="size-3 text-emerald-400" />
          <div className="truncate">{src}</div>
        </div>
        <button onClick={onClose} className="ml-auto rounded-md p-1 text-neutral-300 hover:text-white hover:bg-white/10"><X className="size-4" /></button>
      </div>
      {/* Content */}
      <div className="h-[calc(100%-44px)] w-full">
        <iframe src={src} className="h-full w-full" title="Safari" />
      </div>
      </motion.div>
    </Rnd>
  );
}


