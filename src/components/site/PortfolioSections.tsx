import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { getRepoDetail } from "@/lib/github";
import { PROJECTS, STORY_BEATS, WORK_ITEMS } from "@/lib/portfolio";
import { HeroSignal } from "@/components/site/HeroSignal";
import { ProjectsExperience } from "@/components/site/ProjectsExperience";

const BROWSE_ITEMS = [
  {
    href: "/story",
    label: "Story",
    title: "How I learned to build with high agency.",
    summary:
      "The solo builds, internship work, and debugging moments that shaped the way I approach full-stack engineering.",
    image: "/story-notes-motion.svg",
    imageAlt: "Illustration of note cards expanding from a grid.",
  },
  {
    href: "/work",
    label: "Work",
    title: "Recent product engineering across real teams.",
    summary:
      "A clearer look at Lunacal, Studybank, and the way I handle backend-heavy systems, rollout safety, and polish.",
    image: "/story-studybank-ai.svg",
    imageAlt: "Illustration of a product upload flow with AI assistance.",
  },
  {
    href: "/projects",
    label: "Projects",
    title: "Selected builds with visual previews and feature detail.",
    summary:
      "Decipath, Construct, Mentor Map, and XiteCoin, shown through more concrete interface-driven artwork.",
    image: "/project-decipath-light.svg",
    imageAlt: "Illustration of Decipath with a roadmap graph and prompt panel.",
  },
  {
    href: "/blog",
    label: "Blog",
    title: "A backend and full-stack blog is dropping soon.",
    summary: "Longer notes on systems, infrastructure, AI tooling, and the product choices that make software trustworthy.",
    image: "/project-mentormap.svg",
    imageAlt: "Illustration of Mentor Map with roadmap and collaboration panels.",
  },
];

function formatWritingDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-identity">
        <HeroSignal />
      </div>
      <div className="hero-copy">
        <p className="hero-paragraph">
          I&apos;m a <span className="hero-emphasis">full-stack software engineer</span> who likes the hard middle of
          product engineering: turning ambiguous requirements into stable APIs, clean data flows, reliable automations,
          and interfaces that make complex systems feel obvious.
        </p>
        <p className="hero-paragraph">
          My strongest work sits where backend depth meets product taste. I care about the parts users never see:
          failure modes, rollout safety, database shape, integration edge cases, and the small UI decisions that make a
          product feel fast, trustworthy, and finished.
        </p>
        <p className="hero-paragraph">
          Right now I&apos;m building at{" "}
          <a className="inline-link" href="https://lunacal.ai" target="_blank" rel="noreferrer">
            Lunacal.ai
          </a>
          , where my work is centered on the kind of ownership strong teams expect across the stack: shipping
          carefully, debugging deeply, communicating clearly, and using AI-assisted workflows to turn{" "}
          <span className="hero-emphasis">rough ideas into polished, dependable software</span>.
        </p>
      </div>
      <div className="facts">
        <span>Based in Ghaziabad, India</span>
        <span>Full-stack product engineering</span>
        <span>Backend systems, reliability, AI UX, and thoughtful product polish</span>
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
          <p className="section-note">Recent product engineering, backend systems, rollout safety, and product ownership.</p>
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

export async function ProjectsSection({ page = false }: { page?: boolean }) {
  const repoDetails = await Promise.all(
    PROJECTS.filter((project) => project.repo).map(async (project) => [project.slug, await getRepoDetail(project.slug, project.repo!)] as const)
  );
  const details = Object.fromEntries(repoDetails);
  const summaries = Object.fromEntries(
    repoDetails.map(([slug, detail]) => [
      slug,
      {
        slug,
        totalCommits: detail.totalCommits,
        pushedAt: detail.pushedAt,
      },
    ])
  );

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

      <ProjectsExperience projects={PROJECTS} summaries={summaries} details={details} />
    </section>
  );
}

export async function WritingPreviewSection() {
  const posts = await getAllPosts();

  return (
    <section className="section-block">
      <div className="section-head">
        <h2 className="section-title">Writing</h2>
        <Link href="/blog" className="section-action">
          See all writing
        </Link>
      </div>

      <div className="article-list">
        {posts.slice(0, 3).map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-post-card">
            <div className="article-link-copy">
              <div className="blog-post-meta">
                <span>{formatWritingDate(post.date)}</span>
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="blog-post-title">{post.title}</div>
              <div className="blog-post-desc">{post.summary}</div>
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
