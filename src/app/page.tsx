const TOC = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "writing", label: "Writing" },
  { id: "achievements", label: "Achievements" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
];

const EXPERIENCES = [
  {
    company: "Lunacal.ai",
    location: "Bangalore, KA",
    role: "Software Developer Intern (Full Time)",
    period: "Sep 2025 – Present",
    highlights: [
      "Built CI/testing workflows and guarded releases for the production web stack.",
      "Implemented SMS scheduling and delivery workflows with logging and billing hooks.",
      "Improved observability and automated parts of domain provisioning on Azure infrastructure.",
    ],
  },
  {
    company: "Ludotronics",
    location: "Bhubaneswar, OD",
    role: "Software Developer (Part-time)",
    period: "Jun 2025 – Sep 2025",
    highlights: [
      "Developed PayEvenly, a Splitwise-style expense app for the Indian market using React Native and UPI.",
      "Added voice input and OCR receipt parsing to speed up split creation.",
      "Built the FastAPI backend with SQLite and managed Expo builds for release preparation.",
    ],
  },
  {
    company: "Expert Buddy",
    location: "Jaipur, RJ",
    role: "Next.js Frontend Developer Intern (Full Time)",
    period: "Apr 2025 – Sep 2025",
    highlights: [
      "Delivered StudyBank with Next.js SSR, cookie-based auth, and caching for key user data.",
      "Shipped AI-powered student support features including agentic chat and PDF analysis.",
      "Improved engagement and SEO with real-time notifications and server-side data fetching.",
    ],
  },
];

const PROJECTS = [
  {
    name: "Decipath AI",
    timeframe: "Jan 2025 – Mar 2025",
    stack: ["Next.js", "TypeScript", "ShadCN UI", "OpenAI API", "React Flow"],
    description:
      "Full-stack SaaS that generates structured learning roadmaps with graph layouts and path optimization.",
    live: "https://decipath.abhinavmishra.in",
    source: "https://github.com/AbhinavMishra32",
  },
  {
    name: "Mentor Map",
    timeframe: "Dec 2024",
    stack: ["React", "Node.js", "PostgreSQL", "OpenAI API"],
    description:
      "Career guidance platform with role-based access, real-time updates, and adaptive roadmaps. Built for Smart India Hackathon 2024.",
    live: "https://mentormap.abhinavmishra.in",
  },
  {
    name: "XiteCoin Blockchain",
    timeframe: "Jan 2024 – Jun 2024",
    stack: ["Python"],
    description:
      "Pure Python blockchain with custom proof-of-work, gossip-based P2P, Merkle validation, and JSON-RPC nodes.",
    source: "https://github.com/AbhinavMishra32/xitecoin",
  },
];

const OTHER_PROJECTS = ["Jchess", "Notely", "pdf-rag"];

const ACHIEVEMENTS = [
  {
    title: "Smart India Hackathon 2024 — Winner",
    meta: "Mohali, PB · Dec 2024 · ₹100,000 prize",
    detail:
      "Built Mentor Map, an AI-driven career guidance platform recognized by Dr. Sanjeev (C-DAC Mohali).",
  },
  {
    title: "Open Source Contributor — MetaCall",
    meta: "GitHub · 1,700+ stars",
    detail:
      "Implemented an Intellisense feature using TypeScript and the VSCode API.",
    link: "https://github.com/metacall/core",
  },
];

const SKILLS = {
  languages: ["Python", "JavaScript", "TypeScript"],
  frameworks: ["React", "Next.js", "Node.js", "React Native", "Tailwind CSS", "Supabase", "ShadCN UI"],
  tools: ["PostgreSQL", "Prisma ORM", "tRPC", "Turborepo", "Vercel"],
};

type BlogPost = {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  slug?: string;
};

const BLOG_POSTS: BlogPost[] = [];

export default function Home() {
  return (
    <main className="min-h-svh paper-texture">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-10 space-y-6">
              <div className="font-sans text-xs uppercase tracking-[0.35em] text-foreground/60">Contents</div>
              <nav className="space-y-3 text-sm">
                {TOC.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center justify-between border-b border-foreground/10 pb-2 text-foreground/70 transition hover:text-foreground"
                  >
                    <span>{item.label}</span>
                    <span className="font-sans text-xs text-foreground/40">→</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="space-y-14">
            <header className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 font-sans text-xs uppercase tracking-[0.4em] text-foreground/60">
                  <span>Portfolio</span>
                  <span className="h-px w-10 bg-foreground/30" />
                </div>
                <div className="space-y-3">
                  <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Abhinav Mishra</h1>
                  <p className="max-w-2xl text-lg text-foreground/80">
                    Software developer focused on web, backend systems, and product craftsmanship.
                    Building reliable features across web and mobile.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
                <div className="paper-card rounded-2xl p-6">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-foreground/70">
                    <span>Ghaziabad, UP</span>
                    <span className="text-foreground/40">·</span>
                    <a href="tel:+917701956829" className="hover:text-foreground">+91 7701956829</a>
                    <span className="text-foreground/40">·</span>
                    <a href="mailto:abhinavmishra3322@gmail.com" className="hover:text-foreground">
                      abhinavmishra3322@gmail.com
                    </a>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 font-sans text-xs uppercase tracking-[0.2em] text-foreground/60">
                    <a href="https://abhinavmishra.in" target="_blank" rel="noreferrer" className="hover:text-foreground">
                      abhinavmishra.in
                    </a>
                    <span>@AbhinavMishra32</span>
                  </div>
                </div>
                <div className="paper-card rounded-2xl p-6">
                  <div className="font-sans text-xs uppercase tracking-[0.3em] text-foreground/60">Focus Areas</div>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm">
                    {[
                      "Full-stack web",
                      "Systems reliability",
                      "AI-enabled products",
                      "Developer tooling",
                      "Mobile UX",
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-foreground/10 bg-white/70 px-3 py-1 text-foreground/80"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </header>

            <section id="experience" className="space-y-8">
              <SectionHeading number="01" title="Experience" subtitle="Recent roles and focus areas." />
              <div className="space-y-8">
                {EXPERIENCES.map((role) => (
                  <article key={role.company} className="relative pl-6">
                    <div className="absolute left-0 top-2 h-2 w-2 rounded-full bg-foreground/60" />
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-xl font-semibold">{role.company}</h3>
                        <span className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/60">
                          {role.period}
                        </span>
                      </div>
                      <div className="text-sm text-foreground/70">
                        {role.role} · {role.location}
                      </div>
                      <ul className="mt-2 list-disc space-y-1 pl-4 text-[15px] text-foreground/80">
                        {role.highlights.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="projects" className="space-y-8">
              <SectionHeading number="02" title="Projects" subtitle="Selected work and experiments." />
              <div className="grid gap-4 md:grid-cols-2">
                {PROJECTS.map((project) => (
                  <article key={project.name} className="paper-card rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <div className="mt-1 text-xs text-foreground/60">{project.timeframe}</div>
                      </div>
                      <div className="font-sans text-[11px] uppercase tracking-[0.25em] text-foreground/50">Project</div>
                    </div>
                    <p className="mt-3 text-sm text-foreground/80">{project.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      {project.stack.map((item) => (
                        <span key={item} className="rounded-full border border-foreground/10 bg-white/70 px-2.5 py-1">
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer"
                          className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/70 hover:text-foreground"
                        >
                          Live
                        </a>
                      )}
                      {project.source && (
                        <a
                          href={project.source}
                          target="_blank"
                          rel="noreferrer"
                          className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/70 hover:text-foreground"
                        >
                          Source
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
              <div className="text-sm text-foreground/70">
                More projects: {OTHER_PROJECTS.join(", ")}
              </div>
            </section>

            <section id="writing" className="space-y-8">
              <SectionHeading number="03" title="Knowledge Sharing" subtitle="A space reserved for notes, essays, and build logs." />
              {BLOG_POSTS.length === 0 ? (
                <div className="paper-card rounded-2xl p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-sans text-xs uppercase tracking-[0.3em] text-foreground/60">Coming soon</div>
                      <h3 className="mt-2 text-lg font-semibold">Notes & Writing</h3>
                    </div>
                    <div className="font-sans text-xs uppercase tracking-[0.3em] text-foreground/50">Drafted</div>
                  </div>
                  <p className="mt-3 text-sm text-foreground/75">
                    This section is intentionally reserved for future posts. The layout is ready to surface essays,
                    technical notes, and project retrospectives once they are published.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    {["Engineering notes", "Product learnings", "Book summaries"].map((item) => (
                      <span key={item} className="rounded-full border border-foreground/10 bg-white/70 px-2.5 py-1">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {BLOG_POSTS.map((post) => (
                    <article key={post.title} className="paper-card rounded-2xl p-6">
                      <div className="font-sans text-xs uppercase tracking-[0.3em] text-foreground/60">Note</div>
                      <h3 className="mt-2 text-lg font-semibold">{post.title}</h3>
                      {post.description && <p className="mt-2 text-sm text-foreground/75">{post.description}</p>}
                      {post.date && <div className="mt-3 text-xs text-foreground/60">{post.date}</div>}
                      {post.tags && (
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          {post.tags.map((tag) => (
                            <span key={tag} className="rounded-full border border-foreground/10 bg-white/70 px-2.5 py-1">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section id="achievements" className="space-y-8">
              <SectionHeading number="04" title="Achievements" subtitle="Selected awards and contributions." />
              <div className="grid gap-4 md:grid-cols-2">
                {ACHIEVEMENTS.map((item) => {
                  const content = (
                    <div className="paper-card rounded-2xl p-6">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <div className="mt-1 text-xs text-foreground/60">{item.meta}</div>
                      <p className="mt-3 text-sm text-foreground/75">{item.detail}</p>
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

            <section id="skills" className="space-y-8">
              <SectionHeading number="05" title="Technical Skills" subtitle="Core languages and tools." />
              <div className="grid gap-4 md:grid-cols-3">
                <SkillCard title="Languages" items={SKILLS.languages} />
                <SkillCard title="Frameworks & Libraries" items={SKILLS.frameworks} />
                <SkillCard title="Databases & Tools" items={SKILLS.tools} />
              </div>
            </section>

            <section id="education" className="space-y-8">
              <SectionHeading number="06" title="Education" />
              <div className="paper-card rounded-2xl p-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">ABES Engineering College</h3>
                  <div className="text-sm text-foreground/70">Bachelor of Technology in Computer Science</div>
                  <div className="text-xs text-foreground/60">Ghaziabad, UP</div>
                </div>
              </div>
            </section>

            <footer className="pt-6">
              <div className="chapter-rule" />
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-foreground/60">
                <span>Last updated: Feb 2026</span>
                <span className="font-sans uppercase tracking-[0.3em]">Abhinav Mishra</span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

function SectionHeading({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="font-sans text-xs uppercase tracking-[0.4em] text-foreground/60">Chapter {number}</span>
        <div className="chapter-rule flex-1" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
        {subtitle && <p className="text-sm text-foreground/70">{subtitle}</p>}
      </div>
    </div>
  );
}

function SkillCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="paper-card rounded-2xl p-6">
      <div className="font-sans text-xs uppercase tracking-[0.3em] text-foreground/60">{title}</div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-foreground/10 bg-white/70 px-3 py-1">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
