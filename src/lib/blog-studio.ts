export type BlogPostStatus = "draft" | "published" | "pinned";

export type BlogPostDraft = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: BlogPostStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  contentHtml: string;
};

export const BLOG_STUDIO_STORAGE_KEY = "portfolio-blog-studio-v1";

export const STUDIO_SEED_POSTS: BlogPostDraft[] = [
  {
    id: "signal-notes",
    title: "Signal Notes",
    slug: "signal-notes",
    excerpt: "A live writing draft for interface notes, product signals, and fragments worth resurfacing later.",
    category: "Writing system",
    status: "published",
    tags: ["notes", "signal", "editorial"],
    createdAt: "2026-05-20T09:20:00.000Z",
    updatedAt: "2026-05-27T18:40:00.000Z",
    contentHtml: `
      <h2>Signal Notes</h2>
      <p>This post is for short field notes that do not deserve a long essay but still shape the way the site thinks.</p>
      <blockquote>
        <p>Good portfolio writing should feel like a sharp operating system, not a pile of disconnected captions.</p>
      </blockquote>
      <ul>
        <li>Keep the voice direct and present tense.</li>
        <li>Capture links and embeds inside the writing surface itself.</li>
        <li>Let the site show when the system was last touched.</li>
      </ul>
      <p><a href="https://abhinavmishra.in">Portfolio home</a></p>
    `.trim(),
  },
  {
    id: "build-log-decipath",
    title: "Decipath Build Log",
    slug: "decipath-build-log",
    excerpt: "A denser product log with milestones, repo links, and embedded references for one active build.",
    category: "Project log",
    status: "pinned",
    tags: ["decipath", "roadmaps", "product"],
    createdAt: "2026-05-18T12:10:00.000Z",
    updatedAt: "2026-05-28T04:45:00.000Z",
    contentHtml: `
      <h2>Decipath Build Log</h2>
      <p>Decipath keeps getting better when the product notes, launch links, and execution details live in one place.</p>
      <h3>What belongs in this post</h3>
      <ol>
        <li>Product changes worth surfacing publicly.</li>
        <li>References that should remain attached to the project itself.</li>
        <li>Media that makes the write-up feel alive instead of archival.</li>
      </ol>
      <p><strong>Last pass:</strong> tuning roadmap clarity, polishing execution views, and tightening the product language.</p>
      <p><a href="https://decipath.abhinavmishra.in">Open Decipath</a> · <a href="https://github.com/AbhinavMishra32/DecipathAI">Source</a></p>
    `.trim(),
  },
  {
    id: "research-thread",
    title: "Research Thread",
    slug: "research-thread",
    excerpt: "A scratch-to-ship thread for collecting links, experiments, and future system directions without leaving the site.",
    category: "Research",
    status: "draft",
    tags: ["research", "ml", "systems"],
    createdAt: "2026-05-14T15:00:00.000Z",
    updatedAt: "2026-05-25T11:05:00.000Z",
    contentHtml: `
      <h2>Research Thread</h2>
      <p>Use this for emerging ideas that need structure before they become a section, project page, or essay.</p>
      <p>Tasks, embeds, and markdown export let the same note move from scratchpad to publishable artifact.</p>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="true"><p>Capture the current research angle.</p></li>
        <li data-type="taskItem" data-checked="false"><p>Add links that matter.</p></li>
        <li data-type="taskItem" data-checked="false"><p>Decide whether it becomes a note, a page, or a full post.</p></li>
      </ul>
    `.trim(),
  },
];

export function getBlogStudioSnapshot(posts: BlogPostDraft[]) {
  const latestUpdatedAt = posts.reduce((latest, post) => {
    return new Date(post.updatedAt).getTime() > new Date(latest).getTime() ? post.updatedAt : latest;
  }, posts[0]?.updatedAt ?? new Date().toISOString());

  return {
    total: posts.length,
    published: posts.filter((post) => post.status === "published").length,
    pinned: posts.filter((post) => post.status === "pinned").length,
    latestUpdatedAt,
  };
}
