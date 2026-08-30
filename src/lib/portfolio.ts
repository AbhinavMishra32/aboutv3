export type ProjectCategory = "AI" | "Product" | "Systems";

export type Project = {
  slug: string;
  name: string;
  focus: string;
  /** One-line pitch used on cards. */
  summary: string;
  /** Longer paragraph used in detail views. */
  detail: string;
  category: ProjectCategory[];
  year: string;
  status: "live" | "in-progress" | "archived";
  /** Plain stack labels rendered as chips on the card. */
  stack: string[];
  /** Engineering bullets revealed by "show engineering details". */
  bullets: string[];
  buildTags: string[];
  featured?: boolean;
  iconUrl?: string;
  iconLabel?: string;
  live?: string;
  source?: string;
  /** Real product screenshot, shown as the floating corner panel. */
  shot?: string;
  previewImage?: string;
  previewDarkImage?: string;
  previewAlt: string;
  repo?: {
    owner: string;
    name: string;
    branch?: string;
  };
  repoNote?: string;
};

export type WorkItem = {
  company: string;
  companyNote: string;
  url?: string;
  title: string;
  employment: string;
  location: string;
  period: string;
  summary: string;
  highlights: string[];
  stack: string[];
  current?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "construct",
    name: "Construct IDE",
    focus: "AI-native desktop IDE",
    summary:
      "An AI-native desktop IDE whose agents read your repo, run your tests, and teach from what you actually got wrong.",
    detail:
      "Construct is built around learner-owned coding. Mastra agents inspect the repository, execute tests, review diffs, and generate targeted practice, while a persistent learner memory keeps continuity across sessions. Per-feature model routing and Phoenix tracing keep runs cost-aware and debuggable.",
    category: ["AI", "Product"],
    year: "2026",
    status: "in-progress",
    featured: true,
    stack: ["Electron", "TypeScript", "Mastra", "Prisma", "PostgreSQL", "Turborepo"],
    bullets: [
      "Mastra research + mentor agents that inspect repositories, execute tests, and review diffs before teaching anything",
      "Persistent learner memory so personalization survives across projects instead of resetting each session",
      "Per-feature model routing with Phoenix tracing, keeping agent runs cost-aware and actually debuggable",
      "Turborepo monorepo spanning the Electron shell, agent runtime, and Prisma/Postgres persistence layer",
    ],
    buildTags: ["Hand-built core", "0.1 in progress"],
    iconLabel: "C",
    source: "https://github.com/AbhinavMishra32/Construct-IDE",
    previewImage: "/project-construct-light.svg",
    previewDarkImage: "/project-construct-dark.svg",
    shot: "/project-images/construct.png",
    previewAlt:
      "Preview illustration of Construct showing a goal prompt, lessons, code editor, and knowledge graph.",
    repo: {
      owner: "AbhinavMishra32",
      name: "Construct-IDE",
      branch: "main",
    },
  },
  {
    slug: "spar",
    name: "Spar",
    focus: "Adaptive coding gym",
    summary:
      "An adaptive coding gym that turns your attempt history into the next challenge you should face.",
    detail:
      "Spar keeps a ledger of every attempt and converts it into targeted next challenges across three languages. Sandboxed runners execute submissions in isolation and persistent sessions mean practice picks up exactly where it left off.",
    category: ["AI", "Systems"],
    year: "2026",
    status: "in-progress",
    featured: true,
    stack: ["TypeScript", "Mastra", "PostgreSQL", "Sandboxed runners"],
    bullets: [
      "Ability Ledger converts attempt history into personalized next challenges instead of a fixed problem list",
      "Isolated sandboxed runners execute untrusted submissions across three languages",
      "Persistent sessions so a practice run survives reloads and resumes mid-problem",
    ],
    buildTags: ["Hand-built core", "Active build"],
    iconLabel: "S",
    source: "https://github.com/AbhinavMishra32",
    previewImage: "/project-decipath-light.svg",
    previewDarkImage: "/project-decipath-dark.svg",
    previewAlt: "Preview illustration of an adaptive coding practice interface.",
  },
  {
    slug: "decipath-ai",
    name: "Decipath AI",
    focus: "AI roadmap product",
    summary:
      "An AI roadmap builder that turns a fuzzy goal into an execution map with milestones and dependencies.",
    detail:
      "Decipath takes a rough goal, runs structured research and planning, and turns it into an execution map with milestones, tasks, and branching next steps — wrapped in the plan, auth, and billing layers that make it feel like a product rather than a demo.",
    category: ["AI", "Product"],
    year: "2025",
    status: "live",
    featured: true,
    stack: ["Next.js", "TypeScript", "React Flow", "OpenAI", "Prisma"],
    bullets: [
      "Goal intake that turns rough intent into a structured, guided roadmap request",
      "React Flow execution canvas with nodes, dependencies, time estimates, and detail panels",
      "Plans, auth, billing, and loading-state polish that push it from demo energy to product",
    ],
    buildTags: ["Hand-built core", "AI-assisted UI polish"],
    iconUrl: "https://decipath.abhinavmishra.in/favicon.ico",
    source: "https://github.com/AbhinavMishra32/DecipathAI",
    previewImage: "/project-decipath-light.svg",
    previewDarkImage: "/project-decipath-dark.svg",
    shot: "/project-images/decipath-ai.png",
    previewAlt:
      "Preview illustration of Decipath showing a landing hero and roadmap canvas.",
    repo: {
      owner: "AbhinavMishra32",
      name: "DecipathAI",
      branch: "main",
    },
  },
  {
    slug: "xitecoin",
    name: "XiteCoin",
    focus: "Blockchain from scratch",
    summary:
      "Five blockchain layers written from scratch in pure Python, with zero external dependencies.",
    detail:
      "XiteCoin exists because I wanted to stop treating blockchain as magic. Every layer is written by hand with no libraries: proof-of-work mining, gossip-based peer discovery, Merkle validation, transaction processing, and a JSON-RPC node that keeps peers converged on the longest valid chain.",
    category: ["Systems"],
    year: "2024",
    status: "archived",
    stack: ["Python", "Proof of Work", "Gossip P2P", "JSON-RPC", "Merkle trees"],
    bullets: [
      "Proof-of-work mining and Merkle validation written from first principles, zero dependencies",
      "Gossip-based P2P networking with a bootstrap server keeping peers on the longest chain",
      "JSON-RPC node interface plus tamper detection and chain-recovery paths for bad state",
    ],
    buildTags: ["Fully hand-coded", "No AI in the build"],
    iconLabel: "X",
    source: "https://github.com/AbhinavMishra32/xitecoin",
    previewImage: "/project-xitecoin-light.svg",
    previewDarkImage: "/project-xitecoin-dark.svg",
    previewAlt:
      "Preview illustration of XiteCoin showing a bootstrap server, network nodes, and chained blocks.",
    repo: {
      owner: "AbhinavMishra32",
      name: "xitecoin",
      branch: "main",
    },
  },
  {
    slug: "mentor-map",
    name: "Mentor Map",
    focus: "Smart India Hackathon 2024 winner",
    summary:
      "The AI career-guidance platform that won Smart India Hackathon 2024 against 80,000+ teams.",
    detail:
      "Mentor Map combined AI roadmaps, counselling flows, and progress tracking into a hackathon product that stayed coherent while scope moved daily. It won SIH 2024 nationally and earned recognition from C-DAC Mohali.",
    category: ["AI", "Product"],
    year: "2024",
    status: "live",
    stack: ["React", "Node.js", "PostgreSQL", "OpenAI"],
    bullets: [
      "Landing experience that makes counselling, AI roadmaps, and interview prep legible in one screen",
      "Student dashboard with lesson progress, skill tracking, and guided navigation",
      "Owned the product experience end to end under hackathon pressure, and won nationally",
    ],
    buildTags: ["Hackathon winner", "Product ownership"],
    iconLabel: "M",
    live: "https://mentormap.abhinavmishra.in",
    previewImage: "/project-mentormap-light.svg",
    previewDarkImage: "/project-mentormap-dark.svg",
    shot: "/project-images/mentor-map.png",
    previewAlt:
      "Preview illustration of Mentor Map showing the landing page and learner dashboard.",
    repoNote:
      "Built in a fast team setting, so the public repository is not linked here.",
  },
  {
    slug: "payevenly",
    name: "PayEvenly",
    focus: "Splitwise for India",
    summary:
      "A React Native group-settlement app with UPI checks, voice input, and OCR receipt parsing.",
    detail:
      "PayEvenly was owned end to end: the React Native client, a FastAPI + SQLite backend, and Expo Cloud CI/CD. The interesting work was reducing friction — voice input and receipt parsing replaced most of the manual entry that makes split apps annoying.",
    category: ["Product"],
    year: "2025",
    status: "archived",
    stack: ["React Native", "Expo", "FastAPI", "SQLite", "UPI"],
    bullets: [
      "Owned the full stack: RN client, FastAPI + SQLite backend, and Expo Cloud CI/CD",
      "AI voice input and OCR receipt parsing cut split creation time by about 45%",
      "Payment verification checks around UPI settlement flows",
    ],
    buildTags: ["Shipped for Ludotronics", "Owned end to end"],
    iconLabel: "P",
    previewImage: "/project-payevenly.svg",
    previewDarkImage: "/project-payevenly.svg",
    previewAlt: "Preview illustration of the PayEvenly group settlement app.",
  },
];

export const WORK_ITEMS: WorkItem[] = [
  {
    company: "Lunacal.ai",
    companyNote: "AI scheduling SaaS · highly successful AppSumo launch",
    url: "https://lunacal.ai",
    title: "Software Developer Intern",
    employment: "Full time",
    location: "Bangalore, KA",
    period: "Sep 2025 — Present",
    current: true,
    summary:
      "I own BRAINER end to end, plus the CI, rollout, and communication infrastructure the product ships on.",
    highlights: [
      "Own BRAINER end to end — Codex, OpenCode, and Claude Code orchestrated in isolated Kubernetes sandboxes to automate six company functions.",
      "Designed the agent-delivery pipeline: browser-capable cloud QA, Jenkins + Azure Container Registry, release emails, blog publishing, outreach.",
      "Built the CI and rollout platform for a Next.js + NestJS + tRPC stack — percentage releases, kill switches, rollback in seconds.",
      "Shipped AI calling and SMS on QStash + Redis with credit accounting and retry-aware webhooks; added Elasticsearch tracing.",
      "Automated Azure custom-domain provisioning across DNS, SSL, App Service, and Front Door — days down to ~30 minutes.",
      "Consolidated billing audits, image processing, and scheduled jobs into retry-aware pipelines with central failure visibility.",
    ],
    stack: [
      "NestJS",
      "Next.js",
      "tRPC",
      "Kubernetes",
      "Azure",
      "QStash",
      "Redis",
      "Jenkins",
      "Elasticsearch",
    ],
  },
  {
    company: "Ludotronics",
    companyNote: "Founded by IIT Bhubaneswar alumni",
    url: "https://ludotronics.io",
    title: "Software Developer",
    employment: "Part time",
    location: "Bhubaneswar, OD",
    period: "Jun 2025 — Sep 2025",
    summary:
      "Owned PayEvenly end to end — client, backend, and CI/CD.",
    highlights: [
      "Owned PayEvenly end to end: React Native client, FastAPI + SQLite backend, Expo Cloud CI/CD.",
      "Added payment checks, AI voice input, and receipt parsing — split creation ~45% faster.",
    ],
    stack: ["React Native", "Expo", "FastAPI", "SQLite"],
  },
  {
    company: "Expert Buddy",
    companyNote: "Ed-tech platform used by 200,000+ students",
    url: "https://expertbuddy.com",
    title: "Next.js Frontend Developer Intern",
    employment: "Full time",
    location: "Jaipur, RJ",
    period: "Apr 2025 — Sep 2025",
    summary:
      "Rebuilt StudyBank's auth architecture and shipped the AI document pipeline behind ExpertBuddy AI.",
    highlights: [
      "Moved StudyBank auth from client state to cookie-based SSR with caching — Lighthouse ~45 to 85+, redundant calls down ~30%.",
      "Built ExpertBuddy AI and a Vercel AI SDK pipeline handling 100+ page PDFs in under 5s.",
      "Shipped real-time chat and notifications, moved critical pages server-side — bounce down 17%, organic traffic up 23%.",
    ],
    stack: ["Next.js", "React", "Vercel AI SDK", "SSR", "Caching"],
  },
];

export const CONTACT_LINKS: Array<{ label: string; href: string }> = [
  { label: "GitHub", href: "https://github.com/AbhinavMishra32" },
  { label: "LinkedIn", href: "https://linkedin.com/in/im-abhinavmishra" },
  { label: "X", href: "https://x.com/do_anything_guy" },
  { label: "Mail", href: "mailto:abhinavmishra3322@gmail.com" },
];
