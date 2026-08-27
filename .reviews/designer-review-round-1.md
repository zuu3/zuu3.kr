# Designer review — round 1

**Date:** 2026-08-27
**Artifact:** src/components/project-narrative.tsx, code-comparison.tsx, project-narrative-demos.tsx, hero.tsx, site-footer.tsx, about-section.tsx
**DESIGN.md:** ./DESIGN.md (reread this call)
**Viewport:** both

## Summary

- BLOCK: 2
- WARN: 2
- FYI: 0

## Issues

### [BLOCK] Troubleshooting code diff renders two side-by-side boxes, not one unified diff block
- **Location:** `src/components/project-narrative.tsx:425-433` → `src/components/ui/code-comparison.tsx:76-96` (`grid md:grid-cols-2`)
- **Rule:** §Experience Avoid — "Before/After 코드를 별도 박스 두 개로 나란히 배치하지 않는다 — 하나의 diff 블록(삭제 빨강 -, 추가 초록 +)으로 합친다"; §Components `troubleshooting-code-diff` — same, single dark block with ± markers
- **Evidence:** `CodeComparison` renders `before`/`after` as two full panels in a `grid-cols-2`, each with its own filename header, not a merged `transformerNotationDiff` single-block render.
- **Fix suggestion:** either (a) rebuild as one Shiki block using `transformerNotationDiff` with unified +/- lines per the contract, or (b) if the two-panel comparison is the actually-wanted pattern now, update DESIGN.md's Avoid + `troubleshooting-code-diff` sections to match (repository-fact > stale system-contract per §Governance application priority) — this needs a call, not a silent revert.

### [BLOCK] Troubleshooting entry has no card wrapper (radius.card / color.surface)
- **Location:** `src/components/project-narrative.tsx:388-423`
- **Rule:** §Components `troubleshooting-entry` — "Problem/Cause/Solution/Result를 옅은 회색 카드(radius.card, color.surface)로 감싼다"
- **Evidence:** current markup is a vertical timeline (dot markers + connecting line, `divide-y` list), no `bg-[color.surface]`/`rounded-[var(--radius-card)]` container anywhere in the block.
- **Fix suggestion:** same fork as above — either wrap each stage set in a `radius.card` + `color.surface` panel, or this timeline treatment is the intended current direction and DESIGN.md needs updating to describe it.

### [WARN] Troubleshooting stage labels use semantic status colors not in DESIGN.md
- **Location:** `src/components/project-narrative.tsx:399-412` (`SeedBadge tone="critical"|"positive"`)
- **Rule:** §Components `troubleshooting-entry` — "Problem/Solution은 진하게, Cause/Result는 보조 톤" (weight/tone contrast only, no color specified); §Foundation rules — primary is the only sanctioned saturated hex outside project brandColor
- **Evidence:** `tone: "critical"` (red) and `tone: "positive"` (green) badges introduce two saturated hues DESIGN.md never tokens.
- **Fix suggestion:** drop to `tone="neutral"`/weak variant differentiated by weight only, or add these as tokens to §Foundations if they're wanted going forward.

### [WARN] Tech chip / filtered-result chips use `rounded-full`, not the box-chip / radius.control contract
- **Location:** `src/components/project-narrative.tsx:185` (tech-chip-row), `src/components/project-narrative-demos.tsx:103` (demo result chips)
- **Rule:** §Experience Avoid — "박스형 칩으로 배치한다" (box-shaped, implies `radius.control`); §Foundations — radius scale is `radius.card`(12px)/`radius.control`(8px) only, `9999px` not a token
- **Evidence:** already logged in `.omd/preferences.md` as pending (`pref_mt9dx138_...`, `pref_mtatg7t4_...`) — resurfacing here since it's still live.
- **Fix suggestion:** `rounded-[var(--radius-control)]` instead of `rounded-full`.

## Verdict

**BLOCK** (BLOCK=2) — not shippable as-is against the current DESIGN.md text. Both BLOCK items are the same shape of problem: code implemented a different pattern (two-panel diff, timeline instead of card) than what DESIGN.md still describes. Need a decision before I touch code: revert implementation to match contract, or update DESIGN.md to ratify what's already built.
