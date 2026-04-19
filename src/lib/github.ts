import { cache } from "react";
import repoData from "@/generated/project-repo-data.json";

type RepoRef = {
  owner: string;
  name: string;
  branch?: string;
};

export type RepoSummary = {
  slug: string;
  totalCommits: number;
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
  calendar: RepoCalendarWeek[];
  recentCommits: RepoCommit[];
  allCommits: RepoCommit[];
};

const typedRepoData = repoData as Record<string, RepoDetail>;

export const getRepoSummary = cache(async function getRepoSummary(slug: string, _repo: RepoRef): Promise<RepoSummary> {
  void _repo;
  const detail = typedRepoData[slug];

  if (!detail) {
    throw new Error(`Missing build-time repo summary for ${slug}`);
  }

  return {
    slug: detail.slug,
    totalCommits: detail.totalCommits,
    pushedAt: detail.pushedAt,
  };
});

export const getRepoDetail = cache(async function getRepoDetail(slug: string, _repo: RepoRef): Promise<RepoDetail> {
  void _repo;
  const detail = typedRepoData[slug];

  if (!detail) {
    throw new Error(`Missing build-time repo detail for ${slug}`);
  }

  return detail;
});
