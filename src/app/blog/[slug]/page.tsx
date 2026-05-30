import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostViews } from "@/lib/blog-db";
import { getAllPosts, getPostBySlug, type BlogPost } from "@/lib/blog";
import { ViewCounter } from "@/components/blog/ViewCounter";

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

function getBlogOgImageUrl(post: BlogPost) {
  const params = new URLSearchParams({
    eyebrow: "Writing",
    title: post.title,
    summary: post.summary,
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
      title: "Post not found | Abhinav Mishra",
    };
  }

  const ogImage = getBlogOgImageUrl(post);

  return {
    title: `${post.title} | Abhinav Mishra`,
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

  const initialViews = await getPostViews(post.slug);

  return (
    <article className="blog-article">
      <Link href="/blog" className="blog-back">
        Back to blog
      </Link>
      <p className="eyebrow">Writing</p>
      <h1 className="blog-title">{post.title}</h1>
      <div className="blog-meta">
        <span>{formatBlogDate(post.date)}</span>
        <ViewCounter slug={post.slug} initialViews={initialViews} />
        {post.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <p className="blog-post-desc">{post.summary}</p>
      <div className="blog-markdown" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
