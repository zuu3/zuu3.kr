"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { LoginForm } from "./login-form";
import { PostEditor } from "./post-editor";
import type { Post } from "@/lib/posts";

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
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">글 관리</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing("new")}
            className="rounded-[var(--radius-control)] bg-[#ff6f0f] px-4 py-2 text-sm font-bold text-white"
          >
            새 글
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-[var(--radius-control)] border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-600"
          >
            로그아웃
          </button>
        </div>
      </div>

      <div className="mt-8 divide-y divide-neutral-200">
        {posts.map((p) => (
          <button
            key={p.slug}
            onClick={() => setEditing(p)}
            className="block w-full py-4 text-left hover:bg-neutral-50"
          >
            <p className="font-bold text-neutral-900">{p.title}</p>
            <p className="mt-1 text-sm text-neutral-500">
              /{p.slug} · {p.published_at.slice(0, 10)}
            </p>
          </button>
        ))}
        {posts.length === 0 && <p className="py-8 text-sm text-neutral-500">아직 글이 없습니다.</p>}
      </div>
    </div>
  );
}
