import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getSystemsOverrides, type SystemsOverrideRecord } from "@/lib/systems-db";

export type SystemsEntry = {
  slug: string;
  title: string;
  status: string;
  phase: string;
  startedAt: string;
  updatedAt: string;
  repo: string;
  stack: string[];
  summary: string;
  learningFocus: string[];
  latestMilestone: string;
  words: string;
  nextStep: string;
};

type SystemsFrontmatter = {
  slug?: string;
  title?: string;
  status?: string;
  phase?: string;
  startedAt?: string | Date;
  updatedAt?: string | Date;
  repo?: string;
  stack?: string[];
};

const SYSTEMS_CONTENT_DIR = path.join(process.cwd(), "content", "systems");

function sectionMapFromMarkdown(content: string) {
  const sections = new Map<string, string>();
  const normalized = content.replace(/\r\n/g, "\n");
  const matches = Array.from(normalized.matchAll(/^##\s+(.+)$/gm));

  matches.forEach((match, index) => {
    const title = match[1]?.trim().toLowerCase();
    const start = match.index !== undefined ? match.index + match[0].length : 0;
    const end = index + 1 < matches.length && matches[index + 1].index !== undefined ? matches[index + 1].index : normalized.length;
    const body = normalized.slice(start, end).trim();
    if (title) {
      sections.set(title, body);
    }
  });

  return sections;
}

function bulletLines(value: string | undefined) {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^-\s+/, "").trim())
    .filter(Boolean);
}

function paragraphText(value: string | undefined) {
  if (!value) return "";
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");
}

function normalizeDateValue(value: string | Date | undefined) {
  if (!value) return null;
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return parsed.toISOString().slice(0, 10);
  }

  return value;
}

function mergeOverride(entry: SystemsEntry, override?: SystemsOverrideRecord): SystemsEntry {
  if (!override) return entry;

  return {
    ...entry,
    status: override.status ?? entry.status,
    phase: override.phase ?? entry.phase,
    summary: override.summary ?? entry.summary,
    latestMilestone: override.latestMilestone ?? entry.latestMilestone,
    words: override.words ?? entry.words,
    nextStep: override.nextStep ?? entry.nextStep,
    updatedAt: override.updatedAt ?? entry.updatedAt,
    learningFocus: override.learningFocus?.length ? override.learningFocus : entry.learningFocus,
  };
}

async function readBaseSystemsEntries() {
  const files = (await fs.readdir(SYSTEMS_CONTENT_DIR)).filter((file) => file.endsWith(".md")).sort();

  const entries = await Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(SYSTEMS_CONTENT_DIR, file);
      const raw = await fs.readFile(fullPath, "utf8");
      const parsed = matter(raw);
      const data = parsed.data as SystemsFrontmatter;
      const sections = sectionMapFromMarkdown(parsed.content);

      const slug = data.slug ?? file.replace(/\.md$/, "");
      const title = data.title ?? slug;
      const status = data.status ?? "Planned";
      const phase = data.phase ?? "Planning";
      const startedAt =
        normalizeDateValue(data.startedAt) ??
        normalizeDateValue(data.updatedAt) ??
        new Date().toISOString().slice(0, 10);
      const updatedAt = normalizeDateValue(data.updatedAt) ?? startedAt;
      const repo = data.repo ?? "";
      const stack = Array.isArray(data.stack) ? data.stack : [];

      return {
        slug,
        title,
        status,
        phase,
        startedAt,
        updatedAt,
        repo,
        stack,
        summary: paragraphText(sections.get("what i'm building")),
        learningFocus: bulletLines(sections.get("what i'm learning")),
        latestMilestone: paragraphText(sections.get("latest milestone")),
        words: paragraphText(sections.get("my words")),
        nextStep: paragraphText(sections.get("next step")),
      } satisfies SystemsEntry;
    })
  );

  return entries.sort((left, right) => {
    if (left.startedAt === right.startedAt) return left.title.localeCompare(right.title);
    return left.startedAt.localeCompare(right.startedAt);
  });
}

export async function getSystemsTimelineBase() {
  return readBaseSystemsEntries();
}

export async function getSystemsTimeline() {
  const [entries, overrides] = await Promise.all([readBaseSystemsEntries(), getSystemsOverrides()]);
  return entries.map((entry) => mergeOverride(entry, overrides[entry.slug]));
}
