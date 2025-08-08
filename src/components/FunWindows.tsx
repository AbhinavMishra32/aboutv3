"use client";

import { Rnd } from "react-rnd";
import React from "react";

export function PongWindow({ onClose, zIndex = 80, onActivate }: { onClose: () => void; zIndex?: number; onActivate?: () => void }) {
  return (
    <Rnd
      default={{ x: 120, y: 120, width: 520, height: 340 }}
      bounds="parent"
      className="absolute rounded-2xl border border-white/10 bg-neutral-950/85 backdrop-blur-xl shadow-[0_20px_60px_-25px_rgba(0,0,0,0.6)] overflow-hidden"
      style={{ zIndex }}
      minWidth={360}
      minHeight={240}
      onMouseDown={onActivate}
    >
      <div className="win-drag flex items-center gap-2 border-b border-white/10 bg-neutral-900/70 px-3 py-2">
        <span className="inline-block h-3 w-3 rounded-full bg-rose-500" onClick={onClose} />
        <span className="inline-block h-3 w-3 rounded-full bg-amber-400" />
        <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
        <div className="ml-3 text-sm text-neutral-300">Pong</div>
      </div>
      <PongCanvas />
    </Rnd>
  );
}

function PongCanvas() {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  React.useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = canvas.clientWidth);
    let h = (canvas.height = canvas.clientHeight);
    // Ball
    const r = 8;
    let x = w / 2;
    let y = h / 2;
    let vx = 5 * (Math.random() > 0.5 ? 1 : -1);
    let vy = (Math.random() * 3 + 2) * (Math.random() > 0.5 ? 1 : -1);
    // Paddles
    const paddleW = 10;
    const padOff = 18;
    let paddleH = Math.max(60, Math.min(90, h * 0.16));
    let leftY = h / 2 - paddleH / 2;
    let rightY = h / 2 - paddleH / 2;
    // Scores
    let scoreL = 0;
    let scoreR = 0;
    // Input
    let keyUp = false, keyDown = false;
    let mouseHeld = false;
    let lastAccel = performance.now();
    const onKey = (e: KeyboardEvent) => {
      if (e.type === "keydown") {
        if (e.key === "ArrowUp" || e.key === "w") keyUp = true;
        if (e.key === "ArrowDown" || e.key === "s") keyDown = true;
      } else {
        if (e.key === "ArrowUp" || e.key === "w") keyUp = false;
        if (e.key === "ArrowDown" || e.key === "s") keyDown = false;
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      leftY = Math.max(0, Math.min(h - paddleH, e.clientY - rect.top - paddleH / 2));
    };
    const onDown = () => { mouseHeld = true; lastAccel = performance.now(); };
    const onUp = () => { mouseHeld = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    function serve(toRight: boolean) {
      x = w / 2; y = h / 2; paddleH = Math.max(60, Math.min(90, h * 0.16));
      vx = (toRight ? 5 : -5); vy = (Math.random() * 3 + 2) * (Math.random() > 0.5 ? 1 : -1);
    }

    const predict = () => {
      if (vx <= 0) return y; // only predict when ball coming to right
      const top = r, bottom = h - r; const range = bottom - top;
      const targetX = w - padOff - paddleW - r;
      const t = (targetX - x) / vx; // frames since vx is px/frame
      const pos = y + vy * t;
      // reflect using triangular wave
      const period = 2 * range;
      let m = (pos - top) % period; if (m < 0) m += period;
      const reflected = m <= range ? top + m : top + (period - m);
      return reflected;
    };

    let raf: number;
    const loop = () => {
      w = canvas.width = canvas.clientWidth; h = canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // Player paddle via keyboard fallback
      const pSpeed = 10;
      if (keyUp) leftY -= pSpeed; if (keyDown) leftY += pSpeed;
      leftY = Math.max(0, Math.min(h - paddleH, leftY));

      // Ball motion
      x += vx; y += vy;
      // Accelerate while mouse is held
      if (mouseHeld) {
        const now = performance.now();
        if (now - lastAccel > 1000) {
          const speed = Math.hypot(vx, vy) * 1.08;
          const current = Math.hypot(vx, vy) || 1;
          const f = speed / current;
          vx *= f; vy *= f;
          lastAccel = now;
        }
      }
      if (y < r) { y = r; vy = Math.abs(vy); }
      if (y > h - r) { y = h - r; vy = -Math.abs(vy); }

      // CPU AI: predict intercept and move aggressively
      if (vx > 0) {
        const target = predict();
        const center = rightY + paddleH / 2;
        const error = target - center;
        const aiSpeed = 12; // very strong AI
        rightY += Math.max(-aiSpeed, Math.min(aiSpeed, error));
      } else {
        // when ball going away, drift towards center
        const centerLine = h / 2 - paddleH / 2;
        rightY += (centerLine - rightY) * 0.06;
      }
      rightY = Math.max(0, Math.min(h - paddleH, rightY));

      // Collisions with paddles
      // Left paddle
      if (x - r < padOff + paddleW && y > leftY && y < leftY + paddleH && vx < 0) {
        x = padOff + paddleW + r;
        vx = Math.abs(vx) * 1.05;
        const offset = (y - (leftY + paddleH / 2)) / (paddleH / 2);
        vy += offset * 3.2; // add spin based on hit location
      }
      // Right paddle
      if (x + r > w - padOff - paddleW && y > rightY && y < rightY + paddleH && vx > 0) {
        x = w - padOff - paddleW - r;
        vx = -Math.abs(vx) * 1.05;
        const offset = (y - (rightY + paddleH / 2)) / (paddleH / 2);
        vy += offset * 3.2;
      }

      // Scoring
      if (x < -30) { scoreR += 1; serve(true); lastAccel = performance.now(); }
      if (x > w + 30) { scoreL += 1; serve(false); lastAccel = performance.now(); }

      // Draw midline
      ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(w / 2 - 1, 0, 2, h);
      // Draw ball
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      // Draw paddles
      ctx.fillRect(padOff, leftY, paddleW, paddleH);
      ctx.fillRect(w - padOff - paddleW, rightY, paddleW, paddleH);
      // Scoreboard
      ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.font = "600 18px system-ui, -apple-system, Segoe UI";
      ctx.fillText(String(scoreL), w / 2 - 40, 28);
      ctx.fillText(String(scoreR), w / 2 + 28, 28);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKey); window.removeEventListener("resize", onResize); window.removeEventListener("mousedown", onDown); window.removeEventListener("mouseup", onUp); };
  }, []);
  return <canvas ref={ref} className="w-full h-[calc(100%-40px)]" />;
}

export function StarfieldWindow({ onClose, zIndex = 85, onActivate }: { onClose: () => void; zIndex?: number; onActivate?: () => void }) {
  return (
    <Rnd
      default={{ x: 180, y: 160, width: 560, height: 360 }}
      bounds="parent"
      className="absolute rounded-2xl border border-white/10 bg-neutral-950/85 backdrop-blur-xl shadow-[0_20px_60px_-25px_rgba(0,0,0,0.6)] overflow-hidden"
      style={{ zIndex }}
      minWidth={360}
      minHeight={240}
      onMouseDown={onActivate}
    >
      <div className="win-drag flex items-center gap-2 border-b border-white/10 bg-neutral-900/70 px-3 py-2">
        <span className="inline-block h-3 w-3 rounded-full bg-rose-500" onClick={onClose} />
        <span className="inline-block h-3 w-3 rounded-full bg-amber-400" />
        <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
        <div className="ml-3 text-sm text-neutral-300">Starfield</div>
      </div>
      <StarfieldCanvas />
    </Rnd>
  );
}

function StarfieldCanvas() {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  React.useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = canvas.clientWidth);
    let h = (canvas.height = canvas.clientHeight);
    const stars = Array.from({ length: 200 }, () => ({ x: Math.random()*w, y: Math.random()*h, z: Math.random()*2+0.5 }));
    let raf: number;
    const loop = () => {
      w = canvas.width = canvas.clientWidth; h = canvas.height = canvas.clientHeight;
      ctx.fillStyle = "#0b0b0f"; ctx.fillRect(0,0,w,h);
      ctx.fillStyle = "#ffffff";
      for (const s of stars) {
        s.x += s.z; if (s.x > w) s.x = 0; // pan right
        const size = s.z * 1.2;
        ctx.globalAlpha = Math.min(1, 0.6 + Math.random()*0.4);
        ctx.fillRect(s.x, s.y, size, size);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="w-full h-[calc(100%-40px)]" />;
}


