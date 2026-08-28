"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { toss } from "./toss-tokens";

type Comment = {
  id: string;
  nickname: string;
  body: string;
  created_at: string;
};

const RATE_LIMIT_MS = 20_000;

function formatRelative(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60_000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  return `${Math.floor(hour / 24)}일 전`;
}

export function BlogComments({ postSlug }: { postSlug: string }) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [nickname, setNickname] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("comments")
      .select("id, nickname, body, created_at")
      .eq("post_slug", postSlug)
      .order("created_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          setError("댓글을 불러오지 못했습니다.");
          setComments([]);
          return;
        }
        setComments(data ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, [postSlug]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedBody = body.trim();
    if (!trimmedBody) return;

    const lastAt = Number(localStorage.getItem("comment-last-at") ?? 0);
    if (Date.now() - lastAt < RATE_LIMIT_MS) {
      setError("잠시 후 다시 시도해주세요.");
      return;
    }

    setSubmitting(true);
    const { data, error: insertError } = await supabase
      .from("comments")
      .insert({
        post_slug: postSlug,
        nickname: nickname.trim() || "익명",
        body: trimmedBody,
      })
      .select("id, nickname, body, created_at")
      .single();
    setSubmitting(false);

    if (insertError || !data) {
      setError("댓글 등록에 실패했습니다.");
      return;
    }

    localStorage.setItem("comment-last-at", String(Date.now()));
    setComments((prev) => [data, ...(prev ?? [])]);
    setBody("");
  }

  return (
    <div className="mt-20">
      <p className="font-bold" style={{ color: toss.color.foreground, fontSize: 18 }}>
        댓글 {comments === null ? "" : comments.length}
      </p>

      <form onSubmit={handleSubmit} className="mt-4">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value.slice(0, 20))}
          placeholder="닉네임 (선택, 비우면 익명)"
          maxLength={20}
          className="w-full border-0 border-b pb-2 text-sm outline-none"
          style={{ color: toss.color.foreground, borderColor: toss.color.border }}
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, 1000))}
          placeholder="댓글을 남겨보세요"
          maxLength={1000}
          rows={3}
          required
          className="mt-2 w-full resize-none rounded-md border-none p-3 text-sm outline-none"
          style={{ backgroundColor: toss.color.surface, color: toss.color.foreground }}
        />
        <div className="mt-2 flex items-center justify-between">
          {error ? (
            <p className="text-xs" style={{ color: "#e42939" }}>
              {error}
            </p>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="rounded-md px-4 py-1.5 text-sm font-bold text-white disabled:opacity-40"
            style={{ backgroundColor: toss.color.primary }}
          >
            {submitting ? "등록 중..." : "등록"}
          </button>
        </div>
      </form>

      <div className="mt-8" style={{ borderTop: `1px solid ${toss.color.border}` }}>
        {comments === null && (
          <p className="py-6 text-sm" style={{ color: toss.color.muted }}>
            불러오는 중...
          </p>
        )}
        {comments?.length === 0 && (
          <p className="py-6 text-sm" style={{ color: toss.color.muted }}>
            첫 댓글을 남겨보세요.
          </p>
        )}
        {comments?.map((c) => (
          <div key={c.id} className="py-4" style={{ borderBottom: `1px solid ${toss.color.border}` }}>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold" style={{ color: toss.color.foreground }}>
                {c.nickname}
              </span>
              <span className="text-xs" style={{ color: toss.color.muted }}>
                {formatRelative(c.created_at)}
              </span>
            </div>
            <p className="mt-1 text-sm whitespace-pre-wrap" style={{ color: toss.color.body }}>
              {c.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
