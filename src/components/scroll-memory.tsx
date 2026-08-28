"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const KEY_PREFIX = "scroll:";

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
  pathnameRef.current = pathname;

  useEffect(() => {
    const saved = sessionStorage.getItem(KEY_PREFIX + pathname);
    if (!saved) return;
    const y = Number(saved);
    if (!Number.isFinite(y) || y <= 0) return;

    // 히어로 캔버스, GSAP ScrollTrigger pin-spacer 등 이 페이지의 실제 스크롤
    // 가능 높이는 마운트 직후 한 번에 갖춰지지 않고 몇 프레임에 걸쳐 계속
    // 자란다. 한 번만 옮기면 아직 짧은 문서 높이에 걸려 중간에서 멈추므로,
    // 문서가 자라는 동안 몇 차례 다시 시도해 목표 위치를 계속 쫓아간다.
    function jump() {
      if (window.__lenis) {
        window.__lenis.scrollTo(y, { immediate: true });
      } else {
        window.scrollTo(0, y);
      }
    }
    const timers = [200, 500, 900, 1400].map((delay) => setTimeout(jump, delay));
    return () => timers.forEach(clearTimeout);
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
