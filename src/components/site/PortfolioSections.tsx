import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BlogPostMeta } from "@/lib/blog";
import { PROJECTS, STORY_BEATS, WORK_ITEMS } from "@/lib/portfolio";

const BROWSE_ITEMS = [
  {
    href: "/story",
    label: "Story",
    title: "How I learned to build with high agency.",
    summary:
      "The solo builds, internship work, and debugging moments that shaped the way I approach frontend engineering.",
    image: "/story-notes-motion.svg",
    imageAlt: "Illustration of note cards expanding from a grid.",
  },
  {
    href: "/work",
    label: "Work",
    title: "Recent product engineering across real teams.",
    summary:
      "A clearer look at Lunacal, Studybank, and the way I handle frontend systems, rollout safety, and polish.",
    image: "/story-studybank-ai.svg",
    imageAlt: "Illustration of a product upload flow with AI assistance.",
  },
  {
    href: "/projects",
    label: "Projects",
    title: "Selected builds with visual previews and feature detail.",
    summary:
      "Decipath, Mentor Map, PayEvenly, and XiteCoin, shown through more concrete interface-driven artwork.",
    image: "/project-decipath.svg",
    imageAlt: "Illustration of Decipath with a roadmap graph and prompt panel.",
  },
  {
    href: "/blog",
    label: "Blog",
    title: "Notes on clarity, reliability, and frontend craft.",
    summary: "Writing about the engineering choices that make software feel calmer and easier to trust.",
    image: "/project-mentormap.svg",
    imageAlt: "Illustration of Mentor Map with roadmap and collaboration panels.",
  },
];

function ProjectTechMark({
  tech,
}: {
  tech:
    | {
        name: string;
        src: string;
      }
    | {
        name: string;
        icon: "bootstrap" | "pow";
      };
}) {
  if ("src" in tech) {
    // CDN-served brand marks are intentional here so the cards can use the real logos directly.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={tech.src} alt={tech.name} className="project-tech-logo-image" loading="lazy" />;
  }

  if (tech.icon === "bootstrap") {
    return (
      <span className="project-tech-logo-custom" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="12" r="2.25" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="18" cy="7" r="2.25" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="18" cy="17" r="2.25" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M8.2 11.05 15.7 7.95M8.2 12.95l7.5 3.1"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span className="project-tech-logo-custom" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M6.5 9.25c0-1.52 1.23-2.75 2.75-2.75h5.5c1.52 0 2.75 1.23 2.75 2.75v5.5c0 1.52-1.23 2.75-2.75 2.75h-5.5c-1.52 0-2.75-1.23-2.75-2.75z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="m12 4.75 1.05 2.11 2.33.34-1.69 1.65.4 2.32L12 10.07 9.91 11.2l.4-2.32L8.62 7.2l2.33-.34Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

export function HeroSection() {
  return (
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
          I like shipping dependable products with clean UI, thoughtful systems, and enough technical depth to keep
          the experience calm when things get messy underneath.
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
  );
}

export function BrowseSection() {
  return (
    <section className="section-block">
      <div className="section-head">
        <h2 className="section-title">Browse</h2>
        <p className="section-note">Switch sections from the top nav, or start here.</p>
      </div>

      <div className="browse-grid">
        {BROWSE_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="browse-card">
            <div className="browse-card-visual">
              <Image src={item.image} alt={item.imageAlt} className="browse-card-image" width={640} height={448} />
            </div>
            <div className="browse-card-copy">
              <div className="browse-card-label">{item.label}</div>
              <h3 className="browse-card-title">{item.title}</h3>
              <p className="browse-card-summary">{item.summary}</p>
            </div>
            <div className="browse-card-arrow" aria-hidden="true">
              <ArrowRight size={16} strokeWidth={1.8} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function StorySection() {
  return (
    <article className="story-page-section">
      <p className="eyebrow">Story</p>
      <h1 className="blog-title">How I learned to build with high agency, patience, and first-principles thinking.</h1>
      <p className="story-lead story-lead-page">
        Most of my experience came from building on my own. Solo projects taught me how to turn rough ideas into
        working products, while internship and hackathon work taught me how to bring that same ownership into real
        teams, real constraints, and tighter deadlines.
      </p>

      <div className="story-list">
        {STORY_BEATS.map((beat) => (
          <article key={beat.step} className="story-card">
            <div className="story-visual">
              <Image src={beat.image} alt={beat.imageAlt} className="story-image" width={640} height={448} />
            </div>

            <div className="story-copy-block">
              <div className="story-meta">
                <span className="story-step">{beat.step}</span>
                <span>{beat.label}</span>
              </div>

              <h2 className="story-card-title">{beat.title}</h2>

              <div className="story-paragraphs">
                {beat.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="story-card-copy">
                    {paragraph}
                  </p>
                ))}
              </div>

              {beat.linkHref ? (
                <a
                  href={beat.linkHref}
                  target={beat.linkHref.startsWith("http") ? "_blank" : undefined}
                  rel={beat.linkHref.startsWith("http") ? "noreferrer" : undefined}
                  className="story-link inline-link"
                >
                  {beat.linkLabel}
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <p className="story-closer">
        I tend to do my best work in high-agency environments: close to the product, close to the bugs, and close to
        the people using it. That is usually where I learn the fastest and build the best.
      </p>
    </article>
  );
}

export function WorkSection({ page = false }: { page?: boolean }) {
  return (
    <section className={page ? "work-page-section" : "section-block"}>
      <div className="section-head">
        <h2 className="section-title">Work</h2>
        {!page ? (
          <Link href="/work" className="section-action">
            See full work
          </Link>
        ) : (
          <p className="section-note">Recent product engineering, frontend systems, and UI ownership.</p>
        )}
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
  );
}

export function ProjectsSection({ page = false }: { page?: boolean }) {
  return (
    <section className={page ? "projects-page-section" : "section-block"}>
      <div className="section-head">
        <h2 className="section-title">Projects</h2>
        {!page ? (
          <Link href="/projects" className="section-action">
            See all projects
          </Link>
        ) : (
          <p className="section-note">Interface-led previews drawn from what each build actually does.</p>
        )}
      </div>

      <div className="project-list">
        {PROJECTS.map((project) => (
          <article key={project.name} className="project-card project-card-rich">
            <div className="project-preview">
              <Image
                src={project.previewImage}
                alt={project.previewAlt}
                className="project-preview-image"
                width={640}
                height={400}
              />
            </div>

            <div className="project-card-top">
              <div
                className={`project-icon ${project.iconLabel ? `project-icon-${project.iconTone ?? "slate"}` : ""}`}
                aria-hidden="true"
              >
                {project.iconUrl ? (
                  <span className="project-icon-image" style={{ backgroundImage: `url("${project.iconUrl}")` }} />
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
                  <ArrowUpRight size={16} strokeWidth={1.8} />
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
                <span key={tag} className={`project-badge ${tagIndex === 0 ? "project-badge-primary" : ""}`}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="project-tech-row" aria-label={`${project.name} technologies`}>
              {project.techLogos.map((tech) => (
                <span key={tech.name} className="project-tech-chip" title={tech.name} aria-label={tech.name}>
                  <ProjectTechMark tech={tech} />
                </span>
              ))}
            </div>

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
  );
}

export function WritingPreviewSection({ posts }: { posts: BlogPostMeta[] }) {
  const latestPosts = posts.slice(0, 3);

  return (
    <section className="section-block">
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
              <ArrowRight size={16} strokeWidth={1.8} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
