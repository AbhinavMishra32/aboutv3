"use client";

import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "highlights", label: "Highlights" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

type Project = {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  accent: string;
  live?: string;
  source?: string;
};

const FEATURED_PROJECTS: Project[] = [
  {
    slug: "decipath-ai",
    name: "Decipath AI",
    description:
      "AI roadmap builder that turns goals into structured learning graphs with intelligent layout and path optimization.",
    tags: ["Next.js", "TypeScript", "OpenAI API", "React Flow"],
    accent: "accent-violet",
    live: "https://decipath.abhinavmishra.in",
    source: "https://github.com/AbhinavMishra32",
  },
  {
    slug: "mentor-map",
    name: "Mentor Map",
    description:
      "Career guidance platform built for Smart India Hackathon 2024, featuring adaptive roadmaps and real-time collaboration.",
    tags: ["React", "Node.js", "PostgreSQL"],
    accent: "accent-cyan",
    live: "https://mentormap.abhinavmishra.in",
  },
  {
    slug: "payevenly",
    name: "PayEvenly",
    description:
      "Splitwise-style expense app with UPI settlement, voice input, and OCR receipt parsing for fast group splits.",
    tags: ["React Native", "FastAPI", "Expo"],
    accent: "accent-pink",
  },
  {
    slug: "xitecoin",
    name: "XiteCoin Blockchain",
    description:
      "Pure Python blockchain with custom proof-of-work, gossip P2P, Merkle validation, and JSON-RPC nodes.",
    tags: ["Python", "P2P", "Cryptography"],
    accent: "accent-emerald",
    source: "https://github.com/AbhinavMishra32/xitecoin",
  },
];

const OTHER_PROJECT_CARDS: Array<{
  name: string;
  description: string;
  tags: string[];
  accent: string;
  source?: string;
  live?: string;
}> = [
  {
    name: "Jchess",
    description:
      "A fully-functional chess game built with libGDX featuring full rule enforcement, check/checkmate detection, and drag-and-drop gameplay.",
    tags: ["Java", "libGDX", "Desktop"],
    accent: "accent-cyan",
    source: "https://github.com/AbhinavMishra32/jchess",
  },
  {
    name: "Notely",
    description: "A note‑taking app focused on clean UI and fast capture workflows.",
    tags: ["TypeScript", "Notes", "UI"],
    accent: "accent-pink",
    live: "https://dbnotes.abhinavmishra.in",
    source: "https://github.com/AbhinavMishra32/Notely",
  },
  {
    name: "pdf-rag",
    description: "RAG pipeline for PDFs using OpenAI embeddings and a vector database for fast retrieval.",
    tags: ["OpenAI API", "Vector DB", "RAG"],
    accent: "accent-violet",
    source: "https://github.com/AbhinavMishra32/pdf-rag",
  },
];

const SKILL_GROUPS = [
  {
    title: "Product Engineering",
    description: "Shipping modern web products with strong DX and clean architecture.",
    items: ["Next.js", "React", "TypeScript", "Node.js", "tRPC"],
    accent: "accent-violet",
  },
  {
    title: "Mobile & UI",
    description: "Design-forward interfaces with smooth UX on mobile and web.",
    items: ["React Native", "Expo", "Tailwind CSS", "ShadCN UI", "Design Systems"],
    accent: "accent-pink",
  },
  {
    title: "Data & Infra",
    description: "Reliable data layers, deployments, and production observability.",
    items: ["PostgreSQL", "Prisma ORM", "Supabase", "Vercel", "Observability"],
    accent: "accent-emerald",
  },
];

const HIGHLIGHTS = [
  {
    title: "Smart India Hackathon winner",
    description:
      "Mentor Map earned national recognition for an AI-driven career guidance platform.",
    metric: "80K+",
    metricLabel: "teams competed",
    accent: "accent-cyan",
  },
  {
    title: "Open-source contributor",
    description:
      "Shipped an Intellisense feature for MetaCall using TypeScript and the VSCode API.",
    metric: "1.7K+",
    metricLabel: "GitHub stars",
    link: "https://github.com/metacall/core",
    accent: "accent-violet",
  },
  {
    title: "Currently building at Lunacal.ai",
    description:
      "Working on scheduling and communication infrastructure with a focus on reliability and rollout safety.",
    metric: "Now",
    metricLabel: "shipping",
    accent: "accent-emerald",
  },
];

const BLOG_POSTS: Array<{ title: string; description: string }> = [];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <main className="page-shell">
      <div className="glow-grid" />
      <div className={`loader-screen ${isLoading ? "is-active" : "is-hidden"}`} aria-hidden={!isLoading}>
        <div className="loader-content">
          <div className="loader-title">ABHINAV MISHRA</div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="display-text text-sm uppercase tracking-[0.2em] text-white/70">Abhinav Mishra</div>
          <nav className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-white/55">
            {NAV_ITEMS.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="link-muted">
                {item.label}
              </a>
            ))}
            <a
              href="mailto:abhinavmishra3322@gmail.com"
              className="rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-white/80 transition hover:bg-white/20"
            >
              Email
            </a>
          </nav>
        </header>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="kicker">Product engineering · modern web</div>
            <div className="space-y-4">
              <h1 className="hero-title text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
                Building <span className="accent-gradient accent-italic">sleek, reliable</span> products with modern UI and strong systems.
              </h1>
              <p className="max-w-2xl text-lg text-white/70">
                I design and ship web and mobile experiences that feel fast, polished, and dependable. My work blends
                product thinking with solid engineering and careful UI details.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#work" className="btn-primary">
                View Work
              </a>
              <a href="https://abhinavmishra.in" target="_blank" rel="noreferrer" className="btn-ghost">
                abhinavmishra.in
              </a>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-white/50">
              {[
                "Full-stack systems",
                "Design-forward UI",
                "AI-enabled products",
                "Performance",
              ].map((item) => (
                <span key={item} className="tag rounded-full px-3 py-1">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="panel panel-strong rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-[0.35em] text-white/50">Now</div>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/70">
                Active
              </span>
            </div>
            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <div className="display-text text-xl text-white">Shipping product systems</div>
                <div className="text-sm text-white/60">Lunacal.ai · scheduling & communication platform</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs uppercase tracking-[0.3em] text-white/40">Base</div>
                  <div className="mt-2 text-white">Ghaziabad, India</div>
                  <div className="text-white/50">IST (UTC +5:30)</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs uppercase tracking-[0.3em] text-white/40">Availability</div>
                  <div className="mt-2 text-white">Collab ready</div>
                  <div className="text-white/50">Product builds</div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs uppercase tracking-[0.3em] text-white/40">Focus</div>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-white/55">
                  {["Product systems", "Reliability", "AI UX", "Developer tooling"].map((item) => (
                    <span key={item} className="tag rounded-full px-3 py-1">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
                <div className="text-xs uppercase tracking-[0.3em] text-white/40">Reach me</div>
                <a href="mailto:abhinavmishra3322@gmail.com" className="mt-2 block link-muted">
                  abhinavmishra3322@gmail.com
                </a>
                <div className="text-white/50">@AbhinavMishra32</div>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="mt-16 space-y-8">
          <SectionHeader
            title="Featured work"
            subtitle="A curated set of projects that show my product + engineering range."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {FEATURED_PROJECTS.map((project, index) => (
              <article
                key={project.slug}
                className={`panel panel-accent ${project.accent} rounded-3xl p-6 ${index === 0 ? "lg:col-span-2" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                  </div>
                  <div className="text-xs uppercase tracking-[0.3em] text-white/45">Project</div>
                </div>
                <p className="mt-3 text-sm text-white/70">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {project.tags.map((item) => (
                    <span key={item} className="tag rounded-full px-2.5 py-1">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noreferrer" className="link-muted">
                      Live
                    </a>
                  )}
                  {project.source && (
                    <a href={project.source} target="_blank" rel="noreferrer" className="link-muted">
                      Source
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {OTHER_PROJECT_CARDS.map((project) => (
              <article key={project.name} className={`panel panel-accent ${project.accent} rounded-3xl p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-white">{project.name}</h3>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/45">Project</span>
                </div>
                <p className="mt-2 text-sm text-white/70">{project.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-white/55">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag rounded-full px-2.5 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noreferrer" className="link-muted">
                      Live
                    </a>
                  )}
                  {project.source && (
                    <a href={project.source} target="_blank" rel="noreferrer" className="link-muted">
                      Source
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="mt-16 space-y-8">
          <SectionHeader title="Skills" subtitle="What I like to build with." />
          <div className="grid gap-4 md:grid-cols-3">
            {SKILL_GROUPS.map((group) => (
              <div key={group.title} className={`panel panel-accent ${group.accent} rounded-3xl p-6`}>
                <div className="text-xs uppercase tracking-[0.35em] text-white/50">{group.title}</div>
                <p className="mt-3 text-sm text-white/70">{group.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  {group.items.map((item) => (
                    <span key={item} className="tag rounded-full px-3 py-1">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="highlights" className="mt-16 space-y-8">
          <SectionHeader title="Highlights" subtitle="Signals of impact beyond the UI." />
          <div className="grid gap-4 md:grid-cols-3">
            {HIGHLIGHTS.map((item) => {
              const content = (
                <div className={`panel panel-accent ${item.accent} rounded-3xl p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="metric">{item.metric}</div>
                    <div className="text-xs uppercase tracking-[0.3em] text-white/45">{item.metricLabel}</div>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm text-white/70">{item.description}</p>
                </div>
              );
              return item.link ? (
                <a key={item.title} href={item.link} target="_blank" rel="noreferrer">
                  {content}
                </a>
              ) : (
                <div key={item.title}>{content}</div>
              );
            })}
          </div>
        </section>

        <section id="writing" className="mt-16 space-y-8">
          <SectionHeader title="Writing" subtitle="Notes, build logs, and knowledge sharing." />
          {BLOG_POSTS.length === 0 ? (
            <div className="panel panel-accent accent-cyan rounded-3xl p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-white/50">Coming soon</div>
                  <h3 className="mt-2 text-lg font-semibold text-white">Knowledge drops</h3>
                </div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/40">Drafting</div>
              </div>
              <p className="mt-3 text-sm text-white/70">
                This section is ready for essays, technical walkthroughs, and product notes once published.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {["Engineering notes", "Product learnings", "Book summaries"].map((item) => (
                  <span key={item} className="tag rounded-full px-2.5 py-1">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {BLOG_POSTS.map((post) => (
                <article key={post.title} className="panel rounded-3xl p-6">
                  <div className="text-xs uppercase tracking-[0.3em] text-white/50">Note</div>
                  <h3 className="mt-2 text-lg font-semibold text-white">{post.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{post.description}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="contact" className="mt-16">
          <div className="panel panel-strong rounded-3xl p-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <div className="kicker">Let&apos;s build</div>
                <h3 className="display-text mt-3 text-2xl font-semibold text-white">Open to product collaborations</h3>
                <p className="mt-2 text-sm text-white/70">
                  For partnerships, product builds, or collaborations, reach out and we can make it happen.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="mailto:abhinavmishra3322@gmail.com" className="btn-primary">
                  Email me
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-16 pb-6 text-xs text-white/50">
          <div className="section-rule" />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <span>© 2026 Abhinav Mishra</span>
            <span className="uppercase tracking-[0.3em]">Built with Next.js</span>
          </div>
        </footer>
      </div>
    </main>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="display-text text-2xl font-semibold text-white md:text-3xl">{title}</h2>
        <div className="section-rule flex-1" />
      </div>
      {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
    </div>
  );
}
