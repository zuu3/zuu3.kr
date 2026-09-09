"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BlogMarkdown } from "@/app/blog/blog-markdown";
import type { Post } from "@/lib/posts";

function slugify(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function PostEditor({ post, onDone }: { post: Post | null; onDone: () => void }) {
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError(null);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from("post-images").upload(path, file);
    setUploading(false);
    if (error) {
      setError(error.message);
      return;
    }
    const { data } = supabase.storage.from("post-images").getPublicUrl(path);
    const markdown = `![](${data.publicUrl})`;
    const el = textareaRef.current;
    if (el) {
      const start = el.selectionStart ?? content.length;
      const end = el.selectionEnd ?? content.length;
      const next = content.slice(0, start) + markdown + content.slice(end);
      setContent(next);
      requestAnimationFrame(() => {
        el.focus();
        el.selectionStart = el.selectionEnd = start + markdown.length;
      });
    } else {
      setContent((c) => c + "\n" + markdown);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    const row = {
      slug,
      title,
      excerpt,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      content,
      published_at: post?.published_at ?? new Date().toISOString(),
    };
    const { error } = post
      ? await supabase.from("posts").update(row).eq("slug", post.slug)
      : await supabase.from("posts").insert(row);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    onDone();
  }

  async function remove() {
    if (!post) return;
    if (!confirm(`"${post.title}" 삭제할까요?`)) return;
    setSaving(true);
    const { error } = await supabase.from("posts").delete().eq("slug", post.slug);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    onDone();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          {post ? "글 수정" : "새 글"}
        </h1>
        <div className="flex gap-2">
          <button onClick={onDone} className="rounded-[var(--radius-control)] border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-600">
            취소
          </button>
          {post && (
            <button onClick={remove} className="rounded-[var(--radius-control)] border border-red-200 px-4 py-2 text-sm font-bold text-red-600">
              삭제
            </button>
          )}
          <button
            onClick={save}
            disabled={saving || !slug || !title}
            className="rounded-[var(--radius-control)] bg-[#ff6f0f] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex flex-col gap-3">
        <input
          placeholder="제목"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="rounded-[var(--radius-control)] border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
        <input
          placeholder="슬러그 (URL, 예: my-post)"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className="rounded-[var(--radius-control)] border border-neutral-200 px-3 py-2 font-mono text-sm outline-none focus:border-neutral-400"
        />
        <input
          placeholder="태그 (쉼표로 구분)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="rounded-[var(--radius-control)] border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
        <textarea
          placeholder="요약 (목록에 보이는 짧은 설명)"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="rounded-[var(--radius-control)] border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />

        <div className="flex items-center justify-between">
          <label className="cursor-pointer rounded-[var(--radius-control)] border border-neutral-200 px-3 py-1.5 text-xs font-bold text-neutral-600">
            {uploading ? "업로드 중..." : "이미지 업로드"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
                e.target.value = "";
              }}
            />
          </label>
          <button
            onClick={() => setPreview((p) => !p)}
            className="text-xs font-bold text-neutral-600 underline"
          >
            {preview ? "편집으로" : "미리보기"}
          </button>
        </div>

        {preview ? (
          <div className="min-h-[400px] rounded-[var(--radius-control)] border border-neutral-200 px-4 py-3">
            <BlogMarkdown content={content} />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            placeholder="마크다운 본문"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={24}
            className="rounded-[var(--radius-control)] border border-neutral-200 px-3 py-2 font-mono text-sm leading-relaxed outline-none focus:border-neutral-400"
          />
        )}
      </div>
    </div>
  );
}
