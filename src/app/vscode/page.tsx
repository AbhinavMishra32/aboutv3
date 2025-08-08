"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { FileText, User2, Code2, Layers, Star, Globe } from "lucide-react";
import { DraggableWindow } from "@/components/DraggableWindow";
import { MacDock } from "@/components/MacDock";

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
  const [topWindow, setTopWindow] = useState<"vscode" | "safari" | null>("vscode");
  const boundsRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={boundsRef}
      className="relative min-h-svh text-neutral-100 overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1920&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* VSCode window */}
      <DraggableWindow
        open={vscodeOpen}
        constraintsRef={boundsRef}
        zIndex={topWindow === "vscode" ? 60 : 40}
        isActive={topWindow === "vscode"}
        onActivate={() => setTopWindow("vscode")}
      >
        <div className="grid grid-cols-[240px_1fr] grid-rows-[40px_1fr] h-full rounded-2xl overflow-hidden">
        {/* Top bar */}
        <div className="win-drag col-span-2 flex items-center gap-3 px-3 border-b border-white/10 bg-neutral-900/70 cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-rose-500" onClick={() => setVsOpen(false)} />
            <span className="inline-block h-3 w-3 rounded-full bg-amber-400" />
            <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
          </div>
          <div className="mx-3 text-sm text-neutral-300 truncate">abhinavmishra — Visual Studio Code</div>
        </div>

        {/* Sidebar */}
        <aside className="border-r border-white/10 bg-neutral-900/40 p-3 space-y-3">
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

        {/* Editor */}
        <main className="relative overflow-auto">
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
          <div className="p-6">
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
          zIndex={topWindow === "safari" ? 70 : 50}
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
        }}
      />
    </div>
  );
}

function ReadmePane() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Abhinav Mishra</h1>
      <p>Product‑focused CS undergrad and SIH 2024 winner building scalable AI tools across web and mobile. Creator of Decipath AI.</p>
      <ul>
        <li>Location: Ghaziabad, UP</li>
        <li>Email: abhinavmishra3322@gmail.com</li>
        <li>Website: abhinavmishra.in</li>
      </ul>
    </div>
  );
}

function AboutPane() {
  return (
    <pre className="text-sm whitespace-pre-wrap leading-7">
{`export const about = {
  name: "Abhinav Mishra",
  role: "Software Developer",
  strengths: ["Full‑stack", "Product thinking", "AI UX"],
  stack: ["TypeScript", "Next.js", "React", "Node.js", "PostgreSQL", "TailwindCSS"],
};`}
    </pre>
  );
}

function ExperiencePane() {
  return (
    <div className="space-y-6 text-sm">
      <section>
        <h3 className="text-base font-semibold">LUDOTRONICS — Software Developer</h3>
        <p className="text-neutral-400">Jun 2025 – Present · Bhubaneswar, OD</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Building ExpenseSplitter+ with UPI settlement, AI voice input, and receipt OCR.</li>
          <li>Enabled splits in &lt;60s with itemized multi‑payer logic and offline sync.</li>
          <li>Co‑designed product architecture and UPI integration for 10K+ scale.</li>
        </ul>
      </section>
      <section>
        <h3 className="text-base font-semibold">Expert Buddy — Next.js Frontend Developer Intern</h3>
        <p className="text-neutral-400">Apr 2025 – Present · Jaipur, RJ</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Shipped StudyBank with SSR and custom caching for auth, wallet, and notifications.</li>
          <li>Built chat and realtime notifications (TalkJS + Gupshup WhatsApp).</li>
          <li>Developed gen‑AI PDF analysis with Vercel AI SDK and led perf/accessibility.</li>
        </ul>
      </section>
    </div>
  );
}

function ProjectsPane() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {[{name: "Decipath AI", desc: "Next.js roadmap generator with LLMs and prompt chaining."}, {name: "Mentor Map", desc: "AI career guidance platform; SIH 2024 Winner."}, {name: "XiteCoin Blockchain", desc: "Educational PoW blockchain built from scratch."}].map(p => (
        <div key={p.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold">{p.name}</div>
          <p className="mt-1 text-sm text-neutral-300">{p.desc}</p>
        </div>
      ))}
    </div>
  );
}

function AwardsPane() {
  return (
    <div className="text-sm space-y-2">
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">Smart India Hackathon 2024 — Winner (₹100,000)</div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">MetaCall Maintainer — 1.5K★, built Intellisense feature</div>
    </div>
  );
}

function ContactPane() {
  return (
    <pre className="text-sm whitespace-pre-wrap leading-7">
{`{
  "email": "abhinavmishra3322@gmail.com",
  "phone": "+91 7701956829",
  "website": "https://abhinavmishra.in",
  "location": "Ghaziabad, UP"
}`}
    </pre>
  );
}


