import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const cacheDir = join(rootDir, ".cache", "project-repos");
const outputDir = join(rootDir, "src", "generated");
const outputFile = join(outputDir, "project-repo-data.json");

const REPOS = [
  {
    slug: "decipath-ai",
    owner: "AbhinavMishra32",
    name: "DecipathAI",
    branch: "main",
  },
  {
    slug: "construct",
    owner: "AbhinavMishra32",
    name: "Construct-IDE",
    branch: "main",
  },
  {
    slug: "xitecoin",
    owner: "AbhinavMishra32",
    name: "xitecoin",
    branch: "main",
  },
];

function runGit(args, cwd) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function ensureRepo(repo) {
  const repoDir = join(cacheDir, repo.slug);
  const remoteUrl = `https://github.com/${repo.owner}/${repo.name}.git`;

  if (!existsSync(join(repoDir, ".git"))) {
    runGit(["clone", "--quiet", "--branch", repo.branch, "--single-branch", "--depth", "1000", remoteUrl, repoDir], rootDir);
  } else {
    runGit(["-C", repoDir, "fetch", "--quiet", "origin", repo.branch, "--depth", "1000"], rootDir);
    runGit(["-C", repoDir, "checkout", "--quiet", repo.branch], rootDir);
    runGit(["-C", repoDir, "pull", "--quiet", "--ff-only", "origin", repo.branch], rootDir);
  }

  return repoDir;
}

function getUtcDateKey(date) {
  return date.slice(0, 10);
}

function differenceInDays(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  return Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / millisecondsPerDay));
}

function buildCommitCalendar(commits, weeks = 18) {
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

  const counts = new Map();

  for (const commit of commits) {
    const key = getUtcDateKey(commit.date);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const maxCount = Math.max(...counts.values(), 1);
  const weeksGrid = [];

  for (let weekIndex = 0; weekIndex < weeks; weekIndex += 1) {
    const weekDays = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const cellDate = new Date(start);
      cellDate.setUTCDate(start.getUTCDate() + weekIndex * 7 + dayIndex);
      const label = cellDate.toISOString().slice(0, 10);
      const count = counts.get(label) ?? 0;
      const level = count === 0 ? 0 : Math.min(4, Math.ceil((count / maxCount) * 4));

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

function readRepoDetail(repo, repoDir) {
  const logOutput = runGit(["-C", repoDir, "log", "--date=iso-strict", "--pretty=format:%H%x09%aI%x09%s", repo.branch], rootDir);
  const commits = logOutput
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [sha, date, ...messageParts] = line.split("\t");
      const message = messageParts.join("\t").trim();

      return {
        sha,
        date,
        message,
        url: `https://github.com/${repo.owner}/${repo.name}/commit/${sha}`,
      };
    });

  const firstCommitAt = commits[commits.length - 1]?.date ?? new Date().toISOString();
  const pushedAt = commits[0]?.date ?? firstCommitAt;
  const activeDays = new Set(commits.map((commit) => getUtcDateKey(commit.date))).size;

  return {
    slug: repo.slug,
    totalCommits: commits.length,
    pushedAt,
    activeDays,
    defaultBranch: repo.branch,
    createdAt: firstCommitAt,
    firstCommitAt,
    commitSpanDays: differenceInDays(firstCommitAt, pushedAt),
    calendar: buildCommitCalendar(commits),
    recentCommits: commits.slice(0, 12),
    allCommits: commits,
  };
}

mkdirSync(cacheDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

const data = {};

for (const repo of REPOS) {
  const repoDir = ensureRepo(repo);
  data[repo.slug] = readRepoDetail(repo, repoDir);
}

writeFileSync(outputFile, `${JSON.stringify(data, null, 2)}\n`);
