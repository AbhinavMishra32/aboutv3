import { sql } from "@vercel/postgres";

const hasDatabase = Boolean(process.env.POSTGRES_URL);

export type SystemsOverrideRecord = {
  slug: string;
  status: string | null;
  phase: string | null;
  summary: string | null;
  latestMilestone: string | null;
  words: string | null;
  nextStep: string | null;
  updatedAt: string | null;
  learningFocus: string[] | null;
};

async function ensureSystemsTable() {
  if (!hasDatabase) return;

  await sql`
    CREATE TABLE IF NOT EXISTS systems_timeline_overrides (
      slug TEXT PRIMARY KEY,
      status TEXT,
      phase TEXT,
      summary TEXT,
      latest_milestone TEXT,
      words TEXT,
      next_step TEXT,
      updated_at TEXT,
      learning_focus JSONB,
      saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

export async function getSystemsOverrides(): Promise<Record<string, SystemsOverrideRecord>> {
  if (!hasDatabase) return {};

  await ensureSystemsTable();

  const { rows } = await sql<{
    slug: string;
    status: string | null;
    phase: string | null;
    summary: string | null;
    latest_milestone: string | null;
    words: string | null;
    next_step: string | null;
    updated_at: string | null;
    learning_focus: unknown;
  }>`
    SELECT slug, status, phase, summary, latest_milestone, words, next_step, updated_at, learning_focus
    FROM systems_timeline_overrides
  `;

  return Object.fromEntries(
    rows.map((row) => [
      row.slug,
      {
        slug: row.slug,
        status: row.status,
        phase: row.phase,
        summary: row.summary,
        latestMilestone: row.latest_milestone,
        words: row.words,
        nextStep: row.next_step,
        updatedAt: row.updated_at,
        learningFocus: Array.isArray(row.learning_focus)
          ? row.learning_focus.filter((value): value is string => typeof value === "string")
          : null,
      },
    ])
  );
}

export async function saveSystemsOverride(input: SystemsOverrideRecord) {
  if (!hasDatabase) {
    throw new Error("Systems timeline persistence is unavailable because POSTGRES_URL is not configured.");
  }

  await ensureSystemsTable();

  await sql`
    INSERT INTO systems_timeline_overrides (
      slug,
      status,
      phase,
      summary,
      latest_milestone,
      words,
      next_step,
      updated_at,
      learning_focus,
      saved_at
    )
    VALUES (
      ${input.slug},
      ${input.status},
      ${input.phase},
      ${input.summary},
      ${input.latestMilestone},
      ${input.words},
      ${input.nextStep},
      ${input.updatedAt},
      ${JSON.stringify(input.learningFocus ?? [])}::jsonb,
      NOW()
    )
    ON CONFLICT (slug)
    DO UPDATE SET
      status = EXCLUDED.status,
      phase = EXCLUDED.phase,
      summary = EXCLUDED.summary,
      latest_milestone = EXCLUDED.latest_milestone,
      words = EXCLUDED.words,
      next_step = EXCLUDED.next_step,
      updated_at = EXCLUDED.updated_at,
      learning_focus = EXCLUDED.learning_focus,
      saved_at = NOW();
  `;
}
