import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.abhinavmishra.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts().catch(() => []);
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/story`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/now`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
  ];

  return [
    ...routes,
    ...posts.map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
