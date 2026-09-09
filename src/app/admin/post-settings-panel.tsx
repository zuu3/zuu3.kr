"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, Link2, Tags, AlignLeft } from "lucide-react";
import { toss } from "@/app/blog/toss-tokens";

function FieldLabel({ icon: Icon, children }: { icon: typeof Link2; children: React.ReactNode }) {
  return (
    <span
      className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase"
      style={{ color: toss.color.muted }}
    >
      <Icon size={13} strokeWidth={2} />
      {children}
    </span>
  );
}

const fieldClass =
  "rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition-shadow duration-150 focus:shadow-[0_0_0_3px_var(--focus-ring)]";

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
            className="fixed inset-0 z-20 bg-black/25 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 z-30 flex h-svh w-full max-w-sm flex-col bg-white shadow-2xl"
            style={{ ["--focus-ring" as string]: `${toss.color.primary}26` }}
            initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
          >
            <div
              className="flex shrink-0 items-center justify-between px-5 py-4"
              style={{ borderBottom: `1px solid ${toss.color.border}` }}
            >
              <p className="text-[15px] font-bold" style={{ color: toss.color.foreground }}>
                글 정보
              </p>
              <button
                onClick={onClose}
                aria-label="닫기"
                className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X size={16} strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 py-5">
              {error && (
                <p
                  className="rounded-lg px-3 py-2 text-sm"
                  style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}
                >
                  {error}
                </p>
              )}

              <label className="flex flex-col gap-2">
                <FieldLabel icon={Link2}>슬러그</FieldLabel>
                <input
                  value={slug}
                  onChange={(e) => onSlugChange(e.target.value)}
                  placeholder="my-post"
                  className={`${fieldClass} font-mono`}
                  style={{ borderColor: toss.color.border }}
                />
                <p className="truncate font-mono text-xs" style={{ color: toss.color.muted }}>
                  zuu3.kr/blog/
                  <span style={{ color: toss.color.body }}>{slug || "..."}</span>
                </p>
              </label>

              <label className="flex flex-col gap-2">
                <FieldLabel icon={Tags}>태그</FieldLabel>
                <input
                  value={tags}
                  onChange={(e) => onTagsChange(e.target.value)}
                  placeholder="쉼표로 구분"
                  className={fieldClass}
                  style={{ borderColor: toss.color.border }}
                />
                {existingTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {existingTags.map((tag) => {
                      const used = currentTagList.some((t) => t.toLowerCase() === tag.toLowerCase());
                      return (
                        <button
                          key={tag}
                          type="button"
                          disabled={used}
                          onClick={() => onAddTag(tag)}
                          className="rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-150 disabled:cursor-default"
                          style={{
                            borderColor: used ? "transparent" : toss.color.border,
                            color: used ? toss.color.muted : toss.color.body,
                            backgroundColor: used ? toss.color.surface : "#ffffff",
                          }}
                          onMouseEnter={(e) => {
                            if (used) return;
                            e.currentTarget.style.borderColor = toss.color.primary;
                            e.currentTarget.style.color = toss.color.primary;
                          }}
                          onMouseLeave={(e) => {
                            if (used) return;
                            e.currentTarget.style.borderColor = toss.color.border;
                            e.currentTarget.style.color = toss.color.body;
                          }}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <FieldLabel icon={AlignLeft}>요약</FieldLabel>
                <textarea
                  value={excerpt}
                  onChange={(e) => onExcerptChange(e.target.value)}
                  placeholder="목록에 보이는 짧은 설명"
                  rows={4}
                  className={`${fieldClass} resize-none leading-relaxed`}
                  style={{ borderColor: toss.color.border }}
                />
              </label>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
