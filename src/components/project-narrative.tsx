"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/lib/content";

type Block = { label: string; title: string; body: string };

function buildBlocks(project: Project): Block[] {
  const blocks: Block[] = [
    { label: "Overview", title: project.name, body: project.description },
  ];
  if (project.contributions.length > 0) {
    blocks.push({ label: "기여", title: "기여", body: project.contributions.join(" · ") });
  }
  for (const feature of project.features) {
    blocks.push({ label: "기능", title: feature.title, body: feature.description });
  }
  for (const entry of project.troubleshooting) {
    blocks.push({
      label: "트러블슈팅",
      title: entry.title,
      body: `${entry.problem} ${entry.cause} → ${entry.solution} ${entry.result}`,
    });
  }
  return blocks;
}

// ponytail: crossfade via a single scrubbed timeline instead of per-block
// ScrollTriggers — one pin, one trigger, index-driven position labels.
export function ProjectNarrative({ project, index }: { project: Project; index: number }) {
  const sectionRef = useRef<HTMLElement>(null);
  const blocks = buildBlocks(project);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const blockEls = gsap.utils.toArray<HTMLElement>(".narrative-block", sectionRef.current);
      if (blockEls.length === 0) return;
      gsap.set(blockEls, { opacity: 0.25 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${blockEls.length * 380}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      blockEls.forEach((el, i) => {
        tl.to(el, { opacity: 1, duration: 1 }, i);
        if (i > 0) tl.to(blockEls[i - 1], { opacity: 0.25, duration: 1 }, i);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-screen flex-col justify-center overflow-hidden px-6 py-16 md:px-16 lg:px-24"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center gap-3">
          <span className="text-sm font-black tabular-nums text-neutral-300 [font-family:var(--font-display)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-neutral-200" />
          <span className="text-xs tracking-wide text-neutral-400 uppercase">{project.tagline}</span>
        </div>

        <h2
          className="mt-6 text-4xl font-black [font-family:var(--font-display)] md:text-5xl"
          style={{ color: project.brandColor }}
        >
          {project.name}
        </h2>

        <div className="mt-10 space-y-8">
          {blocks.map((block) => (
            <div key={block.label + block.title} className="narrative-block">
              <p className="text-xs font-bold tracking-wide text-neutral-400 uppercase">{block.label}</p>
              <p className="mt-2 text-lg leading-relaxed font-medium text-neutral-900 md:text-xl">
                {block.title !== block.label && block.title !== project.name && (
                  <span className="font-black">{block.title}. </span>
                )}
                {block.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs tracking-wide text-neutral-400 uppercase">
          {project.techStack.join(" · ")}
        </p>
      </div>
    </section>
  );
}
