type RepoRef = {
  owner: string;
  name: string;
  branch?: string;
};

export type RepoSummary = {
  slug: string;
  owner: string;
  name: string;
  totalCommits: number;
  stars: number;
  forks: number;
  pushedAt: string;
};

export type RepoCommit = {
  sha: string;
  message: string;
  date: string;
  url: string;
};

export type RepoCalendarDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type RepoCalendarWeek = {
  label: string;
  days: RepoCalendarDay[];
};

export type RepoDetail = RepoSummary & {
  activeDays: number;
  defaultBranch: string;
  createdAt: string;
  firstCommitAt: string;
  commitSpanDays: number;
  languages: Array<{
    name: string;
    share: number;
  }>;
  calendar: RepoCalendarWeek[];
  recentCommits: RepoCommit[];
  allCommits: RepoCommit[];
};

type GithubRepoResponse = {
  stargazers_count: number;
  forks_count: number;
  default_branch: string;
  pushed_at: string;
  created_at: string;
};

type GithubCommitResponse = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
};

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_REVALIDATE_SECONDS = 60 * 60;

function getGithubHeaders() {
  const token = process.env.GITHUB_TOKEN;

  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "aboutv3-portfolio",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function githubFetch(path: string) {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: getGithubHeaders(),
    next: { revalidate: GITHUB_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status} ${response.statusText}`);
  }

  return response;
}

function getCommitTitle(message: string) {
  return message.split("\n")[0].trim();
}

function parseLastPage(linkHeader: string | null) {
  if (!linkHeader) return null;

  const lastMatch = linkHeader.match(/&page=(\d+)>; rel="last"/);

  if (!lastMatch) return null;

  return Number(lastMatch[1]);
}

async function fetchRepoInfo(repo: RepoRef) {
  const response = await githubFetch(`/repos/${repo.owner}/${repo.name}`);
  return (await response.json()) as GithubRepoResponse;
}

async function fetchRepoLanguages(repo: RepoRef) {
  const response = await githubFetch(`/repos/${repo.owner}/${repo.name}/languages`);
  const languages = (await response.json()) as Record<string, number>;
  const total = Object.values(languages).reduce((sum, value) => sum + value, 0);

  return Object.entries(languages)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
    .map(([name, bytes]) => ({
      name,
      share: total > 0 ? Math.round((bytes / total) * 100) : 0,
    }));
}

async function fetchTotalCommitCount(repo: RepoRef, branch: string) {
  const response = await githubFetch(`/repos/${repo.owner}/${repo.name}/commits?sha=${branch}&per_page=1`);
  const linkHeader = response.headers.get("link");
  const commits = (await response.json()) as GithubCommitResponse[];
  const lastPage = parseLastPage(linkHeader);

  return lastPage ?? commits.length;
}

async function fetchAllCommits(repo: RepoRef, branch: string) {
  const commits: RepoCommit[] = [];

  for (let page = 1; page <= 10; page += 1) {
    const response = await githubFetch(
      `/repos/${repo.owner}/${repo.name}/commits?sha=${branch}&per_page=100&page=${page}`
    );
    const pageCommits = (await response.json()) as GithubCommitResponse[];

    commits.push(
      ...pageCommits.map((commit) => ({
        sha: commit.sha,
        message: getCommitTitle(commit.commit.message),
        date: commit.commit.author.date,
        url: commit.html_url,
      }))
    );

    if (pageCommits.length < 100) {
      break;
    }
  }

  return commits;
}

function getUtcDateKey(date: string) {
  return date.slice(0, 10);
}

function differenceInDays(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  return Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / millisecondsPerDay));
}

function buildCommitCalendar(commits: RepoCommit[], weeks = 18): RepoCalendarWeek[] {
  if (commits.length === 0) {
    return [];
  }

  const latestCommitDate = new Date(commits[0].date);
  const end = new Date(
    Date.UTC(
      latestCommitDate.getUTCFullYear(),
      latestCommitDate.getUTCMonth(),
      latestCommitDate.getUTCDate()
    )
  );

  end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));

  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - weeks * 7 + 1);

  const counts = new Map<string, number>();

  for (const commit of commits) {
    const key = getUtcDateKey(commit.date);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const maxCount = Math.max(...counts.values(), 1);
  const weeksGrid: RepoCalendarWeek[] = [];

  for (let weekIndex = 0; weekIndex < weeks; weekIndex += 1) {
    const weekDays: RepoCalendarDay[] = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const cellDate = new Date(start);
      cellDate.setUTCDate(start.getUTCDate() + weekIndex * 7 + dayIndex);
      const label = cellDate.toISOString().slice(0, 10);
      const count = counts.get(label) ?? 0;
      const level = count === 0 ? 0 : (Math.min(4, Math.ceil((count / maxCount) * 4)) as 1 | 2 | 3 | 4);

      weekDays.push({
        date: label,
        count,
        level,
      });
    }

    weeksGrid.push({
      label: weekDays[0]?.date ?? `week-${weekIndex + 1}`,
      days: weekDays,
    });
  }

  return weeksGrid;
}

export async function getRepoSummary(slug: string, repo: RepoRef): Promise<RepoSummary> {
  const info = await fetchRepoInfo(repo);
  const branch = repo.branch ?? info.default_branch;
  const totalCommits = await fetchTotalCommitCount(repo, branch);

  return {
    slug,
    owner: repo.owner,
    name: repo.name,
    totalCommits,
    stars: info.stargazers_count,
    forks: info.forks_count,
    pushedAt: info.pushed_at,
  };
}

export async function getRepoDetail(slug: string, repo: RepoRef): Promise<RepoDetail> {
  const info = await fetchRepoInfo(repo);
  const branch = repo.branch ?? info.default_branch;
  const [languages, allCommits] = await Promise.all([fetchRepoLanguages(repo), fetchAllCommits(repo, branch)]);

  const firstCommitAt = allCommits[allCommits.length - 1]?.date ?? info.created_at;
  const latestCommitAt = allCommits[0]?.date ?? info.pushed_at;
  const activeDays = new Set(allCommits.map((commit) => getUtcDateKey(commit.date))).size;
  const calendar = buildCommitCalendar(allCommits);

  return {
    slug,
    owner: repo.owner,
    name: repo.name,
    totalCommits: allCommits.length,
    stars: info.stargazers_count,
    forks: info.forks_count,
    pushedAt: info.pushed_at,
    activeDays,
    defaultBranch: branch,
    createdAt: info.created_at,
    firstCommitAt,
    commitSpanDays: differenceInDays(firstCommitAt, latestCommitAt),
    languages,
    calendar,
    recentCommits: allCommits.slice(0, 12),
    allCommits,
  };
}
