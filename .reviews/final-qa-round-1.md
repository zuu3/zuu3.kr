# Final QA — round 1

**Date:** 2026-08-27
**Artifacts:** src/app (Next.js live site) — hero.tsx, about-section.tsx, project-narrative.tsx, site-footer.tsx, site-nav.tsx, layout.tsx
**DESIGN.md read at:** 2026-08-27 (this call)
**Voice preset:** none declared (hand-authored profile copy, no kr-writer run)

## Rubric

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 1 | Brand consistency | FAIL | Hero background has orange (`#ff6f0f/40`) + purple (`#b8a4ff/35`) blur blobs — §Foundation rules requires hero stay grayscale, color only in hero-cta. `#b8a4ff` isn't a DESIGN.md token at all. |
| 2 | Typography hierarchy | PASS | 1 `h1` (hero, sr-only), `h2` per section (about-section.tsx:64, project-narrative.tsx:170 ×4 projects), `h3` only as children of a project's `h2` (Features/Troubleshooting). No level skip. |
| 3 | Voice register | PASS | No formal preset; copy matches DESIGN.md §Content Voice (direct/concise/personal) — short declarative Korean throughout, no filler honorific padding. |
| 4 | Image / figure | PASS | `about-section.tsx:57` `alt={`${profile.name} 프로필 사진`}`; `tilted-card.jsx:106` `alt={altText}` fed `${main} 화면` from project-narrative.tsx:299. All `src` paths resolve under `public/`. |
| 5 | Cross-locale parity | N/A | Site is ko-only, no locale variants exist to compare. |
| 6 | Accessibility | PASS | `layout.tsx:43` `<html lang="ko">`. Text contrast fixed this session (`text-neutral-400`→`-500`, matches `color.muted` #737373 token, ≈4.8:1). `focus-visible` classes present on interactive components (button.tsx, nav). Semantic elements used (`<nav>` not present but sidebar is `aria-hidden`-gated decorative nav, `<footer>`, `<h1-h3>`, `<button>` via seed-design). |
| 7 | Performance | FAIL | `public/profile-photo.jpg` = 4.8MB source (served via `next/image` so runtime-optimized, but source bloat still a build/repo cost). `public/projects/teachmon.png` (836KB), `m-adp.png` (585KB), `nuri.png` (740KB) all >500KB **and** rendered through `TiltedCard`'s raw `<motion.img>` (`react-bits/tilted-card.jsx:104`) — no `next/image`, no optimization, full source bytes shipped to the browser. |
| 8 | Links | PASS | External links (`project-narrative.tsx:227-249`, `site-footer.tsx:27,36,73`) all carry `rel="noreferrer"` + a visual indicator icon (`SiGithub`/`ExternalLink`/`Download`). No broken-link check possible for `mailto:`/PDF download links (not HTTP-checkable); relative paths (`/docs/*.pdf`, `/profile-photo.jpg`) consistent. |

## Failed items detail

### [1] Brand consistency — hero background breaks grayscale-only rule
- **Location:** `src/components/hero.tsx:17-24`
- **Evidence:** `bg-[#ff6f0f]/40` and `bg-[#b8a4ff]/35` blur blobs behind the hero title, animated via `animate-[smoke-b_22s...]` / `animate-[smoke-c_26s...]`.
- **Fix direction:** either desaturate these two blobs to white/gray (matching the existing `bg-white/55` blob) to comply with §Foundation rules, or — if the colored glow is an intentional design call — update DESIGN.md's grayscale-hero rule to carve out an exception for ambient background glow (distinct from hero-cta/text color usage), the same way round-1/2 designer-review resolved the diff-block and troubleshooting-entry findings.

### [7] Performance — oversized/unoptimized images
- **Location:** `public/profile-photo.jpg` (4.8MB), `public/projects/{teachmon,m-adp,nuri}.png` (585KB–836KB), rendered via `react-bits/tilted-card.jsx:104` raw `<motion.img>`
- **Evidence:** no `next/image`, no `sizes`/responsive `srcset`, full-resolution PNG shipped for a card that displays at a fraction of source resolution.
- **Fix direction:** re-export project thumbnails as compressed WebP under 300KB before drag-in, or swap `TiltedCard`'s `<motion.img>` for `next/image` (motion-wrap the `next/image` output instead of a bare `<img>`) to get automatic resize/format negotiation. Re-encode `profile-photo.jpg` down from 4.8MB regardless of `next/image` runtime optimization — smaller source shortens build/deploy and any non-Next consumer of the file.

## Verdict

**REVISION** (round 1) — 2 items FAIL (Brand consistency, Performance). Both need your call before I touch anything: item 1 is a design decision (revert hero glow to grayscale vs. ratify the color and update DESIGN.md), item 2 is a straightforward asset/code fix (re-encode images + swap to `next/image` in TiltedCard) I can do directly if you want it now.

Round 2 will BLOCK if either repeats.
