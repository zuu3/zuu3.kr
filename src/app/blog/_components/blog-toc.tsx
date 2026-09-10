"use client";

import { useEffect, useRef, useState } from "react";
import type { TocHeading } from "@/lib/toc";
import { toss } from "../toss-tokens";

// 레벨별 세로선 x좌표(px)와 그에 맞춘 텍스트 왼쪽 패딩.
const LINE_X: Record<number, number> = { 2: 1, 3: 13, 4: 25 };
const TEXT_PAD: Record<number, string> = { 2: "0.75rem", 3: "1.5rem", 4: "2.25rem" };

export function BlogToc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);
  const ulRef = useRef<HTMLUListElement>(null);
  const liRefs = useRef<(HTMLLIElement | null)[]>([]);
  // 각 항목의 세로 중심 y좌표 + 목차 전체 높이. 이 좌표로 SVG 폴리라인을
  // 그리면 레벨이 바뀌는 구간이 자동으로 사선으로 이어진다.
  const [layout, setLayout] = useState<{ ys: number[]; h: number } | null>(null);

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
    function measure() {
      const ul = ulRef.current;
      if (!ul) return;
      const ys = liRefs.current.map((li) => (li ? li.offsetTop + li.offsetHeight / 2 : 0));
      setLayout({ ys, h: ul.offsetHeight });
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (ulRef.current) ro.observe(ulRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  const activeIndex = headings.findIndex((h) => h.id === activeId);

  const pt = (level: number, y: number) => `${LINE_X[level]},${y}`;
  const greyPoints = layout
    ? [
        pt(headings[0].level, 0),
        ...headings.map((h, i) => pt(h.level, layout.ys[i])),
        pt(headings[headings.length - 1].level, layout.h),
      ].join(" ")
    : "";
  const bluePoints =
    layout && activeIndex >= 0
      ? [pt(headings[0].level, 0), ...headings.slice(0, activeIndex + 1).map((h, i) => pt(h.level, layout.ys[i]))].join(
          " ",
        )
      : "";

  return (
    <nav className="hidden w-48 shrink-0 xl:block">
      <div className="sticky top-24">
        <p className="text-xs font-bold tracking-wide uppercase" style={{ color: toss.color.muted }}>
          목차
        </p>
        <div className="relative mt-3">
          {layout && (
            <svg
              aria-hidden
              className="pointer-events-none absolute top-0 left-0"
              width={32}
              height={layout.h}
              style={{ overflow: "visible" }}
            >
              <polyline
                points={greyPoints}
                fill="none"
                stroke={toss.color.border}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {bluePoints && (
                <polyline
                  points={bluePoints}
                  fill="none"
                  stroke={toss.color.primary}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          )}
          <ul ref={ulRef} className="relative">
            {headings.map((h, i) => {
              const isActive = h.id === activeId;
              return (
                <li
                  key={h.id}
                  ref={(el) => {
                    liRefs.current[i] = el;
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
      </div>
    </nav>
  );
}
