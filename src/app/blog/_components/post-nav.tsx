"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Post } from "@/lib/posts";
import { toss } from "../toss-tokens";

function NavCard({ post, direction }: { post: Post; direction: "prev" | "next" }) {
  const isNext = direction === "next";
  const [hover, setHover] = useState(false);
  const Arrow = isNext ? ArrowRight : ArrowLeft;

  return (
    <Link
      href={`/blog/${post.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex flex-col gap-1.5 rounded-lg border p-5 transition-colors duration-150"
      style={{
        borderColor: hover ? toss.color.primary : toss.color.border,
        backgroundColor: toss.color.canvas,
        alignItems: isNext ? "flex-end" : "flex-start",
      }}
    >
      <span
        className="inline-flex items-center gap-1 text-xs font-medium"
        style={{ color: toss.color.muted, flexDirection: isNext ? "row-reverse" : "row" }}
      >
        <Arrow
          size={12}
          style={{
            transform: hover ? `translateX(${isNext ? 2 : -2}px)` : "translateX(0)",
            transition: "transform 150ms",
          }}
        />
        {isNext ? "다음 글" : "이전 글"}
      </span>
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
