"use client";

import { ArrowDown, Mail } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { profile as ProfileType } from "@/lib/content";
import { HeroShaderBg } from "@/components/hero-shader-bg";

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
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[92vh] flex-col overflow-hidden px-6 py-8 md:min-h-screen md:px-16 md:py-10 lg:px-24">
      <HeroShaderBg />

      <motion.div
        variants={reduceMotion ? undefined : container}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
        className="flex flex-1 flex-col items-center justify-center gap-6 text-center"
      >
        <motion.h1
          variants={item}
          className="text-7xl leading-[0.95] font-black text-neutral-900 [font-family:var(--font-display)] sm:text-8xl md:text-[9vw]"
        >
          {profile.name}
        </motion.h1>
        <motion.p
          variants={item}
          className="max-w-xl text-lg font-bold text-balance text-neutral-900 md:text-2xl"
        >
          {profile.tagline}
        </motion.p>
        <motion.p
          variants={item}
          className="max-w-md text-sm leading-relaxed text-balance text-neutral-500 md:text-base"
        >
          {profile.bio}
        </motion.p>
        <motion.div variants={item} className="mt-2 flex items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-[#0cefd3] px-5 py-2.5 text-sm font-bold text-neutral-900 transition-transform hover:scale-105"
          >
            <Mail className="h-4 w-4" strokeWidth={2} />
            연락하기
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.4 },
          y: { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
        }}
        className="self-center text-neutral-400"
      >
        <ArrowDown className="h-5 w-5" strokeWidth={1.5} />
      </motion.div>
    </section>
  );
}
