"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Post } from "@/lib/posts";
import { toss } from "../toss-tokens";

function NavCard({ post, direction }: { post: Post; direction: "prev" | "next" }) {
  const isNext = direction === "next";
  const [hover, setHover] = useState(false);

  return (
    <Link
      href={`/blog/${post.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex flex-col gap-3 rounded-lg border p-5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        borderColor: hover ? toss.color.primary : toss.color.border,
        backgroundColor: toss.color.canvas,
        alignItems: isNext ? "flex-end" : "flex-start",
      }}
    >
      <div className={`flex items-center gap-2 ${isNext ? "flex-row-reverse" : ""}`}>
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors"
          style={{
            backgroundColor: hover ? toss.color.primary : toss.color.surface,
            color: hover ? "#ffffff" : toss.color.muted,
          }}
        >
          {isNext ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
        </span>
        <span className="text-xs font-bold tracking-wide uppercase" style={{ color: toss.color.muted }}>
          {isNext ? "다음 글" : "이전 글"}
        </span>
      </div>
      <span
        className={`line-clamp-2 text-[15px] font-bold ${isNext ? "text-right" : "text-left"}`}
        style={{ color: toss.color.foreground }}
      >
        {post.title}
      </span>
    </Link>
  );
}

// allPosts는 published_at 내림차순(getAllPosts)이라, 배열상 다음
// 인덱스가 시간상 "이전 글"(더 먼저 쓴 글)이다.
export function PostNav({ current, allPosts }: { current: Post; allPosts: Post[] }) {
  const i = allPosts.findIndex((p) => p.slug === current.slug);
  if (i === -1) return null;
  const newer = i > 0 ? allPosts[i - 1] : null;
  const older = i < allPosts.length - 1 ? allPosts[i + 1] : null;
  if (!newer && !older) return null;

  return (
    <div className="mt-10 grid gap-3 border-t pt-10 sm:grid-cols-2" style={{ borderColor: toss.color.border }}>
      {older ? <NavCard post={older} direction="prev" /> : <div />}
      {newer && <NavCard post={newer} direction="next" />}
    </div>
  );
}
