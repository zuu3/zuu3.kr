"use client";

import { Copy, Trash2 } from "lucide-react";
import { toss } from "@/app/blog/toss-tokens";
import { useImagesAdmin } from "@/app/admin/_hooks/use-images-admin";
import { useConfirmDialog, ConfirmDialog } from "@/app/admin/_components/confirm-dialog";

export function ImagesPanel() {
  const { images, loading, remove } = useImagesAdmin();
  const confirmDialog = useConfirmDialog();

  function askRemove(name: string) {
    confirmDialog.ask({
      title: "이미지를 삭제할까요?",
      description: "이 이미지를 본문에서 쓰고 있는 글이 있다면 그 글에서도 깨져요.",
      confirmLabel: "삭제",
      onConfirm: () => remove(name),
    });
  }

  if (loading) return null;

  return (
    <div className="mt-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img) => (
          <div key={img.name} className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <img src={img.url} alt={img.name} className="aspect-square w-full object-cover" />
            <div className="absolute inset-0 flex items-end justify-end gap-1 bg-black/0 p-2 opacity-0 transition-opacity group-hover:bg-black/20 group-hover:opacity-100">
              <button
                onClick={() => navigator.clipboard.writeText(img.url)}
                aria-label="URL 복사"
                title="URL 복사"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-neutral-600 shadow-sm hover:text-neutral-900"
              >
                <Copy size={14} strokeWidth={1.75} />
              </button>
              <button
                onClick={() => askRemove(img.name)}
                aria-label="삭제"
                title="삭제"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-red-500 shadow-sm hover:text-red-600"
              >
                <Trash2 size={14} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 && (
        <p className="rounded-2xl border border-dashed border-neutral-200 py-12 text-center text-sm text-neutral-400">
          업로드한 이미지가 없어요.
        </p>
      )}
      <p className="mt-3 text-xs" style={{ color: toss.color.muted }}>
        어떤 글이 이 이미지를 쓰고 있는지는 추적하지 않아요 - 지우기 전에 본문에서 빠졌는지 직접 확인하세요.
      </p>

      <ConfirmDialog
        state={confirmDialog.state}
        onCancel={confirmDialog.cancel}
        onConfirm={confirmDialog.confirmAndClose}
      />
    </div>
  );
}
