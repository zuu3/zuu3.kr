# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the visual layer of the zuu3.kr portfolio (Next.js) using baemin-derived color/radius tokens, reordering sections to lead with projects.

**Architecture:** Same Next.js App Router structure and same components, restyled. `src/lib/content.ts` (data) and the gsap/lenis scroll mechanisms are untouched. Colors/radii flow from CSS custom properties in `src/app/globals.css` so every component picks them up without hardcoding hex values (except each project's own `brandColor`, which is data-driven by design).

**Tech Stack:** Next.js 16, Tailwind v4, motion, gsap + ScrollTrigger, lenis, lucide-react. No new dependencies.

## Global Constraints

- No new dependencies (spec: "Tech Stack ... no new dependencies").
- Keep `src/lib/content.ts`, `src/lib/utils.ts`, `src/components/smooth-scroll.tsx`, `src/components/motion-reveal.tsx` unmodified (spec: "Keep as-is").
- Delete `src/components/custom-cursor.tsx` and remove its usage (spec: "Remove custom-cursor.tsx").
- Primary mint (`#0cefd3`) is an accent only — never a large background fill (spec: visual tokens table).
- This repo has no test runner (`package.json` has no `test` script). Per the spec's Testing section, each task's verification step is `npm run lint` and, for the final task, `npm run build` plus a manual dev-server check — there is no unit test framework to write failing tests against.

---

### Task 1: Baemin color/radius tokens in globals.css

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: CSS custom properties consumed by every later task — `--background`, `--foreground`, `--card`, `--primary`, `--primary-foreground`, `--secondary`, `--muted`, `--muted-foreground`, `--border`, `--ring`, `--radius` (all already consumed by `src/components/ui/badge.tsx` and `src/components/ui/button.tsx` via Tailwind's `bg-primary`/`text-foreground`/etc. classes — no change needed there), plus two new tokens `--radius-card` (12px) and `--radius-control` (8px) that later tasks reference as `rounded-[var(--radius-card)]` / `rounded-[var(--radius-control)]`.

- [ ] **Step 1: Replace the theme tokens and drop unused dark-mode/cursor CSS**

Replace the full contents of `src/app/globals.css` with:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: inherit;
  text-decoration: none;
}

@theme inline {
  --font-heading: var(--font-sans);
  --font-sans: var(--font-sans);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --color-foreground: var(--foreground);
  --color-background: var(--background);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
  /* baemin-derived tokens (see docs/superpowers/specs/2026-08-26-portfolio-redesign-design.md) */
  --background: #ffffff;
  --foreground: #171717;
  --card: #f6f6f6;
  --card-foreground: #171717;
  --popover: #ffffff;
  --popover-foreground: #171717;
  --primary: #0cefd3;
  --primary-foreground: #171717;
  --secondary: #f6f6f6;
  --secondary-foreground: #171717;
  --muted: #f6f6f6;
  --muted-foreground: #6c6d6f;
  --accent: #f6f6f6;
  --accent-foreground: #171717;
  --destructive: oklch(0.577 0.245 27.325);
  --border: #e5e5e5;
  --input: #e5e5e5;
  --ring: #0cefd3;
  --chart-1: oklch(0.87 0 0);
  --chart-2: oklch(0.556 0 0);
  --chart-3: oklch(0.439 0 0);
  --chart-4: oklch(0.371 0 0);
  --chart-5: oklch(0.269 0 0);
  --radius: 0.5rem;
  --radius-card: 12px;
  --radius-control: 8px;
  --sidebar: #fafafa;
  --sidebar-foreground: #171717;
  --sidebar-primary: #0cefd3;
  --sidebar-primary-foreground: #171717;
  --sidebar-accent: #f6f6f6;
  --sidebar-accent-foreground: #171717;
  --sidebar-border: #e5e5e5;
  --sidebar-ring: #0cefd3;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
```

This drops: the `@custom-variant dark` line, the `cursor: none` custom-cursor block, the `.dark` class block, and the `prefers-color-scheme: dark` block — none of them are reachable (no dark-mode toggle exists in this codebase, and Task 2 removes the only consumer of the custom cursor).

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: no errors (CSS isn't linted by this script, but this confirms the repo's lint config still runs clean before further changes stack up).

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: replace theme tokens with baemin-derived palette"
```

---

### Task 2: Remove the custom cursor

**Files:**
- Modify: `src/app/layout.tsx`
- Delete: `src/components/custom-cursor.tsx`

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: `RootLayout` in `src/app/layout.tsx` no longer renders `<CustomCursor />` and no longer loads `Bodoni_Moda` (its only consumer, the old hero headline, is rewritten in Task 4 without it).

- [ ] **Step 1: Delete the custom cursor component**

```bash
rm src/components/custom-cursor.tsx
```

- [ ] **Step 2: Rewrite layout.tsx without CustomCursor or Bodoni_Moda**

Replace the full contents of `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-sans",
  weight: "45 920",
  display: "swap",
});

const paperlogy = localFont({
  src: "./fonts/Paperlogy-Black.woff2",
  variable: "--font-display",
  weight: "900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "오주현 | 스펀지 같은 개발자",
  description:
    "프론트엔드 개발자 오주현의 포트폴리오. 새로운 기술을 빠르게 흡수하고 팀에 필요할 때 꺼내 쓰는 스펀지 같은 개발자입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${paperlogy.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify no remaining references**

Run: `grep -rn "custom-cursor\|CustomCursor\|Bodoni\|font-serif" src`
Expected: no matches.

- [ ] **Step 4: Verify lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add -A src/app/layout.tsx src/components/custom-cursor.tsx
git commit -m "refactor: drop custom cursor and unused serif font"
```

---

### Task 3: Retint the hero shader background to mint

**Files:**
- Modify: `src/components/hero-shader-bg.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `HeroShaderBg` (unchanged export name/signature — a no-props component), now rendering pale mint blobs instead of warm cream/amber ones. Task 4 renders it inside the hero exactly as before.

- [ ] **Step 1: Recolor the fragment shader's blob mix targets**

In `src/components/hero-shader-bg.tsx`, replace the `FRAGMENT` constant's color-mix lines (currently mixing toward cream/peach/amber) with mint tints derived from the `#0cefd3` primary token:

```glsl
    vec3 color = vec3(1.0);
    color = mix(color, vec3(0.93, 0.99, 0.97), blob(p, vec2(-0.55 + sin(t) * 0.04, -0.3 + s), 0.9));
    color = mix(color, vec3(0.85, 0.97, 0.94), blob(p, vec2(0.6 + cos(t * 0.7) * 0.03, 0.35 - s * 0.6), 0.75));
    color = mix(color, vec3(0.70, 0.93, 0.87), blob(p, vec2(0.05, -0.55 + s * 0.4), 0.55) * 0.7);
```

Everything else in the file (the drift math, grain, resize/scroll handling, reduced-motion guard) stays exactly as-is.

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/hero-shader-bg.tsx
git commit -m "style: retint hero shader blobs from warm to mint"
```

---

### Task 4: Rewrite the hero to lead with real profile content

**Files:**
- Modify: `src/components/hero.tsx`

**Interfaces:**
- Consumes: `HeroShaderBg` from Task 3 (unchanged import path), `profile` shape from `src/lib/content.ts` (`name`, `tagline`, `bio`, `email` — all already existing fields, no data change needed), `--radius-control` token from Task 1.
- Produces: `Hero({ profile })` — same export name and prop shape as before, so `src/app/page.tsx` (Task 9) doesn't need to change how it calls it.

- [ ] **Step 1: Replace the placeholder headline with real profile content**

Replace the full contents of `src/components/hero.tsx` with:

```tsx
"use client";

import { ArrowDown, Mail } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { profile as ProfileType } from "@/lib/content";
import { HeroShaderBg } from "@/components/hero-shader-bg";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero({ profile }: { profile: typeof ProfileType }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[92vh] flex-col overflow-hidden px-6 py-8 md:min-h-screen md:px-16 md:py-10 lg:px-24">
      <HeroShaderBg />

      <motion.div
        variants={reduceMotion ? undefined : container}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
        className="flex flex-1 flex-col items-center justify-center gap-6 text-center"
      >
        <motion.h1
          variants={item}
          className="text-7xl leading-[0.95] font-black text-neutral-900 [font-family:var(--font-display)] sm:text-8xl md:text-[9vw]"
        >
          {profile.name}
        </motion.h1>
        <motion.p
          variants={item}
          className="max-w-xl text-lg font-bold text-balance text-neutral-900 md:text-2xl"
        >
          {profile.tagline}
        </motion.p>
        <motion.p
          variants={item}
          className="max-w-md text-sm leading-relaxed text-balance text-neutral-500 md:text-base"
        >
          {profile.bio}
        </motion.p>
        <motion.div variants={item} className="mt-2 flex items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-[#0cefd3] px-5 py-2.5 text-sm font-bold text-neutral-900 transition-transform hover:scale-105"
          >
            <Mail className="h-4 w-4" strokeWidth={2} />
            연락하기
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.4 },
          y: { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
        }}
        className="self-center text-neutral-400"
      >
        <ArrowDown className="h-5 w-5" strokeWidth={1.5} />
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/hero.tsx
git commit -m "feat: rewrite hero with real profile content and mint CTA"
```

---

### Task 5: Restyle project cards as baemin-style cards

**Files:**
- Modify: `src/components/project-card.tsx`

**Interfaces:**
- Consumes: `Project` type from `src/lib/content.ts` (`slug`, `name`, `tagline`, `techStack`, `brandColor` — all existing fields), `--radius-card` token from Task 1.
- Produces: `ProjectCard({ project, index })` — same export name and prop shape as before, so `src/components/project-gallery.tsx` (unchanged, Task-untouched) keeps working without modification.

- [ ] **Step 1: Turn the border-only row into a bounded card**

Replace the full contents of `src/components/project-card.tsx` with:

```tsx
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-black tabular-nums text-neutral-300 [font-family:var(--font-display)] transition-colors duration-300 group-hover:text-[var(--project-color)]" style={{ "--project-color": project.brandColor } as React.CSSProperties}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: project.brandColor }} />
        </div>
        <h3
          className="mt-4 text-2xl font-black [font-family:var(--font-display)] md:text-3xl"
          style={{ color: project.brandColor }}
        >
          {project.name}
        </h3>
        <p className="mt-3 text-sm text-neutral-500">{project.tagline}</p>
      </div>
      <div className="mt-8 flex items-end justify-between gap-3">
        <p className="text-xs tracking-wide text-neutral-400 uppercase">
          {project.techStack.join(" · ")}
        </p>
        <ArrowUpRight
          className="h-5 w-5 shrink-0 -translate-x-1 translate-y-1 text-neutral-400 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
          strokeWidth={2}
        />
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/project-card.tsx
git commit -m "style: restyle project cards with mint-accented card shell"
```

---

### Task 6: Restyle awards/activity into a secondary "About & Track Record" section

**Files:**
- Modify: `src/components/awards-section.tsx`

**Interfaces:**
- Consumes: `profile` shape from `src/lib/content.ts` (`awards`, `activities`, `certificates`, `leadership`, plus the photo/tagline/bio/contact fields — all existing), `--radius-card` token from Task 1.
- Produces: `AwardsSection({ profile })` — same export name/prop shape as before. Task 9 wraps it in a `<div>` that now owns the vertical spacing, so this task removes the component's own `mt-28` (it would otherwise double up).

- [ ] **Step 1: Swap amber accents for mint and drop the section's own top margin**

In `src/components/awards-section.tsx`:

1. In `TimelineBlock`, replace both `bg-amber-600` occurrences (the label dot and the bullet dot) with `bg-[#0cefd3]`, and replace `hover:text-amber-700` with `hover:text-[#0cefd3]`.
2. Change the section's photo wrapper from `rounded-2xl` to `rounded-[var(--radius-card)]`.
3. Change the outer `<section ref={sectionRef} className="mt-28">` to `<section ref={sectionRef}>` — Task 9's wrapper now supplies the spacing.

The full updated file:

```tsx
"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { profile as ProfileType } from "@/lib/content";

type TimelineGroup = { year: string; items: string[] };

function TimelineBlock({ label, groups }: { label: string; groups: TimelineGroup[] }) {
  return (
    <div className="awards-block">
      <h3 className="flex items-center gap-2 text-xl font-bold text-neutral-900">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#0cefd3]" />
        {label}
      </h3>
      <div className="mt-3 space-y-3">
        {groups.map((group) => (
          <div key={group.year}>
            <p className="text-sm font-semibold text-muted-foreground">{group.year}</p>
            <ul className="mt-1 space-y-1 text-[15px] leading-relaxed">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="group flex items-start gap-1.5 transition-colors hover:text-[#0cefd3]"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#0cefd3] transition-transform group-hover:translate-x-0.5"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AwardsSection({ profile }: { profile: typeof ProfileType }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set([".profile-block", ".awards-block"], { opacity: 0, y: 28 });

      gsap.to([".profile-block", ".awards-block"], {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef}>
      <div className="grid gap-x-10 gap-y-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="profile-block">
          <div className="relative aspect-3/4 w-40 overflow-hidden rounded-[var(--radius-card)] bg-neutral-100">
            <Image
              src="/profile-photo.jpg"
              alt={`${profile.name} 프로필 사진`}
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
          <p className="mt-5 text-2xl font-black text-balance text-neutral-900 [font-family:var(--font-display)] md:text-3xl">
            {profile.tagline}
          </p>
          <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
            {profile.bio}
          </p>
          <div className="mt-5 space-y-1 text-sm text-neutral-500">
            <p>{profile.birthdate}</p>
            <p>{profile.phone}</p>
            <p>{profile.email}</p>
            <p>{profile.school}</p>
          </div>
        </div>

        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          <TimelineBlock label="Awards" groups={profile.awards} />
          <TimelineBlock label="Activity" groups={profile.activities} />
          <TimelineBlock label="Certificates" groups={profile.certificates} />
          <TimelineBlock label="Leadership" groups={profile.leadership} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/awards-section.tsx
git commit -m "style: mint-accent the About/track-record section"
```

---

### Task 7: Apply display typography to project detail and troubleshooting headings

**Files:**
- Modify: `src/components/project-detail.tsx`
- Modify: `src/components/troubleshooting-block.tsx`

**Interfaces:**
- Consumes: `Project` and `TroubleshootingEntry` types from `src/lib/content.ts` (unchanged). Both components already receive `project.brandColor`-driven styling — that logic is untouched.
- Produces: `ProjectDetail({ project })` and `TroubleshootingBlock({ entry })` — same export names/prop shapes as before, so `src/app/projects/*/page.tsx` (all four, none of which need edits) keep working.

- [ ] **Step 1: Add display-font headings to project-detail.tsx**

In `src/components/project-detail.tsx`, change:
```tsx
<h1 className="mt-2 text-4xl font-black md:text-5xl">{project.name}</h1>
```
to:
```tsx
<h1 className="mt-2 text-4xl font-black [font-family:var(--font-display)] md:text-5xl">{project.name}</h1>
```

And change all three section headings from:
```tsx
<h2 className="text-xl font-bold" style={{ color: project.brandColor }}>
```
to:
```tsx
<h2 className="text-xl font-bold [font-family:var(--font-display)]" style={{ color: project.brandColor }}>
```
(there are three of these: "기여", "Main features & Contribution", "Troubleshooting" — apply the same class change to each). No other lines in the file change.

- [ ] **Step 2: Add display-font heading to troubleshooting-block.tsx**

In `src/components/troubleshooting-block.tsx`, change:
```tsx
<h4 className="text-xl font-bold">{entry.title}</h4>
```
to:
```tsx
<h4 className="text-xl font-bold [font-family:var(--font-display)]">{entry.title}</h4>
```
No other lines in the file change.

- [ ] **Step 3: Verify**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/project-detail.tsx src/components/troubleshooting-block.tsx
git commit -m "style: use display font for project detail headings"
```

---

### Task 8: Restyle the footer

**Files:**
- Modify: `src/components/site-footer.tsx`

**Interfaces:**
- Consumes: `profile` shape from `src/lib/content.ts` (`name`, `email`, `phone` — all existing fields).
- Produces: `SiteFooter({ profile })` — same export name/prop shape as before, so `src/app/page.tsx` (Task 9) keeps calling it the same way.

- [ ] **Step 1: Shrink the oversized empty footer and add mint hover states**

Replace the full contents of `src/components/site-footer.tsx` with:

```tsx
import { Mail } from "lucide-react";
import type { profile as ProfileType } from "@/lib/content";

// lucide-react dropped brand icons; GitHub mark inlined instead of adding a dependency.
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-1.94c-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.07.78 2.15v3.19c0 .3.2.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export function SiteFooter({ profile }: { profile: typeof ProfileType }) {
  return (
    <footer className="mt-28 border-t border-neutral-200 bg-[#f6f6f6] px-6 py-10 md:px-16 lg:px-24">
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-neutral-500">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/zuu3"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-[#0cefd3]"
          >
            <GithubIcon className="h-4 w-4" />
            github.com/zuu3
          </a>
          <span className="text-neutral-300">·</span>
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-1.5 transition-colors hover:text-[#0cefd3]"
          >
            <Mail className="h-4 w-4" strokeWidth={1.75} />
            {profile.email}
          </a>
          <span className="text-neutral-300">·</span>
          <span>{profile.phone}</span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/site-footer.tsx
git commit -m "style: shrink footer and add mint hover states"
```

---

### Task 9: Reorder the homepage to lead with projects

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `Hero` (Task 4), `ProjectGallery` (unchanged), `AwardsSection` (Task 6), `SiteFooter` (Task 8) — all same export names/prop shapes as before.
- Produces: `Home()` default export, same as before (no consumers outside Next.js routing).

- [ ] **Step 1: Reorder sections — Hero, Projects, About, Footer**

Replace the full contents of `src/app/page.tsx` with:

```tsx
import { profile, projects } from "@/lib/content";
import { Hero } from "@/components/hero";
import { ProjectGallery } from "@/components/project-gallery";
import { AwardsSection } from "@/components/awards-section";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <main>
      <Hero profile={profile} />

      <section className="mt-16 md:mt-24">
        <h2 className="mx-auto max-w-[1600px] px-6 text-2xl font-black text-neutral-900 [font-family:var(--font-display)] md:px-16 md:text-3xl lg:px-24">
          Projects
        </h2>
        <div className="mt-10">
          <ProjectGallery projects={projects} />
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-16 md:py-20 lg:px-24">
        <AwardsSection profile={profile} />
      </div>

      <SiteFooter profile={profile} />
    </main>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "refactor: reorder homepage to lead with projects"
```

---

### Task 10: Full build and manual verification

**Files:** none (verification only).

**Interfaces:**
- Consumes: every file touched in Tasks 1–9.
- Produces: nothing new — this is the plan's final gate.

- [ ] **Step 1: Run the production build**

Run: `npm run build`
Expected: build succeeds with no type errors (this catches any prop-shape mismatch across the `Hero`/`ProjectCard`/`AwardsSection`/`SiteFooter` interfaces touched above).

- [ ] **Step 2: Run lint one more time across the whole diff**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual check in the dev server**

Run: `npm run dev`, open `http://localhost:3000`, and confirm:
- Hero shows name/tagline/bio and a working mint "연락하기" mailto button, mint pastel shader background, no console errors.
- Projects gallery immediately follows the hero; horizontal scrub still works on desktop width, native horizontal scroll on mobile width (resize to 375px).
- Each of the 4 project cards is a bordered/rounded card tinted by its own `brandColor`.
- About & Track Record section (awards/activity/certificates/leadership) renders below the gallery with mint accents, no more amber.
- Footer is compact (not a giant empty block), mint hover states on the GitHub/email links.
- Visit all four project detail pages (`/projects/teachmon`, `/projects/church`, `/projects/m-adp`, `/projects/nuri`) and confirm headings use the display font and nothing is broken.
- No cursor-following custom cursor anywhere; default browser cursor throughout.

- [ ] **Step 4: Stop the dev server**

Kill the `npm run dev` process once the manual check above passes.
