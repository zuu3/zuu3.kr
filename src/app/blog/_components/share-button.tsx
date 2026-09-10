"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Send, Share2 } from "lucide-react";
import { toast } from "sonner";
import { toss } from "../toss-tokens";

// lucide-react엔 X(트위터) 마크가 없어서 인라인.
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2h3.4l-7.4 8.5L23.6 22h-6.8l-5.3-6.9L5.4 22H2l7.9-9.1L1.6 2h7l4.8 6.3L18.9 2Zm-1.2 18h1.9L7.4 4h-2l12.3 16Z" />
    </svg>
  );
}

// navigator.share는 OS 공유시트를 바로 띄워버려서 "그냥 링크만 복사하고
// 싶은" 흔한 케이스에 오히려 방해가 된다. 항상 직접 만든 작은 메뉴를
// 먼저 보여주고, 복사를 기본/1순위로 둔다 - OS 시트는 옵션 중 하나로만.
export function ShareButton({ title, url }: { title: string; url: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("링크를 복사했어요");
    setTimeout(() => setCopied(false), 1500);
    setOpen(false);
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      // 사용자가 공유 시트를 취소한 것 - 에러 아님
    }
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition hover:brightness-95"
        style={{ color: toss.color.body, backgroundColor: toss.color.surface }}
      >
        <Share2 size={14} />
        공유
      </button>

      {open && (
        <div
          className="absolute top-full right-0 z-20 mt-2 w-52 overflow-hidden rounded-md py-1 shadow-lg"
          style={{ backgroundColor: toss.color.canvas, border: `1px solid ${toss.color.border}` }}
        >
          <button
            onClick={copyLink}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition hover:brightness-95"
            style={{ color: toss.color.foreground, backgroundColor: toss.color.surface }}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            링크 복사
          </button>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition hover:brightness-95"
            style={{ color: toss.color.foreground }}
          >
            <XIcon width={14} height={14} />
            X(트위터)에 공유
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition hover:brightness-95"
            style={{ color: toss.color.foreground }}
          >
            <Send size={15} />
            Facebook에 공유
          </a>
          {canNativeShare && (
            <button
              onClick={nativeShare}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition hover:brightness-95"
              style={{ color: toss.color.muted }}
            >
              <Share2 size={15} />
              다른 방법으로 공유
            </button>
          )}
        </div>
      )}
    </div>
  );
}
