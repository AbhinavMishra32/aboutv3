import { ImageResponse } from "next/og";
import { BlogOgCard } from "@/components/og/BlogOgCard";
import { getPostBySlug } from "@/lib/blog";

type BlogPostImageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const runtime = "nodejs";
export const alt = "Abhinav Mishra blog post";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: BlogPostImageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return new ImageResponse(
    (
      <BlogOgCard
        title={post?.title ?? "Writing"}
        summary={post?.summary ?? "Notes on building software that feels sharp, stable, and deeply considered."}
        date={post?.date}
        tags={post?.tags ?? ["Portfolio", "Systems", "Product"]}
      />
    ),
    size
  );
}
