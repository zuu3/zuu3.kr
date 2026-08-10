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
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 0.6,
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
        {projects.map((project) => (
          <div key={project.slug} className="w-[85vw] max-w-[520px] shrink-0 md:w-[440px]">
            <ProjectCard project={project} />
          </div>
        ))}
        <div aria-hidden className="w-px shrink-0 md:w-8 lg:w-16" />
      </div>
    </div>
  );
}
