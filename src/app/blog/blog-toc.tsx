"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/toc";
import { toss } from "./toss-tokens";

export function BlogToc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden w-48 shrink-0 lg:block">
      <div className="sticky top-24">
        <p className="text-xs font-bold tracking-wide uppercase" style={{ color: toss.color.muted }}>
          목차
        </p>
        <ul className="mt-3 space-y-2.5 border-l pl-4" style={{ borderColor: toss.color.border }}>
          {headings.map((h) => {
            const isActive = h.id === activeId;
            return (
              <li
                key={h.id}
                className="relative"
                style={{ marginLeft: h.level === 3 ? "1rem" : h.level === 4 ? "2rem" : 0 }}
              >
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute -left-4 h-full w-0.5"
                    style={{ backgroundColor: toss.color.primary }}
                  />
                )}
                <a
                  href={`#${h.id}`}
                  onClick={(e) => {
                    const target = document.getElementById(h.id);
                    if (!target) return;
                    e.preventDefault();
                    // 사이트 전역에 Lenis 스무스 스크롤이 떠 있어서, 네이티브
                    // #hash 점프나 scrollIntoView를 그대로 쓰면 Lenis가 다음
                    // 프레임에 자기 가상 스크롤 위치로 되돌려버린다 — 특히
                    // 섹션 사이 간격이 짧으면 엉뚱한 이웃 섹션으로 튕겨 보인다.
                    // Lenis 자신의 scrollTo를 거치면 이 경합이 안 생긴다.
                    if (window.__lenis) {
                      window.__lenis.scrollTo(target, { duration: 1, offset: -80 });
                    } else {
                      target.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="block text-sm transition-colors"
                  style={{
                    color: isActive ? toss.color.foreground : toss.color.muted,
                    fontWeight: isActive ? 700 : 400,
                    fontSize: h.level === 4 ? 13 : 14,
                  }}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
