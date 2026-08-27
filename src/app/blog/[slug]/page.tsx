import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@seed-design/react";
import { IconChevronLeftSmallLine, IconChevronRightSmallLine } from "@karrotmarket/react-monochrome-icon";
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
        <p className="mt-4 text-sm font-medium tabular-nums" style={{ color: toss.color.muted }}>
          {formatBlogDate(post.date)} · {readingTime(post.content)}분 읽기
        </p>

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
                className="group/nav-item rounded-md p-5 transition-colors hover:bg-[#f2f4f6] [--post-title-color:#191f28] hover:[--post-title-color:#3182f6]"
              >
                <p className="text-[13px] font-medium" style={{ color: toss.color.muted }}>
                  다음 글
                </p>
                <div className="mt-1 flex items-center gap-1">
                  <p className="text-base font-bold transition-colors" style={{ color: "var(--post-title-color)" }}>
                    {prev.title}
                  </p>
                  <span className="inline-flex shrink-0 transition-transform group-hover/nav-item:translate-x-0.5">
                    <Icon svg={<IconChevronRightSmallLine />} size="16px" color="var(--post-title-color)" />
                  </span>
                </div>
              </Link>
            )}
            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="group/nav-item rounded-md p-5 text-right transition-colors hover:bg-[#f2f4f6] sm:text-left [--post-title-color:#191f28] hover:[--post-title-color:#3182f6]"
              >
                <p className="text-[13px] font-medium" style={{ color: toss.color.muted }}>
                  이전 글
                </p>
                <div className="mt-1 flex items-center justify-end gap-1 sm:justify-start">
                  <span className="order-first inline-flex shrink-0 transition-transform group-hover/nav-item:-translate-x-0.5">
                    <Icon svg={<IconChevronLeftSmallLine />} size="16px" color="var(--post-title-color)" />
                  </span>
                  <p className="text-base font-bold transition-colors" style={{ color: "var(--post-title-color)" }}>
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
