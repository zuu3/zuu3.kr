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

const ADJECTIVES = ["재미있는", "다정한", "유쾌한", "용감한", "친절한", "성실한", "활발한", "차분한"];
const ANIMALS: [string, string][] = [
  ["너구리", "🦝"],
  ["알파카", "🦙"],
  ["사슴", "🦌"],
  ["펭귄", "🐧"],
  ["여우", "🦊"],
  ["고양이", "🐱"],
  ["토끼", "🐰"],
  ["곰", "🐻"],
];
const AVATAR_BG = ["#ffe4ec", "#e4f0ff", "#f0e4ff", "#fff6e0", "#e0fff2"];

function randomIdentity() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const [animal, emoji] = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const bg = AVATAR_BG[Math.floor(Math.random() * AVATAR_BG.length)];
  return { nickname: `${adj}${animal}`, emoji, bg };
}

// 표시용 아바타 — 실제 닉네임 문자열에서 결정론적으로 이모지를 복원(새로고침 후에도 동일 아바타).
function avatarFor(nickname: string) {
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) hash = (hash * 31 + nickname.charCodeAt(i)) >>> 0;
  const [, emoji] = ANIMALS[hash % ANIMALS.length];
  const bg = AVATAR_BG[hash % AVATAR_BG.length];
  return { emoji, bg };
}

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
  // null until mount: Math.random() would otherwise pick different values on
  // the server render vs. the client hydration pass and trigger a hydration
  // mismatch.
  const [identity, setIdentity] = useState<ReturnType<typeof randomIdentity> | null>(null);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIdentity(randomIdentity());
  }, []);

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
    if (!trimmedBody || !identity) return;

    const lastAt = Number(localStorage.getItem("comment-last-at") ?? 0);
    if (Date.now() - lastAt < RATE_LIMIT_MS) {
      setError("잠시 후 다시 시도해주세요.");
      return;
    }

    setSubmitting(true);
    const { data, error: insertError } = await supabase
      .from("comments")
      .insert({ post_slug: postSlug, nickname: identity.nickname, body: trimmedBody })
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
    <div className="mt-20" style={{ borderTop: `1px solid ${toss.color.border}` }}>
      <p className="pt-8 font-bold" style={{ color: toss.color.foreground, fontSize: 18 }}>
        댓글 {comments === null ? "" : comments.length}
      </p>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex h-8 items-center gap-2">
          {identity && (
            <>
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base"
                style={{ backgroundColor: identity.bg }}
              >
                {identity.emoji}
              </span>
              <span className="text-sm font-bold" style={{ color: toss.color.foreground }}>
                {identity.nickname}
              </span>
              <button
                type="button"
                onClick={() => setIdentity(randomIdentity())}
                className="ml-auto rounded-full px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: toss.color.surface, color: toss.color.body }}
              >
                랜덤 변경
              </button>
            </>
          )}
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, 1000))}
          placeholder="댓글을 남겨보세요"
          maxLength={1000}
          rows={3}
          required
          className="mt-3 w-full resize-none rounded-md border-none p-3 text-sm outline-none"
          style={{ backgroundColor: toss.color.surface, color: toss.color.foreground }}
        />
        <p className="mt-1.5 text-xs" style={{ color: toss.color.muted }}>
          입력한 댓글은 수정하거나 삭제할 수 없어요. 또한 허위사실, 욕설, 사칭 등 댓글은 통보없이 삭제될 수 있습니다.
        </p>
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
            disabled={submitting || !body.trim() || !identity}
            className="rounded-md px-4 py-1.5 text-sm font-bold text-white disabled:opacity-40"
            style={{ backgroundColor: toss.color.primary }}
          >
            {submitting ? "등록 중..." : "댓글 남기기"}
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-col gap-3">
        {comments === null && (
          <p className="text-sm" style={{ color: toss.color.muted }}>
            불러오는 중...
          </p>
        )}
        {comments?.length === 0 && (
          <p className="text-sm" style={{ color: toss.color.muted }}>
            첫 댓글을 남겨보세요.
          </p>
        )}
        {comments?.map((c) => {
          const avatar = avatarFor(c.nickname);
          return (
            <div key={c.id} className="rounded-md p-4" style={{ backgroundColor: toss.color.surface }}>
              <div className="flex items-center gap-2">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm"
                  style={{ backgroundColor: avatar.bg }}
                >
                  {avatar.emoji}
                </span>
                <span className="text-sm font-bold" style={{ color: toss.color.foreground }}>
                  {c.nickname}
                </span>
                <span className="text-xs" style={{ color: toss.color.muted }}>
                  {formatRelative(c.created_at)}
                </span>
              </div>
              <p className="mt-2 text-sm whitespace-pre-wrap" style={{ color: toss.color.body }}>
                {c.body}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
