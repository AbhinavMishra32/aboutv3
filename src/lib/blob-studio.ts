export type BlobStatus = "draft" | "live" | "pinned";

export type BlobLink = {
  id: string;
  label: string;
  url: string;
  kind: "reference" | "launch" | "source";
};

export type BlobEmbed = {
  id: string;
  label: string;
  url: string;
  caption: string;
};

export type BlobRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: BlobStatus;
  coverTone: "aurora" | "ember" | "ocean";
  tags: string[];
  createdAt: string;
  updatedAt: string;
  contentHtml: string;
  links: BlobLink[];
  embeds: BlobEmbed[];
};

export const BLOB_STUDIO_STORAGE_KEY = "portfolio-blob-studio-v1";

export const STUDIO_SEED_BLOBS: BlobRecord[] = [
  {
    id: "signal-notes",
    title: "Signal Notes",
    slug: "signal-notes",
    excerpt: "A live writing blob for interface notes, product signals, and fragments worth resurfacing later.",
    category: "Writing system",
    status: "live",
    coverTone: "aurora",
    tags: ["notes", "signal", "editorial"],
    createdAt: "2026-05-20T09:20:00.000Z",
    updatedAt: "2026-05-27T18:40:00.000Z",
    contentHtml: `
      <h2>Signal Notes</h2>
      <p>This blob is for short field notes that do not deserve a full blog post but still shape the way the site thinks.</p>
      <blockquote>
        <p>Good portfolio writing should feel like a sharp operating system, not a pile of disconnected captions.</p>
      </blockquote>
      <ul>
        <li>Keep the voice direct and present tense.</li>
        <li>Capture links, references, and embeds next to the note itself.</li>
        <li>Let the site show when the system was last touched.</li>
      </ul>
    `.trim(),
    links: [
      {
        id: "signal-site",
        label: "Portfolio home",
        url: "https://abhinavmishra.in",
        kind: "launch",
      },
    ],
    embeds: [],
  },
  {
    id: "build-log-decipath",
    title: "Decipath Build Log",
    slug: "decipath-build-log",
    excerpt: "A denser product log with milestones, repo links, and embedded references for one active build.",
    category: "Project log",
    status: "pinned",
    coverTone: "ocean",
    tags: ["decipath", "roadmaps", "product"],
    createdAt: "2026-05-18T12:10:00.000Z",
    updatedAt: "2026-05-28T04:45:00.000Z",
    contentHtml: `
      <h2>Decipath Build Log</h2>
      <p>Decipath keeps getting better when the product notes, launch links, and execution details live in one place.</p>
      <h3>What belongs in this blob</h3>
      <ol>
        <li>Product changes worth surfacing publicly.</li>
        <li>References that should remain attached to the project itself.</li>
        <li>Media that makes the write-up feel alive instead of archival.</li>
      </ol>
      <p><strong>Last pass:</strong> tuning roadmap clarity, polishing execution views, and tightening the product language.</p>
    `.trim(),
    links: [
      {
        id: "deci-live",
        label: "Open Decipath",
        url: "https://decipath.abhinavmishra.in",
        kind: "launch",
      },
      {
        id: "deci-source",
        label: "Source",
        url: "https://github.com/AbhinavMishra32/DecipathAI",
        kind: "source",
      },
    ],
    embeds: [
      {
        id: "deci-demo",
        label: "Walkthrough",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        caption: "Drop a launch video or walkthrough straight into the blob deck.",
      },
    ],
  },
  {
    id: "research-thread",
    title: "Research Thread",
    slug: "research-thread",
    excerpt: "A scratch-to-ship thread for collecting links, experiments, and future system directions without leaving the site.",
    category: "Research",
    status: "draft",
    coverTone: "ember",
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
        <li data-type="taskItem" data-checked="false"><p>Decide whether it becomes a blob, a page, or a full post.</p></li>
      </ul>
    `.trim(),
    links: [
      {
        id: "research-openai",
        label: "OpenAI",
        url: "https://openai.com",
        kind: "reference",
      },
    ],
    embeds: [],
  },
];

export function getBlobStudioSnapshot(blobs: BlobRecord[]) {
  const latestUpdatedAt = blobs.reduce((latest, blob) => {
    return new Date(blob.updatedAt).getTime() > new Date(latest).getTime() ? blob.updatedAt : latest;
  }, blobs[0]?.updatedAt ?? new Date().toISOString());

  return {
    total: blobs.length,
    live: blobs.filter((blob) => blob.status === "live").length,
    pinned: blobs.filter((blob) => blob.status === "pinned").length,
    embeds: blobs.reduce((sum, blob) => sum + blob.embeds.length, 0),
    links: blobs.reduce((sum, blob) => sum + blob.links.length, 0),
    latestUpdatedAt,
  };
}

