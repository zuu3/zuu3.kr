"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/lib/content";

function splitSentences(text: string): string[] {
  return text.split(/(?<=\.)\s+/).filter(Boolean);
}

// Renders `code`-quoted tokens as inline code, and weights the closing
// sentence a touch heavier so a scan of the paragraph lands somewhere.
function renderRichText(text: string): ReactNode {
  const sentences = splitSentences(text);
  return sentences.map((sentence, i) => {
    const isLast = i === sentences.length - 1;
    const parts = sentence.split(/(`[^`]+`)/g).map((part, j) =>
      part.startsWith("`") && part.endsWith("`") ? (
        <code
          key={j}
          className="rounded bg-neutral-200/70 px-1 py-0.5 font-mono text-[0.9em] text-neutral-800"
        >
          {part.slice(1, -1)}
        </code>
      ) : (
        part
      ),
    );
    return (
      <span key={i} className={isLast ? "font-semibold" : undefined}>
        {parts}{" "}
      </span>
    );
  });
}

// "TeachMon(티치몬)" -> { main: "TeachMon", alias: "티치몬" }. Names without
// a parenthetical (e.g. "순복음범천교회 웹사이트") just render as-is.
function splitProjectName(name: string): { main: string; alias: string | null } {
  const match = name.match(/^(.+?)\((.+)\)$/);
  if (!match) return { main: name, alias: null };
  return { main: match[1], alias: match[2] };
}

// ponytail: the scroll-emphasis effect stays scoped to the intro hook
// (2-3 sentences, pinned). Everything after — contributions/features/
// troubleshooting — is plain readable flow, no dimming, no pin.
export function ProjectNarrative({ project, index }: { project: Project; index: number }) {
  const hookRef = useRef<HTMLDivElement>(null);
  const sentences = splitSentences(project.description);
  const { main, alias } = splitProjectName(project.name);

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
    <section id={`project-${project.slug}`} className="border-t border-neutral-200 first:border-t-0">
      <div ref={hookRef} className="flex min-h-[70vh] flex-col justify-center px-6 py-16 md:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-baseline gap-3 text-neutral-400">
            <span className="text-sm font-black tabular-nums [font-family:var(--font-display)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-xs tracking-wide uppercase">{project.period}</span>
          </div>
          <h2 className="mt-3 flex flex-wrap items-baseline gap-x-3">
            <span
              className="text-4xl font-black [font-family:var(--font-display)] md:text-5xl"
              style={{ color: project.brandColor }}
            >
              {main}
            </span>
            {alias && <span className="text-xl font-medium text-neutral-400">{alias}</span>}
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
              <h3 className="text-xl font-bold text-neutral-900">Contribution</h3>
              <ul className="mt-3 space-y-2 text-base leading-relaxed text-neutral-600">
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
              <h3 className="text-xl font-bold text-neutral-900">Features</h3>
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
              <h3 className="text-xl font-bold text-neutral-900">Troubleshooting</h3>
              <div className="mt-3 space-y-10">
                {project.troubleshooting.map((entry) => {
                  return (
                    <div key={entry.title}>
                      <p className="font-semibold text-neutral-900">{entry.title}</p>

                      <dl className="mt-3 max-w-2xl space-y-4 rounded-[var(--radius-card)] bg-neutral-50 p-6">
                        <div>
                          <dt className="text-xs font-bold tracking-wide text-neutral-400 uppercase">Problem</dt>
                          <dd className="mt-1.5 text-base leading-relaxed font-medium text-neutral-900">
                            {renderRichText(entry.problem)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold tracking-wide text-neutral-400 uppercase">Cause</dt>
                          <dd className="mt-1.5 text-base leading-relaxed text-neutral-500">
                            {renderRichText(entry.cause)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold tracking-wide text-neutral-400 uppercase">Solution</dt>
                          <dd className="mt-1.5 text-base leading-relaxed font-medium text-neutral-900">
                            {renderRichText(entry.solution)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-bold tracking-wide text-neutral-400 uppercase">Result</dt>
                          <dd className="mt-1.5 text-base leading-relaxed text-neutral-500">
                            {renderRichText(entry.result)}
                          </dd>
                        </div>
                      </dl>

                      {(entry.codeBefore || entry.codeAfter) && (
                        <pre className="mt-4 overflow-x-auto rounded-[var(--radius-control)] bg-neutral-900 py-3 text-xs leading-relaxed">
                          <code>
                            {entry.codeBefore?.code.split("\n").map((line, i) => (
                              <div key={`b-${i}`} className="bg-red-500/15 px-4 text-red-300">
                                <span className="mr-2 select-none text-red-400/60">-</span>
                                {line}
                              </div>
                            ))}
                            {entry.codeAfter?.code.split("\n").map((line, i) => (
                              <div key={`a-${i}`} className="bg-emerald-500/15 px-4 text-emerald-300">
                                <span className="mr-2 select-none text-emerald-400/60">+</span>
                                {line}
                              </div>
                            ))}
                          </code>
                        </pre>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
