export type StoryChapter = {
  id: string;
  /** Short label for the side rail. */
  label: string;
  year: string;
  title: string;
  paragraphs: string[];
  /** Optional pulled-out line — the sentence the chapter is really about. */
  pull?: string;
  /** Optional hard numbers earned in this chapter. */
  facts?: Array<{ value: string; label: string }>;
  link?: { label: string; href: string };
};

export const STORY_INTRO =
  "I did not start with a plan. I started with things I did not understand and refused to leave alone — and the refusing turned out to be the whole method.";

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "first-principles",
    label: "First principles",
    year: "2024",
    title: "I wrote a blockchain in pure Python because I was tired of nodding along.",
    paragraphs: [
      "Everyone around me could say the words — proof of work, Merkle tree, consensus — and I could say them too. That was the problem. I could repeat the vocabulary and could not have told you what actually happened when two nodes disagreed.",
      "So I built XiteCoin with zero external dependencies. Five layers by hand: proof-of-work mining, gossip-based P2P networking, Merkle validation, transaction processing, and a JSON-RPC node. No library to hide behind meant no way to fake understanding.",
      "The mining loop was the easy part. The real work was the ugly middle: peers that fell out of sync, chains that forked and had to converge on the longest valid one, tampered blocks that had to be detected and repaired. I spent more time on recovery paths than on the happy path, which is exactly the lesson.",
    ],
    pull: "No library to hide behind meant no way to fake understanding.",
    facts: [
      { value: "5", label: "Layers built by hand" },
      { value: "0", label: "External dependencies" },
    ],
    link: { label: "Read the source", href: "https://github.com/AbhinavMishra32/xitecoin" },
  },
  {
    id: "sih",
    label: "Smart India Hackathon",
    year: "Dec 2024",
    title: "Eighty thousand teams entered. We won.",
    paragraphs: [
      "Smart India Hackathon is the largest hackathon in the country. Over 80,000 teams. We built Mentor Map — career guidance that combined counselling flows, AI-generated roadmaps, and interview preparation into one product a student could actually use.",
      "I owned the product experience. Not a slice of it, the whole thing: what the landing page had to prove in five seconds, what the signed-in dashboard needed to show, how progress tracking should feel when a student came back a week later.",
      "The hard part was not the code. It was that the scope moved almost hourly and the interface had to keep reading like one coherent product anyway. Building under that pressure taught me to make product calls fast, commit to them, and stay calm while everything underneath kept shifting.",
      "We won nationally, took ₹1,00,000, and got recognition from Dr. Sanjeev, Joint Director at C-DAC Mohali.",
    ],
    pull: "The scope moved hourly. The product still had to read like one thing.",
    facts: [
      { value: "80k+", label: "Teams competing" },
      { value: "1st", label: "Nationally" },
    ],
  },
  {
    id: "open-source",
    label: "Open source",
    year: "2025",
    title: "Contributing to a runtime with 1,700 stars taught me to read before writing.",
    paragraphs: [
      "MetaCall is a polyglot runtime — it lets functions written in different languages call each other. I implemented TypeScript and VS Code API IntelliSense for it, so developers get real autocomplete across a multi-language boundary instead of guessing.",
      "Working inside somebody else's 1,700-star codebase is a different discipline from building your own. You cannot restructure things to suit you. You read until you understand why it is shaped the way it is, then you make the smallest change that fits.",
    ],
    link: { label: "MetaCall on GitHub", href: "https://github.com/metacall/core" },
  },
  {
    id: "production",
    label: "Real production",
    year: "Apr — Sep 2025",
    title: "At Expert Buddy I learned that most performance problems are architecture problems.",
    paragraphs: [
      "StudyBank was used by a platform serving 200,000+ students, and its authentication lived in client-side state. Every page load flickered while the UI worked out who you were. The instinct is to reach for a loading skeleton. The fix was to move auth to cookie-based Next.js SSR and cache the auth, wallet, and notification data properly.",
      "Lighthouse went from roughly 45 to 85+. Redundant calls dropped about 30%. The flicker did not get hidden — it stopped existing.",
      "I also built ExpertBuddy AI and the Vercel AI SDK document pipeline behind it, processing 100+ page PDFs in under five seconds. And while building the upload flow I noticed the metadata form was long enough to make people abandon it. I built an AI autofill proof of concept in two days, showed the CEO and the design team, and shipped the production version once everyone aligned.",
    ],
    pull: "The flicker did not get hidden. It stopped existing.",
    facts: [
      { value: "45→85+", label: "Lighthouse" },
      { value: "−30%", label: "Redundant calls" },
      { value: "<5s", label: "100+ page PDFs" },
    ],
  },
  {
    id: "ownership",
    label: "Full ownership",
    year: "Jun — Sep 2025",
    title: "PayEvenly was mine end to end — client, backend, and the pipeline between them.",
    paragraphs: [
      "At Ludotronics I owned a group-settlement app for India: React Native client, FastAPI and SQLite backend, Expo Cloud CI/CD. Every layer, including the boring deployment parts nobody volunteers for.",
      "Splitting a bill is a solved problem on paper and miserable in practice, because entering the data is the whole cost. So I attacked entry directly — AI voice input and OCR receipt parsing instead of another form. Split creation got about 45% faster.",
    ],
    facts: [{ value: "−45%", label: "Time to create a split" }],
  },
  {
    id: "agents",
    label: "Agent infrastructure",
    year: "Sep 2025 — now",
    title: "At Lunacal I own BRAINER: businesses run by AI, no employees required.",
    paragraphs: [
      "BRAINER coordinates Codex, OpenCode, and Claude Code inside isolated Kubernetes sandboxes to automate six company functions — planning, coding, QA, deployment, founder reporting, and customer acquisition. I own it end to end.",
      "The interesting engineering is not the prompting. It is everything that has to be true for autonomous agents to be safe in production. A distributed delivery pipeline with browser-capable cloud QA, Jenkins and Azure Container Registry, release emails, and outreach — so implementation-to-release stops being a chain of handoffs.",
      "Underneath that I built the CI and rollout platform for our Next.js + NestJS + tRPC stack: deterministic percentage releases, kill switches, and rollback measured in seconds instead of full redeployments. AI calling and SMS on QStash and Redis with credit accounting and retry-aware webhooks. Elasticsearch and Kibana tracing, because an agent workflow you cannot debug is a liability, not a feature.",
      "The one I am quietly proudest of is unglamorous: Azure custom-domain provisioning across DNS, SSL, App Service, and Front Door used to take days of manual work. It now takes about thirty minutes.",
    ],
    pull: "The interesting part is not the prompting. It is what has to be true for agents to be safe in production.",
    facts: [
      { value: "6", label: "Company functions automated" },
      { value: "98%", label: "Faster provisioning" },
      { value: "3", label: "Workloads consolidated" },
    ],
  },
  {
    id: "now",
    label: "What's next",
    year: "2026",
    title: "Now I am building the tools I wanted when I was starting.",
    paragraphs: [
      "Construct IDE is an AI-native desktop IDE whose agents read your repository, run your tests, review your diffs, and generate practice aimed at what you actually got wrong — with a persistent learner memory so it does not forget you between sessions. Spar is an adaptive coding gym whose Ability Ledger turns your attempt history into the next challenge you should face.",
      "Both come from the same place as the blockchain did. I learn fastest when I am close to the problem, and the fastest way to understand a thing properly is still to build it yourself.",
    ],
    link: { label: "See what I'm building", href: "/projects" },
  },
];
