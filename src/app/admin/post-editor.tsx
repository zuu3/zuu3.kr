"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BlogMarkdown } from "@/app/blog/blog-markdown";
import { toss } from "@/app/blog/toss-tokens";
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
  const [showMeta, setShowMeta] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    if (!slug || !title) {
      setShowMeta(true);
      setError("제목과 슬러그는 필수입니다.");
      return;
    }
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
    <div className="flex h-svh flex-col">
      {/* 상단 바 - 제목만 크게, 나머지 메타는 접어둔다. Velog 에디터가 본문에
          집중하고 태그/요약을 별도 발행 단계로 미루는 것과 같은 방향 */}
      <header className="flex shrink-0 items-center gap-4 border-b border-neutral-200 px-6 py-3">
        <button onClick={onDone} className="text-sm font-medium text-neutral-400 hover:text-neutral-600">
          ← 목록
        </button>
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="제목을 입력하세요"
          className="flex-1 border-none text-lg font-bold text-neutral-900 outline-none placeholder:text-neutral-300"
        />
        <button
          onClick={() => setShowMeta((s) => !s)}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-neutral-500 hover:bg-neutral-100"
        >
          {showMeta ? "정보 닫기" : "정보"}
        </button>
        {post && (
          <button onClick={remove} className="text-sm font-medium text-red-500 hover:text-red-600">
            삭제
          </button>
        )}
        <button
          onClick={save}
          disabled={saving}
          className="rounded-md px-4 py-1.5 text-sm font-bold text-white disabled:opacity-50"
          style={{ backgroundColor: toss.color.primary }}
        >
          {saving ? "저장 중..." : "저장"}
        </button>
      </header>

      {showMeta && (
        <div className="flex shrink-0 flex-col gap-2 border-b border-neutral-200 bg-neutral-50 px-6 py-3">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <input
              placeholder="슬러그 (URL)"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className="w-56 rounded-md border border-neutral-200 bg-white px-3 py-1.5 font-mono text-xs outline-none focus:border-neutral-400"
            />
            <input
              placeholder="태그 (쉼표로 구분)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="flex-1 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-neutral-400"
            />
          </div>
          <textarea
            placeholder="요약 (목록에 보이는 짧은 설명)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-neutral-400"
          />
        </div>
      )}

      {/* 좌우 분할 - 왼쪽 타이핑하면 오른쪽에 바로 렌더링. 미리보기 토글 없앰 */}
      <div className="grid min-h-0 flex-1 grid-cols-2">
        <div className="flex min-h-0 flex-col border-r border-neutral-200">
          <div className="flex shrink-0 items-center border-b border-neutral-100 px-4 py-2">
            <label className="cursor-pointer text-xs font-bold text-neutral-400 hover:text-neutral-600">
              {uploading ? "업로드 중..." : "+ 이미지"}
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
          </div>
          <textarea
            ref={textareaRef}
            placeholder="마크다운으로 작성하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-0 flex-1 resize-none px-6 py-5 font-mono text-sm leading-relaxed text-neutral-800 outline-none placeholder:text-neutral-300"
          />
        </div>
        <div className="min-h-0 overflow-y-auto px-8 py-6">
          {content ? (
            <BlogMarkdown content={content} />
          ) : (
            <p className="text-sm text-neutral-300">미리보기가 여기 표시됩니다</p>
          )}
        </div>
      </div>
    </div>
  );
}
