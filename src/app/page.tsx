import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowUp,
  Github,
  Globe,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { SiteThemeToggle } from "@/components/SiteThemeToggle";
import { getAllPosts } from "@/lib/blog";

type Project = {
  name: string;
  summary: string;
  stackLine: string;
  buildTags: string[];
  iconUrl?: string;
  iconLabel?: string;
  iconTone?: "rose" | "violet" | "amber" | "slate";
  live?: string;
  source?: string;
};

type WorkItem = {
  title: string;
  subtitle: string;
  period: string;
  detail: string;
};

const PROJECTS: Project[] = [
  {
    name: "Decipath AI",
    summary:
      "An AI roadmap builder that turns broad goals into structured learning paths with practical milestones.",
    stackLine: "Next.js · TypeScript · OpenAI API · React Flow",
    buildTags: ["Hand-built core", "AI-assisted UI polish"],
    iconUrl: "https://decipath.abhinavmishra.in/favicon.ico",
    live: "https://decipath.abhinavmishra.in",
    source: "https://github.com/AbhinavMishra32",
  },
  {
    name: "Mentor Map",
    summary:
      "A career guidance platform built for Smart India Hackathon with adaptive roadmaps and collaborative planning.",
    stackLine: "React · Node.js · PostgreSQL",
    buildTags: ["Hand-built core", "AI-assisted UI polish"],
    iconLabel: "M",
    iconTone: "violet",
    live: "https://mentormap.abhinavmishra.in",
  },
  {
    name: "PayEvenly",
    summary:
      "A Splitwise-style expense app with UPI settlement, voice input, and OCR receipt parsing for faster group splits.",
    stackLine: "React Native · FastAPI · Expo",
    buildTags: ["Hand-built core", "Product-first flow"],
    iconLabel: "P",
    iconTone: "rose",
  },
  {
    name: "XiteCoin",
    summary:
      "A Python blockchain experiment with custom proof-of-work, gossip-based networking, and JSON-RPC nodes.",
    stackLine: "Python · P2P · Cryptography",
    buildTags: ["Fully hand-coded", "No AI in the build"],
    iconLabel: "X",
    iconTone: "slate",
    source: "https://github.com/AbhinavMishra32/xitecoin",
  },
];

const WORK_ITEMS: WorkItem[] = [
  {
    title: "Lunacal.ai",
    subtitle: "Product systems and software engineering",
    period: "Current",
    detail:
      "Focused on scheduling and communication infrastructure with an emphasis on reliability, rollout safety, and product polish.",
  },
  {
    title: "Mentor Map",
    subtitle: "Smart India Hackathon winner",
    period: "2024",
    detail:
      "Built Mentor Map as an AI-driven guidance platform and took it from problem framing to a working product under real deadlines.",
  },
];

const CONTACT_LINKS: Array<{ label: string; href: string; icon: LucideIcon }> = [
  { label: "GitHub", href: "https://github.com/AbhinavMishra32", icon: Github },
  { label: "Website", href: "https://abhinavmishra.in", icon: Globe },
  { label: "Email", href: "mailto:abhinavmishra3322@gmail.com", icon: Mail },
];

export default async function HomePage() {
  const posts = await getAllPosts();
  const latestPosts = posts.slice(0, 3);

  return (
    <main id="top" className="site-shell">
      <header className="site-header">
        <Link href="/" className="site-name">
          Abhinav Mishra
        </Link>

        <div className="header-actions">
          <nav className="site-nav" aria-label="Primary">
            <a href="#work" className="nav-link">
              Work
            </a>
            <a href="#projects" className="nav-link">
              Projects
            </a>
            <Link href="/blog" className="nav-link">
              Blog
            </Link>
          </nav>
          <SiteThemeToggle variant="compact" />
        </div>
      </header>

      <section className="hero">
        <div className="hero-identity">
          <h1 className="hero-name">Abhinav Mishra</h1>
          <p className="hero-role">Software Developer</p>
        </div>
        <div className="hero-copy">
          <p className="hero-paragraph">
            I&apos;m a{" "}
            <span className="hero-emphasis">
              software engineer, product builder, and interface-focused problem solver
            </span>{" "}
            who cares about clarity, pacing, and how a product feels in actual use.
          </p>
          <p className="hero-paragraph">
            I love building systems that stay reliable without feeling heavy. Most of my work sits between frontend
            craft, product thinking, and the less visible engineering work that keeps a product calm under pressure.
          </p>
          <p className="hero-paragraph">
            Right now I&apos;m building at{" "}
            <a className="inline-link" href="https://lunacal.ai" target="_blank" rel="noreferrer">
              Lunacal.ai
            </a>
            , while exploring AI-assisted workflows, design-sensitive tooling, and faster ways to turn rough ideas into
            polished software.
          </p>
        </div>
        <div className="facts">
          <span>Based in Ghaziabad, India</span>
          <span>Open to product collaborations</span>
          <span>Focused on reliability, AI UX, and frontend craft</span>
        </div>
      </section>

      <section id="work" className="section-block">
        <div className="section-head">
          <h2 className="section-title">Work</h2>
          <a href="#projects" className="section-action">
            See projects
          </a>
        </div>

        <div className="work-list">
          {WORK_ITEMS.map((item) => (
            <article key={item.title} className="work-row">
              <div className="work-head">
                <div>
                  <h3 className="work-title">{item.title}</h3>
                  <div className="work-subtitle">{item.subtitle}</div>
                </div>
                <div className="work-period">{item.period}</div>
              </div>
              <p className="work-detail">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="section-block">
        <div className="section-head">
          <h2 className="section-title">Side-projects</h2>
          <a
            href="https://github.com/AbhinavMishra32"
            target="_blank"
            rel="noreferrer"
            className="section-action"
          >
            View GitHub
          </a>
        </div>

        <div className="project-list">
          {PROJECTS.map((project) => (
            <article key={project.name} className="project-card">
              <div className="project-card-top">
                <div
                  className={`project-icon ${project.iconLabel ? `project-icon-${project.iconTone ?? "slate"}` : ""}`}
                  aria-hidden="true"
                >
                  {project.iconUrl ? (
                    <span
                      className="project-icon-image"
                      style={{ backgroundImage: `url("${project.iconUrl}")` }}
                    />
                  ) : (
                    <span className="project-icon-letter">{project.iconLabel}</span>
                  )}
                </div>

                {project.live ?? project.source ? (
                  <a
                    href={project.live ?? project.source}
                    target="_blank"
                    rel="noreferrer"
                    className="project-launch"
                    aria-label={`Open ${project.name}`}
                    title={`Open ${project.name}`}
                  >
                    <ArrowUpRight size={18} strokeWidth={1.8} />
                  </a>
                ) : null}
              </div>

              <div className="project-card-body">
                <div className="project-card-heading">
                  <h3 className="project-card-title">{project.name}</h3>
                  {project.live ? <span className="project-live-dot" aria-hidden="true" /> : null}
                </div>
                <p className="project-card-summary">{project.summary}</p>
              </div>

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

              <div className="project-stackline">{project.stackLine}</div>

              {project.live || project.source ? (
                <div className="project-card-links">
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
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section id="writing" className="section-block">
        <div className="section-head">
          <h2 className="section-title">Blog posts</h2>
          <Link href="/blog" className="section-action">
            See all posts
          </Link>
        </div>

        <div className="article-list">
          {latestPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="article-link">
              <div className="article-link-copy">
                <div className="article-link-title">{post.title}</div>
                <div className="article-link-summary">{post.summary}</div>
              </div>
              <div className="article-link-arrow" aria-hidden="true">
                <ArrowRight size={18} strokeWidth={1.9} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="contact" className="section-block">
        <h2 className="section-title">Let&apos;s Connect</h2>
        <div className="connect-block">
          <p className="connect-copy">
            If you want to get in touch with me about a product, an engineering problem, or just to say hi, reach out
            on social media or send me an email.
          </p>
          <div className="connect-links">
            {CONTACT_LINKS.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="contact-icon-link"
                  aria-label={link.label}
                  title={link.label}
                >
                  <Icon size={22} strokeWidth={1.9} />
                </a>
              );
            })}
          </div>
          <a href="mailto:abhinavmishra3322@gmail.com" className="connect-email">
            abhinavmishra3322@gmail.com
          </a>
        </div>

        <div className="home-footer">
          <span className="footer-note">Built with Next.js and kept intentionally minimal.</span>
          <div className="home-footer-actions">
            <a href="#top" className="back-to-top">
              <ArrowUp size={15} strokeWidth={1.9} />
              <span>Back to top</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
