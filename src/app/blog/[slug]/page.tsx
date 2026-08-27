import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionButton, Article, Text } from "@seed-design/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/content";
import { formatBlogDate, readingTime } from "@/lib/blog";

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
    <main className="px-6 py-24 md:px-16 lg:px-24">
      <article className="mx-auto w-full max-w-2xl">
        <ActionButton variant="ghost" size="xsmall" asChild>
          <Link href="/blog">
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
            Blog
          </Link>
        </ActionButton>

        <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-bold tracking-wide text-neutral-500 uppercase">
          <span className="tabular-nums">{formatBlogDate(post.date)}</span>
          <span>·</span>
          <span>{readingTime(post.content)}분 읽기</span>
          {post.tags.length > 0 && (
            <>
              <span>·</span>
              <span>{post.tags.join(" ")}</span>
            </>
          )}
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">{post.title}</h1>

        <div className="mt-10 space-y-5">
          {post.content.map((paragraph, i) => (
            <Article key={i} lang="ko-KR">
              <Text as="p" textStyle="t5Regular" color="fg.neutral" className="leading-relaxed">
                {paragraph}
              </Text>
            </Article>
          ))}
        </div>

        {(prev || next) && (
          <div className="mt-16 divide-y divide-neutral-200 border-t border-neutral-200">
            {prev && (
              <Link href={`/blog/${prev.slug}`} className="group flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-xs font-bold tracking-wide text-neutral-400 uppercase">다음 글</p>
                  <p className="mt-0.5 text-sm font-semibold text-neutral-900 group-hover:text-[#ff6f0f]">
                    {prev.title}
                  </p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-neutral-400 group-hover:text-[#ff6f0f]" strokeWidth={1.75} />
              </Link>
            )}
            {next && (
              <Link href={`/blog/${next.slug}`} className="group flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-xs font-bold tracking-wide text-neutral-400 uppercase">이전 글</p>
                  <p className="mt-0.5 text-sm font-semibold text-neutral-900 group-hover:text-[#ff6f0f]">
                    {next.title}
                  </p>
                </div>
                <ArrowLeft className="h-3.5 w-3.5 shrink-0 text-neutral-400 group-hover:text-[#ff6f0f]" strokeWidth={1.75} />
              </Link>
            )}
          </div>
        )}
      </article>
    </main>
  );
}
