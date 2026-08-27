"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function StickyScroll({
  content,
  accentColor,
  contentClassName,
}: {
  content: { title: string; description: ReactNode; content: ReactNode }[];
  accentColor: string;
  contentClassName?: string;
}) {
  const [activeCard, setActiveCard] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stickyRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelYRef = useRef<number | null>(null);

  useEffect(() => {
    // Each frame: pick the text block closest to the viewport center, then
    // move the panel to sit at that block's actual on-screen position.
    //
    // Aligning the two purely in CSS doesn't work: a sticky panel has two
    // different reference frames — before it sticks it sits wherever it
    // lands in normal flow (top of the grid column), after it sticks it's
    // pinned to the viewport. The text blocks only ever use the first. So
    // any fixed offset that lines them up while stuck is wrong on entry,
    // and vice versa. Driving the panel's offset from the active block's
    // measured rect sidesteps that entirely — they line up in both states.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId: number;
    function update() {
      const viewportH = window.innerHeight;
      const centerY = viewportH / 2;

      let closestIdx = 0;
      let closestDist = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - centerY);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      });
      setActiveCard((prev) => (prev === closestIdx ? prev : closestIdx));

      const activeEl = itemRefs.current[closestIdx];
      const stickyEl = stickyRef.current;
      const panelEl = panelRef.current;
      if (activeEl && stickyEl && panelEl) {
        const activeRect = activeEl.getBoundingClientRect();
        const stickyTop = stickyEl.getBoundingClientRect().top;
        const panelH = panelEl.offsetHeight;
        // Offset is relative to the sticky wrapper, which is why this stays
        // correct whether or not the wrapper is currently pinned. Deliberately
        // unclamped: forcing the panel into the viewport would also drag the
        // panels of not-yet-scrolled-to project sections on screen.
        const target = activeRect.top + activeRect.height / 2 - panelH / 2 - stickyTop;
        // Ease toward the target instead of snapping to it, so switching
        // cards reads as the panel gliding to the next block rather than
        // teleporting. A CSS transition can't do this — the target moves
        // every frame while scrolling, so it would lag continuously.
        const current = panelYRef.current;
        const next = reduceMotion || current === null ? target : current + (target - current) * 0.18;
        panelYRef.current = next;
        panelEl.style.transform = `translateY(${next.toFixed(1)}px)`;
      }

      rafId = requestAnimationFrame(update);
    }
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [content.length]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
      <div className="min-w-0">
        {content.map((item, i) => (
          <div
            key={item.title}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={
              // The first block sits right under the section heading — no
              // leading slack. Later blocks get the tall centered spacing
              // that gives the scroll story room. Panel alignment is driven
              // in JS, so these can differ freely.
              i === 0 ? "pt-2 pb-10" : "flex min-h-[60vh] flex-col justify-center py-10"
            }
          >
            <motion.p
              animate={{ opacity: activeCard === i ? 1 : 0.3 }}
              className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl"
            >
              {item.title}
            </motion.p>
            <motion.div
              animate={{ opacity: activeCard === i ? 1 : 0.3 }}
              className="mt-3 text-base leading-relaxed text-neutral-600"
            >
              {item.description}
            </motion.div>
          </div>
        ))}
        {/* Trailing slack so the last block still has room to reach the
            viewport center before the container ends. */}
        <div aria-hidden className="h-[30vh]" />
      </div>
      {content[activeCard]?.content && (
        <div className="hidden min-w-0 lg:block">
          <div ref={stickyRef} className="sticky top-0 h-screen">
            <div
              ref={panelRef}
              className={cn("w-full overflow-x-hidden rounded-[var(--radius-control)]", contentClassName)}
              style={{ boxShadow: `0 0 0 1px ${accentColor}22` }}
            >
              {content[activeCard]?.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
