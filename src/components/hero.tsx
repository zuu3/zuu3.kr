"use client";

import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { profile as ProfileType } from "@/lib/content";

export function Hero({ profile }: { profile: typeof ProfileType }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="flex min-h-screen flex-col justify-center px-6 py-24 md:px-16 lg:px-24">
      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-sm font-bold tracking-wide text-[#0cefd3] uppercase"
      >
        Frontend Engineer
      </motion.p>
      <motion.h1
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-4 max-w-4xl text-4xl leading-tight font-black text-neutral-900 [font-family:var(--font-display)] sm:text-5xl md:text-6xl"
      >
        {profile.name}, {profile.tagline}
      </motion.h1>
      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 max-w-xl text-base leading-relaxed text-neutral-500"
      >
        {profile.bio}
      </motion.p>
      <motion.a
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        href={`mailto:${profile.email}`}
        className="mt-8 inline-flex w-fit items-center gap-2 rounded-[var(--radius-control)] bg-[#0cefd3] px-5 py-2.5 text-sm font-bold text-neutral-900 transition-transform hover:scale-105"
      >
        연락하기
      </motion.a>

      <motion.div
        aria-hidden
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.5 },
          y: { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
        }}
        className="mt-16 text-neutral-300"
      >
        <ArrowDown className="h-5 w-5" strokeWidth={1.5} />
      </motion.div>
    </section>
  );
}
