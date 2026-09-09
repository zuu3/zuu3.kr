"use client";

import { useEffect, useState } from "react";
import { toss } from "./toss-tokens";

// article 요소 스크롤 진행률(0~100)을 상단 얇은 바로 보여준다.
export function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    function onScroll() {
      const rect = article!.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const ratio = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
      setPct(ratio * 100);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 right-0 left-0 z-50 h-[3px]" aria-hidden>
      <div
        className="h-full transition-[width] duration-100 ease-out"
        style={{ width: `${pct}%`, backgroundColor: toss.color.primary }}
      />
    </div>
  );
}
