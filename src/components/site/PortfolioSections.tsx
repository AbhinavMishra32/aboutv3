import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { getBlobStudioSnapshot, STUDIO_SEED_BLOBS } from "@/lib/blob-studio";
import { getRepoDetail } from "@/lib/github";
import { PROJECTS, STORY_BEATS, WORK_ITEMS } from "@/lib/portfolio";
import { HeroSignal } from "@/components/site/HeroSignal";
import { KoreanHoverText } from "@/components/site/LanguageShiftText";
import { ProjectsExperience } from "@/components/site/ProjectsExperience";

const BROWSE_ITEMS = [
  {
    href: "/story",
    label: "Story",
    koreanLabel: "서사",
    title: "How I learned to build with high agency.",
    summary:
      "The solo builds, internship work, and debugging moments that shaped the way I approach full-stack engineering.",
    image: "/story-notes-motion.svg",
    imageAlt: "Illustration of note cards expanding from a grid.",
  },
  {
    href: "/work",
    label: "Work",
    koreanLabel: "실전",
    title: "Engineering work across real teams.",
    summary:
      "A clearer look at Lunacal, Studybank, and the way I handle backend-heavy systems, rollout safety, and polish.",
    image: "/story-studybank-ai.svg",
    imageAlt: "Illustration of a product upload flow with AI assistance.",
  },
  {
    href: "/projects",
    label: "Projects",
    koreanLabel: "프로젝트",
    title: "Products, experiments, and systems I have built.",
    summary: "A closer look at Decipath, Construct, Mentor Map, XiteCoin, and the engineering behind each one.",
    image: "/project-decipath-light.svg",
    imageAlt: "Illustration of Decipath with a roadmap graph and prompt panel.",
  },
  {
    href: "/studio",
    label: "Studio",
    koreanLabel: "스튜디오",
    title: "Create portfolio blobs directly on the site.",
    summary:
      "A full content workbench with rich editing, markdown exchange, embeds, links, and a live system-updated signal.",
    image: "/project-construct-light.svg",
    imageAlt: "Illustration of a content studio with toolbar, preview, and metadata panels.",
  },
  {
    href: "/blog",
    label: "Blog",
    koreanLabel: "기록",
    title: "Notes on shipping software that holds up.",
    summary: "Writing on systems, infrastructure, AI tooling, and the product choices behind reliable software.",
    image: "/project-mentormap.svg",
    imageAlt: "Illustration of Mentor Map with roadmap and collaboration panels.",
  },
];

const SECTION_LABELS: Record<string, string> = {
  Browse: "탐색",
  Work: "실전",
  Projects: "빌드",
  Studio: "제작실",
  Writing: "기록",
};

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
          I&apos;m a <span className="hero-emphasis">full-stack engineer</span> building TypeScript products and backend
          systems with a bias for depth.
        </p>
        <p className="hero-paragraph">
          My strongest backend work is in <span className="hero-emphasis">NestJS</span>. I care about architecture,
          reliability, and understanding what sits below the framework layer instead of stopping at abstractions.
        </p>
        <p className="hero-paragraph">
          Right now I&apos;m building toward lower-level machine learning tooling while continuing to ship
          product-facing software in TypeScript, with NestJS and occasional Go on the backend.
        </p>
      </div>
    </section>
  );
}

function SectionTitle({ children }: { children: keyof typeof SECTION_LABELS }) {
  return (
    <h2 className="section-title language-section-title">
      <KoreanHoverText korean={SECTION_LABELS[children]} english={children} />
    </h2>
  );
}

export function BrowseSection() {
  return (
    <section className="section-block">
      <div className="section-head">
        <SectionTitle>Browse</SectionTitle>
        <p className="section-note">A quick path through the work, projects, writing, and story.</p>
      </div>

      <div className="browse-grid">
        {BROWSE_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="browse-card">
            <div className="browse-card-visual">
              <Image src={item.image} alt={item.imageAlt} className="browse-card-image" width={640} height={448} />
            </div>
            <div className="browse-card-copy">
              <div className="browse-card-label">
                <KoreanHoverText korean={item.koreanLabel} english={item.label} />
              </div>
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
        <SectionTitle>Work</SectionTitle>
        {!page ? (
          <Link href="/work" className="section-action">
            See full work
          </Link>
        ) : (
          <p className="section-note">Backend systems, product engineering, and the layers underneath them.</p>
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
        <SectionTitle>Projects</SectionTitle>
        {!page ? (
          <Link href="/projects" className="section-action">
            See all projects
          </Link>
        ) : (
          <p className="section-note">Products, experiments, and backend-heavy builds shaped by how they work underneath.</p>
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
        <SectionTitle>Writing</SectionTitle>
        <Link href="/blog" className="section-action">
          See all writing
        </Link>
      </div>

      <div className="article-list">
        {posts.slice(0, 3).map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-post-card">
            <div className="article-link-copy">
              <div className="blog-post-meta">
                <span>
                  <KoreanHoverText korean="노트" english="note" />
                </span>
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

export function BlobStudioPreviewSection() {
  const snapshot = getBlobStudioSnapshot(STUDIO_SEED_BLOBS);
  const freshestBlob = [...STUDIO_SEED_BLOBS].sort(
    (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
  )[0];

  return (
    <section className="section-block">
      <div className="section-head">
        <SectionTitle>Studio</SectionTitle>
        <Link href="/studio" className="section-action">
          Open blob studio
        </Link>
      </div>

      <div className="blob-preview-launchpad">
        <article className="blob-preview-launch-card">
          <p className="eyebrow">Website UI Editing</p>
          <h3 className="blob-preview-launch-title">Create new blobs without leaving the portfolio.</h3>
          <p className="blob-preview-launch-copy">
            The new studio turns the site into a live content system: Tiptap writing, markdown import and export,
            attached links, embedded media, and a visible last-updated state across the whole deck.
          </p>
          <div className="blob-preview-launch-metrics">
            <span>{snapshot.total} blobs</span>
            <span>{snapshot.links} links attached</span>
            <span>{snapshot.embeds} embeds docked</span>
          </div>
        </article>

        <article className="blob-preview-latest-card">
          <div className="blob-preview-latest-top">
            <span className={`blob-status-pill is-${freshestBlob.status}`}>{freshestBlob.status}</span>
            <span>Last updated {formatWritingDate(freshestBlob.updatedAt)}</span>
          </div>
          <h3 className="blob-preview-launch-title">{freshestBlob.title}</h3>
          <p className="blob-preview-launch-copy">{freshestBlob.excerpt}</p>
          <div className="blob-preview-tags">
            {freshestBlob.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
