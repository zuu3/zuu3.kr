import type { Metadata } from "next";
import { blogPosts } from "@/lib/content";
import { BlogPostList } from "./blog-post-list";
import { toss } from "./toss-tokens";

export const metadata: Metadata = {
  title: "Blog | 오주현",
  description: "프론트엔드 개념을 정리해 남기는 기록.",
};

export default function BlogIndexPage() {
  const posts = [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <main className="px-6 py-24 md:px-16 lg:px-24" style={{ backgroundColor: toss.color.canvas }}>
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="font-bold tracking-tight" style={{ color: toss.color.foreground, fontSize: 36, lineHeight: "54px" }}>
          Blog
        </h1>
        <p className="mt-2 max-w-xl" style={{ color: toss.color.body, fontSize: 16, lineHeight: "24px" }}>
          프론트엔드 개념을 정리해 남기는 기록입니다.
        </p>

        <BlogPostList posts={posts} />
      </div>
    </main>
  );
}
