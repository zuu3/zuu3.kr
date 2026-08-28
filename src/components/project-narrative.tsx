"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Article,
  Badge as SeedBadge,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
  Text,
} from "@seed-design/react";
import { ExternalLink } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SiGithub } from "react-icons/si";
import type { Project } from "@/lib/content";
import { TECH_ICON_MAP } from "@/lib/tech-icons";
import { readableOnWhite } from "@/lib/color";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemGroup, ItemMedia } from "@/components/ui/item";
import TiltedCard from "@/components/react-bits/tilted-card";
import { CodeBlock, hasProjectDemo, ProjectDemo } from "@/components/project-narrative-demos";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { Highlighter } from "@/components/ui/highlighter";
import { CodeComparison } from "@/components/ui/code-comparison";

function splitSentences(text: string): string[] {
  return text.split(/(?<=\.)\s+/).filter(Boolean);
}

// Renders `code`-quoted tokens as inline code, and weights the closing
// sentence a touch heavier so a scan of the paragraph lands somewhere.
// markColor draws a hand-drawn marker highlight under that closing sentence
// too (brand-colored for Result's outcome/metric line, neutral for
// Solution's decision line) instead of plain bold. Always uses the
// "highlight" action — "underline" doesn't handle wrapped multi-line text
// reliably in rough-notation and overflows past the text.
function renderRichText(text: string, options?: { markColor?: string }): ReactNode {
  const { markColor } = options ?? {};
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
    if (isLast && markColor) {
      return (
        <span key={i} className="font-semibold">
          <Highlighter action="highlight" color={`${markColor}4d`} padding={3} multiline isView>
            {parts}
          </Highlighter>{" "}
        </span>
      );
    }
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

// Code when the feature has a real snippet, the interactive demo when the
// project has one mapped, and nothing (no filler image) when it has neither
// — the title/description still show in the story, the panel just stays empty.
function renderFeatureContent(feature: Project["features"][number], project: Project): ReactNode {
  if (feature.codeExample) {
    return (
      <CodeBlock code={feature.codeExample} highlight={feature.codeHighlight} accentColor={project.brandColor} />
    );
  }
  if (hasProjectDemo(project.slug)) {
    return (
      <div className="bg-white p-1">
        <ProjectDemo slug={project.slug} accentColor={project.brandColor} />
      </div>
    );
  }
  return null;
}

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
  // brandColor is picked for hue, not contrast — darken it just enough to
  // clear 4.5:1 on white wherever it's used as small text (e.g. #EC4899 is
  // only 3.53:1 as-is). Backgrounds/accents keep the raw brandColor.
  const readableBrand = readableOnWhite(project.brandColor);
  const hasFeatureStory = project.features.some((f) => f.codeExample);
  const storyFeatures = hasFeatureStory ? project.features : [];
  // A step with neither code nor a mapped demo leaves the sticky panel
  // empty — scrolling through those looks broken, so force the flat
  // "show all" view for any project that has one instead of offering a
  // toggle into the one-at-a-time story.
  const hasStoryGaps = storyFeatures.some((f) => !f.codeExample && !hasProjectDemo(project.slug));
  const [showAllCode, setShowAllCode] = useState(hasStoryGaps);

  useEffect(() => {
    // StickyScroll의 코드/데모 패널은 lg 이상에서만 보이므로(lg:block), 그
    // 밑에서는 스크롤 하이라이트만 있고 패널이 없는 반쪽짜리 경험이 된다.
    // 모바일은 처음부터 평문 리스트로 시작한다.
    if (window.matchMedia("(max-width: 1023px)").matches) setShowAllCode(true);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sentences.length <= 1) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".hook-line", hookRef.current);
      if (lines.length <= 1) return;
      // 0.6 not 0.3: floor for text-neutral-900 on white to still clear WCAG AA 4.5:1 at rest.
      gsap.set(lines, { opacity: 0.6 });

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
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      lines.forEach((el, i) => {
        tl.to(el, { opacity: 1, duration: 1 }, i);
        if (i > 0) tl.to(lines[i - 1], { opacity: 0.6, duration: 1 }, i);
      });
    }, hookRef);

    return () => ctx.revert();
  }, [sentences.length]);

  return (
    <section id={`project-${project.slug}`} className="border-t border-neutral-200 first:border-t-0">
      <div ref={hookRef} className="flex min-h-[70vh] flex-col justify-center px-6 py-16 md:px-16 lg:pl-72 lg:pr-24">
        <div className="mx-auto w-full max-w-4xl">
          <div className="flex items-baseline gap-3 text-neutral-500">
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: readableBrand }}
            >
              {String(index + 1).padStart(2, "0")}
              <span className="text-neutral-500">/{String(total).padStart(2, "0")}</span>
            </span>
            <span className="text-xs tracking-wide text-neutral-500 uppercase">{project.period}</span>
          </div>
          <h2 className="mt-3 text-5xl font-bold tracking-tight text-neutral-900 md:text-6xl">
            {main}
          </h2>
          {alias && <p className="mt-1 text-base font-medium text-neutral-500">{alias}</p>}
          <Article lang="ko-KR" className="mt-4 max-w-lg">
            <Text as="p" textStyle="t6Regular" color="fg.neutralMuted">
              {project.tagline}
            </Text>
          </Article>

          {project.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[var(--radius-control)] px-3 py-1 text-xs font-bold"
                  style={{ backgroundColor: `${project.brandColor}14`, color: readableBrand }}
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
                <p className="text-xs font-bold tracking-wide text-neutral-500 uppercase">제작 기간</p>
                <p className="mt-1 text-sm font-medium text-neutral-700">{project.period}</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wide text-neutral-500 uppercase">운영 기간</p>
                <p className="mt-1 text-sm font-medium text-neutral-700">{project.operatingPeriod}</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wide text-neutral-500 uppercase">역할</p>
                <p className="mt-1 text-sm font-medium text-neutral-700">{project.role}</p>
              </div>
              {project.githubUrl && (
                <div>
                  <p className="text-xs font-bold tracking-wide text-neutral-500 uppercase">깃허브</p>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 flex w-fit items-center gap-1.5 text-sm font-medium text-neutral-700 transition-colors hover:text-[#ff6f0f]"
                  >
                    <SiGithub className="h-4 w-4" aria-hidden="true" />
                    바로가기
                  </a>
                </div>
              )}
              {project.liveUrl && (
                <div>
                  <p className="text-xs font-bold tracking-wide text-neutral-500 uppercase">서비스</p>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 flex w-fit items-center gap-1.5 text-sm font-medium text-neutral-700 transition-colors hover:text-[#ff6f0f]"
                  >
                    <ExternalLink className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
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
                    {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
                    {tech}
                  </Badge>
                );
              })}
            </div>

            {project.contributions.length > 0 && (
              <div>
                <p className="text-xs font-bold tracking-wide text-neutral-500 uppercase">기여</p>
                <ItemGroup className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {project.contributions.map((item, i) => (
                    <Item key={item} role="listitem" className="bg-[#f3f4f5] px-3.5 py-3">
                      <ItemMedia
                        aria-hidden
                        className="text-xs font-black tabular-nums"
                        style={{ color: readableBrand }}
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
        <div className="mx-auto w-full max-w-4xl space-y-14">

          {project.features.length > 0 && (
            <div>
              <h3 className="text-xl font-bold tracking-tight text-neutral-900">Features & Contribution</h3>

              {storyFeatures.length > 0 ? (
                <div className="mt-4">
                  {storyFeatures.length > 1 && !hasStoryGaps && (
                    <SwitchRoot
                      checked={showAllCode}
                      onCheckedChange={setShowAllCode}
                      className="mb-4 hidden items-center gap-2 lg:flex"
                    >
                      <SwitchControl>
                        <SwitchThumb />
                      </SwitchControl>
                      <SwitchHiddenInput />
                      <SwitchLabel className="text-xs font-bold tracking-wide text-neutral-500 uppercase">
                        한번에 보기
                      </SwitchLabel>
                    </SwitchRoot>
                  )}

                  {showAllCode ? (
                    <div className="space-y-10">
                      {storyFeatures.map((feature) => (
                        <div key={feature.title}>
                          <p className="text-xl font-bold tracking-tight text-neutral-900 md:text-2xl">
                            {feature.title}
                          </p>
                          <Article lang="ko-KR" className="mt-2">
                            <Text as="p" textStyle="t5Regular" color="fg.neutral" className="leading-relaxed">
                              {feature.description}
                            </Text>
                          </Article>
                          <div className="mt-4">{renderFeatureContent(feature, project)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <StickyScroll
                      accentColor={project.brandColor}
                      content={storyFeatures.map((feature) => ({
                        title: feature.title,
                        description: feature.description,
                        content: renderFeatureContent(feature, project),
                      }))}
                    />
                  )}
                </div>
              ) : (
                <div className="mt-2 divide-y divide-neutral-200">
                  {project.features.map((feature) => (
                    <div key={feature.title} className="py-8 first:pt-6">
                      <p className="max-w-xl text-xl font-bold tracking-tight text-neutral-900 md:text-2xl">
                        {feature.title}
                      </p>
                      <Article lang="ko-KR" maxWidth="36rem" className="mt-2">
                        <Text as="p" textStyle="t5Regular" color="fg.neutral" className="leading-relaxed">
                          {feature.description}
                        </Text>
                      </Article>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {project.troubleshooting.length > 0 && (
            <div>
              <h3 className="text-xl font-bold tracking-tight text-neutral-900">Troubleshooting</h3>
              <div className="mt-2 divide-y divide-neutral-200">
                {project.troubleshooting.map((entry) => (
                  <div key={entry.title} className="py-8 first:pt-6">
                    <p className="max-w-xl text-xl font-bold tracking-tight text-neutral-900 md:text-2xl">
                      {entry.title}
                    </p>

                    <div className="relative mt-6 max-w-xl">
                      <div className="absolute top-2 bottom-2 left-[3px] w-px bg-neutral-200" aria-hidden />
                      <div className="space-y-5">
                        {(
                          [
                            { label: "Problem", tone: "critical", text: entry.problem },
                            { label: "Cause", tone: "neutral", text: entry.cause },
                            { label: "Solution", tone: "brand", text: entry.solution },
                            { label: "Result", tone: "positive", text: entry.result },
                          ] as const
                        ).map((stage) => (
                          <div key={stage.label} className="relative pl-6">
                            <span
                              aria-hidden
                              className="absolute top-1.5 left-0 h-[7px] w-[7px] rounded-full bg-neutral-300"
                            />
                            <SeedBadge tone={stage.tone} variant="weak" size="medium">
                              {stage.label}
                            </SeedBadge>
                            <Article lang="ko-KR" className="mt-1.5">
                              <Text as="p" textStyle="t5Regular" color="fg.neutral" className="leading-relaxed">
                                {renderRichText(stage.text, {
                                  markColor: stage.label === "Result" ? project.brandColor : undefined,
                                })}
                              </Text>
                            </Article>
                          </div>
                        ))}
                      </div>
                    </div>

                    {entry.codeBefore && entry.codeAfter && (
                      <div className="relative mt-5">
                        <CodeComparison
                          beforeCode={entry.codeBefore.code}
                          afterCode={entry.codeAfter.code}
                          language={entry.codeAfter.lang}
                          filename={entry.codeFilename ?? `${entry.codeAfter.lang}.ts`}
                        />
                      </div>
                    )}
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
