import icons from "@/generated/tech-icons.json";
import { techIconSlug } from "@/lib/site";

const ICONS = icons as Record<string, string>;

/**
 * Inlined simple-icons mark. Fetched at build time by scripts/fetch-tech-icons.mjs
 * so a page full of technologies makes no third-party requests. Renders nothing
 * when there is no mark for the label.
 */
export function TechIcon({ name, size = 12 }: { name: string; size?: number }) {
  const slug = techIconSlug(name);
  const svg = slug ? ICONS[slug] : undefined;
  if (!svg) return null;

  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center text-[var(--soft)] opacity-80 [&>svg]:h-full [&>svg]:w-full"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
