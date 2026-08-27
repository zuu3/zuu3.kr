import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionButton, Article, Badge as SeedBadge, Divider, Text } from "@seed-design/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/content";
import { formatBlogDate, readingTime, tagTone } from "@/lib/blog";

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

  const prev = sorted[index - 1]; // 더 최근 글 (위쪽)
  const next = sorted[index + 1]; // 더 이전 글 (아래쪽)

  return (
    <main className="px-6 py-24 md:px-16 lg:px-24">
      <article className="mx-auto w-full max-w-2xl">
        <ActionButton variant="ghost" size="xsmall" asChild>
          <Link href="/blog">
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
            Blog
          </Link>
        </ActionButton>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold tracking-wide text-neutral-500 tabular-nums uppercase">
            {formatBlogDate(post.date)}
          </span>
          <span className="text-xs font-bold text-neutral-300">·</span>
          <span className="text-xs font-bold tracking-wide text-neutral-500 uppercase">
            {readingTime(post.content)}분 읽기
          </span>
          {post.tags.map((tag) => (
            <SeedBadge key={tag} tone={tagTone(tag)} variant="weak" size="medium">
              {tag}
            </SeedBadge>
          ))}
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">{post.title}</h1>

        <Divider className="mt-6" />

        <div className="mt-8 flex flex-col gap-5">
          {post.content.map((paragraph, i) => (
            <Article key={i} lang="ko-KR">
              <Text as="p" textStyle="t5Regular" color="fg.neutral" className="leading-relaxed">
                {paragraph}
              </Text>
            </Article>
          ))}
        </div>

        {(prev || next) && (
          <>
            <Divider className="mt-14" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {prev && (
                <Link
                  href={`/blog/${prev.slug}`}
                  className="group rounded-2xl bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:text-right"
                >
                  <p className="text-xs font-bold tracking-wide text-neutral-400 uppercase">다음 글</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-neutral-900 group-hover:text-[#ff6f0f] sm:justify-end">
                    {prev.title}
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                  </p>
                </Link>
              )}
              {next && (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group rounded-2xl bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:col-start-1 sm:row-start-1"
                >
                  <p className="text-xs font-bold tracking-wide text-neutral-400 uppercase">이전 글</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-neutral-900 group-hover:text-[#ff6f0f]">
                    <ArrowLeft className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                    {next.title}
                  </p>
                </Link>
              )}
            </div>
          </>
        )}
      </article>
    </main>
  );
}
