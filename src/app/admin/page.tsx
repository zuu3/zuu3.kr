"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { LoginForm } from "./login-form";
import { PostEditor } from "./post-editor";
import { CommentsPanel } from "./comments-panel";
import { ImagesPanel } from "./images-panel";
import type { Post } from "@/lib/posts";
import { toss } from "@/app/blog/toss-tokens";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | "new" | null>(null);
  const [tab, setTab] = useState<"posts" | "comments" | "images">("posts");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    supabase
      .from("posts")
      .select("slug, title, excerpt, tags, content, published_at, updated_at, status")
      .order("published_at", { ascending: false })
      .then(({ data }) => setPosts(data ?? []));
  }, [session, editing]);

  if (checking) return null;
  if (!session) return <LoginForm />;

  if (editing) {
    // 태그를 매번 새로 타이핑하면 "Next.js"/"next.js"처럼 표기가 갈라지기
    // 쉽다. 기존 글들에서 실제로 쓰인 태그를 모아 에디터에서 클릭으로
    // 재사용할 수 있게 넘긴다.
    const existingTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();
    return (
      <PostEditor
        post={editing === "new" ? null : editing}
        existingTags={existingTags}
        onDone={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="blog-scope min-h-svh bg-neutral-50" data-theme="light">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-wide text-neutral-400 uppercase">Admin</p>
            <div className="mt-1 flex items-center gap-1">
              <button
                onClick={() => setTab("posts")}
                className="rounded-md px-2.5 py-1 text-2xl font-bold tracking-tight transition-colors"
                style={{ color: tab === "posts" ? toss.color.foreground : toss.color.muted }}
              >
                글 {posts.length}개
              </button>
              <button
                onClick={() => setTab("comments")}
                className="rounded-md px-2.5 py-1 text-2xl font-bold tracking-tight transition-colors"
                style={{ color: tab === "comments" ? toss.color.foreground : toss.color.muted }}
              >
                댓글
              </button>
              <button
                onClick={() => setTab("images")}
                className="rounded-md px-2.5 py-1 text-2xl font-bold tracking-tight transition-colors"
                style={{ color: tab === "images" ? toss.color.foreground : toss.color.muted }}
              >
                이미지
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            {tab === "posts" && (
              <button
                onClick={() => setEditing("new")}
                className="rounded-md px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95"
                style={{ backgroundColor: toss.color.primary }}
              >
                새 글 작성
              </button>
            )}
            <button
              onClick={async () => {
                const { error } = await supabase.auth.registerPasskey();
                if (error) toast.error(error.message);
                else toast.success("패스키 등록 완료");
              }}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-neutral-400 transition hover:text-neutral-600"
            >
              패스키 등록
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-neutral-400 transition hover:text-neutral-600"
            >
              로그아웃
            </button>
          </div>
        </div>

        {tab === "comments" ? (
          <CommentsPanel />
        ) : tab === "images" ? (
          <ImagesPanel />
        ) : (
        <div className="mt-8 flex flex-col gap-2">
          {posts.map((p) => (
            <button
              key={p.slug}
              onClick={() => setEditing(p)}
              className={`group flex flex-col rounded-2xl border bg-white px-5 py-4 text-left transition [--title-color:#171717] hover:shadow-sm hover:[--title-color:#3182f6] ${
                p.status === "draft"
                  ? "border-dashed border-amber-300 bg-amber-50/40 hover:border-amber-400"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex min-w-0 items-center gap-2">
                  <p className="truncate font-bold" style={{ color: "var(--title-color)" }}>{p.title}</p>
                  {p.status === "draft" && (
                    <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                      임시글
                    </span>
                  )}
                </div>
                <span className="shrink-0 text-xs text-neutral-400">{p.published_at.slice(0, 10)}</span>
              </div>
              {p.excerpt && (
                <p className="mt-1 line-clamp-1 text-sm text-neutral-500">{p.excerpt}</p>
              )}
              {p.tags.length > 0 && (
                <div className="mt-2 flex gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
          {posts.length === 0 && (
            <p className="rounded-2xl border border-dashed border-neutral-200 py-12 text-center text-sm text-neutral-400">
              아직 쓴 글이 없어요. &ldquo;새 글 작성&rdquo;으로 시작해보세요.
            </p>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
