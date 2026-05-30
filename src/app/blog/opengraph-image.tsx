import { ImageResponse } from "next/og";
import { BlogOgCard } from "@/components/og/BlogOgCard";
import { getAllPosts } from "@/lib/blog";

export const runtime = "nodejs";
export const alt = "Abhinav Mishra blog";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const posts = await getAllPosts();

  return new ImageResponse(
    (
      <BlogOgCard
        variant="index"
        eyebrow="Blog"
        title="Writing"
        summary="Notes on reliability, backend architecture, product clarity, and the decisions underneath software that feels sharp and stable."
        tags={[`${posts.length} notes`, "Systems", "Product"]}
      />
    ),
    size
  );
}
