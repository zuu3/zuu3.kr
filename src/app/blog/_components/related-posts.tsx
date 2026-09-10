import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/posts";
import { formatBlogDate } from "@/lib/blog";
import { toss } from "../toss-tokens";

// 태그 겹치는 글 최대 3개. 서버 컴포넌트 - 이미 fetch해둔 전체 글 목록에서
// 순수 계산만 하고 별도 쿼리는 안 던진다.
export function RelatedPosts({ current, allPosts }: { current: Post; allPosts: Post[] }) {
  const related = allPosts
    .filter((p) => p.slug !== current.slug && p.status === "published")
    .map((p) => ({ post: p, overlap: p.tags.filter((t) => current.tags.includes(t)).length }))
    .filter((r) => r.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || +new Date(b.post.published_at) - +new Date(a.post.published_at))
    .slice(0, 3)
    .map((r) => r.post);

  if (related.length === 0) return null;

  return (
    <div className="mt-10">
      <p className="text-xs font-bold tracking-wide uppercase" style={{ color: toss.color.muted }}>
        관련 글
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group/related flex flex-col justify-between gap-4 rounded-lg border p-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
            style={{ borderColor: toss.color.border, backgroundColor: toss.color.canvas }}
          >
            <p
              className="line-clamp-2 text-sm font-bold transition-colors group-hover/related:opacity-80"
              style={{ color: toss.color.foreground }}
            >
              {post.title}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: toss.color.muted }}>
                {formatBlogDate(post.published_at)}
              </span>
              <ArrowUpRight
                size={14}
                className="translate-x-0 translate-y-0 opacity-0 transition-all duration-150 group-hover/related:translate-x-0.5 group-hover/related:-translate-y-0.5 group-hover/related:opacity-100"
                style={{ color: toss.color.primary }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
