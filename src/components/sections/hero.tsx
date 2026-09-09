"use client";

import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import ParticleText from "@/components/react-bits/particle-text";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0b0b12] px-6 py-24 text-center md:px-16 lg:px-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute -bottom-24 left-[12%] h-[44rem] w-[44rem] rounded-full bg-white/55 blur-[90px] mix-blend-screen ${reduceMotion ? "" : "animate-[smoke-a_18s_ease-in-out_infinite]"}`}
        />
        <div
          className={`absolute -bottom-32 right-[8%] h-[36rem] w-[36rem] rounded-full bg-[#ff6f0f]/40 blur-[95px] mix-blend-screen ${reduceMotion ? "" : "animate-[smoke-b_22s_ease-in-out_infinite]"}`}
        />
        <div
          className={`absolute bottom-0 left-1/2 ml-[-26rem] h-[30rem] w-[52rem] rounded-full bg-[#b8a4ff]/35 blur-[110px] mix-blend-screen ${reduceMotion ? "" : "animate-[smoke-c_26s_ease-in-out_infinite]"}`}
        />
        <div className="absolute inset-0 bg-radial-[at_50%_45%] from-transparent via-transparent to-[#0b0b12] to-85%" />
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')]" />
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl"
      >
        <h1 className="sr-only">Frontend Engineer</h1>
        {["Frontend", "Engineer"].map((word) => (
          <ParticleText
            key={word}
            text={word}
            aria-hidden
            style={{ height: "clamp(5.5rem, 13vw, 13rem)" }}
            fontSize="clamp(5.5rem, 13vw, 13rem)"
            fontWeight={700}
            color="#ffffff"
            highlightColor="#ffffff"
            particleSize={2.2}
            density={3}
            scatter={220}
            gatherDuration={1400}
            stagger={500}
            pointerRepel={36}
            repelRadius={110}
            idleDrift={0.5}
            trigger="mount"
            glow
          />
        ))}
      </motion.div>

      <motion.div
        aria-hidden
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.4 },
          y: { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
        }}
        className="mt-16 text-white/50"
      >
        <ArrowDown className="h-5 w-5" strokeWidth={1.5} />
      </motion.div>
    </section>
  );
}
