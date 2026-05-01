"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Boxes,
  CalendarDays,
  GitCommitHorizontal,
  Github,
  RadioTower,
  Sparkles,
} from "lucide-react";
import type {
  ActivityCommit,
  ActivityContributionDay,
  ActivityContributionWeek,
  ActivityProjectPulse,
  ActivitySnapshot,
} from "@/lib/activity";

type LiveStatus = "live" | "syncing" | "offline";
type ActivityPost = ActivitySnapshot["posts"][number];
type TooltipStyle = CSSProperties & {
  "--activity-tooltip-x"?: string;
  "--activity-tooltip-y"?: string;
  "--activity-tooltip-shift"?: string;
};
type DayDetail = {
  day: ActivityContributionDay;
  commits: ActivityCommit[];
  posts: ActivityPost[];
  projects: ActivityProjectPulse[];
  repos: string[];
};

const GITHUB_PROFILE_URL = "https://github.com/AbhinavMishra32";
const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function parseDateOnly(dateKey: string) {
  return new Date(`${dateKey}T12:00:00.000Z`);
}

function formatActivityTime(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatActivityStamp(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));
}

function formatCalendarDate(dateKey: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parseDateOnly(dateKey));
}

function formatCalendarMonth(dateKey: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
  }).format(parseDateOnly(dateKey));
}

function formatShortDate(dateKey: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
  }).format(parseDateOnly(dateKey));
}

function getActivityDateKey(value: string | Date, timeZone: string) {
  const date = typeof value === "string" ? new Date(value) : value;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "00";
  const day = parts.find((part) => part.type === "day")?.value ?? "00";

  return `${year}-${month}-${day}`;
}

function getContributionCopy(count: number) {
  return `${count.toLocaleString("en-US")} ${count === 1 ? "contribution" : "contributions"}`;
}

function getCalendarRow(day: ActivityContributionDay) {
  return Math.min(7, Math.max(1, day.weekday + 1));
}

function getLiveStatusLabel(status: LiveStatus) {
  if (status === "syncing") return "Syncing GitHub";
  if (status === "offline") return "Cached GitHub";
  return "Live GitHub";
}

function ActivityLink({
  href,
  external,
  className,
  children,
}: {
  href: string;
  external: boolean;
  className: string;
  children: ReactNode;
}) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function normalizeWeeks(weeks: ActivityContributionWeek[]) {
  return weeks.map((week) => ({
    ...week,
    contributionDays: [...week.contributionDays].sort((a, b) => a.weekday - b.weekday),
  }));
}

function buildMonthMarkers(weeks: ActivityContributionWeek[]) {
  const markers = new Map<number, { id: string; label: string; column: number }>();

  weeks.forEach((week, weekIndex) => {
    week.contributionDays.forEach((day) => {
      if (!day.date.endsWith("-01") || weekIndex >= weeks.length - 1) return;

      markers.set(weekIndex + 1, {
        id: day.date.slice(0, 7),
        label: formatCalendarMonth(day.date),
        column: weekIndex + 1,
      });
    });
  });

  return Array.from(markers.values());
}

function buildDayDetails(snapshot: ActivitySnapshot) {
  const details = new Map<string, Omit<DayDetail, "day" | "repos">>();

  const ensure = (dateKey: string) => {
    const existing = details.get(dateKey);
    if (existing) return existing;

    const nextDetail = {
      commits: [] as ActivityCommit[],
      posts: [] as ActivityPost[],
      projects: [] as ActivityProjectPulse[],
    };
    details.set(dateKey, nextDetail);
    return nextDetail;
  };

  snapshot.commits.forEach((commit) => {
    ensure(getActivityDateKey(commit.date, snapshot.timeZone)).commits.push(commit);
  });

  snapshot.posts.forEach((post) => {
    ensure(getActivityDateKey(post.date, snapshot.timeZone)).posts.push(post);
  });

  snapshot.projects.forEach((project) => {
    if (!project.updatedAt) return;
    ensure(getActivityDateKey(project.updatedAt, snapshot.timeZone)).projects.push(project);
  });

  return details;
}

function getDayDetail(day: ActivityContributionDay, details: Map<string, Omit<DayDetail, "day" | "repos">>): DayDetail {
  const captured = details.get(day.date) ?? {
    commits: [],
    posts: [],
    projects: [],
  };
  const repos = Array.from(new Set(captured.commits.map((commit) => commit.repo))).slice(0, 5);

  return {
    day,
    commits: captured.commits,
    posts: captured.posts,
    projects: captured.projects,
    repos,
  };
}

function ActivityDayTooltip({
  detail,
  style,
  timeZone,
  source,
  onPointerEnter,
  onPointerLeave,
}: {
  detail: DayDetail;
  style: TooltipStyle;
  timeZone: string;
  source: ActivitySnapshot["calendar"]["source"];
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  const visibleCommits = detail.commits.slice(0, 5);
  const visiblePosts = detail.posts.slice(0, 2);
  const visibleProjects = detail.projects.slice(0, 3);
  const hasCapturedDetails = visibleCommits.length > 0 || visiblePosts.length > 0 || visibleProjects.length > 0;

  return (
    <aside
      className="activity-day-tooltip"
      style={style}
      role="tooltip"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div className="activity-day-tooltip-head">
        <span>{formatCalendarDate(detail.day.date)}</span>
        <strong>{getContributionCopy(detail.day.contributionCount)}</strong>
      </div>

      <div className="activity-day-tooltip-meta">
        <span>
          <CalendarDays size={13} aria-hidden="true" />
          {source === "github-graphql" ? "GitHub graph" : "Live public feed"}
        </span>
        {detail.repos.length > 0 ? (
          <span>
            <RadioTower size={13} aria-hidden="true" />
            {detail.repos.length} {detail.repos.length === 1 ? "repo" : "repos"}
          </span>
        ) : null}
      </div>

      {detail.repos.length > 0 ? (
        <div className="activity-day-tooltip-repos">
          {detail.repos.map((repo) => (
            <span key={repo}>{repo}</span>
          ))}
        </div>
      ) : null}

      {visibleCommits.length > 0 ? (
        <div className="activity-day-tooltip-list">
          {visibleCommits.map((commit) => (
            <a key={commit.id} href={commit.url} target="_blank" rel="noreferrer" className="activity-day-tooltip-link">
              <span className="activity-day-tooltip-link-icon" aria-hidden="true">
                <GitCommitHorizontal size={13} />
              </span>
              <span>
                <strong>{commit.message}</strong>
                <span>
                  {commit.repoName} / {commit.sha.slice(0, 7)} / {formatActivityTime(commit.date, timeZone)}
                </span>
              </span>
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          ))}
        </div>
      ) : null}

      {visiblePosts.length > 0 ? (
        <div className="activity-day-tooltip-list">
          {visiblePosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="activity-day-tooltip-link">
              <span className="activity-day-tooltip-link-icon" aria-hidden="true">
                <Sparkles size={13} />
              </span>
              <span>
                <strong>{post.title}</strong>
                <span>{post.tags.slice(0, 2).join(" / ") || "Writing"}</span>
              </span>
              <ArrowUpRight size={12} aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : null}

      {visibleProjects.length > 0 ? (
        <div className="activity-day-tooltip-list">
          {visibleProjects.map((project) => (
            <ActivityLink
              key={project.slug}
              href={project.href}
              external={project.href.startsWith("http")}
              className="activity-day-tooltip-link"
            >
              <span className="activity-day-tooltip-link-icon" aria-hidden="true">
                <Boxes size={13} />
              </span>
              <span>
                <strong>{project.name}</strong>
                <span>{project.latestCommit?.message ?? project.status}</span>
              </span>
              <ArrowUpRight size={12} aria-hidden="true" />
            </ActivityLink>
          ))}
        </div>
      ) : null}

      {!hasCapturedDetails ? (
        <p className="activity-day-tooltip-empty">
          {detail.day.contributionCount > 0
            ? "GitHub reports activity here; detailed public events are outside the live window."
            : "No public activity captured for this day."}
        </p>
      ) : null}
    </aside>
  );
}

export function ActivityDeskClient({
  initialSnapshot,
  page = false,
}: {
  initialSnapshot: ActivitySnapshot;
  page?: boolean;
}) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [status, setStatus] = useState<LiveStatus>("live");
  const [activeDay, setActiveDay] = useState<DayDetail | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<TooltipStyle>({});
  const closeTimer = useRef<number | null>(null);

  const refreshSnapshot = useCallback(async () => {
    setStatus("syncing");

    try {
      const response = await fetch("/api/activity", {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Activity refresh failed with ${response.status}`);
      }

      const nextSnapshot = (await response.json()) as ActivitySnapshot;
      setSnapshot(nextSnapshot);
      setStatus("live");
    } catch {
      setStatus("offline");
    }
  }, []);

  useEffect(() => {
    const refreshSoon = window.setTimeout(refreshSnapshot, 1200);
    const interval = window.setInterval(refreshSnapshot, 60_000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refreshSnapshot();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearTimeout(refreshSoon);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshSnapshot]);

  const weeks = useMemo(() => normalizeWeeks(snapshot.calendar.weeks), [snapshot.calendar.weeks]);
  const monthMarkers = useMemo(() => buildMonthMarkers(weeks), [weeks]);
  const dayDetails = useMemo(() => buildDayDetails(snapshot), [snapshot]);
  const heatmapStyle = useMemo(
    () =>
      ({
        "--activity-week-count": weeks.length,
      }) as CSSProperties,
    [weeks.length]
  );
  const calendarSourceLabel = snapshot.calendar.source === "github-graphql" ? "GitHub contribution graph" : "Recent public events";
  const calendarRange = `${formatShortDate(snapshot.calendar.startedAt.slice(0, 10))} - ${formatShortDate(
    snapshot.calendar.endedAt.slice(0, 10)
  )}`;

  const cancelClose = useCallback(() => {
    if (!closeTimer.current) return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);

  const queueClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      setActiveDay(null);
    }, 140);
  }, [cancelClose]);

  const positionTooltip = useCallback((target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const tooltipWidth = Math.min(340, window.innerWidth - 24);
    const x = Math.min(Math.max(12, rect.left + rect.width / 2 - tooltipWidth / 2), window.innerWidth - tooltipWidth - 12);
    const placeAbove = rect.top > 330;
    const y = placeAbove ? rect.top - 12 : rect.bottom + 12;

    setTooltipStyle({
      "--activity-tooltip-x": `${x}px`,
      "--activity-tooltip-y": `${y}px`,
      "--activity-tooltip-shift": placeAbove ? "-100%" : "0",
      width: `${tooltipWidth}px`,
    });
  }, []);

  const openDay = useCallback(
    (day: ActivityContributionDay, target: HTMLElement) => {
      cancelClose();
      positionTooltip(target);
      setActiveDay(getDayDetail(day, dayDetails));
    },
    [cancelClose, dayDetails, positionTooltip]
  );

  return (
    <section
      className={`${page ? "activity-page-section" : "section-block"} activity-section`}
      id="now"
      aria-labelledby="activity-title"
    >
      <div className="activity-stage">
        <div className="activity-copy">
          <p className="eyebrow">What&apos;s happening</p>
          <h2 id="activity-title" className="activity-title">
            My GitHub calendar for the work in motion.
          </h2>
          <p className="activity-lede">
            Commits, project movement, open-source signals, and notes from the workbench, folded into a daily
            contribution graph.
          </p>

          <div className="activity-actions" aria-label="Activity links">
            <a href={GITHUB_PROFILE_URL} target="_blank" rel="noreferrer" className="activity-button activity-button-primary">
              <Github size={15} aria-hidden="true" />
              <span>GitHub</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <Link href="/projects" className="activity-button">
              <Boxes size={15} aria-hidden="true" />
              <span>Projects</span>
            </Link>
          </div>
        </div>

        <div className="activity-meta-strip" aria-label="Activity telemetry">
          <div className={`activity-live-pill is-${status}`} aria-live="polite">
            <span className="activity-live-dot" aria-hidden="true" />
            <span>{getLiveStatusLabel(status)}</span>
          </div>

          <div className="activity-meta-lines">
            <span>
              <strong>{snapshot.calendar.totalContributions.toLocaleString("en-US")}</strong>
              contributions
            </span>
            <span>
              <strong>{snapshot.metrics.todayCommits}</strong>
              today
            </span>
            <span>
              <strong>{snapshot.metrics.recentRepos}</strong>
              repos
            </span>
          </div>

          <div className="activity-generated">Updated {formatActivityStamp(snapshot.generatedAt, snapshot.timeZone)}</div>
        </div>
      </div>

      <div className="activity-heatmap-shell">
        <div className="activity-heatmap-top">
          <div>
            <p className="activity-panel-kicker">GitHub calendar</p>
            <h3 className="activity-heatmap-title">{getContributionCopy(snapshot.calendar.totalContributions)}</h3>
          </div>
          <div className="activity-heatmap-source">
            <span>{calendarSourceLabel}</span>
            <span>{calendarRange}</span>
          </div>
        </div>

        <div className="activity-heatmap-scroll">
          <div className="activity-heatmap-board" style={heatmapStyle}>
            <div className="activity-heatmap-months" aria-hidden="true">
              {monthMarkers.map((marker) => (
                <span key={marker.id} style={{ gridColumn: marker.column }}>
                  {marker.label}
                </span>
              ))}
            </div>

            <div className="activity-heatmap-weekdays" aria-hidden="true">
              {WEEKDAY_LABELS.map((label, index) => (
                <span key={`${label}-${index}`}>{label}</span>
              ))}
            </div>

            <div className="activity-heatmap-weeks">
              {weeks.map((week) => (
                <div key={week.firstDay} className="activity-heatmap-week">
                  {week.contributionDays.map((day) => (
                    <button
                      key={day.date}
                      type="button"
                      className="activity-heatmap-day"
                      data-level={day.contributionLevel}
                      aria-label={`${formatCalendarDate(day.date)}: ${getContributionCopy(day.contributionCount)}`}
                      style={{ gridRow: getCalendarRow(day) }}
                      onPointerEnter={(event) => openDay(day, event.currentTarget)}
                      onPointerMove={(event) => positionTooltip(event.currentTarget)}
                      onPointerLeave={queueClose}
                      onFocus={(event) => openDay(day, event.currentTarget)}
                      onBlur={queueClose}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="activity-heatmap-footer">
          <span>
            {snapshot.metrics.activeProjects} tracked projects / {snapshot.metrics.posts} notes live
          </span>
          <span className="activity-heatmap-legend" aria-label="Contribution intensity legend">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <span key={level} className="activity-heatmap-legend-cell" data-level={level} aria-hidden="true" />
            ))}
            <span>More</span>
          </span>
        </div>

        {activeDay ? (
          <ActivityDayTooltip
            detail={activeDay}
            style={tooltipStyle}
            timeZone={snapshot.timeZone}
            source={snapshot.calendar.source}
            onPointerEnter={cancelClose}
            onPointerLeave={queueClose}
          />
        ) : null}
      </div>
    </section>
  );
}
