export const PROFILE = {
  name: "Abhinav Mishra",
  role: "Full-stack engineer · backend & agent infrastructure",
  /** Short, but every line carries proof. */
  about: [
    "I'm a full-stack engineer who ends up owning the infrastructure everyone else's features depend on. At Lunacal.ai I own BRAINER end to end — an autonomous agent platform coordinating Codex, OpenCode, and Claude Code inside isolated Kubernetes sandboxes to run six company functions, from planning and QA through deployment and customer acquisition.",
    "I built the production CI and rollout platform behind our Next.js + NestJS + tRPC stack: deterministic percentage releases, kill switches, and rollback in seconds instead of full redeployments. I shipped AI calling and SMS on QStash and Redis with credit accounting and retry-aware webhooks, and automated Azure domain provisioning across DNS, SSL, App Service, and Front Door — days of manual work down to about thirty minutes.",
    "Before that I re-architected authentication for an ed-tech platform serving 200,000+ students, taking Lighthouse from ~45 to 85+, and built a document pipeline that chews through 100+ page PDFs in under five seconds. I won Smart India Hackathon 2024 against 80,000+ teams, and my TypeScript and VS Code IntelliSense work ships in MetaCall's 1,700-star polyglot runtime.",
    "When I want to understand something properly, I build it. Most recently that was a blockchain in pure Python — five layers by hand, zero dependencies. I learn fastest close to the problem.",
  ],
  location: "Ghaziabad, India",
  email: "abhinavmishra3322@gmail.com",
  github: "https://github.com/AbhinavMishra32",
  linkedin: "https://linkedin.com/in/im-abhinavmishra",
  x: "https://x.com/do_anything_guy",
  education: {
    school: "ABES Engineering College",
    short: "ABES Engg.",
    degree: "B.Tech, Computer Science",
  },
} as const;

export type NavKey = "overview" | "projects" | "work" | "story" | "now" | "blog";

export const NAV_ITEMS: Array<{ key: NavKey; label: string; href: string }> = [
  { key: "overview", label: "Home", href: "/" },
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "work", label: "Experience", href: "/work" },
  { key: "story", label: "Story", href: "/story" },
  { key: "blog", label: "Writing", href: "/blog" },
  { key: "now", label: "Now", href: "/now" },
];

export const HOME_INDEX: Array<{ id: string; label: string }> = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "recognition", label: "Recognition" },
  { id: "stack", label: "Stack" },
  { id: "writing", label: "Writing" },
  { id: "github", label: "GitHub" },
];

export const RECOGNITION: Array<{
  title: string;
  org: string;
  meta: string;
  detail: string;
  href?: string;
}> = [
  {
    title: "Smart India Hackathon 2024 — Winner",
    org: "Mentor Map · recognised by C-DAC Mohali",
    meta: "Dec 2024",
    detail:
      "Won nationally against 80,000+ teams with an AI career-guidance platform, taking ₹1,00,000 and recognition from Dr. Sanjeev, Joint Director at C-DAC Mohali.",
  },
  {
    title: "Open source contributor",
    org: "MetaCall · 1,700+ stars",
    meta: "Ongoing",
    detail:
      "Implemented TypeScript and VS Code API IntelliSense in MetaCall's polyglot runtime, improving API discovery for multi-language function calls.",
    href: "https://github.com/metacall/core",
  },
];

export type StackGroup =
  | "Languages"
  | "Frontend"
  | "Backend"
  | "AI"
  | "Data & Infra"
  | "Tooling";

export const STACK_GROUPS: StackGroup[] = [
  "Languages",
  "Frontend",
  "Backend",
  "AI",
  "Data & Infra",
  "Tooling",
];

export const TECH_STACK: Array<{ name: string; group: StackGroup; slug?: string }> = [
  { name: "TypeScript", group: "Languages", slug: "typescript" },
  { name: "JavaScript", group: "Languages", slug: "javascript" },
  { name: "Python", group: "Languages", slug: "python" },
  { name: "C++", group: "Languages", slug: "cplusplus" },

  { name: "Next.js", group: "Frontend", slug: "nextdotjs" },
  { name: "React", group: "Frontend", slug: "react" },
  { name: "React Native", group: "Frontend", slug: "react" },
  { name: "Electron", group: "Frontend", slug: "electron" },
  { name: "Tailwind CSS", group: "Frontend", slug: "tailwindcss" },

  { name: "NestJS", group: "Backend", slug: "nestjs" },
  { name: "Node.js", group: "Backend", slug: "nodedotjs" },
  { name: "tRPC", group: "Backend", slug: "trpc" },
  { name: "FastAPI", group: "Backend", slug: "fastapi" },

  { name: "Mastra", group: "AI" },
  { name: "OpenAI API", group: "AI" },
  { name: "Vercel AI SDK", group: "AI", slug: "vercel" },
  { name: "RAG", group: "AI" },
  { name: "Agentic workflows", group: "AI" },

  { name: "PostgreSQL", group: "Data & Infra", slug: "postgresql" },
  { name: "Prisma", group: "Data & Infra", slug: "prisma" },
  { name: "Redis", group: "Data & Infra", slug: "redis" },
  { name: "QStash", group: "Data & Infra", slug: "upstash" },
  { name: "Kubernetes", group: "Data & Infra", slug: "kubernetes" },
  { name: "Azure", group: "Data & Infra" },

  { name: "Jenkins", group: "Tooling", slug: "jenkins" },
  { name: "GitHub Actions", group: "Tooling", slug: "githubactions" },
  { name: "Playwright", group: "Tooling" },
  { name: "Docker", group: "Tooling", slug: "docker" },
  { name: "Elasticsearch", group: "Tooling", slug: "elasticsearch" },
  { name: "Turborepo", group: "Tooling", slug: "turborepo" },
];

/** Extra icon slugs for technologies that appear on projects but not in the stack list. */
const EXTRA_ICON_SLUGS: Record<string, string> = {
  Expo: "expo",
  SQLite: "sqlite",
  Supabase: "supabase",
  Python: "python",
};

const ICON_SLUGS: Record<string, string> = {
  ...Object.fromEntries(
    TECH_STACK.filter((tech) => tech.slug).map((tech) => [tech.name, tech.slug!])
  ),
  ...EXTRA_ICON_SLUGS,
};

/** Icon slug for a technology label, or null when there is no sensible mark. */
export function techIconSlug(name: string): string | null {
  return ICON_SLUGS[name] ?? null;
}
