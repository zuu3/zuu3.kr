import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: toss.color.primary }}
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          Blog
        </Link>

        <h1
          className="mt-8 font-bold tracking-tight"
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
          <div className="mt-16" style={{ borderTop: `1px solid ${toss.color.border}` }}>
            {prev && (
              <Link
                href={`/blog/${prev.slug}`}
                className="flex items-center justify-between gap-4 py-4"
                style={{ borderBottom: `1px solid ${toss.color.border}` }}
              >
                <div>
                  <p className="text-[13px] font-medium" style={{ color: toss.color.muted }}>
                    다음 글
                  </p>
                  <p className="mt-0.5 text-sm font-semibold" style={{ color: toss.color.foreground }}>
                    {prev.title}
                  </p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" style={{ color: toss.color.muted }} strokeWidth={1.75} />
              </Link>
            )}
            {next && (
              <Link href={`/blog/${next.slug}`} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-[13px] font-medium" style={{ color: toss.color.muted }}>
                    이전 글
                  </p>
                  <p className="mt-0.5 text-sm font-semibold" style={{ color: toss.color.foreground }}>
                    {next.title}
                  </p>
                </div>
                <ArrowLeft className="h-3.5 w-3.5 shrink-0" style={{ color: toss.color.muted }} strokeWidth={1.75} />
              </Link>
            )}
          </div>
        )}
      </article>
    </main>
  );
}
