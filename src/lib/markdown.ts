/**
 * CommonMark closes a fenced code block at the first ``` it sees, so a block
 * that legitimately contains a nested fence — a ```construct tape holding a
 * ```json file, say — terminates early and everything after it is mis-parsed:
 * prose gets swallowed into <pre>, and the rest of the code spills into stray
 * blocks.
 *
 * This normalises the source before parsing by treating a fence that carries a
 * language as an opener and a bare fence as a closer, then re-emitting any
 * outer block that contains nested fences with a longer delimiter. Markdown
 * without nesting passes through untouched.
 */
export function normalizeNestedFences(markdown: string): string {
  const lines = markdown.split("\n");

  type Open = { line: number; indent: string; lang: string };
  const stack: Open[] = [];
  /** Outer blocks that turned out to contain a nested fence. */
  const nested: Array<{ open: number; close: number }> = [];

  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(/^(\s*)(`{3,})(.*)$/);
    if (!match) continue;

    const [, indent, , rest] = match;
    const lang = rest.trim();

    if (lang) {
      stack.push({ line: i, indent, lang });
      continue;
    }

    // A bare fence closes the innermost open block, or opens a plain one.
    const open = stack.pop();
    if (!open) {
      stack.push({ line: i, indent, lang: "" });
      continue;
    }
    if (stack.length) {
      // This pair sat inside another block, so that outer block is nested.
      const outer = stack[stack.length - 1];
      if (!nested.some((entry) => entry.open === outer.line)) {
        nested.push({ open: outer.line, close: -1 });
      }
    }
    const pending = nested.find((entry) => entry.open === open.line);
    if (pending) pending.close = i;
  }

  if (!nested.length) return markdown;

  const out = [...lines];
  for (const { open, close } of nested) {
    if (close < 0) continue;
    const openMatch = out[open].match(/^(\s*)(`{3,})(.*)$/);
    const closeMatch = out[close].match(/^(\s*)(`{3,})\s*$/);
    if (!openMatch || !closeMatch) continue;

    const longest = Math.max(
      ...out
        .slice(open + 1, close)
        .map((line) => line.match(/^\s*(`{3,})/)?.[1].length ?? 0)
    );
    const delimiter = "`".repeat(Math.max(4, longest + 1));

    out[open] = `${openMatch[1]}${delimiter}${openMatch[3]}`;
    out[close] = `${closeMatch[1]}${delimiter}`;
  }

  return out.join("\n");
}
