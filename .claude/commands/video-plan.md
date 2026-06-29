---
description: Plan an Apple-inspired CROW video scene-by-scene before any code
---

Create a scene-by-scene plan for a premium, Apple-keynote-grade CROW video in this Remotion
project. Read `CLAUDE.md` and `src/design.ts` first and obey the visual style + motion rules.

Infer or ask for anything missing:
- aspect ratio (default 1920×1080) and duration
- topic / message (what one idea must land?)
- audience and context (e.g. a booth loop, a launch reel, a social cut)
- voiceover or silent; if silent, the story must read with zero audio
- brand assets to use (logo at public/logo.png; CROW purple accent)

Then return, in this order (NO code yet unless explicitly asked):
1. One-line concept and the single core message
2. Duration, aspect ratio, fps, total frames
3. Scene list — each with: name, frame range, the ONE idea, on-screen copy (few words),
   the single motion event, and which design tokens it uses
4. Visual style notes specific to this film (palette discipline, negative space)
5. Motion language (easing from design.ts, what moves and when — keep it sparse)
6. Reusable components to build first
7. Assets required (real only — no invented assets)
8. Loop/seam plan if it must loop
9. The first scene's implementation plan

Keep it restrained and premium. Stillness and space are features, not gaps.
