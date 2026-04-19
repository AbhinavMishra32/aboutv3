export type Project = {
  name: string;
  summary: string;
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
  previewAlt: string;
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
    name: "Decipath AI",
    summary:
      "An AI roadmap builder that turns broad goals into structured learning paths with practical milestones.",
    techLogos: [
      { name: "Next.js", src: "https://cdn.simpleicons.org/nextdotjs/141413/e9e6dc?viewbox=auto" },
      { name: "TypeScript", src: "https://cdn.simpleicons.org/typescript?viewbox=auto" },
      { name: "OpenAI", src: "https://cdn.simpleicons.org/openai/141413/e9e6dc?viewbox=auto" },
      { name: "React", src: "https://cdn.simpleicons.org/react?viewbox=auto" },
    ],
    buildTags: ["Hand-built core", "AI-assisted UI polish"],
    iconUrl: "https://decipath.abhinavmishra.in/favicon.ico",
    live: "https://decipath.abhinavmishra.in",
    source: "https://github.com/AbhinavMishra32",
    previewImage: "/project-decipath.svg",
    previewAlt: "Illustration of Decipath with a prompt panel and connected roadmap graph.",
  },
  {
    name: "Mentor Map",
    summary:
      "A career guidance platform built for Smart India Hackathon with adaptive roadmaps and collaborative planning.",
    techLogos: [
      { name: "React", src: "https://cdn.simpleicons.org/react?viewbox=auto" },
      { name: "Node.js", src: "https://cdn.simpleicons.org/nodedotjs?viewbox=auto" },
      { name: "PostgreSQL", src: "https://cdn.simpleicons.org/postgresql?viewbox=auto" },
    ],
    buildTags: ["Hand-built core", "AI-assisted UI polish"],
    iconLabel: "M",
    iconTone: "violet",
    live: "https://mentormap.abhinavmishra.in",
    previewImage: "/project-mentormap.svg",
    previewAlt: "Illustration of Mentor Map with roadmap cards, collaboration, and guidance panels.",
  },
  {
    name: "PayEvenly",
    summary:
      "A Splitwise-style expense app with UPI settlement, voice input, and OCR receipt parsing for faster group splits.",
    techLogos: [
      { name: "React Native", src: "https://cdn.simpleicons.org/react?viewbox=auto" },
      { name: "FastAPI", src: "https://cdn.simpleicons.org/fastapi?viewbox=auto" },
      { name: "Expo", src: "https://cdn.simpleicons.org/expo/141413/e9e6dc?viewbox=auto" },
    ],
    buildTags: ["Hand-built core", "Product-first flow"],
    iconLabel: "P",
    iconTone: "rose",
    previewImage: "/project-payevenly.svg",
    previewAlt: "Illustration of PayEvenly with receipt scanning, split amounts, and a voice action.",
  },
  {
    name: "XiteCoin",
    summary:
      "A Python blockchain experiment with custom proof-of-work, gossip-based networking, and JSON-RPC nodes.",
    techLogos: [
      { name: "Python", src: "https://cdn.simpleicons.org/python?viewbox=auto" },
      { name: "Bootstrap network", icon: "bootstrap" },
      { name: "Proof of work", icon: "pow" },
    ],
    buildTags: ["Fully hand-coded", "No AI in the build"],
    iconLabel: "X",
    iconTone: "slate",
    source: "https://github.com/AbhinavMishra32/xitecoin",
    previewImage: "/project-xitecoin.svg",
    previewAlt: "Illustration of XiteCoin with a blockchain terminal, network nodes, and linked blocks.",
  },
];

export const WORK_ITEMS: WorkItem[] = [
  {
    title: "Lunacal.ai",
    subtitle: "Product systems and software engineering",
    period: "Current",
    detail:
      "Focused on scheduling and communication infrastructure with an emphasis on reliability, rollout safety, and product polish.",
  },
  {
    title: "Expert Buddy",
    subtitle: "Frontend systems and Studybank",
    period: "2025",
    detail:
      "Built large parts of the Studybank UI from product designs, troubleshot frontend issues independently, and pushed the upload flow toward a faster AI-assisted experience.",
  },
  {
    title: "Mentor Map",
    subtitle: "Smart India Hackathon winner",
    period: "2024",
    detail:
      "Handled the interface for Mentor Map and helped take the product from idea to a working experience under hackathon pressure.",
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
      "During my internship at Expert Buddy, I worked on a major feature called Studybank, where students could upload notes and other students could search, preview, and download them. I built large parts of the UI from Figma, handled frontend troubleshooting on my own, and used docs, search, and AI to understand why bugs were happening instead of just patching symptoms.",
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
