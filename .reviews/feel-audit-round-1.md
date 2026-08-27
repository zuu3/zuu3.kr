# omd:feel AUDIT — round 1

Scope: full page (site-nav, hero, about, project-narrative + sticky-scroll-reveal + code-comparison + project-narrative-demos, site-footer). DESIGN.md read for token authority; `.omd/preferences.md` cross-checked (43 pending entries).

feel-score: **6/8 applicable SPEC axes in-band** · BLOCK 2 · WARN 3 · FYI 0

---

### [BLOCK] Body/caption text fails 4.5:1 contrast — `text-neutral-400` on white
- **Rule:** §Color & Contrast — text 4.5:1 AA (🟢 SPEC, WCAG 1.4.3)
- **Evidence:** `text-neutral-400` = `#a3a3a3` on white ≈ **2.5:1**. `text-xs font-bold uppercase` does not qualify as "large text" (needs ≥18.66px bold) so the 3:1 exemption doesn't apply.
- **Locations (systemic — same class reused site-wide):**
  - `src/components/site-footer.tsx:79` (copyright line)
  - `src/components/project-narrative.tsx:160,168,173,216,220,224,229,243,275,332` (period/role/repo labels, alias, Switch label)
  - `src/components/project-narrative-demos.tsx:85,109`
  - `src/components/about-section.tsx:63,87,88`
  - `src/components/tech-logo-loop.tsx:18`
  - Also `text-neutral-300` variant same issue: `project-narrative.tsx:166`
- **Fix:** swap to `text-neutral-500` (`#737373` ≈ 4.8:1, passes) for anything carrying real text meaning; keep `-400` only on non-text decoration.

### [BLOCK] Footer copy-icon-button fails 3:1 non-text contrast
- **Location:** `src/components/site-footer.tsx:53-68`
- **Rule:** §Color & Contrast — non-text/icon UI component 3:1 (🟢 SPEC, WCAG 1.4.11)
- **Evidence:** icon-only button, meaning conveyed entirely by the `Copy` icon, colored `text-neutral-400` (`#a3a3a3`) on white ≈ 2.5:1.
- **Fix:** `text-neutral-500` or darker at rest.

---

### [WARN] `rounded-full` pill buttons off design-system radius scale
- **Location:** `src/components/site-footer.tsx:25,34`
- **Rule:** §Spacing/Radius — DS token scale (🟡 CONV, already logged in `.omd/preferences.md` as pending)
- **Fix:** fold into DESIGN.md radius scale or revert to `rounded-[var(--radius-control)]`. Not new — just resurfaced here since it's still live.

### [WARN] Adjacent footer link/icon targets under 8px gap
- **Location:** `src/components/site-footer.tsx:43` (`gap-1` = 4px between mail button, copy button, github button)
- **Rule:** §Targets — adjacent target spacing ≥8pt (🟡 CONV)
- **Fix:** `gap-2` (8px) minimum on that row.

### [WARN] Sticky panel scroll-follow has no `prefers-reduced-motion` branch
- **Location:** `src/components/ui/sticky-scroll-reveal.tsx:22-77`
- **Rule:** §Performance/A11y — reduce → drop non-essential motion (🟢 SPEC, WCAG 2.3.3 direction; lerp glide itself is the non-essential part, not the positioning)
- **Evidence:** rAF loop always lerps (`factor 0.18`) toward target; `motion.p`/`motion.div` opacity fades (lines 96-107) also unconditional.
- **Fix:** under `prefers-reduced-motion: reduce`, set `next = target` directly (skip lerp) so the panel snaps instead of gliding; keep the opacity fade or drop to instant since it's a small, non-spatial cue.

---

**Not flagged / verified clean:** tap target sizes (icon buttons ≥24px, meets AA floor), no `transition: all` outside vendored shadcn primitives (library boilerplate, not project-authored), animations use transform/opacity only, no unbounded/off-grid durations in fixed-duration UI transitions, no `<img>` without intrinsic sizing, no modal/dialog usage to audit.
