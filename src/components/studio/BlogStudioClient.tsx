"use client";

import { useDeferredValue, useEffect, useRef, useState, useTransition } from "react";
import { marked } from "marked";
import TurndownService from "turndown";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import {
  AlignCenter,
  AlignLeft,
  Bold,
  CheckSquare,
  Code2,
  Copy,
  Eye,
  Heading2,
  Highlighter,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  PanelRight,
  Plus,
  Quote,
  Save,
  Search,
  Trash2,
  UnderlineIcon,
  Video,
} from "lucide-react";
import type { BlogPostDraft, BlogPostStatus } from "@/lib/blog-studio";
import { deletePostAction, savePostAction, uploadBlogImageAction } from "@/app/studio/actions";

const turndownService = new TurndownService({
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  headingStyle: "atx",
});

type ToolbarAction = {
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  active?: boolean;
  onClick: () => void;
};

function createBlankPost(index: number): BlogPostDraft {
  const now = new Date().toISOString();

  return {
    id: `post-${Date.now()}`,
    title: `Untitled Post ${index}`,
    slug: `untitled-post-${index}`,
    excerpt: "",
    category: "Draft",
    status: "draft",
    tags: ["draft"],
    createdAt: now,
    updatedAt: now,
    contentHtml: "<h2>Untitled Post</h2><p>Start writing.</p>",
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
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
  return text.length > 150 ? `${text.slice(0, 147).trim()}...` : text;
}

function IconButton({ action }: { action: ToolbarAction }) {
  const Icon = action.icon;

  return (
    <button
      type="button"
      className={`studio-icon-button ${action.active ? "is-active" : ""}`}
      onClick={action.onClick}
      title={action.label}
      aria-label={action.label}
    >
      <Icon size={16} strokeWidth={2} />
    </button>
  );
}

export function BlogStudioClient({
  initialPosts,
  hasDatabase,
}: {
  initialPosts: BlogPostDraft[];
  hasDatabase: boolean;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedId, setSelectedId] = useState(initialPosts[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [markdownDraft, setMarkdownDraft] = useState("");
  const [rightPanel, setRightPanel] = useState<"settings" | "preview" | "markdown">("settings");
  const [toast, setToast] = useState("");
  const [saveState, setSaveState] = useState<"saved" | "unsaved" | "saving" | "error">("saved");
  const [isPending, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);
  const toastTimerRef = useRef<number | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const selectedPost = posts.find((post) => post.id === selectedId) ?? posts[0] ?? null;
  const filteredPosts = posts.filter((post) => {
    const query = deferredSearch.toLowerCase().trim();
    const haystack = `${post.title} ${post.category} ${post.tags.join(" ")} ${post.excerpt}`.toLowerCase();
    return !query || haystack.includes(query);
  });

  function showToast(message: string) {
    setToast(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => setToast(""), 1800);
  }

  function updateSelectedPost(updater: (post: BlogPostDraft) => BlogPostDraft) {
    setSaveState("unsaved");
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== selectedId) return post;
        return {
          ...updater(post),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: false,
        HTMLAttributes: {
          loading: "lazy",
        },
      }),
      Underline,
      Highlight,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({
        placeholder: "Write the post here. Paste links, format sections, add tasks, or insert a video from the toolbar.",
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
        modestBranding: true,
      }),
    ],
    content: selectedPost?.contentHtml ?? "<p></p>",
    editorProps: {
      attributes: {
        class: "studio-editor-surface",
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      const html = activeEditor.getHTML();
      const text = activeEditor.getText().trim();
      updateSelectedPost((post) => ({
        ...post,
        contentHtml: html,
        excerpt: deriveExcerpt(text, post.excerpt),
      }));
    },
  });

  const wordCount = editor?.getText().split(/\s+/).filter(Boolean).length ?? 0;
  const markdownExport = selectedPost ? turndownService.turndown(selectedPost.contentHtml) : "";

  const toolbarActions: ToolbarAction[] = [
    { label: "Bold", icon: Bold, active: editor?.isActive("bold"), onClick: () => editor?.chain().focus().toggleBold().run() },
    { label: "Italic", icon: Italic, active: editor?.isActive("italic"), onClick: () => editor?.chain().focus().toggleItalic().run() },
    { label: "Underline", icon: UnderlineIcon, active: editor?.isActive("underline"), onClick: () => editor?.chain().focus().toggleUnderline().run() },
    { label: "Highlight", icon: Highlighter, active: editor?.isActive("highlight"), onClick: () => editor?.chain().focus().toggleHighlight().run() },
    { label: "Heading", icon: Heading2, active: editor?.isActive("heading", { level: 2 }), onClick: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Quote", icon: Quote, active: editor?.isActive("blockquote"), onClick: () => editor?.chain().focus().toggleBlockquote().run() },
    { label: "Bullet list", icon: List, active: editor?.isActive("bulletList"), onClick: () => editor?.chain().focus().toggleBulletList().run() },
    { label: "Numbered list", icon: ListOrdered, active: editor?.isActive("orderedList"), onClick: () => editor?.chain().focus().toggleOrderedList().run() },
    { label: "Task list", icon: CheckSquare, active: editor?.isActive("taskList"), onClick: () => editor?.chain().focus().toggleTaskList().run() },
    { label: "Code block", icon: Code2, active: editor?.isActive("codeBlock"), onClick: () => editor?.chain().focus().toggleCodeBlock().run() },
    { label: "Align left", icon: AlignLeft, onClick: () => editor?.chain().focus().setTextAlign("left").run() },
    { label: "Align center", icon: AlignCenter, onClick: () => editor?.chain().focus().setTextAlign("center").run() },
    {
      label: "Link",
      icon: LinkIcon,
      active: editor?.isActive("link"),
      onClick: () => {
        const previousUrl = editor?.getAttributes("link").href as string | undefined;
        const url = window.prompt("URL", previousUrl ?? "");

        if (url === null) return;
        if (!url.trim()) {
          editor?.chain().focus().extendMarkRange("link").unsetLink().run();
          return;
        }

        editor?.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
      },
    },
    {
      label: "Video embed",
      icon: Video,
      onClick: () => {
        const url = window.prompt("YouTube URL");
        if (!url?.trim()) return;
        editor?.chain().focus().setYoutubeVideo({ src: url.trim(), width: 900, height: 506 }).run();
      },
    },
    {
      label: "Image",
      icon: ImageIcon,
      onClick: () => imageInputRef.current?.click(),
    },
  ];

  useEffect(() => {
    if (!selectedPost || !editor) return;
    if (editor.getHTML() !== selectedPost.contentHtml) {
      editor.commands.setContent(selectedPost.contentHtml, { emitUpdate: false });
    }
    setMarkdownDraft(turndownService.turndown(selectedPost.contentHtml));
  }, [editor, selectedPost]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasDatabase || !selectedPost || saveState !== "unsaved") return;
    const postToSave = selectedPost;

    const timer = window.setTimeout(() => {
      async function autosave() {
        try {
          setSaveState("saving");
          await savePostAction(postToSave);
          setSaveState("saved");
        } catch {
          setSaveState("error");
          showToast("Autosave failed");
        }
      }

      void autosave();
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [hasDatabase, saveState, selectedPost]);

  async function saveSelectedPost(showSavedToast = true) {
    if (!selectedPost || !hasDatabase) {
      setSaveState("error");
      showToast("Connect POSTGRES_URL to save");
      return;
    }

    try {
      setSaveState("saving");
      await savePostAction(selectedPost);
      setSaveState("saved");
      if (showSavedToast) showToast("Saved to Postgres");
    } catch (error) {
      setSaveState("error");
      showToast(error instanceof Error ? error.message : "Save failed");
    }
  }

  async function uploadImage(file: File) {
    if (!editor || !hasDatabase) {
      showToast("Connect POSTGRES_URL to upload images");
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(String(reader.result)));
      reader.addEventListener("error", () => reject(reader.error));
      reader.readAsDataURL(file);
    });

    try {
      const src = await uploadBlogImageAction({
        dataUrl,
        fileName: file.name,
      });

      editor.chain().focus().setImage({ src, alt: file.name }).run();
      showToast("Image uploaded");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Image upload failed");
    }
  }

  async function importMarkdown() {
    if (!editor || !selectedPost || !markdownDraft.trim()) return;

    const parsed = await marked.parse(markdownDraft);
    const html = typeof parsed === "string" ? parsed : "";

    editor.commands.setContent(html, { emitUpdate: false });
    updateSelectedPost((post) => ({
      ...post,
      contentHtml: html,
      excerpt: deriveExcerpt(stripHtml(html), post.excerpt),
    }));
    showToast("Markdown imported");
  }

  async function copyMarkdown() {
    if (!markdownExport) return;
    await navigator.clipboard.writeText(markdownExport);
    showToast("Markdown copied");
  }

  function createPost() {
    startTransition(() => {
      const created = createBlankPost(posts.length + 1);
      setPosts((current) => [created, ...current]);
      setSelectedId(created.id);
      setSaveState("unsaved");
      showToast("Post created");
    });
  }

  function duplicatePost() {
    if (!selectedPost) return;

    startTransition(() => {
      const now = new Date().toISOString();
      const duplicate: BlogPostDraft = {
        ...selectedPost,
        id: `post-${Date.now()}`,
        title: `${selectedPost.title} Copy`,
        slug: `${selectedPost.slug}-copy`,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      };

      setPosts((current) => [duplicate, ...current]);
      setSelectedId(duplicate.id);
      setSaveState("unsaved");
      showToast("Post duplicated");
    });
  }

  function deletePost() {
    if (!selectedPost || posts.length === 1) return;

    const nextPosts = posts.filter((post) => post.id !== selectedPost.id);
    startTransition(async () => {
      try {
        if (hasDatabase) {
          await deletePostAction(selectedPost.id, selectedPost.slug);
        }
        setPosts(nextPosts);
        setSelectedId(nextPosts[0].id);
        setSaveState("saved");
        showToast("Post deleted");
      } catch (error) {
        setSaveState("error");
        showToast(error instanceof Error ? error.message : "Delete failed");
      }
    });
  }

  function addTag() {
    const tag = tagInput.trim();
    if (!tag || !selectedPost?.id || selectedPost.tags.includes(tag)) {
      setTagInput("");
      return;
    }

    updateSelectedPost((post) => ({
      ...post,
      tags: [...post.tags, tag],
    }));
    setTagInput("");
  }

  if (!selectedPost) {
    return null;
  }

  return (
    <section className="studio-app">
      <header className="studio-topbar">
        <div className="studio-title-block">
          <span>Private Studio</span>
          <strong>{selectedPost.title}</strong>
        </div>
        <div className="studio-status-strip">
          <button type="button" className="studio-save-button" onClick={() => void saveSelectedPost(true)}>
            <Save size={15} strokeWidth={2} />
            <span>Save</span>
          </button>
          <span>{wordCount} words</span>
          <span>{isPending || saveState === "saving" ? "Saving" : saveState === "unsaved" ? "Unsaved" : saveState === "error" ? "Save issue" : "Saved"}</span>
          <span>{hasDatabase ? "Postgres" : "No Postgres"}</span>
          <span>{formatDate(selectedPost.updatedAt)}</span>
        </div>
      </header>

      <div className="studio-grid">
        <aside className="studio-sidebar">
          <div className="studio-search">
            <Search size={15} strokeWidth={2} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" />
          </div>

          <button type="button" className="studio-primary-button" onClick={createPost}>
            <Plus size={16} strokeWidth={2} />
            <span>New post</span>
          </button>

          <div className="studio-post-list">
            {filteredPosts.map((post) => (
              <button
                key={post.id}
                type="button"
                className={`studio-post-row ${post.id === selectedPost.id ? "is-active" : ""}`}
                onClick={() => setSelectedId(post.id)}
              >
                <span className={`studio-status-dot is-${post.status}`} />
                <strong>{post.title}</strong>
                <small>{post.category}</small>
              </button>
            ))}
          </div>
        </aside>

        <main className="studio-main">
          <div className="studio-docbar">
            <input
              className="studio-title-input"
              value={selectedPost.title}
              onChange={(event) =>
                updateSelectedPost((post) => ({
                  ...post,
                  title: event.target.value,
                  slug: slugify(event.target.value) || post.slug,
                }))
              }
            />
            <div className="studio-panel-tabs">
              <button
                type="button"
                className={rightPanel === "settings" ? "is-active" : ""}
                onClick={() => setRightPanel("settings")}
                title="Settings"
                aria-label="Settings"
              >
                <PanelRight size={16} strokeWidth={2} />
              </button>
              <button
                type="button"
                className={rightPanel === "preview" ? "is-active" : ""}
                onClick={() => setRightPanel("preview")}
                title="Preview"
                aria-label="Preview"
              >
                <Eye size={16} strokeWidth={2} />
              </button>
              <button
                type="button"
                className={rightPanel === "markdown" ? "is-active" : ""}
                onClick={() => setRightPanel("markdown")}
                title="Markdown"
                aria-label="Markdown"
              >
                <Code2 size={16} strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="studio-toolbar">
            {toolbarActions.map((action) => (
              <IconButton key={action.label} action={action} />
            ))}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="studio-file-input"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.currentTarget.value = "";
                if (file) void uploadImage(file);
              }}
            />
          </div>

          <EditorContent editor={editor} />
        </main>

        <aside className="studio-inspector">
          {rightPanel === "settings" ? (
            <>
              <label className="studio-field">
                <span>Slug</span>
                <input
                  value={selectedPost.slug}
                  onChange={(event) =>
                    updateSelectedPost((post) => ({
                      ...post,
                      slug: slugify(event.target.value),
                    }))
                  }
                />
              </label>

              <label className="studio-field">
                <span>Category</span>
                <input
                  value={selectedPost.category}
                  onChange={(event) =>
                    updateSelectedPost((post) => ({
                      ...post,
                      category: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="studio-field">
                <span>Status</span>
                <select
                  value={selectedPost.status}
                  onChange={(event) =>
                    updateSelectedPost((post) => ({
                      ...post,
                      status: event.target.value as BlogPostStatus,
                    }))
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="pinned">Pinned</option>
                </select>
              </label>

              <label className="studio-field">
                <span>Excerpt</span>
                <textarea
                  value={selectedPost.excerpt}
                  onChange={(event) =>
                    updateSelectedPost((post) => ({
                      ...post,
                      excerpt: event.target.value,
                    }))
                  }
                />
              </label>

              <div className="studio-tags">
                {selectedPost.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      updateSelectedPost((post) => ({
                        ...post,
                        tags: post.tags.filter((entry) => entry !== tag),
                      }))
                    }
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="studio-tag-entry">
                <input value={tagInput} onChange={(event) => setTagInput(event.target.value)} placeholder="Tag" />
                <button type="button" onClick={addTag}>
                  Add
                </button>
              </div>

              <div className="studio-danger-row">
                <button type="button" onClick={duplicatePost}>
                  <Copy size={15} strokeWidth={2} />
                  <span>Duplicate</span>
                </button>
                <button type="button" onClick={deletePost}>
                  <Trash2 size={15} strokeWidth={2} />
                  <span>Delete</span>
                </button>
              </div>
            </>
          ) : null}

          {rightPanel === "preview" ? (
            <article className="studio-preview">
              <div className="studio-preview-meta">
                <span>{selectedPost.status}</span>
                <span>{selectedPost.category}</span>
              </div>
              <h2>{selectedPost.title}</h2>
              <p>{selectedPost.excerpt}</p>
              <div className="studio-preview-prose" dangerouslySetInnerHTML={{ __html: selectedPost.contentHtml }} />
            </article>
          ) : null}

          {rightPanel === "markdown" ? (
            <div className="studio-markdown-panel">
              <textarea value={markdownDraft} onChange={(event) => setMarkdownDraft(event.target.value)} />
              <div className="studio-danger-row">
                <button type="button" onClick={() => void importMarkdown()}>
                  <Save size={15} strokeWidth={2} />
                  <span>Import</span>
                </button>
                <button type="button" onClick={() => void copyMarkdown()}>
                  <Copy size={15} strokeWidth={2} />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          ) : null}
        </aside>
      </div>

      {toast ? <div className="studio-toast">{toast}</div> : null}
    </section>
  );
}
