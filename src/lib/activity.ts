import { cache } from "react";
import { getAllPosts, type BlogPostMeta } from "@/lib/blog";
import { getRepoDetail, type RepoDetail } from "@/lib/github";
import { PROJECTS, type Project } from "@/lib/portfolio";

export const ACTIVITY_TIME_ZONE = "Asia/Kolkata";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "AbhinavMishra32";
const GITHUB_EVENTS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`;
const GITHUB_ACTIVITY_REVALIDATE_SECONDS = 900;

export type ActivityCommit = {
  id: string;
  repo: string;
  repoName: string;
  repoOwner: string;
  repoUrl: string;
  branch?: string;
  sha: string;
  message: string;
  date: string;
  url: string;
  project?: string;
  source: "github-event" | "project-cache";
};

export type ActivityProjectPulse = {
  slug: string;
  name: string;
  focus: string;
  status: string;
  summary: string;
  href: string;
  repoUrl?: string;
  tags: string[];
  totalCommits?: number;
  updatedAt?: string;
  latestCommit?: ActivityCommit;
};

export type ActivityFocusSignal = {
  label: string;
  title: string;
  detail: string;
};

export type ActivityFeedItem = {
  id: string;
  kind: "commit" | "post" | "project";
  eyebrow: string;
  title: string;
  summary: string;
  meta: string;
  date: string;
  href: string;
  external: boolean;
};

export type ActivitySnapshot = {
  generatedAt: string;
  timeZone: typeof ACTIVITY_TIME_ZONE;
  commits: ActivityCommit[];
  todayCommits: ActivityCommit[];
  tickerCommits: ActivityCommit[];
  posts: BlogPostMeta[];
  projects: ActivityProjectPulse[];
  focusSignals: ActivityFocusSignal[];
  feed: ActivityFeedItem[];
  metrics: {
    todayCommits: number;
    recentRepos: number;
    activeProjects: number;
    posts: number;
  };
};

type GitHubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
  };
  payload?: unknown;
};

const FOCUS_SIGNALS: ActivityFocusSignal[] = [
  {
    label: "Building",
    title: "A public work feed for this site.",
    detail: "Commits, project movement, writing, and current work all flowing into one place.",
  },
  {
    label: "Learning",
    title: "Reliable product infrastructure.",
    detail: "Rollout safety, CI foundations, domain automation, queues, and AI workflow systems.",
  },
  {
    label: "Opening up",
    title: "More visible OSS work.",
    detail: "Public repo activity becomes part of the story as the work moves into open source.",
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown> | undefined, key: string): string | undefined {
  const value = record?.[key];
  return typeof value === "string" ? value : undefined;
}

function isGitHubEvent(value: unknown): value is GitHubEvent {
  if (!isRecord(value) || !isRecord(value.repo)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.type === "string" &&
    typeof value.created_at === "string" &&
    typeof value.repo.name === "string"
  );
}

function isPresent<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

function cleanCommitMessage(message: string) {
  return message.split("\n")[0]?.trim() || "Commit update";
}

function branchFromRef(ref?: string) {
  if (!ref) return undefined;
  return ref.startsWith("refs/heads/") ? ref.replace("refs/heads/", "") : ref;
}

function splitRepo(repo: string) {
  const [repoOwner = "", repoName = repo] = repo.split("/");
  return { repoOwner, repoName };
}

function getLocalDateKey(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ACTIVITY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "00";
  const day = parts.find((part) => part.type === "day")?.value ?? "00";

  return `${year}-${month}-${day}`;
}

function sortCommits(commits: ActivityCommit[]) {
  return [...commits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function sortFeed(items: ActivityFeedItem[]) {
  return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function dedupeCommits(commits: ActivityCommit[]) {
  const seen = new Set<string>();
  const unique: ActivityCommit[] = [];

  for (const commit of commits) {
    const key = `${commit.repo.toLowerCase()}:${commit.sha}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(commit);
  }

  return unique;
}

function getGitHubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2026-03-10",
    "User-Agent": "aboutv3-activity-feed",
  };
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function commitsFromEvent(event: GitHubEvent): ActivityCommit[] {
  if (event.type !== "PushEvent") return [];

  const payload = isRecord(event.payload) ? event.payload : undefined;
  const rawCommits = payload && Array.isArray(payload.commits) ? payload.commits : [];
  const branch = branchFromRef(readString(payload, "ref"));
  const { repoOwner, repoName } = splitRepo(event.repo.name);

  return rawCommits
    .map((rawCommit, index) => {
      const commit = isRecord(rawCommit) ? rawCommit : undefined;
      const sha = readString(commit, "sha");
      const message = readString(commit, "message");

      if (!sha || !message) return null;

      return {
        id: `event-${event.id}-${sha}-${index}`,
        repo: event.repo.name,
        repoName,
        repoOwner,
        repoUrl: `https://github.com/${event.repo.name}`,
        branch,
        sha,
        message: cleanCommitMessage(message),
        date: event.created_at,
        url: `https://github.com/${event.repo.name}/commit/${sha}`,
        source: "github-event" as const,
      };
    })
    .filter(isPresent);
}

function getTrackedProjectForCommit(commit: ActivityCommit) {
  return PROJECTS.find((project) => {
    if (!project.repo) return false;

    return (
      project.repo.owner.toLowerCase() === commit.repoOwner.toLowerCase() &&
      project.repo.name.toLowerCase() === commit.repoName.toLowerCase()
    );
  });
}

function attachProjectName(commit: ActivityCommit): ActivityCommit {
  const project = getTrackedProjectForCommit(commit);
  return project ? { ...commit, project: project.name } : commit;
}

async function getPublicGitHubCommits({ realtime = false }: { realtime?: boolean } = {}) {
  try {
    const response = await fetch(GITHUB_EVENTS_URL, {
      headers: getGitHubHeaders(),
      ...(realtime
        ? { cache: "no-store" as const }
        : {
            next: {
              revalidate: GITHUB_ACTIVITY_REVALIDATE_SECONDS,
            },
          }),
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as unknown;
    if (!Array.isArray(payload)) return [];

    return payload.filter(isGitHubEvent).flatMap(commitsFromEvent).map(attachProjectName);
  } catch {
    return [];
  }
}

function projectCommitFromDetail(project: Project, detail: RepoDetail, commit: RepoDetail["recentCommits"][number]): ActivityCommit {
  const repo = project.repo;
  const repoName = repo ? repo.name : project.slug;
  const repoOwner = repo ? repo.owner : GITHUB_USERNAME;
  const fullRepo = `${repoOwner}/${repoName}`;

  return {
    id: `project-${project.slug}-${commit.sha}`,
    repo: fullRepo,
    repoName,
    repoOwner,
    repoUrl: `https://github.com/${fullRepo}`,
    branch: detail.defaultBranch,
    sha: commit.sha,
    message: cleanCommitMessage(commit.message),
    date: commit.date,
    url: commit.url,
    project: project.name,
    source: "project-cache",
  };
}

function getProjectStatus(project: Project) {
  if (project.slug === "construct") return "0.1 in progress";
  if (project.live) return "Live";
  if (project.repoNote) return "Team sprint";
  return project.buildTags[1] ?? project.buildTags[0] ?? "Active";
}

async function getProjectPulses() {
  const entries = await Promise.all(
    PROJECTS.map(async (project) => {
      if (!project.repo) {
        return { project, detail: null };
      }

      try {
        return { project, detail: await getRepoDetail(project.slug, project.repo) };
      } catch {
        return { project, detail: null };
      }
    })
  );

  const projects = entries.map(({ project, detail }) => {
    const latestCommit = detail?.recentCommits[0]
      ? projectCommitFromDetail(project, detail, detail.recentCommits[0])
      : undefined;

    return {
      slug: project.slug,
      name: project.name,
      focus: project.focus,
      status: getProjectStatus(project),
      summary: project.summary,
      href: project.live ?? project.source ?? "/projects",
      repoUrl: project.source,
      tags: project.buildTags.slice(0, 2),
      totalCommits: detail?.totalCommits,
      updatedAt: detail?.pushedAt,
      latestCommit,
    } satisfies ActivityProjectPulse;
  });

  const projectCommits = entries.flatMap(({ project, detail }) =>
    detail ? detail.recentCommits.slice(0, 4).map((commit) => projectCommitFromDetail(project, detail, commit)) : []
  );

  return {
    projects,
    projectCommits,
  };
}

function mergeLiveProjectPulses(projects: ActivityProjectPulse[], commits: ActivityCommit[]) {
  const latestByProject = new Map<string, ActivityCommit>();

  for (const commit of commits) {
    const project = getTrackedProjectForCommit(commit);
    if (!project) continue;

    const current = latestByProject.get(project.slug);
    if (!current || new Date(commit.date).getTime() > new Date(current.date).getTime()) {
      latestByProject.set(project.slug, { ...commit, project: project.name });
    }
  }

  return projects.map((project) => {
    const liveCommit = latestByProject.get(project.slug);
    if (!liveCommit) return project;

    const currentUpdatedAt = project.updatedAt ? new Date(project.updatedAt).getTime() : 0;
    if (new Date(liveCommit.date).getTime() <= currentUpdatedAt) return project;

    return {
      ...project,
      updatedAt: liveCommit.date,
      latestCommit: liveCommit,
    };
  });
}

function buildFeed(commits: ActivityCommit[], posts: BlogPostMeta[], projects: ActivityProjectPulse[]) {
  const commitItems: ActivityFeedItem[] = commits.slice(0, 8).map((commit) => ({
    id: `commit-${commit.repo}-${commit.sha}`,
    kind: "commit",
    eyebrow: commit.repoName,
    title: commit.message,
    summary: commit.project ? `${commit.project} on ${commit.branch ?? "main"}` : `${commit.repoOwner}/${commit.repoName}`,
    meta: commit.sha.slice(0, 7),
    date: commit.date,
    href: commit.url,
    external: true,
  }));

  const postItems: ActivityFeedItem[] = posts.slice(0, 3).map((post) => ({
    id: `post-${post.slug}`,
    kind: "post",
    eyebrow: "Writing",
    title: post.title,
    summary: post.summary,
    meta: post.tags.slice(0, 2).join(" / ") || "Blog",
    date: post.date,
    href: `/blog/${post.slug}`,
    external: false,
  }));

  const projectItems: ActivityFeedItem[] = projects
    .filter((project) => project.updatedAt)
    .slice(0, 4)
    .map((project) => ({
      id: `project-${project.slug}`,
      kind: "project",
      eyebrow: project.status,
      title: project.name,
      summary: project.latestCommit?.message ?? project.summary,
      meta: project.totalCommits ? `${project.totalCommits.toLocaleString("en-US")} commits` : project.focus,
      date: project.updatedAt ?? new Date(0).toISOString(),
      href: project.href,
      external: project.href.startsWith("http"),
    }));

  return sortFeed([...commitItems, ...postItems, ...projectItems]).slice(0, 12);
}

async function buildActivitySnapshot({ realtime = false }: { realtime?: boolean } = {}): Promise<ActivitySnapshot> {
  const generatedAt = new Date().toISOString();
  const [{ projects: cachedProjects, projectCommits }, publicCommits, posts] = await Promise.all([
    getProjectPulses(),
    getPublicGitHubCommits({ realtime }),
    getAllPosts(),
  ]);

  const projects = mergeLiveProjectPulses(cachedProjects, publicCommits);
  const commits = sortCommits(dedupeCommits([...publicCommits, ...projectCommits])).slice(0, 24);
  const todayKey = getLocalDateKey(generatedAt);
  const todayCommits = commits.filter((commit) => getLocalDateKey(commit.date) === todayKey);
  const tickerCommits = (todayCommits.length > 0 ? todayCommits : commits).slice(0, 10);

  return {
    generatedAt,
    timeZone: ACTIVITY_TIME_ZONE,
    commits,
    todayCommits,
    tickerCommits,
    posts,
    projects,
    focusSignals: FOCUS_SIGNALS,
    feed: buildFeed(commits, posts, projects),
    metrics: {
      todayCommits: todayCommits.length,
      recentRepos: new Set(commits.map((commit) => commit.repo)).size,
      activeProjects: projects.length,
      posts: posts.length,
    },
  };
}

export const getActivitySnapshot = cache(async function getActivitySnapshot(): Promise<ActivitySnapshot> {
  return buildActivitySnapshot();
});

export async function getRealtimeActivitySnapshot(): Promise<ActivitySnapshot> {
  return buildActivitySnapshot({ realtime: true });
}
