"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { toss } from "./toss-tokens";

export function ShareButton({ title, url }: { title: string; url: string }) {
  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // 사용자가 공유 시트를 취소한 것 - 에러 아님
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("링크를 복사했어요");
  }

  return (
    <button
      onClick={share}
      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition hover:brightness-95"
      style={{ color: toss.color.body, backgroundColor: toss.color.surface }}
    >
      <Share2 size={14} />
      공유
    </button>
  );
}
