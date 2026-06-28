import { ImageResponse } from "next/og";
import { BlogOgCard } from "@/components/og/BlogOgCard";

const size = {
  width: 1200,
  height: 630,
};

function getParam(searchParams: URLSearchParams, key: string, fallback: string) {
  return searchParams.get(key)?.trim() || fallback;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tags = searchParams
    .getAll("tag")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return new ImageResponse(
    (
      <BlogOgCard
        variant={searchParams.get("variant") === "index" ? "index" : "post"}
        eyebrow={getParam(searchParams, "eyebrow", "Writing")}
        title={getParam(searchParams, "title", "Writing")}
        summary={getParam(
          searchParams,
          "summary",
          "Notes on building software that feels sharp, stable, and deeply considered."
        )}
        date={searchParams.get("date") ?? undefined}
        tags={tags.length ? tags : ["Portfolio", "Systems", "Product"]}
      />
    ),
    size
  );
}
