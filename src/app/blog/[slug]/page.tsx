import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@seed-design/react";
import { IconCalendarLine, IconClockLine } from "@karrotmarket/react-monochrome-icon";
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
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

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
      </article>
    </main>
  );
}
