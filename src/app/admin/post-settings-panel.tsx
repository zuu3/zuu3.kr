"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { toss } from "@/app/blog/toss-tokens";

// WordPress/Ghost/Notion 전부 글 메타(슬러그·태그·요약)를 오른쪽에서
// 슬라이드로 열리는 패널로 처리한다 - 글쓰기를 완전히 막는 중앙 모달과
// 달리, 본문을 보면서 옆에 계속 띄워둘 수 있는 정보라서다.
export function PostSettingsPanel({
  open,
  onClose,
  error,
  slug,
  onSlugChange,
  tags,
  onTagsChange,
  existingTags,
  currentTagList,
  onAddTag,
  excerpt,
  onExcerptChange,
}: {
  open: boolean;
  onClose: () => void;
  error: string | null;
  slug: string;
  onSlugChange: (v: string) => void;
  tags: string;
  onTagsChange: (v: string) => void;
  existingTags: string[];
  currentTagList: string[];
  onAddTag: (tag: string) => void;
  excerpt: string;
  onExcerptChange: (v: string) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-20 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 z-30 flex h-svh w-full max-w-sm flex-col bg-white shadow-2xl"
            initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-5 py-4">
              <p className="text-sm font-bold" style={{ color: toss.color.foreground }}>
                글 정보
              </p>
              <button
                onClick={onClose}
                aria-label="닫기"
                className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X size={16} strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-4">
              {error && <p className="text-sm text-red-600">{error}</p>}

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold" style={{ color: toss.color.muted }}>
                  슬러그 (URL)
                </span>
                <input
                  value={slug}
                  onChange={(e) => onSlugChange(e.target.value)}
                  placeholder="my-post"
                  className="rounded-md border border-neutral-200 px-3 py-2 font-mono text-xs outline-none focus:border-neutral-400"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold" style={{ color: toss.color.muted }}>
                  태그
                </span>
                <input
                  value={tags}
                  onChange={(e) => onTagsChange(e.target.value)}
                  placeholder="쉼표로 구분"
                  className="rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
                {existingTags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {existingTags.map((tag) => {
                      const used = currentTagList.some((t) => t.toLowerCase() === tag.toLowerCase());
                      return (
                        <button
                          key={tag}
                          type="button"
                          disabled={used}
                          onClick={() => onAddTag(tag)}
                          className="rounded-full border px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-default"
                          style={{
                            borderColor: toss.color.border,
                            color: used ? toss.color.muted : toss.color.body,
                            backgroundColor: used ? toss.color.surface : "#ffffff",
                          }}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                )}
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold" style={{ color: toss.color.muted }}>
                  요약
                </span>
                <textarea
                  value={excerpt}
                  onChange={(e) => onExcerptChange(e.target.value)}
                  placeholder="목록에 보이는 짧은 설명"
                  rows={4}
                  className="rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              </label>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
