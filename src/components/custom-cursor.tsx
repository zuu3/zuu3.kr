"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const HOVER_SELECTOR = "a, button, [role='button']";

function subscribe(callback: () => void) {
  const mqHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  mqHover.addEventListener("change", callback);
  mqMotion.addEventListener("change", callback);
  return () => {
    mqHover.removeEventListener("change", callback);
    mqMotion.removeEventListener("change", callback);
  };
}

function getSnapshot() {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return canHover && !reduceMotion;
}

function getServerSnapshot() {
  return false;
}

export function CustomCursor() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;

    function handleMove(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      setHovering(!!target?.closest(HOVER_SELECTOR));
    }
    window.addEventListener("pointermove", handleMove);
    return () => {
      window.removeEventListener("pointermove", handleMove);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[999] mix-blend-difference"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        className="rounded-full bg-white"
        animate={{
          width: hovering ? 40 : 10,
          height: hovering ? 40 : 10,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </motion.div>
  );
}
