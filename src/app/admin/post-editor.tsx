"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BlogMarkdown } from "@/app/blog/blog-markdown";
import { toss } from "@/app/blog/toss-tokens";
import type { Post } from "@/lib/posts";

function ToolbarButton({
  label,
  title,
  onClick,
  bold,
  italic,
  mono,
}: {
  label: string;
  title: string;
  onClick: () => void;
  bold?: boolean;
  italic?: boolean;
  mono?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      // 클릭 시 textarea가 blur되면 selectionStart/End가 초기화되므로
      // mousedown에서 막아 포커스가 그대로 유지되게 한다.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-7 min-w-7 items-center justify-center rounded px-1.5 text-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 ${
        bold ? "font-bold" : ""
      } ${italic ? "italic" : ""} ${mono ? "font-mono text-xs" : ""}`}
    >
      {label}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-4 w-px bg-neutral-200" />;
}

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
  // 버튼 클릭 직후 커서를 어디로 옮길지 담아둔다. requestAnimationFrame으로
  // "다음 프레임쯤" 옮기면, 그 사이 사용자가 이미 타이핑을 시작한 경우 늦게
  // 도착한 커서 이동이 방금 친 글자 위치를 덮어써버린다(실측: 버튼 클릭 뒤
  // 바로 입력하면 글자가 쏠리거나 뭉개짐). content가 실제로 갱신된 시점에
  // 맞춰 정확히 한 번만 옮기도록 effect로 뺐다.
  const pendingCursorRef = useRef<number | null>(null);

  useEffect(() => {
    if (pendingCursorRef.current == null) return;
    const pos = pendingCursorRef.current;
    pendingCursorRef.current = null;
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    el.selectionStart = el.selectionEnd = pos;
  }, [content]);

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  // 선택 영역을 텍스트로 바꿔치기하고, 커서를 새 텍스트 뒤(또는 지정한
  // 상대 위치)로 옮긴다. 툴바 버튼과 이미지 업로드가 모두 이걸 쓴다 - 직접
  // 마크다운 문법을 외워서 치는 대신 버튼 클릭 한 번으로 끝나게 하기 위함.
  // setContent는 함수형으로 최신 state를 읽어야 한다 - 클로저로 캡처한
  // content를 그대로 쓰면 연달아 호출될 때(또는 타이핑과 겹칠 때) 서로의
  // 결과를 덮어써버린다.
  function replaceSelection(text: string, cursorOffset = text.length) {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? content.length;
    const end = el?.selectionEnd ?? content.length;
    setContent((prev) => prev.slice(0, start) + text + prev.slice(end));
    pendingCursorRef.current = start + cursorOffset;
  }

  // 굵게/기울임/인라인 코드처럼 "선택한 글자를 감싸는" 서식. 선택한 게
  // 없으면 기호만 넣고 그 사이에 커서를 둔다.
  function wrapSelection(before: string, after: string) {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? content.length;
    const end = el?.selectionEnd ?? content.length;
    const selected = content.slice(start, end);
    const cursorOffset = selected ? before.length + selected.length + after.length : before.length;
    replaceSelection(before + selected + after, cursorOffset);
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
    replaceSelection(`![](${data.publicUrl})`);
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
          <div className="flex shrink-0 flex-wrap items-center gap-0.5 border-b border-neutral-100 px-3 py-1.5">
            <ToolbarButton label="H2" title="소제목" onClick={() => replaceSelection("## ")} />
            <ToolbarButton label="H3" title="작은 소제목" onClick={() => replaceSelection("### ")} />
            <ToolbarDivider />
            <ToolbarButton label="B" bold title="굵게" onClick={() => wrapSelection("**", "**")} />
            <ToolbarButton label="I" italic title="기울임" onClick={() => wrapSelection("*", "*")} />
            <ToolbarButton label="<>" mono title="인라인 코드" onClick={() => wrapSelection("`", "`")} />
            <ToolbarDivider />
            <ToolbarButton
              label="{ }"
              mono
              title="코드 블록"
              onClick={() => replaceSelection("```\n\n```", 4)}
            />
            <ToolbarButton
              label="●"
              title="목록"
              onClick={() => replaceSelection("- ")}
            />
            <ToolbarButton
              label="❝"
              title="인용구"
              onClick={() => replaceSelection("> ")}
            />
            <ToolbarButton
              label="🔗"
              title="링크"
              onClick={() => replaceSelection("[텍스트](https://)", 1)}
            />
            <ToolbarButton
              label="▦"
              title="표"
              onClick={() =>
                replaceSelection(
                  "| 제목1 | 제목2 |\n| --- | --- |\n| 내용1 | 내용2 |",
                  6,
                )
              }
            />
            <ToolbarDivider />
            <label
              className="cursor-pointer rounded px-2 py-1 text-xs font-bold text-neutral-500 hover:bg-neutral-100"
              title="이미지 업로드"
            >
              {uploading ? "업로드 중..." : "🖼 이미지"}
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
