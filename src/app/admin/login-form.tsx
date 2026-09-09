"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

// 계정은 여기서 딱 한 번만 만든다 - 회원가입 성공 뒤엔 Supabase 대시보드에서
// Authentication > Providers > Email > "Allow new users to sign up"을 꺼서
// 잠근다. 그때까진 RLS도 "로그인만 하면 쓰기 가능"이라 다른 사람이 가입하면
// 위험하다.
export function LoginForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-sm flex-col justify-center px-6">
      <h1 className="text-xl font-bold tracking-tight text-neutral-900">
        {mode === "login" ? "로그인" : "계정 만들기"}
      </h1>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-[var(--radius-control)] border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
        <input
          type="password"
          name="password"
          required
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-[var(--radius-control)] border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-[var(--radius-control)] bg-[#ff6f0f] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          {mode === "login" ? "로그인" : "가입"}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="mt-4 text-xs text-neutral-500 underline"
      >
        {mode === "login" ? "계정이 없다면 가입" : "이미 계정이 있다면 로그인"}
      </button>
    </div>
  );
}
