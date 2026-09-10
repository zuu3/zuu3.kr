"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { TocHeading } from "@/lib/toc";
import { toss } from "../toss-tokens";

export function BlogToc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  // 목차 자체 안의 진행 바 길이(px) - 첫 항목 위부터 지금 읽고 있는
  // 항목의 아래끝까지. 활성 항목이 바뀌어도 그 위 구간은 파랗게 남아있고,
  // 이 목차 리스트는 늘 화면에 다 떠 있어서(sticky) 실질적으로 다시
  // 회색으로 되돌아가는 일은 없다 - 지나온 만큼 계속 쌓이는 진행 표시.
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
    if (!activeId || !listRef.current) return;
    const activeLi = itemRefs.current[activeId];
    if (!activeLi) return;
    setProgressPx(activeLi.offsetTop + activeLi.offsetHeight);
  }, [activeId, headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden w-48 shrink-0 xl:block">
      <div className="sticky top-24">
        <p className="text-xs font-bold tracking-wide uppercase" style={{ color: toss.color.muted }}>
          목차
        </p>
        <ul ref={listRef} className="relative mt-3 space-y-1.5 pl-4">
          {/* 회색 배경 선 - 목차 전체 높이만큼 항상 깔려있다 */}
          <div className="absolute top-0 left-0 h-full w-px" style={{ backgroundColor: toss.color.border }} />
          {/* 진행 선 - 첫 항목부터 지금 읽는 위치까지, 끊기지 않고 하나로
              이어진다. 높이만 바뀌므로 li마다 따로 그리는 것과 달리 절대
              끊어지지 않는다. */}
          <div
            className="absolute top-0 left-0 w-px"
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
                style={{ marginLeft: h.level === 3 ? "1rem" : h.level === 4 ? "2rem" : 0 }}
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
