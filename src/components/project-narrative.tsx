"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/lib/content";

function splitSentences(text: string): string[] {
  return text.split(/(?<=\.)\s+/).filter(Boolean);
}

// ponytail: the scroll-emphasis effect stays scoped to the intro hook
// (2-3 sentences, pinned). Everything after — contributions/features/
// troubleshooting — is plain readable flow, no dimming, no pin.
export function ProjectNarrative({ project, index }: { project: Project; index: number }) {
  const hookRef = useRef<HTMLDivElement>(null);
  const sentences = splitSentences(project.description);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sentences.length <= 1) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".hook-line", hookRef.current);
      if (lines.length <= 1) return;
      gsap.set(lines, { opacity: 0.3 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hookRef.current,
          start: "top top",
          // +1 "hold" segment at the end so the last line has room to sit
          // fully readable before the section unpins — without it the pin
          // released the instant the last line finished fading in.
          end: () => `+=${(lines.length + 1) * 480}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      lines.forEach((el, i) => {
        tl.to(el, { opacity: 1, duration: 1 }, i);
        if (i > 0) tl.to(lines[i - 1], { opacity: 0.3, duration: 1 }, i);
      });
    }, hookRef);

    return () => ctx.revert();
  }, [sentences.length]);

  return (
    <section className="border-t border-neutral-200 first:border-t-0">
      <div ref={hookRef} className="flex min-h-[70vh] flex-col justify-center px-6 py-16 md:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-baseline gap-3 text-neutral-400">
            <span className="text-sm font-black tabular-nums [font-family:var(--font-display)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-xs tracking-wide uppercase">{project.period}</span>
          </div>
          <h2
            className="mt-3 text-4xl font-black [font-family:var(--font-display)] md:text-5xl"
            style={{ color: project.brandColor }}
          >
            {project.name}
          </h2>
          <p className="mt-1 text-base text-neutral-500">{project.tagline}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-[var(--radius-control)] border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-600"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-8 space-y-2">
            {sentences.map((sentence) => (
              <p
                key={sentence}
                className="hook-line text-xl leading-snug font-bold text-neutral-900 md:text-2xl"
              >
                {sentence}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-24 md:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-3xl space-y-14">
          {project.contributions.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-neutral-900 [font-family:var(--font-display)]">기여</h3>
              <ul
                className="mt-3 space-y-2 rounded-[var(--radius-card)] border border-neutral-200 p-5 text-base leading-relaxed text-neutral-700"
                style={{ backgroundColor: `${project.brandColor}0d` }}
              >
                {project.contributions.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span
                      aria-hidden
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: project.brandColor }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.features.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-neutral-900 [font-family:var(--font-display)]">기능</h3>
              <div className="mt-3 space-y-5">
                {project.features.map((feature) => (
                  <div key={feature.title}>
                    <p className="font-semibold text-neutral-900">{feature.title}</p>
                    <p className="mt-1 text-base leading-relaxed text-neutral-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.troubleshooting.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-neutral-900 [font-family:var(--font-display)]">
                트러블슈팅
              </h3>
              <div className="mt-3 space-y-10">
                {project.troubleshooting.map((entry) => (
                  <div key={entry.title}>
                    <p className="font-semibold text-neutral-900">{entry.title}</p>
                    <dl className="mt-3 space-y-3 border-l-2 pl-4" style={{ borderColor: project.brandColor }}>
                      <div>
                        <dt className="text-xs font-bold tracking-wide text-neutral-400 uppercase">Problem</dt>
                        <dd className="mt-1 text-base leading-relaxed font-medium text-neutral-900">
                          {entry.problem}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold tracking-wide text-neutral-400 uppercase">Cause</dt>
                        <dd className="mt-1 text-base leading-relaxed text-neutral-500">{entry.cause}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold tracking-wide text-neutral-400 uppercase">Solution</dt>
                        <dd className="mt-1 text-base leading-relaxed font-medium text-neutral-900">
                          {entry.solution}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold tracking-wide text-neutral-400 uppercase">Result</dt>
                        <dd className="mt-1 text-base leading-relaxed text-neutral-500">{entry.result}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
