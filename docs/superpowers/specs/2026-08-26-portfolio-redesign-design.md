# Portfolio Redesign (baemin-inspired)

## Purpose

Current portfolio UI (`src/components/*`) doesn't match desired look. Rebuild the visual layer from scratch, using baemin's color/radius/spacing as reference tokens. Keep existing content data and stack.

## Scope

**Rebuild:**
- `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`
- All of `src/components/*` (hero, awards-section, project-card, project-gallery, project-detail, site-footer, hero-shader-bg)
- `src/app/projects/[slug]/page.tsx` detail pages (rewired to new components)
- Remove `src/components/custom-cursor.tsx` and its usage

**Keep as-is:**
- `src/lib/content.ts` (profile + project data)
- `src/lib/utils.ts`
- `src/components/smooth-scroll.tsx` (lenis)
- `src/components/motion-reveal.tsx`, `troubleshooting-block.tsx` (reusable, restyle only if needed)
- Fonts: Paperlogy (display) + Pretendard (body) — already loaded locally, no new font deps
- Stack: Next 16, Tailwind, motion, gsap, lenis, base-ui, cva — no new dependencies

## Page structure (new order)

1. **Hero** — name, tagline, one-line bio, contact CTA (email), social links. Mint accent as the one pop of color.
2. **Projects Gallery** — immediately after hero, primary content. Horizontal scrub gallery (gsap pin/scroll, same mechanism as current `project-gallery.tsx`). Each card tinted by `project.brandColor`.
3. **About & Track Record** — condensed badges for awards/certificates/leadership/activities, grouped by year. Secondary section, lower visual weight than gallery.
4. **Footer** — contact, socials, copyright.

## Visual tokens (from baemin reference)

| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#0cefd3` | Accent only — links, CTA, highlights, per-project tag color fallback. Never a large fill. |
| `--color-canvas` | `#ffffff` | Page background |
| `--color-panel` | `#f6f6f6` | Card/section background |
| `--color-foreground` | `#171717` | Body text |
| `--color-muted` | `#6c6d6f` | Secondary text/captions |
| `--color-border` | `#e5e5e5` | Card borders/dividers |
| `--radius-card` | `12px` | Cards |
| `--radius-control` | `8px` | Buttons/small controls |
| spacing scale | 6/8/12/16/20/24/32px | Section/component spacing |

Per-project `brandColor` (already in `content.ts`) still drives each project card's accent, layered on top of the primary mint system — this is what keeps the gallery colorful/playful rather than monochrome.

## Interaction/motion

- Keep lenis smooth scroll.
- Keep gsap horizontal pin/scrub for the projects gallery (same core mechanism as current `project-gallery.tsx`, restyled).
- Drop the custom cursor component entirely.
- Standard hover/focus-visible states on interactive elements (cards, links, buttons) — no other bespoke cursor/pointer tricks.

## Testing

No test suite in this repo (`package.json` has no test script). Verification is manual: `npm run dev`, visually check hero/gallery/about/footer at mobile (375px) and desktop widths, confirm gallery scrub still works, confirm all 4 project detail pages render with new components, run `npm run lint` and `npm run build` to catch type/lint errors.

## Revision notes (post-launch feedback)

- The single-page horizontal-scrub project gallery from the initial spec was scrapped after user feedback in favor of a per-project pinned scroll narrative (intro hook sentences emphasized in sequence, then plain-flow contributions/features/troubleshooting).
- Primary (mint `#0cefd3`) had been applied to the hero eyebrow text, the About photo frame, and About category labels. User feedback: this made the result worse — primary must stay restricted to the one actual CTA action, not spread across every section as decoration.
- Korean display headings (Paperlogy) had `tracking-tight` applied, which crowded Hangul glyphs and read as ugly. Removed; Korean display type keeps normal tracking.
- Troubleshooting entries must keep Problem/Cause/Solution/Result as separate labeled fields, not one merged paragraph — Problem/Solution get heavier emphasis than Cause/Result.
- Tech stack chips moved from the end of each project section to right under the tagline, styled as bordered boxes instead of a plain text line.
