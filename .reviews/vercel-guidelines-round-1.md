# Vercel Web Interface Guidelines — audit round 1

Source: github.com/vercel-labs/web-interface-guidelines (AGENTS.md checklist), fetched 2026-08-27.
Scope: site-nav.tsx, mobile-menu.tsx, react-bits/line-sidebar.jsx, react-bits/bubble-menu.jsx + full-site spot-check.

## Findings

### [ISSUE] In-page nav uses `onClick`-only controls, not `<a href>`/`<Link>`
- **Rule:** "Never use `<div onClick>` for navigation" / "Use semantic `<a>` or `<Link>` for navigation supporting modifier clicks" / "URL reflects state"
- **Location:** `src/components/react-bits/line-sidebar.jsx:141-156` (desktop side nav — `<li role="button" onClick={...}>`), `src/components/mobile-menu.tsx:17-29` → `react-bits/bubble-menu.jsx:117-118` (mobile menu — plain `onClick`, no href)
- **Evidence:** both scroll to a section via `document.getElementById` + Lenis `scrollTo`; neither renders an `<a href="#project-teachmon">`. Cmd/Ctrl/middle-click can't open a section in a new tab, and the URL hash never reflects the active section (a shared link always lands on the top of the page).
- **Fix direction:** wrap each item in an `<a href={`#${id}`}>` (keep the Lenis smooth-scroll as an `onClick` `preventDefault`-then-scroll enhancement so it still degrades to native anchor jump), and push the hash via `history.replaceState` as the `IntersectionObserver` in `site-nav.tsx` updates `activeIndex`.

### [ISSUE] Custom nav item has no focus ring at all
- **Rule:** "Visible, unobscured focus rings (`:focus-visible`)"
- **Location:** `src/components/react-bits/line-sidebar.jsx:141-156` + `line-sidebar.css` (no `:focus`/`:focus-visible` rule for `.line-sidebar__item`)
- **Evidence:** the `<li>` is keyboard-focusable (`tabIndex={0}`, handles Enter/Space) but grep of `line-sidebar.css` finds zero focus selectors — tabbing through the site gives no visible indicator on this control.
- **Fix direction:** add a `.line-sidebar__item:focus-visible` style (e.g. outline or the marker/text getting the active-state treatment), matching the pattern already used on `button.tsx`'s `focus-visible:ring-3`.

### [FYI] Hero ambient blobs loop indefinitely with no pause affordance
- **Rule:** "Autoplay motion >5s requires pause, stop, or hide controls"
- **Location:** `src/components/hero.tsx:17-24` (`smoke-a` 18s / `smoke-b` 22s / `smoke-c` 26s, `infinite`)
- **Note:** these are `aria-hidden` decorative background glow, not attention-grabbing foreground motion (the rule's usual target is autoplay video/carousels) — already gated behind `prefers-reduced-motion`. Flagging for awareness, not requesting a change; low-severity edge case of the letter of the rule.

### [FYI] `transition: all` only appears in vendored shadcn/base-ui primitives
- **Rule:** "Avoid `transition: all`; list properties explicitly"
- **Location:** `src/components/ui/{accordion,button,badge}.tsx` — library-generated boilerplate, not project-authored, low-value to hand-edit (next `shadcn` sync would revert it).

## Already compliant (spot-checked, no action)

- `prefers-reduced-motion` honored in hero, particle-text, project-narrative GSAP timelines, and the sticky-scroll panel (fixed this session).
- Animations use `transform`/`opacity` only; no layout-property animation found.
- `font-variant-numeric: tabular-nums` already applied to period/index digits (`project-narrative.tsx:162,281`).
- Icon-only buttons carry `aria-label` (footer copy button).
- Images sized via `aspect-ratio`/`fill`+`sizes`, no CLS risk; oversized sources re-encoded this session (final-qa round 1 fix).
- `<html lang="ko">` set; alt text present on all raster images.

## Verdict

Not a pass/fail rubric (advisory checklist, not final-qa's closed 8-item gate) — 2 real ISSUEs (nav semantics, missing focus ring on the desktop side-nav), both fixable without a design decision. Want me to fix both now?
