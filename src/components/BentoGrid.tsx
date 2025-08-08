"use client";

import React from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { BentoCard } from "@/components/BentoCard";
import Modal from "@/components/Modal";
import { Award, Briefcase, Code2, GraduationCap, Link2, MessageSquare, Trophy, MessageCircle, Crown, Send, Mail, Globe, LayoutGrid, ListTree } from "lucide-react";

type Section = {
  key: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  preview: React.ReactNode;
  detail: React.ReactNode;
  className?: string;
};

export default function BentoGrid() {
  const [openKey, setOpenKey] = React.useState<string | null>(null);
  const close = () => setOpenKey(null);

  const sections: Section[] = [
    // Left column stack
    {
      key: "stack",
      title: "My Stacks",
      subtitle: "Tech Arsenal",
      icon: <LayoutGrid className="size-5" />,
      className: "sm:col-span-2 md:col-span-3 lg:col-span-3 md:row-span-3",
      preview: (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {["Next.js", "TypeScript", "Tailwind", "Node.js"].map((t) => (
            <div key={t} className="rounded-xl bg-white/5 px-3 py-2 text-neutral-200">{t}</div>
          ))}
        </div>
      ),
      detail: (
        <div className="grid grid-cols-2 gap-3 text-sm">
          {["Next.js", "TypeScript", "TailwindCSS", "React", "Node.js", "PostgreSQL"].map((t) => (
            <div key={t} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">{t}</div>
          ))}
        </div>
      ),
    },
    // Stats – three small tiles
    {
      key: "stat-projects",
      title: "01+",
      subtitle: "Projects",
      icon: <Trophy className="size-5" />,
      className: "sm:col-span-1 md:col-span-1 lg:col-span-1 md:row-span-1",
      preview: <div className="mt-3 text-xs text-neutral-400">Shipped</div>,
      detail: <p className="text-sm">Select projects and experiments I’ve shipped recently.</p>,
    },
    {
      key: "stat-clients",
      title: "01+",
      subtitle: "Happy Clients",
      icon: <Trophy className="size-5" />,
      className: "sm:col-span-1 md:col-span-1 lg:col-span-1 md:row-span-1",
      preview: <div className="mt-3 text-xs text-neutral-400">Satisfied</div>,
      detail: <p className="text-sm">Collaborations with startups and student teams.</p>,
    },
    {
      key: "stat-years",
      title: "01+",
      subtitle: "Year Expertise",
      icon: <Trophy className="size-5" />,
      className: "sm:col-span-1 md:col-span-1 lg:col-span-1 md:row-span-1",
      preview: <div className="mt-3 text-xs text-neutral-400">Hands-on</div>,
      detail: <p className="text-sm">Focused on product engineering and AI UX.</p>,
    },
    {
      key: "about",
      title: "Abhinav Mishra",
      subtitle: "Product-focused CS undergrad · SIH’24 Winner",
      icon: <Code2 className="size-5" />,
      className: "sm:col-span-2 md:col-span-4 lg:col-span-3 md:row-span-3",
      preview: (
        <ul className="mt-3 grid grid-cols-2 gap-2 text-xs md:text-sm text-neutral-300">
          <li>Ghaziabad, UP</li>
          <li>+91 7701956829</li>
          <li>abhinavmishra3322@gmail.com</li>
          <li className="flex items-center gap-1">
            <Link2 className="size-3" /> abhinavmishra.in
          </li>
        </ul>
      ),
      detail: (
        <div className="space-y-4">
          <p>
            I build scalable AI products across web and mobile. Creator of Decipath AI, an LLM-powered roadmap generator. I enjoy tasteful UI, performance, and shipping fast.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-white/10 p-3 bg-white/5">
              <div className="text-xs text-neutral-400">Location</div>
              <div>Ghaziabad, Uttar Pradesh</div>
            </div>
            <div className="rounded-xl border border-white/10 p-3 bg-white/5">
              <div className="text-xs text-neutral-400">Contact</div>
              <div>+91 7701956829 · abhinavmishra3322@gmail.com</div>
            </div>
          </div>
        </div>
      ),
    },
    // Right column: Testimonials
    {
      key: "reviews",
      title: "Testimonials",
      subtitle: "Reviews Showcase",
      icon: <MessageCircle className="size-5" />,
      className: "sm:col-span-2 md:col-span-3 lg:col-span-3 md:row-span-3",
      preview: (
        <div className="mt-3 space-y-2 text-sm">
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-neutral-300">“Abhinav ships polished UIs and reliable features fast.”</div>
            <div className="mt-1 text-xs text-neutral-500">— Teammate</div>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-neutral-300">“Great partner for AI-driven product work.”</div>
            <div className="mt-1 text-xs text-neutral-500">— Collaborator</div>
          </div>
        </div>
      ),
      detail: (
        <div className="space-y-3">
          <p className="text-sm">More reviews and references available on request.</p>
        </div>
      ),
    },
    // Far right column: Workflow highlights
    {
      key: "workflow",
      title: "Work Process",
      subtitle: "Workflow Highlights",
      icon: <ListTree className="size-5" />,
      className: "sm:col-span-2 md:col-span-2 lg:col-span-2 md:row-span-4",
      preview: (
        <ul className="mt-3 space-y-2 text-sm">
          {["Goals & Objectives", "Research", "Wireframe", "Prototyping", "Finalize Design"].map((s) => (
            <li key={s} className="rounded-xl bg-white/5 px-3 py-2">{s}</li>
          ))}
        </ul>
      ),
      detail: (
        <p className="text-sm">A crisp, collaborative cycle that keeps shipping velocity high.</p>
      ),
    },
    {
      key: "stats",
      title: "At a Glance",
      subtitle: "Impact & Numbers",
      icon: <Trophy className="size-5" />,
      className: "sm:col-span-2 md:col-span-2 lg:col-span-2 md:row-span-2",
      preview: (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ["01+", "Projects"],
            ["01+", "Happy Clients"],
            ["01+", "Years"],
          ].map(([num, label]) => (
            <div key={label} className="rounded-2xl bg-white/5 p-3 text-center">
              <div className="text-lg font-semibold">{num}</div>
              <div className="text-xs text-neutral-400">{label}</div>
            </div>
          ))}
        </div>
      ),
      detail: (
        <ul className="grid sm:grid-cols-3 gap-3 text-sm">
          <li className="rounded-xl border border-white/10 p-3 bg-white/5">1+ shipped projects</li>
          <li className="rounded-xl border border-white/10 p-3 bg-white/5">1+ happy clients</li>
          <li className="rounded-xl border border-white/10 p-3 bg-white/5">1+ years building</li>
        </ul>
      ),
    },
    {
      key: "experience",
      title: "Experience",
      subtitle: "Where I worked recently",
      icon: <Briefcase className="size-5" />,
      className: "sm:col-span-2 md:col-span-4 lg:col-span-3 md:row-span-3",
      preview: (
        <ul className="mt-3 text-sm space-y-2">
          <li className="flex items-start gap-2"><span className="mt-0.5 size-1.5 rounded-full bg-violet-400" /> LUDOTRONICS · Software Developer · Jun 2025 – Present</li>
          <li className="flex items-start gap-2"><span className="mt-0.5 size-1.5 rounded-full bg-violet-400" /> Expert Buddy · Next.js Frontend Intern · Apr 2025 – Present</li>
        </ul>
      ),
      detail: (
        <div className="space-y-5">
          <section>
            <h4 className="font-medium">LUDOTRONICS — Software Developer (Jun 2025 – Present)</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>Building ExpenseSplitter+, a cross-platform React Native app with UPI settlement, AI voice input, and receipt OCR.</li>
              <li>Enabled splits in &lt;60s with itemized multi‑payer logic and offline sync.</li>
              <li>Co-designed product architecture and UPI integration for 10K+ scale.</li>
            </ul>
          </section>
          <section>
            <h4 className="font-medium">Expert Buddy — Next.js Frontend Developer Intern (Apr 2025 – Present)</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>Shipped StudyBank with SSR and custom caching for auth, wallet, and notifications.</li>
              <li>Built chat and realtime notifications via TalkJS + Gupshup WhatsApp.</li>
              <li>Developed gen‑AI PDF analysis with Vercel AI SDK and led perf/accessibility.</li>
            </ul>
          </section>
        </div>
      ),
    },
    {
      key: "projects",
      title: "Projects",
      subtitle: "Things I’ve built",
      icon: <MessageSquare className="size-5" />,
      className: "sm:col-span-2 md:col-span-3 lg:col-span-3 md:row-span-3",
      preview: (
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 p-3">Decipath AI</div>
          <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 p-3">Mentor Map</div>
          <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 p-3">XiteCoin</div>
        </div>
      ),
      detail: (
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium">Decipath AI (Jan–Mar 2025)</h4>
            <p>Next.js roadmap generator using LLMs and prompt chaining with branching card layouts. ShadCN UI.</p>
          </div>
          <div>
            <h4 className="font-medium">Mentor Map (Dec 2024)</h4>
            <p>AI career guidance platform that won SIH 2024 with personalized roadmaps, quizzes, and counseling.</p>
          </div>
          <div>
            <h4 className="font-medium">XiteCoin Blockchain (Jan–Jun 2024)</h4>
            <p>Built a blockchain from scratch with PoW, P2P networking, and cryptographic ledger.</p>
          </div>
        </div>
      ),
    },
    {
      key: "awards",
      title: "Achievements",
      subtitle: "Recognition & wins",
      icon: <Award className="size-5" />,
      className: "sm:col-span-2 md:col-span-2 lg:col-span-2 md:row-span-3",
      preview: (
        <ul className="mt-3 space-y-2 text-sm">
          <li>Smart India Hackathon 2024 — Winner</li>
          <li>MetaCall Maintainer (1.5K★)</li>
        </ul>
      ),
      detail: (
        <div className="space-y-3 text-sm">
          <p>
            SIH 2024 Winner for Mentor Map; ₹100,000 prize and recognition from C‑DAC Mohali for innovative use of AI.
          </p>
          <p>
            MetaCall repo maintainer: building Intellisense via TypeScript & VSCode Extension API; contributing across AI tools & SaaS.
          </p>
        </div>
      ),
    },
    {
      key: "education",
      title: "Education",
      subtitle: "ABES Engineering College",
      icon: <GraduationCap className="size-5" />,
      className: "sm:col-span-2 md:col-span-2 lg:col-span-2 md:row-span-2",
      preview: (
        <p className="mt-3 text-sm">B.Tech in Computer Science · Expected Aug 2027</p>
      ),
      detail: (
        <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
          <li>Relevant: Python, JavaScript/TypeScript, React, Next.js, Node.js, PostgreSQL, TailwindCSS</li>
        </ul>
      ),
    },
    // Works Gallery (matches left column visual)
    {
      key: "gallery",
      title: "Projects",
      subtitle: "Works Gallery",
      icon: <MessageSquare className="size-5" />,
      className: "sm:col-span-2 md:col-span-3 lg:col-span-3 md:row-span-3",
      preview: (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {["/next.svg", "/vercel.svg", "/globe.svg"].map((src, i) => (
            <div key={i} className="flex items-center justify-center rounded-xl bg-gradient-to-b from-violet-500/20 to-fuchsia-500/10 p-3">
              <span className="text-xs text-neutral-200">Work {i + 1}</span>
            </div>
          ))}
        </div>
      ),
      detail: (
        <div className="text-sm space-y-3">
          <p>Curated snapshots from select projects. Full case studies on request.</p>
        </div>
      ),
    },
    // Services Suite (bottom left)
    {
      key: "services",
      title: "Services",
      subtitle: "Solutions Suite",
      icon: <Code2 className="size-5" />,
      className: "sm:col-span-2 md:col-span-3 lg:col-span-3 md:row-span-3",
      preview: (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {["App Design", "No Code development", "Frontend", "AI Prototyping"].map((s) => (
            <div key={s} className="rounded-xl bg-white/5 px-3 py-2">{s}</div>
          ))}
        </div>
      ),
      detail: (
        <p className="text-sm">From idea to shipped MVP with performance and accessibility baked in.</p>
      ),
    },
    // Clients (bottom middle)
    {
      key: "clients",
      title: "My Clients",
      subtitle: "Satisfied Partners",
      icon: <Award className="size-5" />,
      className: "sm:col-span-2 md:col-span-4 lg:col-span-3 md:row-span-3",
      preview: (
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          {["TikTok", "Spotify", "Facebook", "YouTube", "Instagram", "Snapchat"].map((b) => (
            <div key={b} className="rounded-xl bg-white/5 px-3 py-2 text-center text-neutral-300">{b}</div>
          ))}
        </div>
      ),
      detail: <p className="text-sm">Logos for illustration only. References on request.</p>,
    },
    // Online Presence (right middle)
    {
      key: "presence",
      title: "Follow Me",
      subtitle: "Online Presence",
      icon: <Globe className="size-5" />,
      className: "sm:col-span-2 md:col-span-3 lg:col-span-3 md:row-span-3",
      preview: (
        <ul className="mt-3 space-y-2 text-sm">
          {[
            ["GitHub", "abhinavmishra"],
            ["LinkedIn", "abhinav-mishra"],
            ["Twitter", "@abhinav_ai"],
            ["Website", "abhinavmishra.in"],
          ].map(([name, handle]) => (
            <li key={name} className="rounded-xl bg-white/5 px-3 py-2 flex items-center justify-between">
              <span>{name}</span>
              <span className="text-xs text-neutral-400">{handle}</span>
            </li>
          ))}
        </ul>
      ),
      detail: <p className="text-sm">Find more work, open-source contributions, and writings.</p>,
    },
    // CTA (right bottom)
    {
      key: "cta",
      title: "Let's Work Together",
      subtitle: "Let’s Make Magic Happen Together!",
      icon: <Crown className="size-5" />,
      className: "sm:col-span-2 md:col-span-3 lg:col-span-3 md:row-span-3",
      preview: (
        <div className="mt-4 grid grid-cols-1 gap-2">
          <button className="rounded-2xl bg-white/5 px-4 py-3 text-left flex items-center gap-2 hover:bg-white/7 transition">
            <Mail className="size-4 text-violet-300" /> Email Me
          </button>
          <button className="rounded-2xl bg-white/5 px-4 py-3 text-left flex items-center gap-2 hover:bg-white/7 transition">
            <Send className="size-4 text-violet-300" /> Schedule a Call
          </button>
        </div>
      ),
      detail: <p className="text-sm">I’m available for internships, part‑time, and freelance product work.</p>,
    },
  ];

  return (
    <LayoutGroup>
      <div className="bento-grid grid gap-3 md:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {sections.map((s) => (
          <motion.div key={s.key} layout className={s.className}>
            <BentoCard
              title={s.title}
              subtitle={s.subtitle}
              icon={s.icon}
              onClick={() => setOpenKey(s.key)}
            >
              {s.preview}
            </BentoCard>
            <AnimatePresence>
              <Modal open={openKey === s.key} onClose={close} title={s.title}>
                {s.detail}
              </Modal>
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </LayoutGroup>
  );
}


