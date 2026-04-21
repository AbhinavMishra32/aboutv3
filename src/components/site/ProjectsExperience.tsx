"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, type Transition } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { RepoDetail, RepoSummary } from "@/lib/github";
import type { Project } from "@/lib/portfolio";

const CARD_TRANSITION: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 30,
  mass: 0.85,
};

const HOVER_TRANSITION: Transition = {
  type: "spring",
  stiffness: 360,
  damping: 24,
  mass: 0.7,
};

const OVERLAY_TRANSITION: Transition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1] as const,
};

const SHARED_CARD_RADIUS = 18;
const SHARED_PREVIEW_RADIUS = 14;
const MODAL_DETAILS_EXIT_MS = 150;

function ProjectTechMark({
  tech,
}: {
  tech:
    | {
        name: string;
        src: string;
      }
    | {
        name: string;
        icon: "ai" | "bootstrap" | "pow";
      };
}) {
  if ("src" in tech) {
    // CDN-served brand marks are intentional here so the cards can use the real logos directly.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={tech.src} alt={tech.name} className="project-tech-logo-image" loading="lazy" />;
  }

  if (tech.icon === "ai") {
    return (
      <span className="project-tech-logo-custom" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M12 4.5c1.55 0 2.86.9 3.47 2.16a3.88 3.88 0 0 1 4.03 3.84c0 1.48-.84 2.77-2.06 3.42.22 1.42-.37 2.92-1.68 3.68-1.29.75-2.88.62-4.04-.18a3.86 3.86 0 0 1-4.48.18 3.88 3.88 0 0 1-1.68-3.68A3.86 3.86 0 0 1 3.5 10.5c0-2 1.52-3.65 3.47-3.84A3.86 3.86 0 0 1 12 4.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="m8.2 10.2 3.8-2.15 3.8 2.15v4.3L12 16.65 8.2 14.5z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      </span>
    );
  }

  if (tech.icon === "bootstrap") {
    return (
      <span className="project-tech-logo-custom" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="12" r="2.25" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="18" cy="7" r="2.25" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="18" cy="17" r="2.25" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M8.2 11.05 15.7 7.95M8.2 12.95l7.5 3.1"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span className="project-tech-logo-custom" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M6.5 9.25c0-1.52 1.23-2.75 2.75-2.75h5.5c1.52 0 2.75 1.23 2.75 2.75v5.5c0 1.52-1.23 2.75-2.75 2.75h-5.5c-1.52 0-2.75-1.23-2.75-2.75z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="m12 4.75 1.05 2.11 2.33.34-1.69 1.65.4 2.32L12 10.07 9.91 11.2l.4-2.32L8.62 7.2l2.33-.34Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

function ThemedProjectPreview({
  project,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  project: Project;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className="themed-project-preview">
      <Image
        src={project.previewImage}
        alt={project.previewAlt}
        className="project-preview-image project-preview-image-light"
        width={960}
        height={600}
        priority={priority}
        sizes={sizes}
      />
      <Image
        src={project.previewDarkImage}
        alt={project.previewAlt}
        className="project-preview-image project-preview-image-dark"
        width={960}
        height={600}
        priority={priority}
        sizes={sizes}
      />
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatMonthYear(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getRepoLine(project: Project, summary?: RepoSummary) {
  if (summary) {
    return `${formatNumber(summary.totalCommits)} commits · updated ${formatMonthYear(summary.pushedAt)}`;
  }

  if (project.repoNote) {
    return "Hackathon build · repo private";
  }

  return "Open the modal for repo detail";
}

function CommitCalendar({ calendar }: { calendar: RepoDetail["calendar"] }) {
  return (
    <div className="project-calendar-shell">
      <div className="project-calendar-grid" role="img" aria-label="Project commit calendar">
        {calendar.map((week) => (
          <div key={week.label} className="project-calendar-week">
            {week.days.map((day) => (
              <span
                key={day.date}
                className={`project-calendar-cell project-calendar-level-${day.level}`}
                title={`${day.count} commit${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="project-calendar-legend">
        <span>Less</span>
        <div className="project-calendar-legend-scale">
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className={`project-calendar-cell project-calendar-level-${level}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

function RepoMetrics({ detail }: { detail: RepoDetail }) {
  return (
    <div className="project-metrics-grid">
      <div className="project-metric-card">
        <div className="project-metric-label">Commits</div>
        <div className="project-metric-value">{formatNumber(detail.totalCommits)}</div>
      </div>
      <div className="project-metric-card">
        <div className="project-metric-label">Active days</div>
        <div className="project-metric-value">{formatNumber(detail.activeDays)}</div>
      </div>
      <div className="project-metric-card">
        <div className="project-metric-label">First commit</div>
        <div className="project-metric-value project-metric-value-small">{formatDate(detail.firstCommitAt)}</div>
      </div>
      <div className="project-metric-card">
        <div className="project-metric-label">Latest push</div>
        <div className="project-metric-value project-metric-value-small">{formatDate(detail.pushedAt)}</div>
      </div>
    </div>
  );
}

function ProjectHeaderBlock({
  project,
  expanded = false,
}: {
  project: Project;
  expanded?: boolean;
}) {
  return (
    <div className={`project-card-body ${expanded ? "project-card-body-expanded" : ""}`}>
      <motion.div layoutId={`project-eyebrow-${project.slug}`} className="project-card-eyebrow">
        {project.focus}
      </motion.div>

      <div className="project-card-heading">
        <motion.h3
          layoutId={`project-title-${project.slug}`}
          className={expanded ? "project-modal-title" : "project-card-title"}
        >
          {project.name}
        </motion.h3>
        {project.live ? <span className="project-live-dot" aria-hidden="true" /> : null}
      </div>

      <p className={expanded ? "project-modal-copy" : "project-card-summary"}>{project.summary}</p>
    </div>
  );
}

export function ProjectsExperience({
  projects,
  summaries,
  details,
}: {
  projects: Project[];
  summaries: Partial<Record<string, RepoSummary>>;
  details: Partial<Record<string, RepoDetail>>;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [showModalDetails, setShowModalDetails] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const selectedProject = projects.find((project) => project.slug === selectedSlug) ?? null;
  const selectedDetail = selectedSlug ? details[selectedSlug] : undefined;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openProject = useCallback(
    (slug: string) => {
      clearCloseTimer();
      setIsClosing(false);
      setShowModalDetails(false);
      setSelectedSlug(slug);
    },
    [clearCloseTimer]
  );

  const closeProject = useCallback(() => {
    if (!selectedSlug) return;

    clearCloseTimer();

    if (!showModalDetails) {
      setIsClosing(false);
      setSelectedSlug(null);
      return;
    }

    setIsClosing(true);
    setShowModalDetails(false);

    closeTimerRef.current = window.setTimeout(() => {
      setSelectedSlug(null);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, MODAL_DETAILS_EXIT_MS);
  }, [clearCloseTimer, selectedSlug, showModalDetails]);

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, [clearCloseTimer]);

  useEffect(() => {
    if (!selectedProject) {
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      setShowModalDetails(false);
      setIsClosing(false);
      return;
    }

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.removeProperty("overflow");
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeProject();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeProject, selectedProject]);

  return (
    <LayoutGroup id="project-experience">
      <div className="project-list">
        {projects.map((project) => {
          const isSelected = selectedSlug === project.slug;

          return (
            <motion.button
              key={project.slug}
              type="button"
              layoutId={`project-card-${project.slug}`}
              layout
              transition={CARD_TRANSITION}
              whileHover={
                isSelected
                  ? undefined
                  : {
                      y: -6,
                      scale: 1.012,
                      boxShadow: "0 22px 48px rgba(17, 17, 16, 0.12)",
                      transition: HOVER_TRANSITION,
                    }
              }
              whileTap={isSelected ? undefined : { scale: 0.995 }}
              className={`project-card project-card-button project-card-rich ${isSelected ? "project-card-selected" : ""}`}
              style={{ borderRadius: SHARED_CARD_RADIUS, boxShadow: "0 10px 28px rgba(17, 17, 16, 0.04)" }}
              aria-haspopup="dialog"
              aria-expanded={isSelected}
              onClick={() => openProject(project.slug)}
            >
              <motion.div
                layoutId={`project-preview-${project.slug}`}
                className="project-preview"
                transition={CARD_TRANSITION}
                style={{ borderRadius: SHARED_PREVIEW_RADIUS }}
              >
                <ThemedProjectPreview project={project} />
              </motion.div>

              <div className="project-card-top">
                <div
                  className={`project-icon ${project.iconLabel ? `project-icon-${project.iconTone ?? "slate"}` : ""}`}
                  aria-hidden="true"
                >
                  {project.iconUrl ? (
                    <span className="project-icon-image" style={{ backgroundImage: `url("${project.iconUrl}")` }} />
                  ) : (
                    <span className="project-icon-letter">{project.iconLabel}</span>
                  )}
                </div>

                <span className="project-card-open">Open project</span>
              </div>

              <ProjectHeaderBlock project={project} />

              <div className="project-meta">
                {project.buildTags.map((tag, tagIndex) => (
                  <span key={tag} className={`project-badge ${tagIndex === 0 ? "project-badge-primary" : ""}`}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="project-tech-row" aria-label={`${project.name} technologies`}>
                {project.techLogos.map((tech) => (
                  <span key={tech.name} className="project-tech-chip" title={tech.name} aria-label={tech.name}>
                    <ProjectTechMark tech={tech} />
                  </span>
                ))}
              </div>

              <div className="project-card-repo-line">{getRepoLine(project, summaries[project.slug])}</div>
            </motion.button>
          );
        })}
      </div>

      {isMounted
        ? createPortal(
            <AnimatePresence initial={false}>
              {selectedProject ? (
                <motion.div className="project-modal-shell" layoutRoot>
                  <motion.button
                    type="button"
                    className="project-modal-backdrop"
                    aria-label="Close project details"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={OVERLAY_TRANSITION}
                    onClick={closeProject}
                  />

                  <motion.div
                    layoutId={`project-card-${selectedProject.slug}`}
                    className={`project-modal-panel ${showModalDetails ? "is-ready" : ""}`}
                    transition={CARD_TRANSITION}
                    style={{ borderRadius: 22, boxShadow: "0 28px 80px rgba(17, 17, 16, 0.16)" }}
                    onLayoutAnimationComplete={() => {
                      if (selectedProject && !isClosing && !showModalDetails) {
                        setShowModalDetails(true);
                      }
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${selectedProject.name} project details`}
                  >
                    <div className="project-modal-header">
                      <div className="project-modal-heading">
                        <motion.div layoutId={`project-eyebrow-${selectedProject.slug}`} className="project-card-eyebrow">
                          {selectedProject.focus}
                        </motion.div>

                        <div className="project-card-heading">
                          <motion.h3 layoutId={`project-title-${selectedProject.slug}`} className="project-modal-title">
                            {selectedProject.name}
                          </motion.h3>
                          {selectedProject.live ? <span className="project-live-dot" aria-hidden="true" /> : null}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="project-modal-close"
                        aria-label="Close project details"
                        onClick={closeProject}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="project-modal-content">
                      <aside className="project-modal-aside">
                        <motion.div
                          layoutId={`project-preview-${selectedProject.slug}`}
                          className="project-modal-visual"
                          transition={CARD_TRANSITION}
                          style={{ borderRadius: SHARED_PREVIEW_RADIUS }}
                        >
                          <ThemedProjectPreview
                            project={selectedProject}
                            priority
                            sizes="(max-width: 900px) 100vw, 32vw"
                          />
                        </motion.div>

                        <div className={`project-modal-section-stack ${showModalDetails ? "is-visible" : ""}`}>
                          <section className="project-side-card">
                            <div className="project-detail-section-head">
                              <div>
                                <p className="project-detail-kicker">At a glance</p>
                                <h4 className="project-detail-title">Stack, tags, and links.</h4>
                              </div>
                            </div>

                            <div className="project-meta">
                              {selectedProject.buildTags.map((tag, tagIndex) => (
                                <span key={tag} className={`project-badge ${tagIndex === 0 ? "project-badge-primary" : ""}`}>
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="project-tech-row" aria-label={`${selectedProject.name} technologies`}>
                              {selectedProject.techLogos.map((tech) => (
                                <span key={tech.name} className="project-tech-chip" title={tech.name} aria-label={tech.name}>
                                  <ProjectTechMark tech={tech} />
                                </span>
                              ))}
                            </div>

                            <div className="project-highlight-list">
                              {selectedProject.featureHighlights.map((highlight) => (
                                <div key={highlight} className="project-highlight-item">
                                  {highlight}
                                </div>
                              ))}
                            </div>

                            <div className="project-action-row">
                              {selectedProject.live ? (
                                <a href={selectedProject.live} target="_blank" rel="noreferrer" className="project-action-pill">
                                  <ExternalLink size={14} />
                                  <span>Live</span>
                                </a>
                              ) : null}
                              {selectedProject.source ? (
                                <a href={selectedProject.source} target="_blank" rel="noreferrer" className="project-action-pill">
                                  <Github size={14} />
                                  <span>Repo</span>
                                </a>
                              ) : null}
                            </div>
                          </section>

                          {selectedDetail ? (
                            <section className="project-side-card">
                              <div className="project-detail-section-head">
                                <div>
                                  <p className="project-detail-kicker">Telemetry</p>
                                  <h4 className="project-detail-title">Build stats.</h4>
                                </div>
                              </div>

                              <RepoMetrics detail={selectedDetail} />

                              <div className="project-side-meta">
                                <div className="project-side-meta-row">
                                  <span>Span</span>
                                  <strong>{formatNumber(selectedDetail.commitSpanDays)} days</strong>
                                </div>
                                <div className="project-side-meta-row">
                                  <span>Branch</span>
                                  <strong>{selectedDetail.defaultBranch}</strong>
                                </div>
                              </div>
                            </section>
                          ) : null}

                          {selectedDetail ? (
                            <section className="project-side-card">
                              <div className="project-detail-section-head">
                                <div>
                                  <p className="project-detail-kicker">Recent commits</p>
                                  <h4 className="project-detail-title">Latest snapshots.</h4>
                                </div>
                              </div>

                              <div className="project-side-commits">
                                {selectedDetail.recentCommits.map((commit) => (
                                  <a
                                    key={commit.sha}
                                    href={commit.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="project-side-commit"
                                  >
                                    <div className="project-side-commit-message">{commit.message}</div>
                                    <div className="project-side-commit-meta">
                                      <span>{commit.sha.slice(0, 7)}</span>
                                      <span>{formatMonthYear(commit.date)}</span>
                                      <ArrowUpRight size={12} />
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </section>
                          ) : null}
                        </div>
                      </aside>

                      <div className="project-modal-main">
                        <div className={`project-modal-main-stack ${showModalDetails ? "is-visible" : ""}`}>
                          <div className="project-detail-copy project-modal-detail-lead">{selectedProject.detail}</div>

                          <section className="project-detail-section">
                            <div className="project-detail-section-head">
                              <div>
                                <p className="project-detail-kicker">Build arc</p>
                                <h4 className="project-detail-title">How the project took shape.</h4>
                              </div>
                            </div>

                            <div className="project-arc-list">
                              {selectedProject.buildArc.map((step) => (
                                <article key={step.label} className="project-arc-card">
                                  <div className="project-arc-label">{step.label}</div>
                                  <h5 className="project-arc-title">{step.title}</h5>
                                  <p className="project-arc-copy">{step.detail}</p>
                                </article>
                              ))}
                            </div>
                          </section>

                          {selectedProject.repo ? (
                            <section className="project-detail-section">
                              <div className="project-detail-section-head">
                                <div>
                                  <p className="project-detail-kicker">Commit calendar</p>
                                  <h4 className="project-detail-title">Activity at a glance.</h4>
                                </div>
                              </div>

                              {selectedDetail ? (
                                <>
                                  <p className="project-detail-copy">
                                    Last 18 weeks of recorded activity ending {formatDate(selectedDetail.pushedAt)}.
                                  </p>
                                  <CommitCalendar calendar={selectedDetail.calendar} />
                                </>
                              ) : (
                                <p className="project-detail-copy">GitHub activity was not included in this build.</p>
                              )}
                            </section>
                          ) : (
                            <section className="project-detail-section">
                              <div className="project-detail-section-head">
                                <div>
                                  <p className="project-detail-kicker">Repo activity</p>
                                  <h4 className="project-detail-title">Public telemetry is not linked for this one.</h4>
                                </div>
                              </div>
                              <p className="project-detail-copy">{selectedProject.repoNote}</p>
                            </section>
                          )}

                          {selectedProject.repo ? (
                            <section className="project-detail-section">
                              <div className="project-detail-section-head">
                                <div>
                                  <p className="project-detail-kicker">Commit log</p>
                                  <h4 className="project-detail-title">Main branch history.</h4>
                                </div>
                              </div>

                              {selectedDetail ? (
                                <div className="project-commit-log">
                                  {selectedDetail.allCommits.map((commit) => (
                                    <a
                                      key={commit.sha}
                                      href={commit.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="project-commit-row"
                                    >
                                      <div className="project-commit-sha">{commit.sha.slice(0, 7)}</div>
                                      <div className="project-commit-message">{commit.message}</div>
                                      <div className="project-commit-date">{formatDate(commit.date)}</div>
                                    </a>
                                  ))}
                                </div>
                              ) : (
                                <p className="project-detail-copy">Commit history was not included in this build.</p>
                              )}
                            </section>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </LayoutGroup>
  );
}
