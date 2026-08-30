import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.abhinavmishra.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/studio", "/api/"] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
