import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
};

export type BlogPost = BlogPostMeta & {
  contentHtml: string;
};

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const files = await fs.readdir(BLOG_DIR);
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const slug = file.replace(/\.md$/, "");
        const fullPath = path.join(BLOG_DIR, file);
        const fileContents = await fs.readFile(fullPath, "utf8");
        const { data } = matter(fileContents);

        return {
          slug,
          title: data.title as string,
          date: data.date as string,
          summary: (data.summary as string) ?? "",
          tags: (data.tags as string[]) ?? [],
        } satisfies BlogPostMeta;
      })
  );

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(BLOG_DIR, `${slug}.md`);
  try {
    const fileContents = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const processed = await remark().use(html).process(content);

    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      summary: (data.summary as string) ?? "",
      tags: (data.tags as string[]) ?? [],
      contentHtml: processed.toString(),
    };
  } catch (error) {
    return null;
  }
}
