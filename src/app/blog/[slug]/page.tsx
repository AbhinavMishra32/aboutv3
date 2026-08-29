import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Eye } from "lucide-react";
import { getPostViews } from "@/lib/blog-db";
import { getAllPosts, getPostBySlug, type BlogPost } from "@/lib/blog";
import { ViewCounter } from "@/components/blog/ViewCounter";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { SiteShell } from "@/components/shell/SiteShell";
import { Band } from "@/components/shell/Band";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatBlogDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function readingMinutes(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

function getBlogOgImageUrl(post: BlogPost) {
  // Clean newlines and carriage returns from the summary for URL safety
  const cleanSummary = post.summary
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const params = new URLSearchParams({
    eyebrow: "Writing",
    title: post.title,
    summary: cleanSummary,
    date: post.date,
    v: "2",
  });

  for (const tag of post.tags.slice(0, 3)) {
    params.append("tag", tag);
  }

  return `/api/og/blog?${params.toString()}`;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  const ogImage = getBlogOgImageUrl(post);

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: `${post.title} | Abhinav Mishra`,
      description: post.summary,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${post.title} by Abhinav Mishra`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Abhinav Mishra`,
      description: post.summary,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [initialViews, allPosts] = await Promise.all([
    getPostViews(post.slug),
    getAllPosts().catch(() => []),
  ]);

  const currentIndex = allPosts.findIndex((entry) => entry.slug === post.slug);
  const previous = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const next = currentIndex >= 0 ? allPosts[currentIndex + 1] : null;
  const minutes = readingMinutes(post.contentHtml);

  return (
    <SiteShell active="blog">
      <ReadingProgress />

      <div className="col px-6 pb-7 pt-10 sm:px-8 sm:pt-14">
        <Link
          href="/blog"
          className="mono group inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-[var(--soft)] transition-colors hover:text-[var(--fg)]"
        >
          <ArrowLeft
            size={12}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          All writing
        </Link>

        <h1 className="serif mt-5 max-w-[30ch] text-[32px] leading-[1.12] text-[var(--fg)] sm:text-[42px]">
          {post.title}
        </h1>

        {post.summary ? (
          <p className="copy mt-4 max-w-[60ch] text-[15.5px]">{post.summary}</p>
        ) : null}

        <div className="mono mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-dashed border-[var(--line)] pt-4 text-[10.5px] uppercase tracking-[0.1em] text-[var(--soft)]">
          <span>{formatBlogDate(post.date)}</span>
          <span className="text-[var(--faint)]">·</span>
          <span className="flex items-center gap-1.5">
            <Clock size={11} />
            {minutes} min read
          </span>
          <span className="text-[var(--faint)]">·</span>
          <span className="flex items-center gap-1.5">
            <Eye size={11} />
            <ViewCounter slug={post.slug} initialViews={initialViews} />
          </span>
          {post.tags.length ? (
            <>
              <span className="text-[var(--faint)]">·</span>
              <span className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-[var(--line)] bg-[var(--chip)] px-1.5 py-0.5 text-[9.5px] tracking-[0.1em]"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            </>
          ) : null}
        </div>
      </div>

      <Band className="px-6 py-9 sm:px-8">
        <div
          className="prose-note"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </Band>

      {previous || next ? (
        <Band className="px-6 py-6 sm:px-8">
          <div className="grid gap-2 sm:grid-cols-2">
            {previous ? (
              <Link
                href={`/blog/${previous.slug}`}
                className="card card-interactive group px-4 py-3.5"
              >
                <span className="mono flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-[var(--soft)]">
                  <ArrowLeft size={11} className="transition-transform group-hover:-translate-x-0.5" />
                  Newer
                </span>
                <span className="mt-1.5 block text-[14px] leading-snug text-[var(--fg)]">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="card card-interactive group px-4 py-3.5 text-right"
              >
                <span className="mono flex items-center justify-end gap-1.5 text-[10px] uppercase tracking-[0.14em] text-[var(--soft)]">
                  Older
                  <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1.5 block text-[14px] leading-snug text-[var(--fg)]">
                  {next.title}
                </span>
              </Link>
            ) : null}
          </div>
        </Band>
      ) : null}
    </SiteShell>
  );
}
