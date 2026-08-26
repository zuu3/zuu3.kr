"use client";

import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) return;

    let raf = 0;
    let targetX = -9999;
    let targetY = -9999;
    let x = -9999;
    let y = -9999;
    let active = false;

    function handleMove(e: MouseEvent) {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      active = true;
    }

    function handleLeave() {
      active = false;
      targetX = -9999;
      targetY = -9999;
    }

    function tick() {
      // ease toward the target so the cleared spot glides instead of snapping
      x += (targetX - x) * (active ? 0.15 : 0.08);
      y += (targetY - y) * (active ? 0.15 : 0.08);
      if (grainRef.current) {
        grainRef.current.style.setProperty("--cx", `${x}px`);
        grainRef.current.style.setProperty("--cy", `${y}px`);
      }
      raf = requestAnimationFrame(tick);
    }

    const section = sectionRef.current;
    section?.addEventListener("mousemove", handleMove);
    section?.addEventListener("mouseleave", handleLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      section?.removeEventListener("mousemove", handleMove);
      section?.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center md:px-16 lg:px-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-[26rem] w-[26rem] rounded-full bg-[#0cefd3]/25 blur-[110px]" />
        <div className="absolute -bottom-32 -left-16 h-[22rem] w-[22rem] rounded-full bg-neutral-200/70 blur-[110px]" />
        <div
          ref={grainRef}
          className="absolute inset-0 opacity-[0.09] mix-blend-multiply [mask-mode:alpha] [-webkit-mask-mode:alpha]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 18 -8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            maskImage:
              "radial-gradient(140px circle at var(--cx, -9999px) var(--cy, -9999px), transparent 0, transparent 55px, black 140px)",
            WebkitMaskImage:
              "radial-gradient(140px circle at var(--cx, -9999px) var(--cy, -9999px), transparent 0, transparent 55px, black 140px)",
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
