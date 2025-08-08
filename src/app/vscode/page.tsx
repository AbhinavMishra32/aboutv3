"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/cn";
import { FileText, User2, Code2, Layers, Star, Globe } from "lucide-react";
import { DraggableWindow } from "@/components/DraggableWindow";
import { MacDock } from "@/components/MacDock";
import { PongWindow, StarfieldWindow } from "@/components/FunWindows";

type TabKey = "README.md" | "about.ts" | "experience.tsx" | "projects.tsx" | "awards.md" | "contact.json";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "README.md", label: "README.md", icon: <FileText className="size-4" /> },
  { key: "about.ts", label: "about.ts", icon: <User2 className="size-4" /> },
  { key: "experience.tsx", label: "experience.tsx", icon: <Layers className="size-4" /> },
  { key: "projects.tsx", label: "projects.tsx", icon: <Code2 className="size-4" /> },
  { key: "awards.md", label: "awards.md", icon: <Star className="size-4" /> },
  { key: "contact.json", label: "contact.json", icon: <Globe className="size-4" /> },
];

export default function VSCodePortfolio() {
  const [active, setActive] = useState<TabKey>("README.md");
  const [vscodeOpen, setVsOpen] = useState(true);
  const [safariOpen, setSafariOpen] = useState(false);
  const [safariUrl, setSafariUrl] = useState("https://abhinavmishra.in");
  const [safariBlocked, setSafariBlocked] = useState(false);
  const [pongOpen, setPongOpen] = useState(false);
  const [starOpen, setStarOpen] = useState(false);
  // Curated dark, modern wallpapers
  const wallpapers = [
    "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=1920&auto=format&fit=crop", // dark forest
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1920&auto=format&fit=crop", // night coast
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1920&auto=format&fit=crop", // alpine dusk
  ];
  const [wallpaperIdx, setWallpaperIdx] = useState(0);
  useEffect(() => {
    setWallpaperIdx(Math.floor(Math.random() * wallpapers.length));
  }, []);
  const blockedDomains = [
    "google.com",
    "www.google.com",
    "accounts.google.com",
    "x.com",
    "twitter.com",
    "instagram.com",
    "facebook.com",
    "linkedin.com",
  ];
  const [topWindow, setTopWindow] = useState<"vscode" | "safari" | "pong" | "starfield" | null>("vscode");
  const boundsRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(260);
  const [isResizing, setIsResizing] = useState(false);

  // Sidebar resize handlers
  const onResizeStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
  };
  const onResizeMove = (e: MouseEvent) => {
    if (!isResizing || !editorRef.current) return;
    const rect = editorRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // position within editor container
    const min = 180;
    const max = Math.min(480, rect.width - 200); // ensure editor remains visible
    setSidebarWidth(Math.max(min, Math.min(max, Math.round(x))));
  };
  const onResizeEnd = () => setIsResizing(false);

  useEffect(() => {
    window.addEventListener("mousemove", onResizeMove);
    window.addEventListener("mouseup", onResizeEnd);
    return () => {
      window.removeEventListener("mousemove", onResizeMove);
      window.removeEventListener("mouseup", onResizeEnd);
    };
  }, [isResizing, onResizeMove]);

  return (
    <div
      ref={boundsRef}
      className="relative min-h-svh text-neutral-100 overflow-hidden"
      style={{
        backgroundImage: `url('${wallpapers[wallpaperIdx]}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* VSCode window */}
      <DraggableWindow
        open={vscodeOpen}
        constraintsRef={boundsRef}
        zIndex={topWindow === "vscode" ? 100 : 60}
        isActive={topWindow === "vscode"}
        onActivate={() => setTopWindow("vscode")}
      >
        <div
          ref={editorRef}
          className="grid grid-rows-[40px_1fr] h-full rounded-2xl overflow-hidden min-w-0"
          style={{ gridTemplateColumns: `${sidebarWidth}px 6px 1fr` }}
        >
        {/* Top bar spans all columns */}
        <div className="win-drag col-span-3 flex items-center gap-3 px-3 border-b border-white/10 bg-neutral-900/70 cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-rose-500" onClick={() => setVsOpen(false)} />
            <span className="inline-block h-3 w-3 rounded-full bg-amber-400" />
            <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
          </div>
          <div className="mx-3 text-sm text-neutral-300 truncate">abhinavmishra — Visual Studio Code</div>
        </div>

        {/* Sidebar */}
        <aside className="border-r border-white/10 bg-neutral-900/40 p-3 space-y-3 min-w-0">
          <div className="text-xs uppercase tracking-wider text-neutral-500 px-1">Explorer</div>
          <nav className="space-y-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={cn(
                  "w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm",
                  active === t.key ? "bg-white/10 text-white" : "hover:bg-white/5 text-neutral-300"
                )}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Resizer */}
        <div
          onMouseDown={onResizeStart}
          className="relative cursor-col-resize select-none"
          aria-label="Resize sidebar"
        >
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/10" />
          <div className="absolute inset-y-0 left-0 right-0 hover:bg-white/5" />
        </div>

        {/* Editor */}
        <main className="relative overflow-auto vscode-scroll text-[15px] sm:text-[15px] md:text-base min-w-0 overflow-x-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-white/10 bg-neutral-900/40 px-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-t-md px-3 py-2 text-sm",
                  active === t.key ? "bg-neutral-900 text-white border-x border-t border-white/10" : "text-neutral-400 hover:text-neutral-200"
                )}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Content panes */}
          <div className="p-6 vscode-scroll min-w-0">
            {active === "README.md" && <ReadmePane />}
            {active === "about.ts" && <AboutPane />}
            {active === "experience.tsx" && <ExperiencePane />}
            {active === "projects.tsx" && <ProjectsPane />}
            {active === "awards.md" && <AwardsPane />}
            {active === "contact.json" && <ContactPane />}
          </div>
        </main>
        </div>
      </DraggableWindow>
      {safariOpen && (
        <DraggableWindow
          open
          constraintsRef={boundsRef}
          zIndex={topWindow === "safari" ? 100 : 60}
          isActive={topWindow === "safari"}
          onActivate={() => setTopWindow("safari")}
        >
          {/* Safari toolbar */}
          <div className="win-drag flex items-center gap-2 border-b border-white/10 bg-neutral-900/70 px-3 py-2 cursor-grab active:cursor-grabbing rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-rose-500" onClick={() => setSafariOpen(false)} />
              <span className="inline-block h-3 w-3 rounded-full bg-amber-400" />
              <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
            </div>
            <form
              className="mx-3 flex min-w-0 flex-1 items-center gap-2 rounded-md bg-white/5 px-3 py-1.5 text-sm text-neutral-300"
              onSubmit={(e) => {
                e.preventDefault();
                const input = (e.currentTarget.elements.namedItem("addr") as HTMLInputElement);
                let v = input.value.trim();
                if (!v) return;
                if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
                try {
                  const { hostname } = new URL(v);
                  setSafariBlocked(blockedDomains.some((d) => hostname === d || hostname.endsWith(`.${d}`)));
                } catch {}
                setSafariUrl(v);
              }}
            >
              <span className="size-2 rounded-full bg-emerald-400" />
              <input
                name="addr"
                defaultValue={safariUrl}
                className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-neutral-500"
                placeholder="Enter URL"
              />
            </form>
          </div>
          <div className="relative h-[calc(100%-44px)] w-full rounded-b-2xl overflow-hidden">
            <iframe src={safariUrl} className="h-full w-full" title="Safari" />
            {safariBlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm">
                <div className="rounded-xl border border-white/10 bg-neutral-900/80 p-5 text-center max-w-md">
                  <div className="text-sm text-neutral-200">This site prevents embedding in other pages.</div>
                  <a
                    href={safariUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center rounded-lg bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
                  >
                    Open in new tab
                  </a>
                </div>
              </div>
            )}
          </div>
        </DraggableWindow>
      )}
      {pongOpen && (
        <PongWindow onClose={() => setPongOpen(false)} zIndex={topWindow === "pong" ? 100 : 60} onActivate={() => setTopWindow("pong")} />
      )}
      {starOpen && (
        <StarfieldWindow onClose={() => setStarOpen(false)} zIndex={topWindow === "starfield" ? 100 : 60} onActivate={() => setTopWindow("starfield")} />
      )}
      <MacDock
        onLaunch={(key) => {
          if (key === "safari") {
            setSafariOpen(true);
            setTopWindow("safari");
          }
          if (key === "vscode") {
            setVsOpen(true);
            setTopWindow("vscode");
          }
          if (key === "pong") { setPongOpen(true); setTopWindow("pong"); }
          if (key === "starfield") { setStarOpen(true); setTopWindow("starfield"); }
        }}
      />
    </div>
  );
}

function ReadmePane() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Abhinav Mishra</h1>
        <p className="mt-1 text-neutral-300">Product‑focused CS undergrad and SIH 2024 winner building scalable AI tools across web and mobile. Creator of Decipath AI, an LLM‑powered roadmap generator.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          "TypeScript",
          "Next.js",
          "React",
          "Node.js",
          "PostgreSQL",
          "TailwindCSS",
          "AI UX",
        ].map((t) => (
          <span key={t} className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-neutral-200">{t}</span>
        ))}
      </div>
          <div className="grid sm:grid-cols-3 gap-3 min-w-0">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 min-w-0">
          <div className="text-xs uppercase tracking-wider text-neutral-500">Location</div>
          <div className="mt-1 text-neutral-200 break-words">Ghaziabad, UP</div>
        </div>
        <a href="mailto:abhinavmishra3322@gmail.com" className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors min-w-0">
          <div className="text-xs uppercase tracking-wider text-neutral-500">Email</div>
          <div className="mt-1 text-neutral-200 truncate">abhinavmishra3322@gmail.com</div>
        </a>
        <a href="https://abhinavmishra.in" target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors min-w-0">
          <div className="text-xs uppercase tracking-wider text-neutral-500">Website</div>
          <div className="mt-1 text-neutral-200 break-words">abhinavmishra.in</div>
        </a>
      </div>
    </div>
  );
}

function AboutPane() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold">Who I am</h3>
        <p className="mt-2 text-sm text-neutral-300">Product‑focused CS undergrad building scalable, polished software with a minimal, modern aesthetic. I care about performance, UX, and shipping real value.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 min-w-0">
          <div className="text-xs uppercase tracking-wider text-neutral-500">Strengths</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Full‑stack", "Product thinking", "AI UX", "Animations", "DX/Tooling"].map((t) => (
              <span key={t} className="rounded-md bg-white/10 px-2 py-1 text-xs">{t}</span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 min-w-0">
          <div className="text-xs uppercase tracking-wider text-neutral-500">Core Stack</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {["TypeScript", "Next.js", "React", "Node.js", "Tailwind", "PostgreSQL"].map((t) => (
              <span key={t} className="rounded-md bg-white/10 px-2 py-1 text-xs">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperiencePane() {
  return (
    <div className="relative">
      <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />
      <div className="space-y-6 text-sm">
        <div className="relative pl-8 min-w-0">
          <span className="absolute left-1.5 top-1 size-3 rounded-full bg-violet-400" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <h3 className="text-base font-semibold">LUDOTRONICS (Tech company founded by IIT Bhubaneswar developers) — Software Developer</h3>
            <span className="text-xs text-neutral-400">Jun 2025 – Present · Bhubaneswar, OD</span>
          </div>
          <ul className="mt-2 space-y-1 text-neutral-300">
            <li>Building ExpenseSplitter+, a cross‑platform React Native app with UPI settlement, AI‑powered voice input, and receipt OCR for fast, private group expense splitting.</li>
            <li>Implemented features enabling expense splits in &lt;60 seconds, with itemized multi‑payer logic and offline sync.</li>
            <li>Collaborated on product architecture and UPI integration strategy, researching secure settlement flows, AI service design, and scalable sync mechanisms for launch at 10K+ user scale.</li>
          </ul>
        </div>
        <div className="relative pl-8 min-w-0">
          <span className="absolute left-1.5 top-1 size-3 rounded-full bg-cyan-400" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <h3 className="text-base font-semibold">EXPERT BUDDY (Ed‑tech platform used by 200,000+ students) — Next.js Frontend Developer Intern</h3>
            <span className="text-xs text-neutral-400">Apr 2025 – Present · Jaipur, RJ</span>
          </div>
          <ul className="mt-2 space-y-1 text-neutral-300">
            <li>Built and shipped the StudyBank feature using Next.js with SSR, implementing custom caching for auth state, wallet balances, and notifications to reduce redundant network calls and boost performance.</li>
            <li>Engineered the chat page and real‑time notification system, integrating TalkJS with custom themes and connecting Gupshup for automated WhatsApp messaging.</li>
            <li>Developed a generative AI–powered document analysis system using Vercel AI SDK, enabling full PDF parsing, smart metadata extraction (title, subject, type), and structured output generation; led frontend performance optimization for a faster, more accessible experience.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ProjectsPane() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { name: "Decipath AI", date: "Jan 2025 – Mar 2025", desc: "Next.js‑powered roadmap generator using LLMs and prompt chaining, fine‑tuned for branching card layouts (ShadCN UI).", tech: ["Next.js", "Vercel AI", "Tailwind"], live: "https://abhinavmishra.in", src: "https://github.com/AbhinavMishra32" },
        { name: "Mentor Map", date: "Dec 2024", desc: "AI‑powered career guidance platform that won Smart India Hackathon 2024; personalized roadmaps, quizzes, realtime counseling, and progress tracking.", tech: ["React", "Firebase", "AI"], live: "https://abhinavmishra.in" },
        { name: "XiteCoin Blockchain", date: "Jan 2024 – Jun 2024", desc: "Complete blockchain system from scratch with proof‑of‑work, P2P networking, and cryptographic ledger security.", tech: ["Node.js", "Crypto", "CLI"], src: "https://github.com/AbhinavMishra32" },
      ].map((p) => (
        <div key={p.name} className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">{p.name}</div>
            {p.date && <div className="text-[11px] text-neutral-400">{p.date}</div>}
          </div>
          <p className="mt-1 text-sm text-neutral-300">{p.desc}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {p.tech?.map((t) => (
              <span key={t} className="rounded-md bg-white/10 px-2 py-0.5 text-[11px]">{t}</span>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            {p.live && (
              <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15">Live</a>
            )}
            {p.src && (
              <a href={p.src} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15">Source</a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AwardsPane() {
  return (
    <div className="grid sm:grid-cols-2 gap-3 text-sm">
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="font-medium">Smart India Hackathon 2024 — Winner</div>
        <div className="text-neutral-400 text-xs">Mohali, PB · Dec 2024 — ₹100,000 (~$1,200 USD)</div>
        <p className="mt-1 text-neutral-300 text-xs">Developed Mentor Map, an AI‑driven career guidance platform; recognized by Dr. Sanjeev (Joint Director, C‑DAC Mohali).</p>
      </div>
      <a href="https://github.com/metacall/core" target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors">
        <div className="font-medium">MetaCall Repository Maintainer</div>
        <div className="text-neutral-400 text-xs">1.5K+ stars — TypeScript + VSCode Extension API</div>
        <p className="mt-1 text-neutral-300 text-xs">Contributing Intellisense feature and helping maintain the open‑source project.</p>
      </a>
    </div>
  );
}

function ContactPane() {
  return (
    <div className="space-y-4 text-sm">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-wider text-neutral-500">Email</div>
          <a href="mailto:abhinavmishra3322@gmail.com" className="mt-1 block text-neutral-200">abhinavmishra3322@gmail.com</a>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-wider text-neutral-500">Phone</div>
          <a href="tel:+917701956829" className="mt-1 block text-neutral-200">+91 7701956829</a>
        </div>
        <a href="https://abhinavmishra.in" target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
          <div className="text-xs uppercase tracking-wider text-neutral-500">Website</div>
          <div className="mt-1 text-neutral-200">abhinavmishra.in</div>
        </a>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-wider text-neutral-500">Location</div>
          <div className="mt-1 text-neutral-200">Ghaziabad, UP</div>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-xs uppercase tracking-wider text-neutral-500">Skills</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "TailwindCSS"].map((t) => (
            <span key={t} className="rounded-md bg-white/10 px-2 py-0.5 text-[11px]">{t}</span>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-xs uppercase tracking-wider text-neutral-500">Education</div>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div>
            <div className="font-medium">ABES Engineering College — B.Tech, Computer Science</div>
            <div className="text-xs text-neutral-400">Ghaziabad, UP</div>
          </div>
          <div className="text-xs text-neutral-400 whitespace-nowrap">Expected Aug 2027</div>
        </div>
        <div className="mt-1 text-xs text-neutral-300">CGPA: 7.8/10.0</div>
      </div>
    </div>
  );
}


