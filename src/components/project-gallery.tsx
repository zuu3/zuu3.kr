"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/content";

export function ProjectGallery({ projects }: { projects: Project[] }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    // Below md, the track is just a native horizontally-scrollable row
    // (overflow-x-auto in the JSX) — pin+scrub only kicks in on desktop,
    // where a trackpad/wheel-driven pin reads as intentional instead of
    // fighting the user's vertical scroll.
    mm.add("(min-width: 768px)", () => {
      const pinEl = pinRef.current;
      const track = trackRef.current;
      if (!pinEl || !track) return;

      const distance = track.scrollWidth - pinEl.clientWidth;
      const tween = gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: pinEl,
          start: "top 12%",
          // Scroll input needed to finish the slide is stretched to 1.6x the
          // raw overflow so the scrub doesn't blow through in a couple of
          // wheel ticks — same pin, more room to feel it happen. Clamped to
          // whatever page length is actually left after the pin's start, so
          // a short footer can never truncate the slide before it finishes
          // (this is what silently broke once already when the footer got
          // shorter).
          end: () => {
            const startAbs =
              pinEl.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.12;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const available = Math.max(distance, maxScroll - startAbs);
            return `+=${Math.min(distance * 1.6, available)}`;
          },
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={pinRef}
      className="overflow-x-auto md:overflow-hidden"
    >
      <div
        ref={trackRef}
        className="flex w-max gap-6 px-6 pb-4 md:px-16 md:pb-0 lg:px-24"
      >
        {projects.map((project, index) => (
          <div key={project.slug} className="w-[85vw] max-w-[420px] shrink-0 md:w-[360px]">
            <ProjectCard project={project} index={index} />
          </div>
        ))}
        <div aria-hidden className="w-px shrink-0 md:w-8 lg:w-16" />
      </div>
    </div>
  );
}
