import { cache } from "react";
import { getAllPosts, type BlogPostMeta } from "@/lib/blog";
import { getRepoDetail, type RepoDetail } from "@/lib/github";
import { PROJECTS, type Project } from "@/lib/portfolio";

export const ACTIVITY_TIME_ZONE = "Asia/Kolkata";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "AbhinavMishra32";
const GITHUB_EVENTS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`;
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const GITHUB_COMMIT_SEARCH_URL = "https://api.github.com/search/commits";
const GITHUB_ACTIVITY_REVALIDATE_SECONDS = 900;

export type ActivityContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ActivityContributionDay = {
  date: string;
  weekday: number;
  contributionCount: number;
  contributionLevel: ActivityContributionLevel;
  color?: string;
};

export type ActivityContributionWeek = {
  firstDay: string;
  contributionDays: ActivityContributionDay[];
};

export type ActivityContributionMonth = {
  firstDay: string;
  name: string;
  totalWeeks: number;
  year: number;
};

export type ActivityContributionCalendar = {
  source: "github-graphql" | "github-profile" | "activity-feed";
  startedAt: string;
  endedAt: string;
  totalContributions: number;
  weeks: ActivityContributionWeek[];
  months: ActivityContributionMonth[];
};

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
  source: "github-event" | "github-search" | "project-cache";
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
  calendar: ActivityContributionCalendar;
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

type GitHubContributionCalendarPayload = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: {
            firstDay: string;
            contributionDays: {
              color: string;
              contributionCount: number;
              contributionLevel: string;
              date: string;
              weekday: number;
            }[];
          }[];
          months: ActivityContributionMonth[];
        };
      };
    };
  };
  errors?: unknown;
};

type GitHubCommitSearchPayload = {
  total_count?: number;
  items?: {
    sha?: string;
    html_url?: string;
    repository?: {
      full_name?: string;
    };
    commit?: {
      message?: string;
      author?: {
        date?: string;
      };
      committer?: {
        date?: string;
      };
    };
  }[];
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

function getLocalYear(value: string | Date) {
  return getLocalDateKey(value).slice(0, 4);
}

function getGitHubToken() {
  return process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
}

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addUtcDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

function startOfSundayWeek(date: Date) {
  const weekStart = startOfUtcDay(date);
  weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay());
  return weekStart;
}

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getCalendarRange(generatedAt: string) {
  const year = Number(getLocalYear(generatedAt));
  const startDay = new Date(Date.UTC(year, 0, 1));
  const endDay = new Date(Date.UTC(year, 11, 31));
  const endOfDay = new Date(Date.UTC(year, 11, 31, 23, 59, 59));

  return {
    year,
    startDay,
    endDay,
    startedAt: startDay.toISOString(),
    endedAt: endOfDay.toISOString(),
  };
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
  const token = getGitHubToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function decodeHtml(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function getContributionLevel(level: string, count: number): ActivityContributionLevel {
  if (level === "FIRST_QUARTILE") return 1;
  if (level === "SECOND_QUARTILE") return 2;
  if (level === "THIRD_QUARTILE") return 3;
  if (level === "FOURTH_QUARTILE") return 4;
  return count > 0 ? 1 : 0;
}

function getFallbackContributionLevel(count: number, maxCount: number): ActivityContributionLevel {
  if (count <= 0) return 0;
  if (maxCount <= 1) return 1;

  const ratio = count / maxCount;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function buildCalendarMonths(weeks: ActivityContributionWeek[]): ActivityContributionMonth[] {
  const monthStarts: ActivityContributionMonth[] = [];

  weeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
      if (!day.date.endsWith("-01")) return;

      const date = new Date(`${day.date}T12:00:00.000Z`);
      monthStarts.push({
        firstDay: day.date,
        name: new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" }).format(date),
        totalWeeks: 1,
        year: date.getUTCFullYear(),
      });
    });
  });

  return monthStarts;
}

function buildCalendarFromDays({
  days,
  generatedAt,
  source,
  totalContributions,
}: {
  days: ActivityContributionDay[];
  generatedAt: string;
  source: ActivityContributionCalendar["source"];
  totalContributions?: number;
}): ActivityContributionCalendar {
  const range = getCalendarRange(generatedAt);
  const weeksByFirstDay = new Map<string, ActivityContributionDay[]>();

  days
    .filter((day) => day.date >= `${range.year}-01-01` && day.date <= `${range.year}-12-31`)
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((day) => {
      const weekKey = getDateKey(startOfSundayWeek(new Date(`${day.date}T12:00:00.000Z`)));
      const weekDays = weeksByFirstDay.get(weekKey) ?? [];
      weekDays.push(day);
      weeksByFirstDay.set(weekKey, weekDays);
    });

  const weeks = Array.from(weeksByFirstDay.entries()).map(([firstDay, contributionDays]) => ({
    firstDay,
    contributionDays: contributionDays.sort((a, b) => a.weekday - b.weekday),
  }));

  return {
    source,
    startedAt: range.startedAt,
    endedAt: range.endedAt,
    totalContributions: totalContributions ?? days.reduce((sum, day) => sum + day.contributionCount, 0),
    weeks,
    months: buildCalendarMonths(weeks),
  };
}

function parseContributionCount(text: string) {
  if (/no contributions/i.test(text)) return 0;

  const match = text.match(/([\d,]+)\s+contributions?/i);
  return match ? Number(match[1].replace(/,/g, "")) : 0;
}

async function getGitHubContributionCalendar({
  generatedAt,
  realtime = false,
}: {
  generatedAt: string;
  realtime?: boolean;
}): Promise<ActivityContributionCalendar | null> {
  const token = getGitHubToken();
  if (!token) return null;

  const range = getCalendarRange(generatedAt);
  const query = `
    query ContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              firstDay
              contributionDays {
                color
                contributionCount
                contributionLevel
                date
                weekday
              }
            }
            months {
              firstDay
              name
              totalWeeks
              year
            }
          }
        }
      }
    }
  `;
  const requestOptions: RequestInit & { next?: { revalidate: number } } = {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "aboutv3-activity-feed",
    },
    body: JSON.stringify({
      query,
      variables: {
        login: GITHUB_USERNAME,
        from: range.startedAt,
        to: range.endedAt,
      },
    }),
  };

  if (realtime) {
    requestOptions.cache = "no-store";
  } else {
    requestOptions.next = {
      revalidate: GITHUB_ACTIVITY_REVALIDATE_SECONDS,
    };
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, requestOptions);
    if (!response.ok) return null;

    const payload = (await response.json()) as GitHubContributionCalendarPayload;
    if (payload.errors) return null;

    const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return null;

    return {
      source: "github-graphql",
      startedAt: range.startedAt,
      endedAt: range.endedAt,
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks.map((week) => ({
        firstDay: week.firstDay,
        contributionDays: week.contributionDays.map((day) => ({
          date: day.date,
          weekday: day.weekday,
          contributionCount: day.contributionCount,
          contributionLevel: getContributionLevel(day.contributionLevel, day.contributionCount),
          color: day.color,
        })),
      })),
      months: calendar.months,
    };
  } catch {
    return null;
  }
}

async function getGitHubProfileContributionCalendar({
  generatedAt,
  realtime = false,
}: {
  generatedAt: string;
  realtime?: boolean;
}): Promise<ActivityContributionCalendar | null> {
  const range = getCalendarRange(generatedAt);
  const url = `https://github.com/users/${GITHUB_USERNAME}/contributions?from=${range.year}-01-01&to=${range.year}-12-31`;
  const requestOptions: RequestInit & { next?: { revalidate: number } } = {
    headers: {
      Accept: "text/html",
      "User-Agent": "aboutv3-activity-feed",
    },
  };

  if (realtime) {
    requestOptions.cache = "no-store";
  } else {
    requestOptions.next = {
      revalidate: GITHUB_ACTIVITY_REVALIDATE_SECONDS,
    };
  }

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) return null;

    const html = await response.text();
    const totalMatch = html.match(/<h2[^>]*>\s*([\d,]+)\s+contributions/i);
    const totalContributions = totalMatch ? Number(totalMatch[1].replace(/,/g, "")) : undefined;
    const cells = html.matchAll(
      /(<td[^>]*ContributionCalendar-day[^>]*><\/td>)\s*<tool-tip[^>]*>([^<]*)<\/tool-tip>/g
    );
    const days = Array.from(cells)
      .map((match) => {
        const cell = match[1];
        const date = cell.match(/data-date="([^"]+)"/)?.[1];
        const level = Number(cell.match(/data-level="(\d+)"/)?.[1] ?? 0);
        if (!date) return null;

        return {
          date,
          weekday: new Date(`${date}T12:00:00.000Z`).getUTCDay(),
          contributionCount: parseContributionCount(decodeHtml(match[2])),
          contributionLevel: Math.min(4, Math.max(0, level)) as ActivityContributionLevel,
        };
      })
      .filter(isPresent);

    if (days.length === 0) return null;

    return buildCalendarFromDays({
      days,
      generatedAt,
      source: "github-profile",
      totalContributions,
    });
  } catch {
    return null;
  }
}

function buildFallbackContributionCalendar(commits: ActivityCommit[], generatedAt: string): ActivityContributionCalendar {
  const range = getCalendarRange(generatedAt);
  const countByDate = new Map<string, number>();

  commits.forEach((commit) => {
    const dateKey = getLocalDateKey(commit.date);
    countByDate.set(dateKey, (countByDate.get(dateKey) ?? 0) + 1);
  });

  const maxCount = Math.max(1, ...countByDate.values());
  const days: ActivityContributionDay[] = [];
  let cursor = new Date(range.startDay);

  while (cursor <= range.endDay) {
    const dateKey = getDateKey(cursor);
    const contributionCount = countByDate.get(dateKey) ?? 0;

    days.push({
      date: dateKey,
      weekday: cursor.getUTCDay(),
      contributionCount,
      contributionLevel: getFallbackContributionLevel(contributionCount, maxCount),
    });

    cursor = addUtcDays(cursor, 1);
  }

  return buildCalendarFromDays({
    days,
    generatedAt,
    source: "activity-feed",
    totalContributions: commits.length,
  });
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

function commitFromSearchItem(item: NonNullable<GitHubCommitSearchPayload["items"]>[number], index: number): ActivityCommit | null {
  const sha = item.sha;
  const repo = item.repository?.full_name;
  const message = item.commit?.message;
  const date = item.commit?.committer?.date ?? item.commit?.author?.date;
  const url = item.html_url;

  if (!sha || !repo || !message || !date || !url) return null;

  const { repoOwner, repoName } = splitRepo(repo);

  return attachProjectName({
    id: `search-${repo}-${sha}-${index}`,
    repo,
    repoName,
    repoOwner,
    repoUrl: `https://github.com/${repo}`,
    sha,
    message: cleanCommitMessage(message),
    date,
    url,
    source: "github-search",
  });
}

async function getGitHubSearchCommits({ generatedAt, realtime = false }: { generatedAt: string; realtime?: boolean }) {
  const token = getGitHubToken();
  const range = getCalendarRange(generatedAt);
  const todayKey = getLocalDateKey(generatedAt);
  const maxPages = token ? 5 : 2;
  const commits: ActivityCommit[] = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const url = new URL(GITHUB_COMMIT_SEARCH_URL);
    url.searchParams.set("q", `author:${GITHUB_USERNAME} committer-date:${range.year}-01-01..${todayKey}`);
    url.searchParams.set("sort", "committer-date");
    url.searchParams.set("order", "desc");
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));

    try {
      const response = await fetch(url, {
        headers: getGitHubHeaders(),
        ...(realtime
          ? { cache: "no-store" as const }
          : {
              next: {
                revalidate: GITHUB_ACTIVITY_REVALIDATE_SECONDS,
              },
            }),
      });

      if (!response.ok) break;

      const payload = (await response.json()) as GitHubCommitSearchPayload;
      const items = payload.items ?? [];
      commits.push(...items.map(commitFromSearchItem).filter(isPresent));

      if (items.length < 100) break;
    } catch {
      break;
    }
  }

  return commits;
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
  const [{ projects: cachedProjects, projectCommits }, searchCommits, publicCommits, profileCalendar, posts] = await Promise.all([
    getProjectPulses(),
    getGitHubSearchCommits({ generatedAt, realtime }),
    getPublicGitHubCommits({ realtime }),
    getGitHubProfileContributionCalendar({ generatedAt, realtime }),
    getAllPosts(),
  ]);

  const projects = mergeLiveProjectPulses(cachedProjects, publicCommits);
  const commits = sortCommits(dedupeCommits([...searchCommits, ...publicCommits, ...projectCommits])).slice(0, 240);
  const calendar =
    (await getGitHubContributionCalendar({ generatedAt, realtime })) ??
    profileCalendar ??
    buildFallbackContributionCalendar(commits, generatedAt);
  const todayKey = getLocalDateKey(generatedAt);
  const todayCommits = commits.filter((commit) => getLocalDateKey(commit.date) === todayKey);
  const tickerCommits = (todayCommits.length > 0 ? todayCommits : commits).slice(0, 16);

  return {
    generatedAt,
    timeZone: ACTIVITY_TIME_ZONE,
    calendar,
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
