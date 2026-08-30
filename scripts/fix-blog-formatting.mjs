/**
 * Repairs the stored HTML for the blog post whose markdown used nested ```
 * fences. A ```construct block containing a ```json / ```ts sub-block closed
 * early at the inner fence, so the prose that followed was swallowed into
 * <pre><code> and the remaining code was split across stray blocks.
 *
 * This re-partitions those regions using the exact text already present —
 * no wording is added, removed, or altered.
 *
 * Usage: node scripts/fix-blog-formatting.mjs [--write]
 */
import fs from "node:fs";

const WRITE = process.argv.includes("--write");

for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const { sql } = await import("@vercel/postgres");

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const unescape = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

const codeBlock = (lang, body) =>
  `<pre><code${lang ? ` class="language-${lang}"` : ""}>${escape(
    body.replace(/\s+$/, "") + "\n"
  )}</code></pre>`;

/** Inline markdown that survived inside the mis-parsed blocks. */
function inline(text) {
  return escape(text)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

/**
 * Turns the raw text of a mis-parsed block back into real nodes: fenced
 * sections become code blocks, numbered runs become an ordered list, and
 * everything else becomes paragraphs.
 */
function reflow(raw) {
  const out = [];
  const lines = raw.split("\n");
  let i = 0;
  let para = [];
  let list = [];

  const flushPara = () => {
    if (!para.length) return;
    out.push(`<p>${inline(para.join(" ").trim())}</p>`);
    para = [];
  };
  const flushList = () => {
    if (!list.length) return;
    out.push(
      `<ol>\n${list.map((item) => `<li>${inline(item)}</li>`).join("\n")}\n</ol>`
    );
    list = [];
  };

  while (i < lines.length) {
    const line = lines[i];

    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      flushPara();
      flushList();
      const lang = fence[1] || "";
      const body = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        body.push(lines[i]);
        i += 1;
      }
      i += 1; // consume the closing fence when present
      out.push(codeBlock(lang, body.join("\n")));
      continue;
    }

    if (!line.trim()) {
      flushPara();
      flushList();
      i += 1;
      continue;
    }

    const ordered = line.match(/^\s*\d+\.\s+(.*)$/);
    if (ordered) {
      flushPara();
      list.push(ordered[1].trim());
      i += 1;
      continue;
    }

    flushList();
    para.push(line.trim());
    i += 1;
  }

  flushPara();
  flushList();
  return out.join("\n");
}

const res = await sql`SELECT id, slug, content_html FROM blog_posts ORDER BY updated_at DESC LIMIT 1;`;
const post = res.rows[0];
let html = post.content_html;
const before = html;

/* ---------------------------------------------------------------------
   1. The ::files scaffold was split into three nodes by its nested fences.
      Merge them back into one construct block.
   --------------------------------------------------------------------- */
const filesRe =
  /<pre><code class="language-construct">(::files[\s\S]*?)<\/code><\/pre>\s*<p>(::file path="src\/domain\/types\.ts")<\/p>\s*<pre><code class="language-ts">([\s\S]*?)<\/code><\/pre>/;

html = html.replace(filesRe, (_m, filesBody, filePath, tsBody) => {
  const body = [
    unescape(filesBody).replace(/\s+$/, ""),
    "```",
    "",
    unescape(filePath),
    "```ts",
    unescape(tsBody).replace(/\s+$/, ""),
    "```",
  ].join("\n");
  return codeBlock("construct", body);
});

/* ---------------------------------------------------------------------
   2 & 3. Two blocks captured prose as code. Re-partition their contents.
      The trailing fenced section of each keeps its own language.
   --------------------------------------------------------------------- */
const strayRe = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;
html = html.replace(strayRe, (_m, body) => reflow(unescape(body)));

/* ---------------------------------------------------------------------
   4. The concept card's continuation was left as three loose paragraphs
      after its block. Fold them back in so the card reads as one unit.
   --------------------------------------------------------------------- */
const contRe =
  /(<pre><code class="language-construct">[\s\S]*?)<\/code><\/pre>\s*<p>(Do not treat lifecycle as a UI label\.)<\/p>\s*<p>(Lifecycle is a guardrail for behavior\.)<\/p>\s*<p>(title="OCI Runtime Specification"[\s\S]*?)<\/p>/;

html = html.replace(contRe, (_m, head, mistake, guardrail, doc) => {
  const docText = unescape(doc.replace(/<a[^>]*>([\s\S]*?)<\/a>/g, "$1"));
  const tail = ["", mistake, "", guardrail, "", docText].join("\n");
  return `${head}${escape(tail)}\n</code></pre>`;
});

const changed = html !== before;
const strayLeft = (html.match(/<pre><code>/g) || []).length;

console.log(`post:        ${post.slug}`);
console.log(`changed:     ${changed}`);
console.log(`length:      ${before.length} -> ${html.length}`);
console.log(`stray <pre><code> without a language remaining: ${strayLeft}`);

fs.writeFileSync("/tmp/post-fixed.html", html);
console.log("preview written to /tmp/post-fixed.html");

if (WRITE && changed) {
  await sql`UPDATE blog_posts SET content_html = ${html} WHERE id = ${post.id};`;
  console.log("database updated");
} else if (!WRITE) {
  console.log("dry run — pass --write to persist");
}
