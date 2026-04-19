import Link from "next/link";
import { SiteThemeToggle } from "@/components/SiteThemeToggle";
import { getAllPosts } from "@/lib/blog";

type Project = {
  name: string;
  summary: string;
  stackLine: string;
  buildTags: string[];
  live?: string;
  source?: string;
};

type Highlight = {
  title: string;
  detail: string;
  meta: string;
  href?: string;
};

const PROJECTS: Project[] = [
  {
    name: "Decipath AI",
    summary:
      "An AI roadmap builder that turns broad goals into structured learning paths with practical milestones.",
    stackLine: "Next.js · TypeScript · OpenAI API · React Flow",
    buildTags: ["Hand-built core", "AI-assisted UI polish"],
    live: "https://decipath.abhinavmishra.in",
    source: "https://github.com/AbhinavMishra32",
  },
  {
    name: "Mentor Map",
    summary:
      "A career guidance platform built for Smart India Hackathon with adaptive roadmaps and collaborative planning.",
    stackLine: "React · Node.js · PostgreSQL",
    buildTags: ["Hand-built core", "AI-assisted UI polish"],
    live: "https://mentormap.abhinavmishra.in",
  },
  {
    name: "PayEvenly",
    summary:
      "A Splitwise-style expense app with UPI settlement, voice input, and OCR receipt parsing for faster group splits.",
    stackLine: "React Native · FastAPI · Expo",
    buildTags: ["Hand-built core", "Product-first flow"],
  },
  {
    name: "XiteCoin",
    summary:
      "A Python blockchain experiment with custom proof-of-work, gossip-based networking, and JSON-RPC nodes.",
    stackLine: "Python · P2P · Cryptography",
    buildTags: ["Fully hand-coded", "No AI in the build"],
    source: "https://github.com/AbhinavMishra32/xitecoin",
  },
];

const HIGHLIGHTS: Highlight[] = [
  {
    title: "Shipping product systems at Lunacal.ai",
    detail:
      "Focused on scheduling and communication infrastructure with an emphasis on reliability, rollout safety, and product polish.",
    meta: "Current focus",
  },
  {
    title: "Smart India Hackathon winner",
    detail:
      "Built Mentor Map as an AI-driven guidance platform and took it from problem framing to a working product under real deadlines.",
    meta: "National recognition",
  },
];

const CONTACT_LINKS = [
  { label: "GitHub", href: "https://github.com/AbhinavMishra32" },
  { label: "Website", href: "https://abhinavmishra.in" },
  { label: "Email", href: "mailto:abhinavmishra3322@gmail.com" },
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default async function HomePage() {
  const posts = await getAllPosts();
  const latestPosts = posts.slice(0, 4);

  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="site-brand">
          <Link href="/" className="site-name">
            Abhinav Mishra
          </Link>
          <p className="site-tagline">Engineer building thoughtful products, modern interfaces, and reliable systems.</p>
        </div>

        <nav className="site-nav" aria-label="Primary">
          <Link href="/blog" className="nav-link">
            Blog
          </Link>
          <a href="#projects" className="nav-link">
            Projects
          </a>
          <a href="#highlights" className="nav-link">
            Highlights
          </a>
          <a href="#contact" className="nav-link">
            Contact
          </a>
        </nav>
      </header>

      <section className="hero">
        <p className="eyebrow">Hello</p>
        <h1 className="hero-title">
          Abhinav Mishra
          <span>software developer</span>
        </h1>
        <p className="lead">
          I design and ship products that balance a calm user experience with strong engineering underneath. Most of my
          work sits at the intersection of product thinking, frontend systems, and dependable backend infrastructure.
        </p>
        <p className="lead">
          I am currently building at{" "}
          <a className="inline-link" href="https://lunacal.ai" target="_blank" rel="noreferrer">
            Lunacal.ai
          </a>
          , while exploring AI-assisted interfaces, developer tooling, and faster ways to turn rough ideas into polished
          software.
        </p>
        <div className="facts">
          <span>Based in Ghaziabad, India</span>
          <span>Open to product collaborations</span>
          <span>Focused on reliability, AI UX, and frontend craft</span>
        </div>
        <div className="intro-links">
          {CONTACT_LINKS.map((link) => (
            <a
              key={link.label}
              className="inline-link"
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>

      <section id="projects" className="section-block">
        <div className="section-head">
          <h2 className="section-title">Selected Work</h2>
          <p className="section-note">A few projects that represent how I like to build.</p>
        </div>

        <div className="project-list">
          {PROJECTS.map((project, index) => (
            <article key={project.name} className="project-row">
              <div className="project-number">0{index + 1}</div>

              <div className="project-main">
                <div className="project-heading">
                  <div className="project-title-row">
                    <h3 className="project-title">{project.name}</h3>
                    <div className="project-meta">
                      {project.buildTags.map((tag, tagIndex) => (
                        <span
                          key={tag}
                          className={`project-badge ${tagIndex === 0 ? "project-badge-primary" : ""}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="project-stackline">{project.stackLine}</div>
                </div>

                <p className="project-summary">{project.summary}</p>
              </div>

              <div className="project-actions">
                {project.live ? (
                  <a href={project.live} target="_blank" rel="noreferrer" className="project-link">
                    Live
                  </a>
                ) : null}
                {project.source ? (
                  <a href={project.source} target="_blank" rel="noreferrer" className="project-link">
                    Source
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="highlights" className="section-block">
        <div className="section-head">
          <h2 className="section-title">Highlights</h2>
          <p className="section-note">A few milestones and areas of current focus.</p>
        </div>

        <div className="note-list">
          {HIGHLIGHTS.map((item) => {
            const content = (
              <>
                <div className="note-topline">{item.meta}</div>
                <h3 className="note-title">{item.title}</h3>
                <p className="note-copy">{item.detail}</p>
              </>
            );

            return item.href ? (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="note-item note-item-link"
              >
                {content}
              </a>
            ) : (
              <article key={item.title} className="note-item">
                {content}
              </article>
            );
          })}
        </div>
      </section>

      <section id="writing" className="section-block">
        <div className="section-head">
          <h2 className="section-title">Writing</h2>
          <p className="section-note">
            Short essays on product clarity, shipping, and the systems that make software feel dependable.
          </p>
        </div>

        <div className="article-list">
          {latestPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="article-link">
              <div className="article-link-main">
                <div className="article-link-title">{post.title}</div>
                <div className="article-link-summary">{post.summary}</div>
              </div>
              <div className="article-link-meta">
                <span>{formatDate(post.date)}</span>
                <span>{post.tags.join(" · ")}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="section-tail">
          <Link href="/blog" className="inline-link">
            View all posts
          </Link>
        </div>
      </section>

      <section id="contact" className="section-block">
        <div className="section-head">
          <h2 className="section-title">Find Me</h2>
          <p className="section-note">The easiest way to reach me is by email, but these links work too.</p>
        </div>

        <div className="contact-list">
          {CONTACT_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              className="contact-row"
            >
              <span>{link.label}</span>
              <span className="contact-row-arrow">→</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <p className="footer-note">Built with Next.js, then pared back until only the essential pieces remained.</p>
        <SiteThemeToggle />
      </footer>
    </main>
  );
}
