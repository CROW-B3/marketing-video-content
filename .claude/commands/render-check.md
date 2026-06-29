---
description: Review the current Remotion video for correctness and premium quality
---

Review the current CROW Remotion implementation against `CLAUDE.md` and `src/design.ts`.
Render stills where useful (`bunx remotion still ...`) and inspect them — do not judge from code alone.

Check for:
- Broken imports, TypeScript errors, invalid Remotion usage
- Hardcoded values that should come from `design.ts`
- Magic timing numbers instead of named constants
- Duplicated animation logic that should be a shared primitive

Then judge the look like a senior motion designer:
- Weak visual hierarchy; type not aligned/balanced; off the 8pt grid
- Overcrowded composition; not enough negative space
- Un-premium motion: bounce, jitter, too many things moving, constant full-screen motion
- Neon/particle/lens-flare "slop" that breaks the Apple-restraint brief
- Excessive randomness; off-brand color
- For loops: a visible seam (render frame 0 and the last frame, compare)

Return the **smallest set of changes** that raises quality the most, ordered by impact.
