import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpenText } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

const blogDescription =
  "Notes on reliability, backend architecture, product clarity, and the decisions underneath software that feels sharp and stable.";
const blogOgImage =
  "/api/og/blog?variant=index&eyebrow=Blog&title=Writing&summary=Notes+on+reliability%2C+backend+architecture%2C+product+clarity%2C+and+the+decisions+underneath+software+that+feels+sharp+and+stable.&tag=Writing&tag=Systems&tag=Product&v=2";

export const metadata: Metadata = {
  title: "Writing | Abhinav Mishra",
  description: blogDescription,
  openGraph: {
    title: "Writing | Abhinav Mishra",
    description: blogDescription,
    type: "website",
    url: "/blog",
    images: [
      {
        url: blogOgImage,
        width: 1200,
        height: 630,
        alt: "Abhinav Mishra blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing | Abhinav Mishra",
    description: blogDescription,
    images: [blogOgImage],
  },
};

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
      <h1 className="blog-title">Writing</h1>
      <div className="blog-meta">
        <span>{posts.length} notes live</span>
        <span>Backend systems, product judgment, and technical depth</span>
      </div>
      <p className="blog-body">
        Notes on reliability, backend architecture, product clarity, and the decisions underneath software that feels
        sharp and stable.
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
