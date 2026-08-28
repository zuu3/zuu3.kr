import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { profile } from "@/lib/content";
import { SiteFooter } from "@/components/site-footer";
import { BlogPostList } from "./blog-post-list";
import { toss } from "./toss-tokens";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | 오주현",
  description: "프론트엔드 개념을 정리해 남기는 기록.",
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <>
      <main className="px-6 pt-24 pb-20 md:px-16 lg:px-24" style={{ backgroundColor: toss.color.canvas }}>
        <div className="mx-auto w-full max-w-3xl">
          <p className="text-xs font-bold tracking-wide uppercase" style={{ color: toss.color.primary }}>
            Blog
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <h1 className="font-bold tracking-tight" style={{ color: toss.color.foreground, fontSize: 36, lineHeight: "54px" }}>
              프론트엔드 기록
            </h1>
            <p className="text-sm font-medium tabular-nums" style={{ color: toss.color.muted }}>
              총 {posts.length}개의 글
            </p>
          </div>
          <p className="mt-2 max-w-xl" style={{ color: toss.color.body, fontSize: 16, lineHeight: "24px" }}>
            프론트엔드 개념을 정리해 남기는 기록입니다.
          </p>

          <BlogPostList posts={posts} />
        </div>
      </main>
      <SiteFooter profile={profile} />
    </>
  );
}
