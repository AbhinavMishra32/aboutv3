export type Project = {
  slug: string;
  name: string;
  focus: string;
  summary: string;
  detail: string;
  techLogos: Array<
    | {
        name: string;
        src: string;
      }
    | {
        name: string;
        icon: "bootstrap" | "pow";
      }
  >;
  buildTags: string[];
  iconUrl?: string;
  iconLabel?: string;
  iconTone?: "rose" | "violet" | "amber" | "slate";
  live?: string;
  source?: string;
  previewImage: string;
  previewDarkImage: string;
  previewAlt: string;
  repo?: {
    owner: string;
    name: string;
    branch?: string;
  };
  featureHighlights: string[];
  buildArc: Array<{
    label: string;
    title: string;
    detail: string;
  }>;
  repoNote?: string;
};

export type WorkItem = {
  title: string;
  subtitle: string;
  period: string;
  detail: string;
};

export type StoryBeat = {
  step: string;
  label: string;
  title: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  linkLabel?: string;
  linkHref?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "decipath-ai",
    name: "Decipath AI",
    focus: "AI roadmap product",
    summary:
      "An AI roadmap builder that turns broad goals into structured learning paths with practical milestones.",
    detail:
      "Decipath takes a fuzzy goal, runs structured research and planning, and turns it into an execution map with milestones, tasks, and branching next steps.",
    techLogos: [
      { name: "Next.js", src: "https://cdn.simpleicons.org/nextdotjs/141413/e9e6dc?viewbox=auto" },
      { name: "TypeScript", src: "https://cdn.simpleicons.org/typescript?viewbox=auto" },
      { name: "OpenAI", src: "https://cdn.simpleicons.org/openai/141413/e9e6dc?viewbox=auto" },
      { name: "React", src: "https://cdn.simpleicons.org/react?viewbox=auto" },
    ],
    buildTags: ["Hand-built core", "AI-assisted UI polish"],
    iconUrl: "https://decipath.abhinavmishra.in/favicon.ico",
    live: "https://decipath.abhinavmishra.in",
    source: "https://github.com/AbhinavMishra32/DecipathAI",
    previewImage: "/project-decipath-light.svg",
    previewDarkImage: "/project-decipath-dark.svg",
    previewAlt: "Preview illustration of Decipath showing a landing hero and roadmap canvas.",
    repo: {
      owner: "AbhinavMishra32",
      name: "DecipathAI",
      branch: "main",
    },
    featureHighlights: [
      "Goal intake that turns rough intent into a structured roadmap request",
      "React Flow execution canvas with nodes, dependencies, and next-step detail",
      "Tiered product polish around plans, auth, billing, and agent activity",
    ],
    buildArc: [
      {
        label: "Foundation",
        title: "Turn the prompt into a real planning input.",
        detail:
          "The first shape of the product was the goal intake: current state, desired outcome, and enough structured context for roadmap generation to feel guided instead of random.",
      },
      {
        label: "Graph layer",
        title: "Make the roadmap feel alive, not static.",
        detail:
          "The core interaction became the visual map itself, with readable nodes, branching structure, time estimates, and detail panels that make the plan feel actionable.",
      },
      {
        label: "Productization",
        title: "Add the systems that make it feel like a product.",
        detail:
          "From pricing and plans to loading states and theme-aware polish, the later work pushed Decipath from demo energy toward a clearer user-facing product.",
      },
    ],
  },
  {
    slug: "mentor-map",
    name: "Mentor Map",
    focus: "Hackathon winner",
    summary:
      "A career guidance platform built for Smart India Hackathon with adaptive roadmaps and collaborative planning.",
    detail:
      "Mentor Map combined AI roadmaps, counselling flows, and progress tracking into a hackathon product that felt guided and usable under serious time pressure.",
    techLogos: [
      { name: "React", src: "https://cdn.simpleicons.org/react?viewbox=auto" },
      { name: "Node.js", src: "https://cdn.simpleicons.org/nodedotjs?viewbox=auto" },
      { name: "PostgreSQL", src: "https://cdn.simpleicons.org/postgresql?viewbox=auto" },
    ],
    buildTags: ["Hand-built core", "AI-assisted UI polish"],
    iconLabel: "M",
    iconTone: "violet",
    live: "https://mentormap.abhinavmishra.in",
    previewImage: "/project-mentormap-light.svg",
    previewDarkImage: "/project-mentormap-dark.svg",
    previewAlt: "Preview illustration of Mentor Map showing the landing page and learner dashboard.",
    featureHighlights: [
      "Friendly landing page that frames counselling, AI roadmap, and interview support",
      "Student dashboard with lesson progress, skill progress, and course tracking",
      "UI ownership across the product during the Smart India Hackathon sprint",
    ],
    buildArc: [
      {
        label: "Landing",
        title: "Sell the idea clearly before the user clicks deeper.",
        detail:
          "The first front-end job was making the product understandable fast: career guidance, AI roadmap generation, and interview prep all needed to read clearly from the homepage.",
      },
      {
        label: "Dashboard",
        title: "Turn the promise into a usable student product.",
        detail:
          "The next layer was the signed-in experience: progress cards, lesson tracking, and guided navigation so the platform felt like a real system, not just a hackathon pitch.",
      },
      {
        label: "Sprint pressure",
        title: "Keep the UI coherent while the scope keeps moving.",
        detail:
          "Because it was built under hackathon pressure, a big part of the work was making shifting ideas still feel like one product and shipping a polished interface fast enough to win.",
      },
    ],
    repoNote:
      "This project was built in a fast team setting and the public repository is not linked here, so the modal focuses on the shipped interface and product slices instead of GitHub telemetry.",
  },
  {
    slug: "construct",
    name: "Construct",
    focus: "AI teaching IDE",
    summary:
      "An AI teaching IDE that turns a software goal into a personalized course, workspace, and guided build path.",
    detail:
      "Construct is built around learner-owned coding: it tailors a project path, writes lessons and checks, opens a real workspace, and keeps teaching as the learner builds.",
    techLogos: [
      { name: "Next.js", src: "https://cdn.simpleicons.org/nextdotjs/141413/e9e6dc?viewbox=auto" },
      { name: "TypeScript", src: "https://cdn.simpleicons.org/typescript?viewbox=auto" },
      { name: "PostgreSQL", src: "https://cdn.simpleicons.org/postgresql?viewbox=auto" },
      { name: "Vercel", src: "https://cdn.simpleicons.org/vercel/141413/e9e6dc?viewbox=auto" },
    ],
    buildTags: ["Hand-built core", "0.1 in progress"],
    iconLabel: "C",
    iconTone: "amber",
    source: "https://github.com/AbhinavMishra32/Construct-IDE",
    previewImage: "/project-construct-light.svg",
    previewDarkImage: "/project-construct-dark.svg",
    previewAlt: "Preview illustration of Construct showing a goal prompt, lessons, code editor, and knowledge graph.",
    repo: {
      owner: "AbhinavMishra32",
      name: "Construct-IDE",
      branch: "main",
    },
    featureHighlights: [
      "Goal-driven course generation for projects like compilers, CLIs, and bundlers",
      "Docs-style lessons, concept checks, hidden tests, and learner-owned exercises",
      "Persistent knowledge graph and in-editor tutoring inside one workspace",
    ],
    buildArc: [
      {
        label: "Learning loop",
        title: "Start from the idea that the learner should write the code.",
        detail:
          "Construct is shaped around a strict loop: tailor the learner, teach the concept, check understanding, then let the learner implement the project themselves.",
      },
      {
        label: "Workspace",
        title: "Put lessons, code, validation, and tutoring in one IDE.",
        detail:
          "The product became much stronger once the learning path stopped feeling separate from the coding environment and started behaving like one continuous workspace.",
      },
      {
        label: "Memory",
        title: "Make personalization survive across projects.",
        detail:
          "A key layer is the knowledge graph, where the system tracks concept evidence over time so future projects can adapt to what the learner already knows.",
      },
    ],
  },
  {
    slug: "xitecoin",
    name: "XiteCoin",
    focus: "First-principles blockchain build",
    summary:
      "A Python blockchain experiment with custom proof-of-work, gossip-based networking, and JSON-RPC nodes.",
    detail:
      "XiteCoin explores blockchain mechanics from scratch with a bootstrap server, mining, synced chains, and transaction flow that prioritizes understanding the protocol deeply.",
    techLogos: [
      { name: "Python", src: "https://cdn.simpleicons.org/python?viewbox=auto" },
      { name: "Bootstrap network", icon: "bootstrap" },
      { name: "Proof of work", icon: "pow" },
    ],
    buildTags: ["Fully hand-coded", "No AI in the build"],
    iconLabel: "X",
    iconTone: "slate",
    source: "https://github.com/AbhinavMishra32/xitecoin",
    previewImage: "/project-xitecoin-light.svg",
    previewDarkImage: "/project-xitecoin-dark.svg",
    previewAlt: "Preview illustration of XiteCoin showing a bootstrap server, network nodes, and chained blocks.",
    repo: {
      owner: "AbhinavMishra32",
      name: "xitecoin",
      branch: "main",
    },
    featureHighlights: [
      "Bootstrap server architecture that keeps peers aligned on the longest chain",
      "Mining and transaction flow wired into a CLI-first blockchain experience",
      "JSON-style blockchain records, sync logic, and chain recovery experiments",
    ],
    buildArc: [
      {
        label: "Protocol",
        title: "Figure out the basic blockchain machinery first.",
        detail:
          "The early shape of XiteCoin was getting blocks, hashes, transactions, and proof-of-work to behave consistently instead of treating blockchain as magic.",
      },
      {
        label: "Networking",
        title: "Keep peers in sync without losing the global chain.",
        detail:
          "The next step was coordinating clients through a bootstrap server so users could join, transact, mine, and still converge on the same longest valid chain.",
      },
      {
        label: "Hard edges",
        title: "Keep debugging the ugly protocol cases.",
        detail:
          "A lot of the real work was in recovery paths, tampering checks, and getting clients to repair bad state, which is what made the project such a strong learning experience.",
      },
    ],
  },
];

export const WORK_ITEMS: WorkItem[] = [
  {
    title: "Lunacal.ai",
    subtitle: "Software Developer Intern · product infrastructure and rollout systems",
    period: "Sep 2025 - Present",
    detail:
      "Working across the core scheduling stack on release safety, communication infrastructure, and operational tooling. A lot of my work has gone into rollout controls, testing and CI foundations, SMS workflows, AI meeting orchestration, and automation around custom domain provisioning.",
  },
  {
    title: "Ludotronics",
    subtitle: "Software Developer · PayEvenly",
    period: "Jun 2025 - Sep 2025",
    detail:
      "Built PayEvenly, a Splitwise-style React Native app for India focused on faster group settlements. The app combined UPI payments, AI voice input, and OCR receipt parsing, with a FastAPI + SQLite backend and Expo-based mobile delivery.",
  },
  {
    title: "Expert Buddy",
    subtitle: "Next.js Frontend Developer Intern · StudyBank and AI student tools",
    period: "Apr 2025 - Sep 2025",
    detail:
      "Built the full frontend for StudyBank in Next.js, including SSR-oriented auth and faster data flows across student-facing pages. I also worked on AI-powered support features, including document analysis and chat-style student help tools, while handling frontend troubleshooting and UI polish across the product.",
  },
];

export const STORY_BEATS: StoryBeat[] = [
  {
    step: "01",
    label: "Learning by building",
    title: "A notes app taught me how to think past the framework.",
    paragraphs: [
      "A lot of my frontend experience came from solo projects, where I had to make product decisions, troubleshoot bugs, and keep moving without waiting for someone else to unblock me. One of the earliest was a rich-text notes app with a responsive dashboard of note cards arranged in a grid.",
      "I wanted each card to expand smoothly from its exact position, but CSS Grid kept fighting the animation. I used React refs and getBoundingClientRect() to measure the clicked card, rendered a duplicate outside the grid, and animated that copy with Framer Motion so it felt like the original card was opening in place. Getting the offsets right across screen sizes took careful layout math and a lot of debugging, but it taught me to work from first principles instead of stopping at the first limitation.",
    ],
    image: "/story-notes-motion.svg",
    imageAlt: "Minimal illustration of note cards expanding out of a grid.",
    linkLabel: "View the notes app",
    linkHref: "https://dbnotes.abhinavmishra.in",
  },
  {
    step: "02",
    label: "Shipping in a real product",
    title: "Studybank taught me how to own a feature and improve it at the same time.",
    paragraphs: [
      "During my internship at Expert Buddy, I worked on a major feature called StudyBank, where students could upload notes and other students could search, preview, and download them. I built the full frontend from Figma, handled frontend troubleshooting on my own, and used docs, search, and AI to understand why bugs were happening instead of just patching symptoms.",
      "While building the upload flow, I realized the long metadata form created too much friction. I proposed an AI-assisted autofill option, built a proof of concept in two days, and showed the CEO and design team how it could make uploads faster while keeping manual control. Once everyone aligned on the flow, I helped shape the final interface and shipped the production version.",
    ],
    image: "/story-studybank-ai.svg",
    imageAlt: "Minimal illustration of a file upload interface with AI-assisted autofill.",
  },
  {
    step: "03",
    label: "High-agency environments",
    title: "Hackathons and solo projects made me comfortable carrying the whole interface.",
    paragraphs: [
      "During Smart India Hackathon, I took ownership of the UI for Mentor Map and helped turn the idea into a product that felt usable under real time pressure. Building the whole interface in that environment taught me how to move quickly, make product calls, and stay calm while the scope kept shifting.",
      "That same habit shows up across my side projects as well. I like working independently, debugging the hard edges myself, and understanding how something behaves before I reach for shortcuts. Whether it is AI tooling, frontend interaction design, or a first-principles side project, I usually learn the fastest when I am close to the problem.",
    ],
    image: "/story-high-agency.svg",
    imageAlt: "Minimal illustration of interface design boards and a product flow under construction.",
    linkLabel: "See selected projects",
    linkHref: "/projects",
  },
];

export const CONTACT_LINKS: Array<{ label: string; href: string; icon: string }> = [
  { label: "X", href: "https://x.com/do_anything_guy", icon: "ri:twitter-x-fill" },
  { label: "GitHub", href: "https://github.com/AbhinavMishra32", icon: "mdi:github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/im-abhinavmishra", icon: "mdi:linkedin" },
  { label: "Website", href: "https://abhinavmishra.in", icon: "mdi:web" },
];
