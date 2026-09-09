"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { Icon } from "@seed-design/react";
import { IconCalendarLine, IconClockLine } from "@karrotmarket/react-monochrome-icon";
import { supabase } from "@/lib/supabase";
import { formatBlogDate, readingTime } from "@/lib/blog";
import { extractHeadings } from "@/lib/toc";
import { toss } from "../../toss-tokens";
import { BlogMarkdown } from "../../blog-markdown";
import { BlogToc } from "../../blog-toc";
import type { Post } from "@/lib/posts";

// 공개 /blog/[slug] 페이지는 status='published'만 조회한다(getPostBySlug).
// 발행 전 글이 실제로 어떻게 보일지(TOC, 헤더, 레이아웃까지 전부) 확인하려면
// 그 필터를 우회해서 봐야 하는데, 그건 로그인한 사람만 봐야 하는 화면이라
// /blog 공개 페이지가 아니라 여기 별도 라우트로 뺐다. 클라이언트에서 세션을
// 직접 확인하고, RLS가 authenticated에게는 draft까지 다 열어주는 걸 그대로
// 활용한다.
export default function PreviewPage() {
  const params = useParams<{ slug: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
  }, []);

  useEffect(() => {
    if (!session) return;
    supabase
      .from("posts")
      .select("slug, title, excerpt, tags, content, published_at, updated_at, status")
      .eq("slug", params.slug)
      .maybeSingle()
      .then(({ data }) => setPost(data));
  }, [session, params.slug]);

  if (checking) return null;
  if (!session) {
    return (
      <div className="flex min-h-svh items-center justify-center px-6 text-center">
        <p className="text-sm text-neutral-400">로그인한 사람만 미리볼 수 있어요.</p>
      </div>
    );
  }
  if (!post) return null;

  const headings = extractHeadings(post.content);

  return (
    <main className="px-6 py-24 md:px-16 lg:px-24" style={{ backgroundColor: toss.color.canvas }}>
      {post.status === "draft" && (
        <div className="mx-auto mb-6 w-full max-w-6xl">
          <p
            className="rounded-md px-4 py-2 text-center text-sm font-bold"
            style={{ backgroundColor: "#fffbeb", color: "#92400e" }}
          >
            미리보기 - 아직 발행 전인 글이에요
          </p>
        </div>
      )}
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
        </article>

        <BlogToc headings={headings} />
      </div>
    </main>
  );
}
