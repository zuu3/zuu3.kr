"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { LoginForm } from "./login-form";
import { PostEditor } from "./post-editor";
import type { Post } from "@/lib/posts";
import { toss } from "@/app/blog/toss-tokens";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | "new" | null>(null);

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
      .select("slug, title, excerpt, tags, content, published_at")
      .order("published_at", { ascending: false })
      .then(({ data }) => setPosts(data ?? []));
  }, [session, editing]);

  if (checking) return null;
  if (!session) return <LoginForm />;

  if (editing) {
    return (
      <PostEditor
        post={editing === "new" ? null : editing}
        onDone={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="min-h-svh bg-neutral-50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-wide text-neutral-400 uppercase">Admin</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900">
              글 {posts.length}개
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing("new")}
              className="rounded-md px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95"
              style={{ backgroundColor: toss.color.primary }}
            >
              새 글 작성
            </button>
            <button
              onClick={async () => {
                const { error } = await supabase.auth.registerPasskey();
                alert(error ? error.message : "패스키 등록 완료");
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

        <div className="mt-8 flex flex-col gap-2">
          {posts.map((p) => (
            <button
              key={p.slug}
              onClick={() => setEditing(p)}
              className="group flex flex-col rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-left transition [--title-color:#171717] hover:border-neutral-300 hover:shadow-sm hover:[--title-color:#3182f6]"
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-bold" style={{ color: "var(--title-color)" }}>{p.title}</p>
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
      </div>
    </div>
  );
}
