"use client";

import { useEffect, useRef, useState } from "react";
import type { Post } from "@/lib/posts";

function slugify(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-");
}

// 글 폼(슬러그/제목/요약/태그/본문)과 "본문 텍스트 편집" 관심사만 갖는 훅.
// 업로드 상태, 확인 모달, UI 토글(정보 패널/표 피커) 같은 다른 관심사는
// 여기 안 들어온다 - 같이 안 바뀔 것들을 한 곳에 묶으면 그중 하나만 고쳐도
// 전체 훅의 영향 범위를 다시 확인해야 하기 때문.
export function usePostForm(post: Post | null) {
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const currentTagList = tags.split(",").map((t) => t.trim()).filter(Boolean);

  function addTag(tag: string) {
    if (currentTagList.some((t) => t.toLowerCase() === tag.toLowerCase())) return;
    setTags(currentTagList.length > 0 ? `${tags}, ${tag}` : tag);
  }
  const [content, setContent] = useState(post?.content ?? "");
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

  // 저장 안 한 채 나가려는 걸 막기 위한 기준값. 최초 마운트 시점(불러온 글
  // 또는 빈 새 글) 그대로 고정해두고 현재 필드들과 비교한다.
  const initialRef = useRef({
    slug: post?.slug ?? "",
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    tags: post?.tags.join(", ") ?? "",
    content: post?.content ?? "",
  });
  const isDirty =
    slug !== initialRef.current.slug ||
    title !== initialRef.current.title ||
    excerpt !== initialRef.current.excerpt ||
    tags !== initialRef.current.tags ||
    content !== initialRef.current.content;

  // 브라우저 탭을 닫거나 새로고침/다른 주소로 이동할 때도 걸어야 한다 -
  // 목록 버튼 클릭만 막으면 새로고침으로는 그냥 날아간다.
  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (!isDirty) return;
      e.preventDefault();
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  function handleSlugChange(v: string) {
    setSlugTouched(true);
    setSlug(v);
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

  function insertTable(rows: number, cols: number) {
    const header = "| " + Array.from({ length: cols }, (_, i) => `열${i + 1}`).join(" | ") + " |";
    const separator = "| " + Array.from({ length: cols }, () => "---").join(" | ") + " |";
    const body = Array.from(
      { length: rows },
      () => "| " + Array.from({ length: cols }, () => " ").join(" | ") + " |",
    ).join("\n");
    replaceSelection(`${header}\n${separator}\n${body}`, 2);
  }

  // 대소문자만 다른 태그("Next.js" vs "next.js")가 따로 쌓이지 않도록 저장
  // 직전에 정리한다. 먼저 입력된 표기를 그대로 살리고 중복만 걸러낸다.
  function normalizeTags(raw: string) {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const tag of raw.split(",").map((t) => t.trim()).filter(Boolean)) {
      const key = tag.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(tag);
    }
    return result;
  }

  // 발행 시점(draft -> published로 처음 바뀌는 순간)에만 published_at을
  // now()로 새로 찍는다. 이미 발행된 글을 고쳐 저장할 때 발행일이 수정일로
  // 밀려버리면 목록 정렬이랑 "최근 글" 의미가 둘 다 틀어진다.
  function toRow(nextStatus: "draft" | "published") {
    const wasPublished = post?.status === "published";
    return {
      slug,
      title,
      excerpt,
      tags: normalizeTags(tags),
      content,
      status: nextStatus,
      published_at:
        nextStatus === "published" && !wasPublished
          ? new Date().toISOString()
          : (post?.published_at ?? new Date().toISOString()),
    };
  }

  return {
    slug,
    title,
    excerpt,
    setExcerpt,
    tags,
    setTags,
    currentTagList,
    addTag,
    content,
    setContent,
    isDirty,
    textareaRef,
    handleTitleChange,
    handleSlugChange,
    replaceSelection,
    wrapSelection,
    insertTable,
    toRow,
  };
}
