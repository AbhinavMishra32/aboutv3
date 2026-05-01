"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Lock, LogOut, Save, Sparkles } from "lucide-react";
import type { SystemsEntry } from "@/lib/systems";

type SessionState = {
  authenticated: boolean;
  configured: boolean;
};

type DraftState = {
  slug: string;
  status: string;
  phase: string;
  summary: string;
  learningFocus: string;
  latestMilestone: string;
  words: string;
  nextStep: string;
  updatedAt: string;
};

const SECRET_TRIGGER_TARGET = 5;
const SECRET_TRIGGER_WINDOW_MS = 1200;

function formatTimelineDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function createDraft(entry: SystemsEntry): DraftState {
  return {
    slug: entry.slug,
    status: entry.status,
    phase: entry.phase,
    summary: entry.summary,
    learningFocus: entry.learningFocus.join("\n"),
    latestMilestone: entry.latestMilestone,
    words: entry.words,
    nextStep: entry.nextStep,
    updatedAt: entry.updatedAt,
  };
}

function sortEntries(entries: SystemsEntry[]) {
  return [...entries].sort((left, right) => right.startedAt.localeCompare(left.startedAt));
}

export function SystemsTimeline({ initialEntries }: { initialEntries: SystemsEntry[] }) {
  const [entries, setEntries] = useState(() => sortEntries(initialEntries));
  const [expandedSlug, setExpandedSlug] = useState<string | null>(initialEntries[0]?.slug ?? null);
  const [session, setSession] = useState<SessionState>({ authenticated: false, configured: false });
  const [adminOpen, setAdminOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(initialEntries[0]?.slug ?? "");
  const [draft, setDraft] = useState<DraftState | null>(initialEntries[0] ? createDraft(initialEntries[0]) : null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const triggerClicks = useRef<number[]>([]);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const [itemsResponse, sessionResponse] = await Promise.all([
          fetch("/api/systems", { cache: "no-store" }),
          fetch("/api/systems/session", { cache: "no-store" }),
        ]);

        if (!ignore && itemsResponse.ok) {
          const payload = (await itemsResponse.json()) as { items: SystemsEntry[] };
          setEntries(sortEntries(payload.items));
        }

        if (!ignore && sessionResponse.ok) {
          const payload = (await sessionResponse.json()) as SessionState;
          setSession(payload);
        }
      } catch {
        // Keep the section working from the embedded content if the live fetch fails.
      }
    };

    void load();

    return () => {
      ignore = true;
    };
  }, []);

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.slug === selectedSlug) ?? entries[0] ?? null,
    [entries, selectedSlug]
  );

  useEffect(() => {
    if (!selectedEntry) return;
    setDraft(createDraft(selectedEntry));
  }, [selectedEntry]);

  const toggleSecretEditor = () => {
    const now = Date.now();
    triggerClicks.current = [...triggerClicks.current.filter((value) => now - value < SECRET_TRIGGER_WINDOW_MS), now];

    if (triggerClicks.current.length >= SECRET_TRIGGER_TARGET) {
      triggerClicks.current = [];
      setAdminOpen((value) => !value);
      setLoginError("");
      setSaveMessage("");
    }
  };

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("/api/systems/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setLoginError(payload.error ?? "Could not log in.");
        return;
      }

      setPassword("");
      setSession((current) => ({ ...current, authenticated: true }));
    } catch {
      setLoginError("Could not log in.");
    }
  };

  const submitSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;

    setIsSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch("/api/systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: draft.slug,
          status: draft.status,
          phase: draft.phase,
          summary: draft.summary,
          latestMilestone: draft.latestMilestone,
          words: draft.words,
          nextStep: draft.nextStep,
          updatedAt: draft.updatedAt,
          learningFocus: draft.learningFocus
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        }),
      });

      const payload = (await response.json()) as { items?: SystemsEntry[]; error?: string };

      if (!response.ok || !payload.items) {
        setSaveMessage(payload.error ?? "Could not save timeline entry.");
        return;
      }

      startTransition(() => {
        setEntries(sortEntries(payload.items ?? []));
      });
      setSaveMessage("Saved.");
    } catch {
      setSaveMessage("Could not save timeline entry.");
    } finally {
      setIsSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/systems/logout", { method: "POST" });
    setSession((current) => ({ ...current, authenticated: false }));
    setSaveMessage("");
  };

  return (
    <div className="systems-section">
      <div className="section-head systems-head">
        <div>
          <p className="eyebrow">Current Systems Work</p>
          <button type="button" className="systems-title-trigger" onClick={toggleSecretEditor}>
            <h3 className="section-title systems-title">Current builds, systems work, and learning in motion.</h3>
          </button>
          <p className="section-note">
            The smaller projects under the flagship work: live progress, learning notes, and where each build is heading.
          </p>
        </div>
      </div>

      <div className="systems-timeline">
        {entries.map((entry) => {
          const isExpanded = expandedSlug === entry.slug;

          return (
            <article key={entry.slug} className={`systems-item ${isExpanded ? "is-expanded" : ""}`}>
              <div className="systems-rail" aria-hidden="true">
                <span className={`systems-rail-dot systems-status-${entry.status.toLowerCase()}`} />
                <span className="systems-rail-line" />
              </div>

              <button
                type="button"
                className="systems-card"
                onClick={() => setExpandedSlug(isExpanded ? null : entry.slug)}
                aria-expanded={isExpanded}
              >
                <div className="systems-card-top">
                  <div className="systems-card-head">
                    <div className="systems-card-meta">
                      <span>{formatTimelineDate(entry.startedAt)}</span>
                      <span>{entry.phase}</span>
                    </div>
                    <div className="systems-card-heading">
                      <h4>{entry.title}</h4>
                      <span className={`systems-status-pill systems-status-${entry.status.toLowerCase()}`}>{entry.status}</span>
                    </div>
                  </div>

                  <span className={`systems-chevron ${isExpanded ? "is-open" : ""}`} aria-hidden="true">
                    <ChevronDown size={16} />
                  </span>
                </div>

                <p className="systems-summary">{entry.summary}</p>

                <div className="systems-focus-row">
                  {entry.learningFocus.slice(0, 4).map((focus) => (
                    <span key={focus} className="systems-focus-pill">
                      {focus}
                    </span>
                  ))}
                </div>

                {isExpanded ? (
                  <div className="systems-expanded">
                    <div className="systems-expanded-grid">
                      <div className="systems-note-block">
                        <span>Latest milestone</span>
                        <p>{entry.latestMilestone}</p>
                      </div>

                      <div className="systems-note-block">
                        <span>Next step</span>
                        <p>{entry.nextStep}</p>
                      </div>
                    </div>

                    <blockquote className="systems-words">
                      <Sparkles size={15} />
                      <p>{entry.words}</p>
                    </blockquote>

                    <div className="systems-card-footer">
                      <span>Updated {formatTimelineDate(entry.updatedAt)}</span>
                      {entry.repo ? (
                        <a
                          href={entry.repo}
                          target="_blank"
                          rel="noreferrer"
                          className="systems-link-pill"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <span>Repo</span>
                          <ArrowUpRight size={13} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </button>
            </article>
          );
        })}
      </div>

      {adminOpen ? (
        <section className="systems-admin-panel" aria-label="Hidden systems editor">
          <div className="systems-admin-head">
            <div>
              <p className="eyebrow">Private editor</p>
              <h4>Quietly update the timeline from here.</h4>
            </div>
            {session.authenticated ? (
              <button type="button" className="systems-admin-ghost" onClick={logout}>
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            ) : null}
          </div>

          {!session.configured ? (
            <p className="systems-admin-note">
              Set `SYSTEMS_ADMIN_PASSWORD` and `POSTGRES_URL` to enable hidden editing from the site.
            </p>
          ) : !session.authenticated ? (
            <form className="systems-admin-login" onSubmit={submitLogin}>
              <label>
                <span>Password</span>
                <div className="systems-admin-password">
                  <Lock size={14} />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Secret editor password"
                  />
                </div>
              </label>
              {loginError ? <p className="systems-admin-error">{loginError}</p> : null}
              <button type="submit" className="systems-admin-save">
                Unlock editor
              </button>
            </form>
          ) : (
            <div className="systems-admin-shell">
              <div className="systems-admin-list">
                {entries.map((entry) => (
                  <button
                    key={entry.slug}
                    type="button"
                    className={`systems-admin-item ${selectedSlug === entry.slug ? "is-active" : ""}`}
                    onClick={() => setSelectedSlug(entry.slug)}
                  >
                    <strong>{entry.title}</strong>
                    <span>{entry.phase}</span>
                  </button>
                ))}
              </div>

              {draft ? (
                <form className="systems-admin-form" onSubmit={submitSave}>
                  <label>
                    <span>Status</span>
                    <input
                      value={draft.status}
                      onChange={(event) => setDraft((current) => (current ? { ...current, status: event.target.value } : current))}
                    />
                  </label>

                  <label>
                    <span>Phase</span>
                    <input
                      value={draft.phase}
                      onChange={(event) => setDraft((current) => (current ? { ...current, phase: event.target.value } : current))}
                    />
                  </label>

                  <label>
                    <span>Summary</span>
                    <textarea
                      rows={3}
                      value={draft.summary}
                      onChange={(event) => setDraft((current) => (current ? { ...current, summary: event.target.value } : current))}
                    />
                  </label>

                  <label>
                    <span>Learning focus</span>
                    <textarea
                      rows={4}
                      value={draft.learningFocus}
                      onChange={(event) =>
                        setDraft((current) => (current ? { ...current, learningFocus: event.target.value } : current))
                      }
                    />
                  </label>

                  <label>
                    <span>Latest milestone</span>
                    <textarea
                      rows={3}
                      value={draft.latestMilestone}
                      onChange={(event) =>
                        setDraft((current) => (current ? { ...current, latestMilestone: event.target.value } : current))
                      }
                    />
                  </label>

                  <label>
                    <span>My words</span>
                    <textarea
                      rows={4}
                      value={draft.words}
                      onChange={(event) => setDraft((current) => (current ? { ...current, words: event.target.value } : current))}
                    />
                  </label>

                  <label>
                    <span>Next step</span>
                    <textarea
                      rows={3}
                      value={draft.nextStep}
                      onChange={(event) => setDraft((current) => (current ? { ...current, nextStep: event.target.value } : current))}
                    />
                  </label>

                  <label>
                    <span>Updated date</span>
                    <input
                      value={draft.updatedAt}
                      onChange={(event) => setDraft((current) => (current ? { ...current, updatedAt: event.target.value } : current))}
                    />
                  </label>

                  <div className="systems-admin-actions">
                    <button type="submit" className="systems-admin-save" disabled={isSaving}>
                      <Save size={14} />
                      <span>{isSaving ? "Saving..." : "Save changes"}</span>
                    </button>
                    {saveMessage ? <p className="systems-admin-note">{saveMessage}</p> : null}
                  </div>
                </form>
              ) : null}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
