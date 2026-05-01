import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowUpRight,
  BookOpenText,
  Boxes,
  Brain,
  Code2,
  GitCommitHorizontal,
  Github,
  RadioTower,
  Rocket,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  ACTIVITY_TIME_ZONE,
  getActivitySnapshot,
  type ActivityCommit,
  type ActivityFeedItem,
} from "@/lib/activity";

const FEED_ICONS = {
  commit: GitCommitHorizontal,
  post: BookOpenText,
  project: Boxes,
} satisfies Record<ActivityFeedItem["kind"], LucideIcon>;

function formatActivityDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: ACTIVITY_TIME_ZONE,
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function formatActivityTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: ACTIVITY_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatActivityStamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: ACTIVITY_TIME_ZONE,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));
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

function MetricTile({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="activity-metric">
      <div className="activity-metric-label">{label}</div>
      <div className="activity-metric-value">{value}</div>
      <div className="activity-metric-detail">{detail}</div>
    </div>
  );
}

function TickerCommit({
  commit,
  hidden = false,
}: {
  commit: ActivityCommit;
  hidden?: boolean;
}) {
  return (
    <a
      href={commit.url}
      target="_blank"
      rel="noreferrer"
      className="activity-ticker-item"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
    >
      <span className="activity-ticker-repo">{commit.repoName}</span>
      <span className="activity-ticker-message">{commit.message}</span>
      <span className="activity-ticker-meta">{commit.sha.slice(0, 7)}</span>
      <ArrowUpRight size={13} aria-hidden="true" />
    </a>
  );
}

function FeedItem({ item }: { item: ActivityFeedItem }) {
  const Icon = FEED_ICONS[item.kind];

  return (
    <ActivityLink href={item.href} external={item.external} className={`activity-feed-item activity-feed-item-${item.kind}`}>
      <span className="activity-feed-icon" aria-hidden="true">
        <Icon size={15} />
      </span>
      <span className="activity-feed-copy">
        <span className="activity-feed-kicker">
          <span>{item.eyebrow}</span>
          <span>{formatActivityDate(item.date)}</span>
        </span>
        <span className="activity-feed-title">{item.title}</span>
        <span className="activity-feed-summary">{item.summary}</span>
      </span>
      <span className="activity-feed-meta">
        <span>{item.meta}</span>
        <ArrowUpRight size={13} aria-hidden="true" />
      </span>
    </ActivityLink>
  );
}

export async function ActivitySection() {
  const snapshot = await getActivitySnapshot();
  const wireLabel = snapshot.todayCommits.length > 0 ? "Today's commit wire" : "Latest commit wire";
  const metricTiles = [
    {
      label: "Today",
      value: snapshot.metrics.todayCommits,
      detail: "public commits",
    },
    {
      label: "Repos",
      value: snapshot.metrics.recentRepos,
      detail: "recently touched",
    },
    {
      label: "Projects",
      value: snapshot.metrics.activeProjects,
      detail: "tracked builds",
    },
    {
      label: "Writing",
      value: snapshot.metrics.posts,
      detail: "notes live",
    },
  ];
  const signalBars = Array.from({ length: 18 }, (_, index) => (index % 6) + 1);

  return (
    <section className="section-block activity-section" id="now" aria-labelledby="activity-title">
      <div className="activity-stage">
        <div className="activity-copy">
          <p className="eyebrow">What&apos;s happening</p>
          <h2 id="activity-title" className="activity-title">
            A live desk for what I&apos;m building, learning, writing, and shipping.
          </h2>
          <p className="activity-lede">
            Public commits, project movement, open-source signals, and notes from the workbench, pulled into one
            rolling feed.
          </p>

          <div className="activity-actions" aria-label="Activity links">
            <a href="https://github.com/AbhinavMishra32" target="_blank" rel="noreferrer" className="activity-button activity-button-primary">
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

        <div className="activity-command-center" aria-label="Activity telemetry">
          <div className="activity-window-top">
            <div className="activity-window-lights" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="activity-live-pill">
              <span className="activity-live-dot" aria-hidden="true" />
              <span>Live desk</span>
            </div>
          </div>

          <div className="activity-metrics">
            {metricTiles.map((metric) => (
              <MetricTile key={metric.label} {...metric} />
            ))}
          </div>

          <div className="activity-signal-strip" aria-hidden="true">
            {signalBars.map((level, index) => (
              <span key={`${level}-${index}`} style={{ "--activity-level": level } as CSSProperties} />
            ))}
          </div>

          <div className="activity-generated">Updated {formatActivityStamp(snapshot.generatedAt)}</div>
        </div>
      </div>

      <div className="activity-wire" aria-label={wireLabel}>
        <div className="activity-wire-label">
          <RadioTower size={15} aria-hidden="true" />
          <span>{wireLabel}</span>
        </div>
        <div className="activity-marquee">
          <div className="activity-marquee-track">
            {[0, 1].map((copyIndex) =>
              snapshot.tickerCommits.map((commit) => (
                <TickerCommit key={`${copyIndex}-${commit.id}`} commit={commit} hidden={copyIndex === 1} />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="activity-grid">
        <div className="activity-feed-panel">
          <div className="activity-panel-head">
            <div>
              <p className="activity-panel-kicker">Signal feed</p>
              <h3 className="activity-panel-title">Build log</h3>
            </div>
            <Code2 size={17} aria-hidden="true" />
          </div>

          <div className="activity-feed-list">
            {snapshot.feed.map((item) => (
              <FeedItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        <aside className="activity-side-rail" aria-label="Current work">
          <section className="activity-focus-panel">
            <div className="activity-panel-head">
              <div>
                <p className="activity-panel-kicker">Now</p>
                <h3 className="activity-panel-title">Working on</h3>
              </div>
              <Brain size={17} aria-hidden="true" />
            </div>

            <div className="activity-focus-list">
              {snapshot.focusSignals.map((signal, index) => (
                <article key={signal.label} className="activity-focus-item">
                  <span className="activity-focus-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="activity-focus-copy">
                    <span className="activity-focus-label">{signal.label}</span>
                    <strong>{signal.title}</strong>
                    <span>{signal.detail}</span>
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="activity-project-panel">
            <div className="activity-panel-head">
              <div>
                <p className="activity-panel-kicker">Projects</p>
                <h3 className="activity-panel-title">Pulse</h3>
              </div>
              <Rocket size={17} aria-hidden="true" />
            </div>

            <div className="activity-project-list">
              {snapshot.projects.slice(0, 4).map((project) => (
                <ActivityLink
                  key={project.slug}
                  href={project.href}
                  external={project.href.startsWith("http")}
                  className="activity-project-row"
                >
                  <span className="activity-project-top">
                    <strong>{project.name}</strong>
                    <span>{project.status}</span>
                  </span>
                  <span className="activity-project-summary">{project.latestCommit?.message ?? project.summary}</span>
                  <span className="activity-project-meta">
                    <Sparkles size={12} aria-hidden="true" />
                    <span>
                      {project.totalCommits ? `${project.totalCommits.toLocaleString("en-US")} commits` : project.focus}
                    </span>
                    {project.updatedAt ? <span>{formatActivityTime(project.updatedAt)}</span> : null}
                  </span>
                </ActivityLink>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
