import Link from "next/link";
import type { Metadata } from "next";
import { Badge as SeedBadge } from "@seed-design/react";
import { ArrowRight } from "lucide-react";
import { Item, ItemActions, ItemContent, ItemGroup } from "@/components/ui/item";
import { SiteTabNav } from "@/components/site-tab-nav";
import { blogPosts } from "@/lib/content";
import { formatBlogDate, readingTime } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | 오주현",
  description: "프론트엔드 개념을 정리해 남기는 기록.",
};

export default function BlogIndexPage() {
  const posts = [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <main className="px-6 py-24 md:px-16 lg:px-24">
      <div className="mx-auto w-full max-w-3xl">
        <SiteTabNav active="blog" />

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">Blog</h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-neutral-600">
          프론트엔드 개념을 정리해 남기는 기록입니다.
        </p>

        <ItemGroup className="mt-12 gap-3">
          {posts.map((post) => (
            <Item
              key={post.slug}
              variant="outline"
              className="group/post-item items-start rounded-[var(--radius-card)] border-neutral-200 px-5 py-4 hover:border-[#ff6f0f]/40 hover:bg-[#fff8f3]"
              render={<Link href={`/blog/${post.slug}`} />}
            >
              <ItemContent>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold tracking-wide text-neutral-500 tabular-nums uppercase">
                    {formatBlogDate(post.date)}
                  </span>
                  <span className="text-xs font-bold text-neutral-300">·</span>
                  <span className="text-xs font-bold tracking-wide text-neutral-500 uppercase">
                    {readingTime(post.content)}분 읽기
                  </span>
                  {post.tags.map((tag) => (
                    <SeedBadge key={tag} tone="neutral" variant="weak" size="medium">
                      {tag}
                    </SeedBadge>
                  ))}
                </div>
                <p className="mt-1.5 text-xl font-bold tracking-tight text-neutral-900 group-hover/post-item:text-[#ff6f0f] md:text-2xl">
                  {post.title}
                </p>
                <p className="mt-1.5 text-base leading-relaxed text-neutral-600">{post.excerpt}</p>
              </ItemContent>
              <ItemActions className="self-center">
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover/post-item:translate-x-0.5 group-hover/post-item:text-[#ff6f0f]"
                  strokeWidth={1.75}
                />
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </div>
    </main>
  );
}
