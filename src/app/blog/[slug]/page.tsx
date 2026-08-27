import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@seed-design/react";
import {
  IconCalendarLine,
  IconChevronLeftSmallLine,
  IconChevronRightSmallLine,
  IconClockLine,
} from "@karrotmarket/react-monochrome-icon";
import { blogPosts } from "@/lib/content";
import { formatBlogDate, readingTime } from "@/lib/blog";
import { toss } from "../toss-tokens";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: `${post.title} | 오주현`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sorted = [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const index = sorted.findIndex((p) => p.slug === slug);
  const post = sorted[index];
  if (!post) notFound();

  const prev = sorted[index - 1]; // 더 최근 글
  const next = sorted[index + 1]; // 더 이전 글

  return (
    <main className="px-6 py-24 md:px-16 lg:px-24" style={{ backgroundColor: toss.color.canvas }}>
      <article className="mx-auto w-full max-w-2xl">
        <h1
          className="font-bold tracking-tight"
          style={{ color: toss.color.foreground, fontSize: 36, lineHeight: "1.3" }}
        >
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-3 text-sm font-medium" style={{ color: toss.color.muted }}>
          <span className="inline-flex items-center gap-1">
            <Icon svg={<IconCalendarLine />} size="15px" color={toss.color.muted} />
            <span className="tabular-nums">{formatBlogDate(post.date)}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon svg={<IconClockLine />} size="15px" color={toss.color.muted} />
            {readingTime(post.content)}분 읽기
          </span>
        </div>

        <div className="mt-10 space-y-4">
          {post.content.map((paragraph, i) => (
            <p key={i} style={{ color: toss.color.body, fontSize: 16, lineHeight: "24px" }}>
              {paragraph}
            </p>
          ))}
        </div>

        {(prev || next) && (
          <div className="mt-20 grid gap-3 sm:grid-cols-2">
            {prev && (
              <Link
                href={`/blog/${prev.slug}`}
                className="group/nav-item flex items-center gap-3 rounded-md p-4 transition-colors hover:bg-[#f2f4f6] [--post-title-color:#191f28] hover:[--post-title-color:#3182f6]"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform group-hover/nav-item:translate-x-0.5"
                  style={{ backgroundColor: toss.color.weakBg }}
                >
                  <Icon svg={<IconChevronRightSmallLine />} size="16px" color={toss.color.weakFg} />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium" style={{ color: toss.color.muted }}>
                    다음 글
                  </p>
                  <p
                    className="mt-0.5 truncate text-base font-bold transition-colors"
                    style={{ color: "var(--post-title-color)" }}
                  >
                    {prev.title}
                  </p>
                </div>
              </Link>
            )}
            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="group/nav-item flex items-center gap-3 rounded-md p-4 transition-colors hover:bg-[#f2f4f6] [--post-title-color:#191f28] hover:[--post-title-color:#3182f6]"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform group-hover/nav-item:-translate-x-0.5"
                  style={{ backgroundColor: toss.color.weakBg }}
                >
                  <Icon svg={<IconChevronLeftSmallLine />} size="16px" color={toss.color.weakFg} />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium" style={{ color: toss.color.muted }}>
                    이전 글
                  </p>
                  <p
                    className="mt-0.5 truncate text-base font-bold transition-colors"
                    style={{ color: "var(--post-title-color)" }}
                  >
                    {next.title}
                  </p>
                </div>
              </Link>
            )}
          </div>
        )}
      </article>
    </main>
  );
}
