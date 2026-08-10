"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Mail, Phone, GraduationCap } from "lucide-react";
import type { profile as ProfileType } from "@/lib/content";

const SPONGE_COLORS = ["#F5A524", "#2563EB", "#EC4899", "#171717", "#F5A524", "#3B82F6"];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero({ profile }: { profile: typeof ProfileType }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springPx = useSpring(px, { stiffness: 150, damping: 18 });
  const springPy = useSpring(py, { stiffness: 150, damping: 18 });

  const rotateY = useTransform(springPx, [0, 1], [-10, 10]);
  const rotateX = useTransform(springPy, [0, 1], [8, -8]);
  const spotlightX = useTransform(springPx, [0, 1], ["10%", "90%"]);
  const spotlightY = useTransform(springPy, [0, 1], ["10%", "90%"]);
  const blockShiftX = useTransform(springPx, [0, 1], [8, -8]);
  const blockShiftY = useTransform(springPy, [0, 1], [6, -6]);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <section className="grid items-center gap-12 md:grid-cols-[3fr_2fr]">
      <motion.div
        variants={reduceMotion ? undefined : container}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
      >
        <motion.p
          variants={item}
          className="text-sm font-bold uppercase tracking-wide text-amber-700"
        >
          Frontend Developer
        </motion.p>
        <motion.h1
          variants={item}
          className="mt-3 text-4xl leading-tight font-normal text-balance md:text-5xl [font-family:var(--font-display)]"
        >
          <span className="text-amber-700">스펀지</span> 같은 개발자,
          <br />
          {profile.name}입니다.
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-6 max-w-[58ch] text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {profile.bio}
        </motion.p>
        <motion.div
          variants={item}
          className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5">
            <Mail className="h-4 w-4" strokeWidth={1.75} />
            {profile.email}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Phone className="h-4 w-4" strokeWidth={1.75} />
            {profile.phone}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4" strokeWidth={1.75} />
            {profile.school}
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        ref={panelRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        style={{ rotateX, rotateY, transformPerspective: 800 }}
        className="relative aspect-square touch-none overflow-hidden rounded-3xl bg-amber-700 md:aspect-4/5"
      >
        <motion.div
          className="absolute inset-3 grid grid-cols-3 gap-2"
          style={{ x: blockShiftX, y: blockShiftY }}
          aria-hidden
        >
          {SPONGE_COLORS.map((color, i) => (
            <div
              key={i}
              className="rounded-2xl"
              style={{
                backgroundColor: color,
                opacity: 0.35,
                gridRow: i === 0 ? "span 2" : undefined,
                gridColumn: i === 4 ? "span 2" : undefined,
              }}
            />
          ))}
        </motion.div>
        <Image
          src="/profile-photo.jpg"
          alt={`${profile.name} 프로필 사진`}
          fill
          sizes="(min-width: 768px) 40vw, 90vw"
          className="relative rounded-3xl object-cover"
          priority
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl mix-blend-soft-light"
          style={{
            background: useTransform(
              [spotlightX, spotlightY],
              ([x, y]) => `radial-gradient(220px circle at ${x} ${y}, white, transparent 70%)`
            ),
          }}
        />
      </motion.div>
    </section>
  );
}
