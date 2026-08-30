import { ArrowUpRight } from "lucide-react";
import { getActivitySnapshot } from "@/lib/activity";

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
}

/**
 * Live desk, rebuilt on the ruled-column system so /now speaks in the same
 * voice as the rest of the site. Same data source as before.
 */
export async function NowDesk() {
  const snapshot = await getActivitySnapshot().catch(() => null);

  if (!snapshot) {
    return (
      <div className="col px-6 py-6 sm:px-8">
        <p className="mono text-[12px] text-[var(--soft)]">
          The live desk is temporarily unavailable.
        </p>
      </div>
    );
  }

  const { focusSignals, projects, feed, generatedAt } = snapshot;

  return (
    <div className="col px-6 py-6 sm:px-8">
      {/* Focus signals */}
      {focusSignals.length ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {focusSignals.slice(0, 4).map((signal) => (
            <div key={signal.title} className="card p-5">
              <div className="mono text-[9.5px] uppercase tracking-[0.14em] text-[var(--soft)]">
                {signal.label}
              </div>
              <h3 className="mt-2 text-[15px] font-semibold tracking-[0.02em] text-[var(--fg)]">
                {signal.title}
              </h3>
              <p className="copy mt-2 text-[13.5px]">{signal.detail}</p>
            </div>
          ))}
        </div>
      ) : null}

      {/* Project pulse */}
      {projects.length ? (
        <div className="card mt-4 overflow-hidden">
          <div className="mono border-b border-dashed border-[var(--line)] px-4 py-2.5 text-[9.5px] uppercase tracking-[0.14em] text-[var(--soft)]">
            Project pulse
          </div>
          <ul className="divide-y divide-dashed divide-[var(--line)]">
            {projects.slice(0, 5).map((project) => (
              <li key={project.slug}>
                <a
                  href={project.href}
                  target={project.href.startsWith("http") ? "_blank" : undefined}
                  rel={project.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--hover)]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] text-[var(--fg)]">
                      {project.name}
                    </span>
                    <span className="mono block truncate text-[10.5px] text-[var(--soft)]">
                      {project.status}
                      {project.totalCommits ? ` · ${project.totalCommits} commits` : ""}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={12}
                    className="shrink-0 text-[var(--soft)] opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Feed */}
      {feed.length ? (
        <div className="card mt-4 overflow-hidden">
          <div className="mono border-b border-dashed border-[var(--line)] px-4 py-2.5 text-[9.5px] uppercase tracking-[0.14em] text-[var(--soft)]">
            Recent signal
          </div>
          <ul className="divide-y divide-dashed divide-[var(--line)]">
            {feed.slice(0, 8).map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  className="group flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--hover)]"
                >
                  <span className="mono w-[64px] shrink-0 pt-0.5 text-[9.5px] uppercase tracking-[0.1em] text-[var(--soft)]">
                    {item.eyebrow}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] text-[var(--fg)]">
                      {item.title}
                    </span>
                    <span className="mono block truncate text-[10.5px] text-[var(--soft)]">
                      {item.meta}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mono mt-4 text-[10px] uppercase tracking-[0.12em] text-[var(--soft)]">
        Updated {formatWhen(generatedAt)} IST
      </p>
    </div>
  );
}
