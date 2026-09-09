"use client";

import { Trash2 } from "lucide-react";
import { toss } from "@/app/blog/toss-tokens";
import { useCommentsAdmin } from "./use-comments-admin";
import { useConfirmDialog, ConfirmDialog } from "./use-confirm-dialog";

export function CommentsPanel() {
  const { comments, loading, remove } = useCommentsAdmin();
  const confirmDialog = useConfirmDialog();

  function askRemove(id: string, nickname: string) {
    confirmDialog.ask({
      title: "댓글을 삭제할까요?",
      description: `"${nickname}"님의 댓글이에요. 복구할 수 없어요.`,
      confirmLabel: "삭제",
      onConfirm: () => remove(id),
    });
  }

  if (loading) return null;

  return (
    <div className="mt-8 flex flex-col gap-2">
      {comments.map((c) => (
        <div
          key={c.id}
          className="flex items-start justify-between gap-4 rounded-2xl border border-neutral-200 bg-white px-5 py-4"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-bold" style={{ color: toss.color.foreground }}>
                {c.nickname}
              </span>
              <a
                href={`/blog/${c.post_slug}`}
                target="_blank"
                rel="noreferrer"
                className="truncate text-xs hover:underline"
                style={{ color: toss.color.primary }}
              >
                {c.post_slug}
              </a>
              <span className="shrink-0 text-xs text-neutral-400">
                {new Date(c.created_at).toLocaleString("ko-KR")}
              </span>
            </div>
            <p className="mt-1 text-sm" style={{ color: toss.color.body }}>
              {c.body}
            </p>
          </div>
          <button
            onClick={() => askRemove(c.id, c.nickname)}
            aria-label="삭제"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={16} strokeWidth={1.75} />
          </button>
        </div>
      ))}
      {comments.length === 0 && (
        <p className="rounded-2xl border border-dashed border-neutral-200 py-12 text-center text-sm text-neutral-400">
          아직 댓글이 없어요.
        </p>
      )}

      <ConfirmDialog
        state={confirmDialog.state}
        onCancel={confirmDialog.cancel}
        onConfirm={confirmDialog.confirmAndClose}
      />
    </div>
  );
}
