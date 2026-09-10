"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { toss } from "../toss-tokens";

type Theme = "light" | "dark";

const STORAGE_KEY = "blog-theme";

// 첫 렌더는 서버와 맞춰야 hydration 경고가 안 나서 null(=시스템 기본값,
// CSS의 prefers-color-scheme가 처리)로 시작하고, mount 후에만 localStorage에
// 저장된 명시적 선택을 읽어 data-theme을 덮어쓴다.
export function BlogThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    // localStorage는 React 밖 외부 시스템 - mount 시 한 번 읽어와 동기화한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  useEffect(() => {
    const scope = document.querySelector(".blog-scope");
    if (!scope) return;
    if (theme) scope.setAttribute("data-theme", theme);
    else scope.removeAttribute("data-theme");
  }, [theme]);

  function toggle() {
    const current =
      theme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next: Theme = current === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="다크모드 전환"
      className="fixed right-5 bottom-5 z-40 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition hover:brightness-95"
      style={{ backgroundColor: toss.color.canvas, border: `1px solid ${toss.color.border}` }}
    >
      {theme === "dark" ? (
        <Sun size={18} style={{ color: toss.color.body }} />
      ) : (
        <Moon size={18} style={{ color: toss.color.body }} />
      )}
    </button>
  );
}
