"use client";

import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { profile as ProfileType } from "@/lib/content";

export function Hero({ profile }: { profile: typeof ProfileType }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="flex min-h-screen flex-col justify-center px-6 py-24 md:px-16 lg:px-24">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <div>
          <motion.span
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-[var(--radius-control)] bg-[#0cefd3] px-3 py-1 text-xs font-bold tracking-wide text-neutral-900 uppercase"
          >
            Frontend Engineer
          </motion.span>
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 max-w-2xl text-4xl leading-[1.15] font-black text-neutral-900 [font-family:var(--font-display)] sm:text-5xl md:text-6xl"
          >
            {profile.tagline}
          </motion.h1>
          <motion.a
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            href={`mailto:${profile.email}`}
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-[var(--radius-control)] bg-[#0cefd3] px-5 py-2.5 text-sm font-bold text-neutral-900 transition-transform hover:scale-105"
          >
            연락하기
          </motion.a>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border-l-2 border-[#0cefd3] pl-6"
        >
          <p className="text-base leading-relaxed text-neutral-600">{profile.bio}</p>
          <p className="mt-4 text-sm text-neutral-400">{profile.school}</p>
        </motion.div>
      </div>

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
