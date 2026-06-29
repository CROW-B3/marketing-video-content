---
description: Build only the next Remotion scene, premium and reusable
---

Build **only the next scene** of the current CROW video. Read `CLAUDE.md` and `src/design.ts`
first. Do not touch other scenes or rewrite the project.

Rules:
- Pull EVERY color, size, spacing, easing, and duration from `src/design.ts`. No hardcoded values.
- Reuse existing primitives (`components/*`); if a needed primitive is missing, build it as a
  reusable component first, then use it.
- Keep all timing as named constants at the top of the file (or in `constants.ts`).
- Frame-driven animation only: `useCurrentFrame()` + `interpolate()`. Use `spring()` ONLY for
  motion with physical mass — never for text.
- Apple restraint: ≤ 2 things moving at once, slow confident easing (`EASE.out`), generous
  negative space, few words per frame, align to the 8pt grid.
- Make the scene look premium as a **still** before adding motion.

After coding:
1. Render 3–5 stills across the scene:
   `bunx remotion still src/Root.tsx <CompId> out/frames/<scene>_<frame>.png --frame=N`
2. Inspect them. If any frame looks crowded, misaligned, cheap, or off-brand, fix it.
3. Run typecheck/lint if available. Report what you rendered and what you changed.
