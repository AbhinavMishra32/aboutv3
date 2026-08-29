import { ArrowUpRight } from "lucide-react";
import { getActivitySnapshot } from "@/lib/activity";
import { ContributionGrid } from "@/components/home/ContributionGrid";

export async function GithubSection() {
  const snapshot = await getActivitySnapshot().catch(() => null);

  if (!snapshot) {
    return (
      <div className="col px-6 py-6 sm:px-8">
        <p className="mono text-[12px] text-[var(--soft)]">
          GitHub activity is temporarily unavailable.
        </p>
      </div>
    );
  }

  const { calendar, commits } = snapshot;

  return (
    <div className="col px-6 py-6 sm:px-8">
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-b border-dashed border-[var(--line)] px-4 py-2.5">
          <a
            href="https://github.com/AbhinavMishra32"
            target="_blank"
            rel="noreferrer"
            className="mono group flex items-center gap-1 text-[11.5px] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
          >
            @AbhinavMishra32
            <ArrowUpRight
              size={11}
              className="text-[var(--faint)] transition-all group-hover:-translate-y-px group-hover:translate-x-px"
            />
          </a>
          <span className="mono text-[10.5px] text-[var(--soft)]">
            {calendar.totalContributions.toLocaleString()} contributions in the last year
          </span>
        </div>

        <div className="px-4 py-4">
          <ContributionGrid calendar={calendar} />
        </div>

        {commits.length ? (
          <div className="border-t border-dashed border-[var(--line)]">
            <div className="label px-4 pb-1.5 pt-2.5">Latest commits</div>
            <ul className="divide-y divide-dashed divide-[var(--line)]">
              {commits.slice(0, 4).map((commit) => (
                <li key={commit.id}>
                  <a
                    href={commit.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mono group flex items-center gap-3 px-4 py-2 text-[10.5px] transition-colors hover:bg-[var(--hover)]"
                  >
                    <span className="w-[92px] shrink-0 truncate text-[var(--soft)]">
                      {commit.repoName}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[var(--muted)] transition-colors group-hover:text-[var(--fg)]">
                      {commit.message.split("\n")[0]}
                    </span>
                    <span className="shrink-0 text-[var(--faint)]">
                      {commit.sha.slice(0, 7)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
