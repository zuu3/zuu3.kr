import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@seed-design/react";
import { IconCalendarLine, IconClockLine } from "@karrotmarket/react-monochrome-icon";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { profile } from "@/lib/content";
import { SiteFooter } from "@/components/layout/site-footer";
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

  const url = `https://zuu3.kr/blog/${post.slug}`;
  const title = `${post.title} | 오주현`;

  return {
    title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: "오주현 포트폴리오",
      locale: "ko_KR",
      type: "article",
      publishedTime: post.published_at,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const headings = extractHeadings(post.content);

  // 검색엔진이 "이건 블로그 글이고, 언제 썼고, 누가 썼는지"를 마크업 파싱
  // 없이 바로 읽어갈 수 있게 하는 구조화 데이터. 리치 결과(날짜, 작성자 등
  // 검색 결과에 바로 노출되는 정보)에 반영된다.
  // BreadcrumbList는 검색 결과에 "zuu3.kr › Blog › 글제목" 같은 경로를
  // URL 대신 보여주게 해준다.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.published_at,
        dateModified: post.published_at,
        author: { "@type": "Person", name: "오주현", url: "https://zuu3.kr" },
        keywords: post.tags.join(", "),
        url: `https://zuu3.kr/blog/${post.slug}`,
        mainEntityOfPage: `https://zuu3.kr/blog/${post.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: "https://zuu3.kr" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://zuu3.kr/blog" },
          { "@type": "ListItem", position: 3, name: post.title, item: `https://zuu3.kr/blog/${post.slug}` },
        ],
      },
    ],
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
    <SiteFooter profile={profile} />
    </>
  );
}
