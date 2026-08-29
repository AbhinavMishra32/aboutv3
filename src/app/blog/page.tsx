import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/SiteShell";
import { PageIntro } from "@/components/shell/PageIntro";
import { WritingSection } from "@/components/home/WritingSection";
import { getAllPosts } from "@/lib/blog";

const blogDescription =
  "Notes on reliability, backend architecture, agent infrastructure, and the decisions underneath software that feels sharp and stable.";

const blogOgImage =
  "/api/og/blog?variant=index&eyebrow=Blog&title=Writing&summary=Notes+on+reliability%2C+backend+architecture%2C+product+clarity%2C+and+the+decisions+underneath+software+that+feels+sharp+and+stable.&tag=Writing&tag=Systems&tag=Product&v=2";

export const metadata: Metadata = {
  title: "Writing",
  description: blogDescription,
  openGraph: {
    title: "Writing | Abhinav Mishra",
    description: blogDescription,
    type: "website",
    url: "/blog",
    images: [{ url: blogOgImage, width: 1200, height: 630, alt: "Abhinav Mishra blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing | Abhinav Mishra",
    description: blogDescription,
    images: [blogOgImage],
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts().catch(() => []);

  return (
    <SiteShell active="blog">
      <PageIntro
        eyebrow="Writing"
        title="Notes on software that holds up."
        lead={blogDescription}
        meta={
          <>
            <span>{posts.length} notes</span>
            <span className="text-[var(--faint)]">·</span>
            <span>Systems · Backend · AI tooling</span>
          </>
        }
      />
      <WritingSection limit={100} />
    </SiteShell>
  );
}
