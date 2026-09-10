"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { TocHeading } from "@/lib/toc";
import { toss } from "../toss-tokens";

export function BlogToc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);
  const reduceMotion = useReducedMotion();

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
    <nav className="hidden w-48 shrink-0 xl:block">
      <div className="sticky top-24">
        <p className="text-xs font-bold tracking-wide uppercase" style={{ color: toss.color.muted }}>
          목차
        </p>
        <ul className="mt-3 space-y-1.5">
          {headings.map((h) => {
            const isActive = h.id === activeId;
            const isNested = h.level !== 2;
            return (
              <li
                key={h.id}
                className="relative"
                style={{
                  marginLeft: h.level === 3 ? "1rem" : h.level === 4 ? "2rem" : 0,
                  // 최상위(level 2) 항목엔 세로 가이드라인을 두지 않는다 -
                  // 당근 seed-design 목차처럼 하위 항목에만 얇은 구조선이
                  // 붙고, 최상위는 활성일 때만 굵은 바가 나타난다.
                  borderLeft: isNested ? `1px solid ${toss.color.border}` : undefined,
                  paddingLeft: isNested ? "1rem" : 0,
                }}
              >
                {/* layoutId 공유 - 활성 항목이 바뀔 때 굵은 바가 순간이동
                    대신 부드럽게 미끄러져 이동한다. */}
                {isActive && (
                  <motion.span
                    layoutId="toc-active-indicator"
                    aria-hidden
                    className="absolute top-0 h-full w-0.5 rounded-full"
                    style={{ left: isNested ? -1 : -1.5, backgroundColor: toss.color.primary }}
                    transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
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
                  className="block py-0.5 leading-snug transition-colors duration-150"
                  style={{
                    color: isActive ? toss.color.foreground : toss.color.muted,
                    fontWeight: isActive ? 700 : 400,
                    fontSize: h.level === 4 ? 13 : 14,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = toss.color.foreground;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = toss.color.muted;
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
