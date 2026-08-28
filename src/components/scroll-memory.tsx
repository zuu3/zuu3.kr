"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const KEY_PREFIX = "scroll:";
const MAX_RESTORE_MS = 1500;

// Next.js Link 네비게이션은 뒤로가기가 아니라 매번 새 push라서, 브라우저의
// 네이티브 스크롤 복원이 적용되지 않는다(그건 popstate에만 붙는다). 홈처럼
// 스크롤이 곧 콘텐츠인 페이지에서 Home → Blog → Home으로 오면 매번 맨 위로
// 튕기는 이유가 이거다 - sessionStorage에 직접 위치를 저장/복원한다.
//
// "떠나는 시점"에 한 번 저장하는 방식은 안 된다: Next가 네비게이션을 시작하며
// React가 이 컴포넌트의 cleanup을 돌리기도 전에 이미 스크롤을 0으로 되돌려
// 놓는다. 그래서 스크롤할 때마다 계속 최신 위치를 흘려 저장해둔다.
export function ScrollMemory() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // 복원할 위치가 있으면 첫 페인트 전에 문서를 숨겨서 "맨 위 → 목표 위치"로
  // 튀는 깜빡임 자체를 안 보이게 한다. rAF 폴링으로 문서 높이가 목표 위치에
  // 닿을 때까지(= 히어로/ScrollTrigger pin-spacer가 다 자랄 때까지) 계속
  // scrollTo를 재시도하다가, 도달하거나 최대 대기 시간을 넘기면 다시 보여준다.
  useLayoutEffect(() => {
    const saved = sessionStorage.getItem(KEY_PREFIX + pathname);
    const y = Number(saved);
    if (!saved || !Number.isFinite(y) || y <= 0) return;

    document.documentElement.style.visibility = "hidden";
    const start = performance.now();
    let raf = 0;

    function tick() {
      if (window.__lenis) {
        window.__lenis.scrollTo(y, { immediate: true });
      } else {
        window.scrollTo(0, y);
      }

      const reached = Math.abs(window.scrollY - y) < 2;
      const timedOut = performance.now() - start > MAX_RESTORE_MS;
      if (reached || timedOut) {
        document.documentElement.style.visibility = "";
        return;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.visibility = "";
    };
  }, [pathname]);

  useEffect(() => {
    let raf = 0;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        sessionStorage.setItem(KEY_PREFIX + pathnameRef.current, String(window.scrollY));
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
