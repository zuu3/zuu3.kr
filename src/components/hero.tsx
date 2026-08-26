"use client";

import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import GradientWaves from "@/components/gradient-waves";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center md:px-16 lg:px-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {reduceMotion ? (
          <div className="absolute -top-24 -right-24 h-[26rem] w-[26rem] rounded-full bg-[#0cefd3]/25 blur-[110px]" />
        ) : (
          <GradientWaves
            horizonColor="#e3fbf6"
            waveColor="#0cefd3"
            crestColor="#ffffff"
            speed={0.3}
            amplitude={4.5}
            waveScale={0.65}
            waveRatio={0.9}
            swell={40}
            turbulence={24}
            tilt={1.05}
            zoom={1.15}
            height={4.5}
            fogDepth={40}
            detail="high"
            opacity={1}
            brightness={1.05}
            parallaxStrength={0.3}
            grainIntensity={0.04}
          />
        )}
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
