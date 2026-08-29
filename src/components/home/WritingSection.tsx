import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { Reveal } from "@/components/shell/Reveal";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export async function WritingSection({ limit = 4 }: { limit?: number }) {
  const posts = await getAllPosts().catch(() => []);
  const visible = posts.slice(0, limit);

  return (
    <div className="col px-6 py-6 sm:px-8">
      {visible.length === 0 ? (
        <p className="mono py-6 text-center text-[12px] text-[var(--soft)]">
          Notes are on the way.
        </p>
      ) : (
        <div className="divide-y divide-dashed divide-[var(--line)]">
          {visible.map((post, index) => (
            <Reveal key={post.slug} delay={index * 60}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-start gap-4 py-4 first:pt-0"
              >
                <span className="mono mt-[3px] w-[84px] shrink-0 text-[10.5px] text-[var(--soft)]">
                  {formatDate(post.date)}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-semibold leading-snug tracking-[0.02em] text-[var(--fg)]">
                    {post.title}
                  </h3>
                  {post.tags.length ? (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <ArrowRight
                  size={14}
                  className="mt-1 shrink-0 text-[var(--faint)] transition-all group-hover:translate-x-1 group-hover:text-[var(--fg)]"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      )}

      {posts.length > limit ? (
        <Link
          href="/blog"
          className="mono mt-4 inline-flex items-center gap-1.5 border-t border-dashed border-[var(--line)] pt-4 text-[10.5px] text-[var(--soft)] transition-colors hover:text-[var(--fg)]"
        >
          All {posts.length} notes
          <ArrowRight size={12} />
        </Link>
      ) : null}
    </div>
  );
}
