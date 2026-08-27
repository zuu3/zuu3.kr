import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/content";

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

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <main className="px-6 py-24 md:px-16 lg:px-24">
      <article className="mx-auto w-full max-w-2xl">
        <Link href="/blog" className="text-sm font-medium text-neutral-500 hover:text-[#ff6f0f]">
          ← Blog
        </Link>

        <div className="mt-4 flex items-baseline gap-3 text-xs font-bold tracking-wide text-neutral-500 uppercase">
          <span className="tabular-nums">{formatDate(post.date)}</span>
          <span className="flex gap-2 normal-case tracking-normal">
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">{post.title}</h1>

        <div className="mt-8 space-y-5">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed text-neutral-700">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}
