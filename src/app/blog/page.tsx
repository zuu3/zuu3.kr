import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog | 오주현",
  description: "프론트엔드 개념을 정리해 남기는 기록.",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function BlogIndexPage() {
  const posts = [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <main className="px-6 py-24 md:px-16 lg:px-24">
      <div className="mx-auto w-full max-w-3xl">
        <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-[#ff6f0f]">
          ← 오주현
        </Link>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">Blog</h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-neutral-600">
          프론트엔드 개념을 정리해 남기는 기록입니다.
        </p>

        <div className="mt-14 divide-y divide-neutral-200">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block py-8 first:pt-0"
            >
              <div className="flex items-baseline gap-3 text-xs font-bold tracking-wide text-neutral-500 uppercase">
                <span className="tabular-nums">{formatDate(post.date)}</span>
                <span className="flex gap-2 normal-case tracking-normal">
                  {post.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </span>
              </div>
              <p className="mt-2 text-xl font-bold tracking-tight text-neutral-900 group-hover:text-[#ff6f0f] md:text-2xl">
                {post.title}
              </p>
              <p className="mt-2 max-w-xl text-base leading-relaxed text-neutral-600">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
