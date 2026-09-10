import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Post } from "@/lib/posts";
import { toss } from "../toss-tokens";

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
      {older ? (
        <Link
          href={`/blog/${older.slug}`}
          className="group/nav flex flex-col rounded-md p-4 transition-colors"
          style={{ backgroundColor: toss.color.surface }}
        >
          <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: toss.color.muted }}>
            <ArrowLeft size={13} />
            이전 글
          </span>
          <span className="mt-1.5 line-clamp-2 text-sm font-bold" style={{ color: toss.color.foreground }}>
            {older.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {newer && (
        <Link
          href={`/blog/${newer.slug}`}
          className="group/nav flex flex-col items-end rounded-md p-4 text-right transition-colors"
          style={{ backgroundColor: toss.color.surface }}
        >
          <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: toss.color.muted }}>
            다음 글
            <ArrowRight size={13} />
          </span>
          <span className="mt-1.5 line-clamp-2 text-sm font-bold" style={{ color: toss.color.foreground }}>
            {newer.title}
          </span>
        </Link>
      )}
    </div>
  );
}
