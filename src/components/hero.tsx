"use client";

import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const blobRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    function handleMove(e: MouseEvent) {
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
    }

    function tick() {
      // ease toward the target instead of snapping, so the drift reads as
      // atmosphere rather than a cursor-tracking gimmick
      x += (targetX - x) * 0.06;
      y += (targetY - y) * 0.06;
      if (blobRef.current) blobRef.current.style.transform = `translate3d(${x * 40}px, ${y * 40}px, 0)`;
      if (grainRef.current) grainRef.current.style.transform = `translate3d(${x * 14}px, ${y * 14}px, 0)`;
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", handleMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center md:px-16 lg:px-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div ref={blobRef} className="absolute inset-0">
          <div className="absolute -top-24 -right-24 h-[26rem] w-[26rem] rounded-full bg-[#0cefd3]/25 blur-[110px]" />
          <div className="absolute -bottom-32 -left-16 h-[22rem] w-[22rem] rounded-full bg-neutral-200/70 blur-[110px]" />
        </div>
        <div
          ref={grainRef}
          className="absolute -inset-8 opacity-[0.09] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 18 -8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <motion.h1
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-7xl leading-[0.95] font-black text-neutral-900 [font-family:var(--font-display)] sm:text-8xl md:text-[11vw]"
      >
        Frontend
        <br />
        Engineer
      </motion.h1>

      <motion.div
        aria-hidden
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.4 },
          y: { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
        }}
        className="mt-16 text-neutral-400"
      >
        <ArrowDown className="h-5 w-5" strokeWidth={1.5} />
      </motion.div>
    </section>
  );
}
