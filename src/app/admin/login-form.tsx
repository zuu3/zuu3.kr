"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toss } from "@/app/blog/toss-tokens";

// 계정은 이미 만들었으니 로그인만 남긴다. 회원가입 UI는 여기서 뺐지만, 진짜
// 잠금은 Supabase 대시보드 Authentication > Sign In / Up > "Allow new users
// to sign up"을 꺼야 걸린다 - 안 끄면 API로 직접 가입은 여전히 가능하다.
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-sm flex-col justify-center px-6">
      <h1 className="text-xl font-bold tracking-tight text-neutral-900">로그인</h1>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          style={{ backgroundColor: toss.color.primary }}
        >
          로그인
        </button>
      </form>
    </div>
  );
}
