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

  const rotateY = useTransform(springPx, [0, 1], [-6, 6]);
  const rotateX = useTransform(springPy, [0, 1], [5, -5]);
  const spotlightX = useTransform(springPx, [0, 1], ["10%", "90%"]);
  const spotlightY = useTransform(springPy, [0, 1], ["10%", "90%"]);

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
          className="text-sm font-bold tracking-wide text-amber-700"
        >
          당신의 코드를 가장 유연하게
        </motion.p>
        <motion.h1
          variants={item}
          className="mt-4 text-4xl leading-[1.15] font-black text-balance text-neutral-900 md:text-6xl"
        >
          <span className="text-amber-700">스펀지</span> 같은
          <br />
          개발자, {profile.name}
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-8 max-w-[52ch] text-base leading-relaxed text-muted-foreground md:text-lg"
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
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="group relative aspect-square touch-none overflow-hidden rounded-2xl bg-neutral-100 md:aspect-4/5"
      >
        <Image
          src="/profile-photo.jpg"
          alt={`${profile.name} 프로필 사진`}
          fill
          sizes="(min-width: 768px) 40vw, 90vw"
          className="object-cover"
          priority
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{
            background: useTransform(
              [spotlightX, spotlightY],
              ([x, y]) => `radial-gradient(280px circle at ${x} ${y}, white, transparent 70%)`
            ),
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
      </motion.div>
    </section>
  );
}
