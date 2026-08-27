import type { Metadata } from "next";
import { blogPosts } from "@/lib/content";
import { BlogPostList } from "./blog-post-list";

export const metadata: Metadata = {
  title: "Blog | 오주현",
  description: "프론트엔드 개념을 정리해 남기는 기록.",
};

export default function BlogIndexPage() {
  const posts = [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <main className="px-6 py-24 md:px-16 lg:px-24">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">Blog</h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-neutral-600">
          프론트엔드 개념을 정리해 남기는 기록입니다.
        </p>

        <BlogPostList posts={posts} />
      </div>
    </main>
  );
}
