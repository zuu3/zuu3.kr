"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { TocHeading } from "@/lib/toc";
import { toss } from "../toss-tokens";

// 하위 레벨은 텍스트만 들여쓴다. 세로선은 레벨과 무관하게 한 축에
// 고정돼 있어서 끊기지도, 꺾이지도 않는다 - Stripe/Tailwind 등
// 문서 사이트 목차의 표준 방식.
const TEXT_PAD: Record<number, string> = { 2: "0.875rem", 3: "1.625rem", 4: "2.375rem" };

export function BlogToc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  // 첫 항목 위부터 지금 읽는 항목의 아래끝까지의 px 길이. 목차는 sticky라
  // 늘 화면에 다 떠 있어서, 지나온 구간은 계속 파랗게 남는다.
  const [progressPx, setProgressPx] = useState(0);

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

  useEffect(() => {
    if (!activeId) return;
    const li = itemRefs.current[activeId];
    if (!li) return;
    setProgressPx(li.offsetTop + li.offsetHeight);
  }, [activeId, headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden w-48 shrink-0 xl:block">
      <div className="sticky top-24">
        <p className="text-xs font-bold tracking-wide uppercase" style={{ color: toss.color.muted }}>
          목차
        </p>
        <ul ref={listRef} className="relative mt-3">
          {/* 회색 배경선 (목차 전체 높이) */}
          <div className="absolute top-0 left-0 h-full w-0.5" style={{ backgroundColor: toss.color.border }} />
          {/* 파란 진행선 (첫 항목 ~ 현재 위치). 같은 x축이라 완전 연속. */}
          <div
            className="absolute top-0 left-0 w-0.5"
            style={{
              height: progressPx,
              backgroundColor: toss.color.primary,
              transition: reduceMotion ? "none" : "height 250ms ease-out",
            }}
          />
          {headings.map((h) => {
            const isActive = h.id === activeId;
            return (
              <li
                key={h.id}
                ref={(el) => {
                  itemRefs.current[h.id] = el;
                }}
              >
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
                  className="block py-2 leading-snug transition-colors duration-150"
                  style={{
                    paddingLeft: TEXT_PAD[h.level],
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
