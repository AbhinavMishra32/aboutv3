import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const latestDate = posts[0] ? formatDate(posts[0].date) : "No posts yet";

  return (
    <article className="blog-article">
      <p className="eyebrow">Writing</p>
      <h1 className="blog-title">Notes on building products that feel calm, clear, and dependable.</h1>
      <div className="blog-meta">
        <span>{posts.length} posts</span>
        <span>Latest update {latestDate}</span>
      </div>
      <p className="blog-body">
        This is where I write about product systems, frontend craft, and the practical decisions that make software
        easier to trust in the real world.
      </p>

      <div className="blog-post-grid">
        {posts.map((post) => (
          <Link key={post.slug} className="blog-post-card" href={`/blog/${post.slug}`}>
            <div className="blog-post-title">{post.title}</div>
            <div className="blog-post-desc">{post.summary}</div>
            <div className="blog-post-meta">
              <span>{formatDate(post.date)}</span>
              <span>{post.tags.join(" · ")}</span>
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}
