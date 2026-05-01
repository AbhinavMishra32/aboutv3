import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

function formatBlogDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <article className="blog-article">
      <p className="eyebrow">Blog</p>
      <h1 className="blog-title">Notes from the parts of software that make products hold together.</h1>
      <div className="blog-meta">
        <span>{posts.length} notes live</span>
        <span>Backend systems, product judgment, AI workflows</span>
      </div>
      <p className="blog-body">
        Short engineering essays on reliability, clarity, full-stack shipping, and the hidden decisions behind polished
        product work.
      </p>

      <div className="blog-post-grid">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-post-card">
            <div className="article-link-copy">
              <div className="blog-post-meta">
                <span>{formatBlogDate(post.date)}</span>
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="blog-post-title">{post.title}</div>
              <div className="blog-post-desc">{post.summary}</div>
            </div>
            <div className="article-link-arrow" aria-hidden="true">
              <BookOpenText size={15} strokeWidth={1.8} />
              <ArrowRight size={16} strokeWidth={1.8} />
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}
