/**
 * Fetches the simple-icons SVG for every tech slug used on the site and writes
 * them into a single generated module, so the pages ship zero third-party
 * icon requests at runtime.
 */
import fs from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "src", "generated", "tech-icons.json");

const source = await fs.readFile(path.join(process.cwd(), "src", "lib", "site.ts"), "utf8");
const slugs = [...new Set([...source.matchAll(/slug:\s*"([a-z0-9.+-]+)"/g)].map((m) => m[1]))];
const extras = [...new Set([...source.matchAll(/:\s*"([a-z0-9.+-]+)",\s*$/gm)].map((m) => m[1]))];
const all = [...new Set([...slugs, ...extras])];

const icons = {};
let missing = [];

await Promise.all(
  all.map(async (slug) => {
    try {
      const res = await fetch(`https://cdn.simpleicons.org/${slug}`);
      if (!res.ok) {
        missing.push(slug);
        return;
      }
      const svg = await res.text();
      if (!svg.trimStart().startsWith("<svg")) {
        missing.push(slug);
        return;
      }
      // Strip the fixed fill so the mark inherits currentColor.
      icons[slug] = svg
        .replace(/\s(width|height)="[^"]*"/g, "")
        .replace(/fill="[^"]*"/g, 'fill="currentColor"')
        .replace(/<svg /, '<svg fill="currentColor" ');
    } catch {
      missing.push(slug);
    }
  })
);

await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(OUT, JSON.stringify(icons, null, 0));

console.log(`tech-icons: wrote ${Object.keys(icons).length} icons`);
if (missing.length) console.log(`tech-icons: no icon for ${missing.join(", ")}`);
