"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ExternalLink, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Subtle grid + radial glow background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_30%,rgba(124,58,237,0.25),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background:linear-gradient(to_right,transparent_0,transparent_calc(50%_-_.5px),rgba(255,255,255,.4)_50%,transparent_calc(50%_+_.5px),transparent_100%),linear-gradient(to_bottom,transparent_0,transparent_calc(50%_-_.5px),rgba(255,255,255,.4)_50%,transparent_calc(50%_+_.5px),transparent_100%)] [background-size:120px_120px]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Avatar */}
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-400/40 to-fuchsia-400/40 p-[2px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-neutral-900/80 text-2xl">🧑‍💻</div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Hey, I&apos;m <span className="bg-gradient-to-r from-violet-300 via-violet-200 to-fuchsia-300 bg-clip-text text-transparent">Abhinav</span>
            <span className="align-super text-lg sm:text-xl"> ✨</span>
            <br />
            <span className="bg-gradient-to-r from-neutral-50/90 via-neutral-200/90 to-neutral-50/90 bg-clip-text text-transparent">A Software Developer</span>
          </h1>

          {/* Subtext */}
          <p className="mt-5 text-base sm:text-lg text-neutral-300/90">
            A <span className="font-semibold">full‑stack developer</span> with a product focus and strong foundations in
            <span className="font-semibold"> design</span>. I love crafting seamless user experiences and building
            performant, scalable AI‑powered tools across web and mobile.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="#contact" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-neutral-100 shadow-sm hover:bg-white/10 transition">
              <MessageSquare className="size-4" /> Contact Me
            </Link>
            <Link href="#projects" className="inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 px-4 py-2 text-sm font-medium text-neutral-100 shadow-sm hover:from-violet-600/40 hover:to-fuchsia-600/40 transition">
              <ExternalLink className="size-4" /> View Projects
            </Link>
          </div>

          {/* Socials */}
          <div className="mt-6 flex items-center justify-center gap-4 text-neutral-300/80">
            {[{Icon: Github, href: "https://github.com/abhinavmishra"}, {Icon: Linkedin, href: "https://linkedin.com"}, {Icon: Twitter, href: "https://x.com"}, {Icon: Mail, href: "mailto:abhinavmishra3322@gmail.com"}].map(({Icon, href}) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" className="rounded-lg p-2 hover:bg-white/10 transition">
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}


