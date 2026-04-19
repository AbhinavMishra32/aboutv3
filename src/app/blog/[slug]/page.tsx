import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/blog";
import { getPostViews } from "@/lib/blog-db";
import { ViewCounter } from "@/components/blog/ViewCounter";

export const dynamic = "force-dynamic";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const views = await getPostViews(post.slug);

  return (
    <article className="blog-article">
      <Link className="blog-back" href="/blog">
        ← Back to all posts
      </Link>
      <p className="eyebrow">Essay</p>
      <h1 className="blog-title">{post.title}</h1>
      <div className="blog-meta">
        <span>{formatDate(post.date)}</span>
        <span>{post.tags.join(" · ")}</span>
        <ViewCounter slug={post.slug} initialViews={views} />
      </div>
      <div className="blog-body blog-markdown" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
