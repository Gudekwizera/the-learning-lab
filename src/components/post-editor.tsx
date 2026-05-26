"use client";

import { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, Code, Minus, Undo, Redo,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface PostEditorProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    weekNumber: number;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    status: string;
    tags: { id: string; name: string }[];
  };
}

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [weekNumber, setWeekNumber] = useState(post?.weekNumber?.toString() ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [tags, setTags] = useState(post?.tags.map((t) => t.name).join(", ") ?? "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(
    (post?.status as "DRAFT" | "PUBLISHED") ?? "DRAFT"
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start writing…" }),
    ],
    content: post?.content ?? "",
    editorProps: {
      attributes: {
        class:
          "prose-blog min-h-[400px] focus:outline-none px-1",
      },
    },
  });

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
      if (!isEdit) setSlug(slugify(e.target.value));
    },
    [isEdit]
  );

  async function handleSave(publishStatus?: "DRAFT" | "PUBLISHED") {
    const saveStatus = publishStatus ?? status;
    setSaving(true);
    setError("");

    try {
      const body = {
        title,
        slug,
        weekNumber: parseInt(weekNumber) || 1,
        excerpt: excerpt || null,
        content: editor?.getHTML() ?? "",
        coverImage: coverImage || null,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        status: saveStatus,
      };

      const url = isEdit ? `/api/admin/posts/${post.id}` : "/api/admin/posts";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setStatus(saveStatus);
        router.push("/admin/posts");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to save post.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!post || !confirm("Delete this post permanently?")) return;
    await fetch(`/api/admin/posts/${post.id}`, { method: "DELETE" });
    router.push("/admin/posts");
    router.refresh();
  }

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">{isEdit ? "Edit post" : "New post"}</h1>
        <div className="flex items-center gap-2">
          {isEdit && (
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={saving}>
              Delete
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => handleSave("DRAFT")} disabled={saving}>
            Save draft
          </Button>
          <Button size="sm" onClick={() => handleSave("PUBLISHED")} disabled={saving}>
            {saving ? "Saving…" : "Publish"}
          </Button>
        </div>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-4">
          <div>
            <Input
              placeholder="Post title"
              value={title}
              onChange={handleTitleChange}
              className="text-lg font-serif font-bold"
            />
          </div>
          <div>
            <Textarea
              placeholder="Short excerpt (optional — auto-generated if blank)"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <div className="space-y-4">
          <Input
            placeholder="Slug (auto-generated)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="font-mono text-sm"
          />
          <Input
            type="number"
            placeholder="Week number"
            value={weekNumber}
            onChange={(e) => setWeekNumber(e.target.value)}
            min={1}
          />
          <Input
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <Input
            placeholder="Cover image URL (optional)"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
        </div>
      </div>

      {/* Editor */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border">
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            active={editor?.isActive("bold")}
            title="Bold"
          >
            <Bold size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            active={editor?.isActive("italic")}
            title="Italic"
          >
            <Italic size={14} />
          </ToolbarButton>
          <div className="w-px h-5 bg-border mx-1" />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor?.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor?.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 size={14} />
          </ToolbarButton>
          <div className="w-px h-5 bg-border mx-1" />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            active={editor?.isActive("bulletList")}
            title="Bullet list"
          >
            <List size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            active={editor?.isActive("orderedList")}
            title="Ordered list"
          >
            <ListOrdered size={14} />
          </ToolbarButton>
          <div className="w-px h-5 bg-border mx-1" />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            active={editor?.isActive("blockquote")}
            title="Blockquote"
          >
            <Quote size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleCode().run()}
            active={editor?.isActive("code")}
            title="Inline code"
          >
            <Code size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            title="Divider"
          >
            <Minus size={14} />
          </ToolbarButton>
          <div className="w-px h-5 bg-border mx-1" />
          <ToolbarButton
            onClick={() => editor?.chain().focus().undo().run()}
            title="Undo"
          >
            <Undo size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().redo().run()}
            title="Redo"
          >
            <Redo size={14} />
          </ToolbarButton>
        </div>

        <div className="p-6">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
