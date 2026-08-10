"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    // Bridge Lenis's virtual scroll into GSAP: without this, ScrollTrigger
    // (used for the Awards reveal and the Projects pin/scrub gallery) reads
    // stale scroll positions and pinned sections barely move. Driving both
    // off the same gsap.ticker also removes the duplicate rAF loop.
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
    // this is also what makes the Projects pin/scrub gallery track a
    // moving target reliably instead of pinning at a stale scroll offset.
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
