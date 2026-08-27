# Designer review — round 2

**Date:** 2026-08-27
**Artifact:** src/components/project-narrative.tsx, code-comparison.tsx, project-narrative-demos.tsx, hero.tsx, site-footer.tsx, about-section.tsx
**DESIGN.md:** ./DESIGN.md (reread this call)
**Viewport:** both
**Prior report:** .reviews/designer-review-round-1.md

## Summary

- BLOCK: 0
- WARN: 0
- FYI: 0

## Round 1 items

### [BLOCK → RESOLVED] Troubleshooting code diff two-panel vs unified block
- DESIGN.md §Experience Avoid + §Components `troubleshooting-code-diff` rewritten to describe the actual two-panel (`md:grid-cols-2`, filename header, diff-highlighted lines) implementation. Contract now matches `code-comparison.tsx:76-96`.

### [BLOCK → RESOLVED] Troubleshooting entry no card wrapper
- §Components `troubleshooting-entry` rewritten: timeline (connector-line, stage-dot, stage-badge) anatomy, card/`radius.card`/`color.surface` token refs dropped. Matches `project-narrative.tsx:388-423`.

### [WARN → RESOLVED] Troubleshooting stage badges use semantic status colors
- Folded into the same `troubleshooting-entry` rewrite — contract now explicitly states Problem=critical/Cause=neutral/Solution=brand/Result=positive `SeedBadge` tones. Matches `project-narrative.tsx:399-412`.

### [WARN → RESOLVED] `rounded-full` tech/demo chips off radius scale
- Code fixed, not the contract: `rounded-full` → `rounded-[var(--radius-control)]` at `project-narrative.tsx:185` and `project-narrative-demos.tsx:103`.

## New issues

None found in this pass.

## Verdict

**PASS** (BLOCK=0, WARN=0) — contract and implementation agree on all four round-1 items. Ready to move to `omd:final-qa`.
