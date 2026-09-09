import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { profile } from "@/lib/content";
import { SiteFooter } from "@/components/layout/site-footer";
import { BlogPostList } from "./blog-post-list";
import { toss } from "./toss-tokens";

export const revalidate = 60;

const title = "Blog | 오주현";
const description = "프론트엔드 개념을 정리해 남기는 기록.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://zuu3.kr/blog" },
  openGraph: {
    title,
    description,
    url: "https://zuu3.kr/blog",
    siteName: "오주현 포트폴리오",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <>
      <main className="px-6 pt-24 pb-20 md:px-16 lg:px-24" style={{ backgroundColor: toss.color.canvas }}>
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="font-bold tracking-tight" style={{ color: toss.color.foreground, fontSize: 28, lineHeight: "40px" }}>
            프론트엔드 기록
          </h1>

          <BlogPostList posts={posts} />
        </div>
      </main>
      <SiteFooter profile={profile} />
    </>
  );
}
