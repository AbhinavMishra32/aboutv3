"use client";

import { useDeferredValue, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { marked } from "marked";
import TurndownService from "turndown";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import type { BlobLink, BlobRecord, BlobStatus } from "@/lib/blob-studio";
import { BLOB_STUDIO_STORAGE_KEY, getBlobStudioSnapshot } from "@/lib/blob-studio";

const turndownService = new TurndownService({
  codeBlockStyle: "fenced",
  headingStyle: "atx",
  bulletListMarker: "-",
});

function createBlankBlob(index: number): BlobRecord {
  const now = new Date().toISOString();
  const slug = `new-blob-${index}`;

  return {
    id: `${slug}-${Math.random().toString(36).slice(2, 8)}`,
    title: `New Blob ${index}`,
    slug,
    excerpt: "A fresh blob for product notes, links, embeds, and markdown-ready writing.",
    category: "Fresh draft",
    status: "draft",
    coverTone: index % 3 === 0 ? "aurora" : index % 3 === 1 ? "ember" : "ocean",
    tags: ["fresh", "draft"],
    createdAt: now,
    updatedAt: now,
    contentHtml: "<p>Start with a title, then shape the body here.</p>",
    links: [],
    embeds: [],
  };
}

function formatAbsoluteDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatRelativeDate(value: string) {
  const diff = new Date(value).getTime() - Date.now();
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const minutes = Math.round(diff / 60000);

  if (Math.abs(minutes) < 60) {
    return formatter.format(minutes, "minute");
  }

  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) {
    return formatter.format(hours, "hour");
  }

  const days = Math.round(hours / 24);
  return formatter.format(days, "day");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function stripHtml(html: string) {
  if (typeof window === "undefined") return html;

  const container = window.document.createElement("div");
  container.innerHTML = html;
  return container.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function deriveExcerpt(text: string, fallback: string) {
  if (!text) return fallback;
  return text.length > 160 ? `${text.slice(0, 157).trim()}...` : text;
}

function getEmbedType(url: string) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("figma.com")) return "figma";
  if (url.includes("spotify.com")) return "spotify";
  if (url.includes("loom.com")) return "loom";
  return "link";
}

function renderEmbed(url: string) {
  const type = getEmbedType(url);

  if (type === "youtube") {
    return (
      <iframe
        src={url.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/")}
        title="YouTube embed"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (type === "spotify") {
    return <iframe src={url.replace("/track/", "/embed/track/")} title="Spotify embed" allow="encrypted-media" />;
  }

  if (type === "figma") {
    return <iframe src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`} title="Figma embed" allowFullScreen />;
  }

  if (type === "loom") {
    return <iframe src={url.replace("/share/", "/embed/")} title="Loom embed" allowFullScreen />;
  }

  return null;
}

function ToolbarButton({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className={`blob-toolbar-button ${active ? "is-active" : ""}`} onClick={onClick}>
      {label}
    </button>
  );
}

export function BlobStudioClient({ initialBlobs }: { initialBlobs: BlobRecord[] }) {
  const [blobs, setBlobs] = useState(initialBlobs);
  const [selectedId, setSelectedId] = useState(initialBlobs[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [tagDraft, setTagDraft] = useState("");
  const [markdownDraft, setMarkdownDraft] = useState("");
  const [linkDraft, setLinkDraft] = useState({ label: "", url: "", kind: "reference" as BlobLink["kind"] });
  const [embedDraft, setEmbedDraft] = useState({ label: "", url: "", caption: "" });
  const [toast, setToast] = useState("");
  const [isPending, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);
  const toastTimerRef = useRef<number | null>(null);

  const selectedBlob = blobs.find((blob) => blob.id === selectedId) ?? blobs[0] ?? null;
  const filteredBlobs = blobs.filter((blob) => {
    const haystack = `${blob.title} ${blob.category} ${blob.tags.join(" ")} ${blob.excerpt}`.toLowerCase();
    return haystack.includes(deferredSearch.trim().toLowerCase());
  });
  const studioSnapshot = getBlobStudioSnapshot(blobs);

  function showToast(message: string) {
    setToast(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => setToast(""), 2200);
  }

  function updateSelectedBlob(updater: (blob: BlobRecord) => BlobRecord) {
    setBlobs((current) =>
      current.map((blob) => {
        if (blob.id !== selectedId) return blob;
        const next = updater(blob);
        return {
          ...next,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({
        placeholder: "Write the blob. Add links, structure, embeds, and publishing notes here.",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noreferrer noopener",
          target: "_blank",
        },
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
    ],
    content: selectedBlob?.contentHtml ?? "<p></p>",
    editorProps: {
      attributes: {
        class: "blob-editor-surface",
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      const html = activeEditor.getHTML();
      const text = activeEditor.getText().trim();
      updateSelectedBlob((blob) => ({
        ...blob,
        contentHtml: html,
        excerpt: deriveExcerpt(text, blob.excerpt),
      }));
    },
  });

  useEffect(() => {
    const raw = window.localStorage.getItem(BLOB_STUDIO_STORAGE_KEY);

    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as BlobRecord[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setBlobs(parsed);
        setSelectedId(parsed[0].id);
      }
    } catch {
      window.localStorage.removeItem(BLOB_STUDIO_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!blobs.length) return;
    window.localStorage.setItem(BLOB_STUDIO_STORAGE_KEY, JSON.stringify(blobs));
  }, [blobs]);

  useEffect(() => {
    if (!selectedBlob || !editor) return;
    if (editor.getHTML() === selectedBlob.contentHtml) return;

    editor.commands.setContent(selectedBlob.contentHtml, { emitUpdate: false });
    setMarkdownDraft(turndownService.turndown(selectedBlob.contentHtml));
  }, [editor, selectedBlob]);

  useEffect(() => {
    if (!selectedBlob) return;
    setMarkdownDraft(turndownService.turndown(selectedBlob.contentHtml));
  }, [selectedBlob]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedBlob) return;
    if (blobs[0]) setSelectedId(blobs[0].id);
  }, [blobs, selectedBlob]);

  async function handleMarkdownImport() {
    if (!selectedBlob || !editor || !markdownDraft.trim()) return;

    const parsed = await marked.parse(markdownDraft);
    const html = typeof parsed === "string" ? parsed : "";
    editor.commands.setContent(html, { emitUpdate: false });
    updateSelectedBlob((blob) => ({
      ...blob,
      contentHtml: html,
      excerpt: deriveExcerpt(stripHtml(html), blob.excerpt),
    }));
    showToast("Markdown synced into the blob.");
  }

  async function handleCopyMarkdown() {
    if (!selectedBlob) return;
    const markdown = turndownService.turndown(selectedBlob.contentHtml);
    await navigator.clipboard.writeText(markdown);
    showToast("Markdown copied.");
  }

  async function handleCopyJson() {
    if (!selectedBlob) return;
    await navigator.clipboard.writeText(JSON.stringify(selectedBlob, null, 2));
    showToast("Blob JSON copied.");
  }

  function handleCreateBlob() {
    startTransition(() => {
      const created = createBlankBlob(blobs.length + 1);
      setBlobs((current) => [created, ...current]);
      setSelectedId(created.id);
      showToast("Fresh blob ready.");
    });
  }

  function handleDuplicateBlob() {
    if (!selectedBlob) return;

    startTransition(() => {
      const now = new Date().toISOString();
      const duplicate: BlobRecord = {
        ...selectedBlob,
        id: `${selectedBlob.slug}-${Math.random().toString(36).slice(2, 8)}`,
        title: `${selectedBlob.title} Copy`,
        slug: `${selectedBlob.slug}-copy`,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      };

      setBlobs((current) => [duplicate, ...current]);
      setSelectedId(duplicate.id);
      showToast("Blob duplicated.");
    });
  }

  function handleDeleteBlob() {
    if (!selectedBlob || blobs.length === 1) return;

    const next = blobs.filter((blob) => blob.id !== selectedBlob.id);
    setBlobs(next);
    setSelectedId(next[0].id);
    showToast("Blob removed from the deck.");
  }

  function handleAddTag() {
    const nextTag = tagDraft.trim();
    if (!nextTag || !selectedBlob) return;
    if (selectedBlob.tags.includes(nextTag)) {
      setTagDraft("");
      return;
    }

    updateSelectedBlob((blob) => ({
      ...blob,
      tags: [...blob.tags, nextTag],
    }));
    setTagDraft("");
  }

  function handleAddLink() {
    if (!selectedBlob || !linkDraft.label.trim() || !linkDraft.url.trim()) return;

    updateSelectedBlob((blob) => ({
      ...blob,
      links: [
        ...blob.links,
        {
          id: `link-${Math.random().toString(36).slice(2, 8)}`,
          label: linkDraft.label.trim(),
          url: linkDraft.url.trim(),
          kind: linkDraft.kind,
        },
      ],
    }));
    setLinkDraft({ label: "", url: "", kind: "reference" });
    showToast("Link pinned into the blob.");
  }

  function handleAddEmbed() {
    if (!selectedBlob || !embedDraft.label.trim() || !embedDraft.url.trim()) return;

    updateSelectedBlob((blob) => ({
      ...blob,
      embeds: [
        ...blob.embeds,
        {
          id: `embed-${Math.random().toString(36).slice(2, 8)}`,
          label: embedDraft.label.trim(),
          url: embedDraft.url.trim(),
          caption: embedDraft.caption.trim(),
        },
      ],
    }));
    setEmbedDraft({ label: "", url: "", caption: "" });
    showToast("Embed docked into the blob.");
  }

  function handleInsertYoutube(url: string) {
    if (!editor || !url.trim()) return;

    editor.chain().focus().setYoutubeVideo({ src: url.trim(), width: 640, height: 360 }).run();
    showToast("YouTube embed inserted into the editor.");
  }

  if (!selectedBlob) {
    return null;
  }

  const markdownExport = turndownService.turndown(selectedBlob.contentHtml);

  return (
    <section className="blob-studio-shell">
      <div className="blob-studio-hero">
        <div>
          <p className="eyebrow">Blob Studio</p>
          <h1 className="blob-studio-title">A full in-site creation system for rich portfolio blobs.</h1>
          <p className="blob-studio-lead">
            Build new blobs directly inside the website with structured metadata, Tiptap editing, link rails, embed
            docks, markdown exchange, and a visible last-updated heartbeat for the whole system.
          </p>
        </div>
        <div className="blob-system-strip">
          <div className="blob-system-card">
            <span>System updated</span>
            <strong>{formatRelativeDate(studioSnapshot.latestUpdatedAt)}</strong>
            <small>{formatAbsoluteDate(studioSnapshot.latestUpdatedAt)}</small>
          </div>
          <div className="blob-system-card">
            <span>Blob count</span>
            <strong>{studioSnapshot.total}</strong>
            <small>
              {studioSnapshot.live} live · {studioSnapshot.pinned} pinned
            </small>
          </div>
          <div className="blob-system-card">
            <span>Attached context</span>
            <strong>{studioSnapshot.links + studioSnapshot.embeds}</strong>
            <small>
              {studioSnapshot.links} links · {studioSnapshot.embeds} embeds
            </small>
          </div>
        </div>
      </div>

      <div className="blob-studio-workbench">
        <aside className="blob-sidebar">
          <div className="blob-sidebar-head">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="blob-input"
              placeholder="Search blobs, tags, or categories"
            />
            <button type="button" className="blob-pill-button" onClick={handleCreateBlob}>
              New blob
            </button>
          </div>

          <div className="blob-sidebar-list">
            {filteredBlobs.map((blob) => (
              <button
                key={blob.id}
                type="button"
                onClick={() => setSelectedId(blob.id)}
                className={`blob-sidebar-card ${blob.id === selectedBlob.id ? "is-active" : ""}`}
              >
                <div className="blob-sidebar-meta">
                  <span className={`blob-status-pill is-${blob.status}`}>{blob.status}</span>
                  <span>{blob.category}</span>
                </div>
                <strong>{blob.title}</strong>
                <p>{blob.excerpt}</p>
                <div className="blob-sidebar-foot">
                  <span>{blob.tags.slice(0, 3).join(" · ")}</span>
                  <span>{formatRelativeDate(blob.updatedAt)}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <div className="blob-editor-stack">
          <div className="blob-meta-panel">
            <div className="blob-meta-grid">
              <label className="blob-field">
                <span>Title</span>
                <input
                  className="blob-input"
                  value={selectedBlob.title}
                  onChange={(event) =>
                    updateSelectedBlob((blob) => ({
                      ...blob,
                      title: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="blob-field">
                <span>Slug</span>
                <input
                  className="blob-input"
                  value={selectedBlob.slug}
                  onChange={(event) =>
                    updateSelectedBlob((blob) => ({
                      ...blob,
                      slug: slugify(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="blob-field">
                <span>Category</span>
                <input
                  className="blob-input"
                  value={selectedBlob.category}
                  onChange={(event) =>
                    updateSelectedBlob((blob) => ({
                      ...blob,
                      category: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="blob-field">
                <span>Status</span>
                <select
                  className="blob-input"
                  value={selectedBlob.status}
                  onChange={(event) =>
                    updateSelectedBlob((blob) => ({
                      ...blob,
                      status: event.target.value as BlobStatus,
                    }))
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="live">Live</option>
                  <option value="pinned">Pinned</option>
                </select>
              </label>
            </div>

            <label className="blob-field">
              <span>Excerpt</span>
              <textarea
                className="blob-textarea"
                value={selectedBlob.excerpt}
                onChange={(event) =>
                  updateSelectedBlob((blob) => ({
                    ...blob,
                    excerpt: event.target.value,
                  }))
                }
              />
            </label>

            <div className="blob-tags-panel">
              <div className="blob-tag-list">
                {selectedBlob.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="blob-tag-chip"
                    onClick={() =>
                      updateSelectedBlob((blob) => ({
                        ...blob,
                        tags: blob.tags.filter((entry) => entry !== tag),
                      }))
                    }
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="blob-tag-entry">
                <input
                  className="blob-input"
                  value={tagDraft}
                  onChange={(event) => setTagDraft(event.target.value)}
                  placeholder="Add tag"
                />
                <button type="button" className="blob-pill-button" onClick={handleAddTag}>
                  Add tag
                </button>
              </div>
            </div>

            <div className="blob-command-row">
              <button type="button" className="blob-pill-button" onClick={handleDuplicateBlob}>
                Duplicate
              </button>
              <button type="button" className="blob-pill-button" onClick={handleDeleteBlob}>
                Delete
              </button>
              <button type="button" className="blob-pill-button" onClick={() => void handleCopyJson()}>
                Copy JSON
              </button>
              <button type="button" className="blob-pill-button" onClick={() => void handleCopyMarkdown()}>
                Copy markdown
              </button>
              <span className="blob-pending-state">
                {isPending ? "Syncing deck..." : `Updated ${formatRelativeDate(selectedBlob.updatedAt)}`}
              </span>
            </div>
          </div>

          <div className="blob-editor-panel">
            <div className="blob-toolbar">
              <ToolbarButton label="B" active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()} />
              <ToolbarButton label="I" active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()} />
              <ToolbarButton label="U" active={editor?.isActive("underline")} onClick={() => editor?.chain().focus().toggleUnderline().run()} />
              <ToolbarButton label="H1" active={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} />
              <ToolbarButton label="Quote" active={editor?.isActive("blockquote")} onClick={() => editor?.chain().focus().toggleBlockquote().run()} />
              <ToolbarButton label="Code" active={editor?.isActive("codeBlock")} onClick={() => editor?.chain().focus().toggleCodeBlock().run()} />
              <ToolbarButton label="Task" active={editor?.isActive("taskList")} onClick={() => editor?.chain().focus().toggleTaskList().run()} />
              <ToolbarButton label="HL" active={editor?.isActive("highlight")} onClick={() => editor?.chain().focus().toggleHighlight().run()} />
              <ToolbarButton label="Left" onClick={() => editor?.chain().focus().setTextAlign("left").run()} />
              <ToolbarButton label="Center" onClick={() => editor?.chain().focus().setTextAlign("center").run()} />
              <ToolbarButton
                label="Link"
                onClick={() => {
                  const url = window.prompt("Paste a URL");
                  if (!url) return;
                  editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
                }}
              />
            </div>

            <EditorContent editor={editor} />
          </div>
        </div>

        <aside className="blob-preview-stack">
          <section className="blob-side-panel">
            <div className="blob-panel-head">
              <h2>Links</h2>
              <small>Attach launches, references, and source context.</small>
            </div>
            <div className="blob-composer-grid">
              <input
                className="blob-input"
                placeholder="Label"
                value={linkDraft.label}
                onChange={(event) => setLinkDraft((current) => ({ ...current, label: event.target.value }))}
              />
              <input
                className="blob-input"
                placeholder="https://"
                value={linkDraft.url}
                onChange={(event) => setLinkDraft((current) => ({ ...current, url: event.target.value }))}
              />
              <select
                className="blob-input"
                value={linkDraft.kind}
                onChange={(event) => setLinkDraft((current) => ({ ...current, kind: event.target.value as BlobLink["kind"] }))}
              >
                <option value="reference">Reference</option>
                <option value="launch">Launch</option>
                <option value="source">Source</option>
              </select>
              <button type="button" className="blob-pill-button" onClick={handleAddLink}>
                Add link
              </button>
            </div>
            <div className="blob-attached-list">
              {selectedBlob.links.map((link) => (
                <div key={link.id} className="blob-attached-card">
                  <div>
                    <strong>{link.label}</strong>
                    <p>{link.url}</p>
                  </div>
                  <button
                    type="button"
                    className="blob-inline-action"
                    onClick={() =>
                      updateSelectedBlob((blob) => ({
                        ...blob,
                        links: blob.links.filter((entry) => entry.id !== link.id),
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="blob-side-panel">
            <div className="blob-panel-head">
              <h2>Embeds</h2>
              <small>Dock media, demos, docs, or boards next to the writing.</small>
            </div>
            <div className="blob-composer-grid">
              <input
                className="blob-input"
                placeholder="Label"
                value={embedDraft.label}
                onChange={(event) => setEmbedDraft((current) => ({ ...current, label: event.target.value }))}
              />
              <input
                className="blob-input"
                placeholder="https://"
                value={embedDraft.url}
                onChange={(event) => setEmbedDraft((current) => ({ ...current, url: event.target.value }))}
              />
              <input
                className="blob-input"
                placeholder="Caption"
                value={embedDraft.caption}
                onChange={(event) => setEmbedDraft((current) => ({ ...current, caption: event.target.value }))}
              />
              <button type="button" className="blob-pill-button" onClick={handleAddEmbed}>
                Add embed
              </button>
            </div>

            <div className="blob-attached-list">
              {selectedBlob.embeds.map((embed) => (
                <div key={embed.id} className="blob-attached-card blob-attached-card--stack">
                  <div>
                    <strong>{embed.label}</strong>
                    <p>{embed.caption || embed.url}</p>
                  </div>
                  <div className="blob-embed-actions">
                    <button type="button" className="blob-inline-action" onClick={() => handleInsertYoutube(embed.url)}>
                      Insert media
                    </button>
                    <button
                      type="button"
                      className="blob-inline-action"
                      onClick={() =>
                        updateSelectedBlob((blob) => ({
                          ...blob,
                          embeds: blob.embeds.filter((entry) => entry.id !== embed.id),
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="blob-side-panel">
            <div className="blob-panel-head">
              <h2>Markdown Deck</h2>
              <small>Round-trip content between rich editing and markdown.</small>
            </div>
            <textarea
              className="blob-textarea blob-textarea--code"
              value={markdownDraft}
              onChange={(event) => setMarkdownDraft(event.target.value)}
            />
            <div className="blob-command-row">
              <button type="button" className="blob-pill-button" onClick={() => void handleMarkdownImport()}>
                Sync markdown into blob
              </button>
              <span className="blob-pending-state">{markdownExport.split(/\s+/).filter(Boolean).length} words exported</span>
            </div>
          </section>

          <section className="blob-side-panel blob-render-panel">
            <div className="blob-panel-head">
              <h2>Live Blob Preview</h2>
              <small>What this blob feels like as a public-facing content object.</small>
            </div>

            <div className={`blob-preview-card tone-${selectedBlob.coverTone}`}>
              <div className="blob-preview-meta">
                <span className={`blob-status-pill is-${selectedBlob.status}`}>{selectedBlob.status}</span>
                <span>{selectedBlob.category}</span>
                <span>{formatAbsoluteDate(selectedBlob.updatedAt)}</span>
              </div>
              <h3>{selectedBlob.title}</h3>
              <p className="blob-preview-excerpt">{selectedBlob.excerpt}</p>
              <div className="blob-preview-tags">
                {selectedBlob.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="blob-preview-prose" dangerouslySetInnerHTML={{ __html: selectedBlob.contentHtml }} />

              {selectedBlob.links.length ? (
                <div className="blob-preview-link-grid">
                  {selectedBlob.links.map((link) => (
                    <Link key={link.id} href={link.url} target="_blank" rel="noreferrer" className="blob-preview-link-card">
                      <span>{link.kind}</span>
                      <strong>{link.label}</strong>
                      <small>{link.url}</small>
                    </Link>
                  ))}
                </div>
              ) : null}

              {selectedBlob.embeds.length ? (
                <div className="blob-preview-embed-grid">
                  {selectedBlob.embeds.map((embed) => (
                    <div key={embed.id} className="blob-embed-card">
                      <div className="blob-embed-frame">{renderEmbed(embed.url) ?? <p>{embed.url}</p>}</div>
                      <div>
                        <strong>{embed.label}</strong>
                        <p>{embed.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        </aside>
      </div>

      {toast ? <div className="blob-toast">{toast}</div> : null}
    </section>
  );
}
