"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    // Exposed so section-jump navigation (LineSidebar) can call
    // window.__lenis?.scrollTo(el) instead of fighting Lenis with a raw
    // scrollIntoView/scrollTo, which it overrides mid-animation.
    window.__lenis = lenis;

    // Bridge Lenis's virtual scroll into GSAP: without this, ScrollTrigger
    // (used for the per-project pinned narrative reveal) reads stale scroll
    // positions and pinned sections barely move. Driving both off the same
    // gsap.ticker also removes the duplicate rAF loop.
    function tick(time: number) {
      lenis.raf(time * 1000);
    }
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Lenis caches the scrollable height on init, and ScrollTrigger caches
    // each trigger's pixel start/end, both computed before late layout
    // shifts (web fonts swapping in, images loading) settle the real page
    // height. Re-measure both whenever the document's height changes —
    // debounced, because calling ScrollTrigger.refresh() while a pin:true
    // trigger is actively pinned (e.g. mid reverse-scroll through one of the
    // per-project narrative sections) recalculates its pin boundaries against
    // the current scroll position and desyncs the pin spacer, which is what
    // caused scrolling upward through those sections to stutter/stick.
    let resizeTimeout: ReturnType<typeof setTimeout> | undefined;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 200);
    });
    resizeObserver.observe(document.body);

    return () => {
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}
