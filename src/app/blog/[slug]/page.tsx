import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@seed-design/react";
import { IconCalendarLine, IconClockLine } from "@karrotmarket/react-monochrome-icon";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { formatBlogDate, readingTime } from "@/lib/blog";
import { extractHeadings } from "@/lib/toc";
import { toss } from "../toss-tokens";
import { BlogComments } from "../blog-comments";
import { BlogMarkdown } from "../blog-markdown";
import { BlogToc } from "../blog-toc";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: `${post.title} | 오주현`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const headings = extractHeadings(post.content);

  return (
    <main className="px-6 py-24 md:px-16 lg:px-24" style={{ backgroundColor: toss.color.canvas }}>
      <div className="mx-auto grid w-full max-w-6xl gap-x-12 lg:grid-cols-[1fr_42rem_1fr]">
        <div aria-hidden className="hidden lg:block" />
        <article className="mx-auto min-w-0 max-w-2xl lg:mx-0 lg:max-w-none">
          <h1
            className="font-bold tracking-tight"
            style={{ color: toss.color.foreground, fontSize: 36, lineHeight: "1.3" }}
          >
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm font-medium" style={{ color: toss.color.muted }}>
            <span className="inline-flex items-center gap-1">
              <Icon svg={<IconCalendarLine />} size="15px" color={toss.color.muted} />
              <span className="tabular-nums">{formatBlogDate(post.published_at)}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon svg={<IconClockLine />} size="15px" color={toss.color.muted} />
              {readingTime(post.content)}분 읽기
            </span>
          </div>

          <div className="mt-10">
            <BlogMarkdown content={post.content} />
          </div>

          <BlogComments postSlug={post.slug} />
        </article>

        <BlogToc headings={headings} />
      </div>
    </main>
  );
}
