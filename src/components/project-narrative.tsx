"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SiGithub } from "react-icons/si";
import type { Project } from "@/lib/content";
import { TECH_ICON_MAP } from "@/lib/tech-icons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemGroup, ItemMedia } from "@/components/ui/item";
import TiltedCard from "@/components/react-bits/tilted-card";

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
export function ProjectNarrative({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
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
      <div ref={hookRef} className="flex min-h-[70vh] flex-col justify-center px-6 py-16 md:px-16 lg:pl-72 lg:pr-24">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-baseline gap-3 text-neutral-400">
            <span
              className="text-sm font-bold tabular-nums [font-family:var(--font-display)]"
              style={{ color: project.brandColor }}
            >
              {String(index + 1).padStart(2, "0")}
              <span className="text-neutral-300">/{String(total).padStart(2, "0")}</span>
            </span>
            <span className="text-xs tracking-wide text-neutral-400 uppercase">{project.period}</span>
          </div>
          <h2 className="mt-3 text-5xl font-black tracking-tight text-neutral-900 [font-family:var(--font-display)] md:text-6xl">
            {main}
          </h2>
          {alias && <p className="mt-1 text-base font-medium text-neutral-400">{alias}</p>}
          <p className="mt-4 max-w-lg text-lg text-neutral-500">{project.tagline}</p>

          {project.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-xs font-bold"
                  style={{ backgroundColor: `${project.brandColor}14`, color: project.brandColor }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

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

      <div className="px-6 pb-20 md:px-16 lg:pl-72 lg:pr-24">
        <div
          className={`grid items-center gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20 ${
            index % 2 === 1 ? "lg:[&>:first-child]:order-2" : ""
          }`}
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <p className="text-xs font-bold tracking-wide text-neutral-400 uppercase">제작 기간</p>
                <p className="mt-1 text-sm font-medium text-neutral-700">{project.period}</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wide text-neutral-400 uppercase">운영 기간</p>
                <p className="mt-1 text-sm font-medium text-neutral-700">{project.operatingPeriod}</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wide text-neutral-400 uppercase">역할</p>
                <p className="mt-1 text-sm font-medium text-neutral-700">{project.role}</p>
              </div>
              {project.githubUrl && (
                <div>
                  <p className="text-xs font-bold tracking-wide text-neutral-400 uppercase">깃허브</p>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 flex w-fit items-center gap-1.5 text-sm font-medium text-neutral-700 transition-colors hover:text-[#ff6f0f]"
                  >
                    <SiGithub className="h-4 w-4" />
                    바로가기
                  </a>
                </div>
              )}
              {project.liveUrl && (
                <div>
                  <p className="text-xs font-bold tracking-wide text-neutral-400 uppercase">서비스</p>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 flex w-fit items-center gap-1.5 text-sm font-medium text-neutral-700 transition-colors hover:text-[#ff6f0f]"
                  >
                    <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
                    바로가기
                  </a>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => {
                const Icon = TECH_ICON_MAP[tech];
                return (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="h-auto gap-1.5 rounded-lg border-none bg-[#f3f4f5] px-3 py-1.5 text-xs font-bold tracking-tight text-neutral-700"
                  >
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    {tech}
                  </Badge>
                );
              })}
            </div>

            {project.contributions.length > 0 && (
              <div>
                <p className="text-xs font-bold tracking-wide text-neutral-400 uppercase">기여</p>
                <ItemGroup className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {project.contributions.map((item, i) => (
                    <Item key={item} className="bg-[#f3f4f5] px-3.5 py-3">
                      <ItemMedia
                        aria-hidden
                        className="text-xs font-black tabular-nums [font-family:var(--font-display)]"
                        style={{ color: project.brandColor }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </ItemMedia>
                      <ItemContent className="text-sm leading-snug font-medium tracking-tight text-neutral-800">
                        {item}
                      </ItemContent>
                    </Item>
                  ))}
                </ItemGroup>
              </div>
            )}
          </div>

          <AspectRatio ratio={1524 / 1293}>
            <TiltedCard
              imageSrc={project.image}
              altText={`${main} 화면`}
              containerHeight="100%"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              rotateAmplitude={8}
              scaleOnHover={1.03}
              showMobileWarning={false}
              showTooltip={false}
            />
          </AspectRatio>
        </div>
      </div>

      <div className="px-6 pb-24 md:px-16 lg:pl-72 lg:pr-24">
        <div className="mx-auto w-full max-w-3xl space-y-14">

          {project.features.length > 0 && (
            <div>
              <h3 className="text-xl font-bold tracking-tight text-neutral-900">Features & Contribution</h3>
              <div className="mt-2 divide-y divide-neutral-200">
                {project.features.map((feature, i) => (
                  <div key={feature.title} className="relative py-8 first:pt-6">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute top-4 right-0 text-7xl font-black tabular-nums [font-family:var(--font-display)] md:text-8xl"
                      style={{ color: project.brandColor, opacity: 0.08 }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="relative text-xl font-bold tracking-tight text-neutral-900 md:text-2xl">
                      {feature.title}
                    </p>
                    <p className="relative mt-2 max-w-xl text-base leading-relaxed text-neutral-600">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.troubleshooting.length > 0 && (
            <div>
              <h3 className="text-xl font-bold tracking-tight text-neutral-900">Troubleshooting</h3>
              <Accordion
                multiple
                defaultValue={project.troubleshooting.map((entry) => entry.title)}
                className="mt-4 space-y-3"
              >
                {project.troubleshooting.map((entry, i) => (
                  <AccordionItem
                    key={entry.title}
                    value={entry.title}
                    className="overflow-hidden rounded-2xl border border-neutral-200"
                  >
                    <AccordionTrigger className="gap-4 px-5 py-4 text-left hover:no-underline focus-visible:ring-0">
                      <span className="flex items-center gap-3.5">
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black tabular-nums text-white [font-family:var(--font-display)]"
                          style={{ backgroundColor: project.brandColor }}
                        >
                          {i + 1}
                        </span>
                        <span className="text-lg font-bold tracking-tight text-neutral-900">{entry.title}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-6">
                      <div className="max-w-3xl space-y-4 border-t border-neutral-100 pt-5">
                        <div
                          className="rounded-xl p-4"
                          style={{ backgroundColor: `${project.brandColor}0d` }}
                        >
                          <p className="text-xs font-black tracking-wide uppercase" style={{ color: project.brandColor }}>
                            Problem
                          </p>
                          <p className="mt-1.5 text-base leading-relaxed font-medium text-neutral-900">
                            {renderRichText(entry.problem)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-black tracking-wide text-neutral-400 uppercase">Cause</p>
                          <p className="mt-1.5 text-base leading-relaxed text-neutral-500">
                            {renderRichText(entry.cause)}
                          </p>
                        </div>

                        <div
                          className="rounded-xl p-4"
                          style={{ backgroundColor: `${project.brandColor}0d` }}
                        >
                          <p className="text-xs font-black tracking-wide uppercase" style={{ color: project.brandColor }}>
                            Solution
                          </p>
                          <p className="mt-1.5 text-base leading-relaxed font-medium text-neutral-900">
                            {renderRichText(entry.solution)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-black tracking-wide text-neutral-400 uppercase">Result</p>
                          <p className="mt-1.5 text-base leading-relaxed text-neutral-500">
                            {renderRichText(entry.result)}
                          </p>
                        </div>
                      </div>

                      {(entry.codeBefore || entry.codeAfter) && (
                        <div className="mt-5 max-w-3xl overflow-hidden rounded-xl bg-neutral-900">
                          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                            <span className="ml-2 text-[11px] font-medium tracking-wide text-white/40">diff</span>
                          </div>
                          <pre className="overflow-x-auto py-3 text-xs leading-relaxed">
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
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
