# CLAUDE.md — CROW Marketing Video (motion-design operating system)

## Project goal

This repo produces **Apple-keynote-grade** product films for **CROW** (crowai.dev) with
Remotion + React + TypeScript. The bar is **restrained, cinematic, typography-led** motion.
It is **NOT** flashy sci-fi, neon, particle storms, starfields, lens-flare spam, or "AI slop."
Think Apple product reveal: confident, calm, expensive, lots of breathing room.

CROW = **C**ognitive **R**easoning **O**bservation **W**atcher. It unifies **Web + CCTV + Social**
signals into one behaviour model plus an AI analyst you can ask. Brand font **Sora**;
deep near-black canvas; a **single** restrained purple accent used sparingly.

## The one rule that matters

**NEVER generate a whole video in one pass.** Always work the pipeline:

1. Plan the structure → `/video-plan`
2. Lock the design system → `src/design.ts` (single source of truth)
3. Build the reusable primitives first
4. Implement **ONE** scene → `/scene-build`
5. Render **stills** + inspect → `/render-check`
6. Refine timing, spacing, hierarchy, motion
7. Only then move to the next scene

Stillness is premium. A scene must look expensive as a **frozen frame** before it's allowed to move.

## Visual style — Apple-inspired premium

**DO**
- Huge, restrained typography; few words per frame
- Minimal palette: mostly white/greys on near-black, **ONE** accent used sparingly
- Generous negative space; align everything to an 8pt grid
- Slow, confident movement; one or two things move at a time
- Clean geometric layout; soft reveal masks; subtle depth & soft shadows
- Gentle gradients and blur; cinematic pacing; high contrast; precise alignment

**AVOID**
- Neon gradients, rainbow color, glby glow on everything
- Overcrowded frames; constant full-screen motion
- Cheap bouncy/cartoon motion; meme-style transitions
- Particle fields, starfields, scanlines, heavy lens flares
- Default web-app spacing; stock-template aesthetics
- CSS @keyframes spaghetti; one-off un-reusable animation code
- Random magic frame numbers scattered across files

## Motion language

- **Frame-driven only**: `useCurrentFrame()` + `interpolate()`. Use `spring()` **only** when the
  motion needs physical mass; never for text reveals.
- **Premium easing** comes from `design.ts` (`EASE.out`, `EASE.inOut`, …). No bounce unless asked.
- Default Apple motion: gentle ease-in → confident acceleration → soft deceleration.
- Every animation must earn its place: reveal info, guide the eye, pace emotion, transition an
  idea, or simulate a camera move. If it does none of those, delete it.

## Timing

- 30fps. 16:9 = 1920×1080. Vertical = 1080×1920.
- **Name every timing constant** at the top of the scene (or in `constants.ts`). No magic numbers.
- Hold load-bearing text long enough to read it 2–3× (≥ 60 frames for key lines).

```ts
const INTRO_IN = 0;
const TITLE_REVEAL = 18;
const TITLE_HOLD = 78;
const EXIT_START = 108;
```

## File structure

```
src/
  Root.tsx                  # register compositions
  design.ts                 # SINGLE source of truth: color, type, space, easing, duration
  compositions/<Name>/
    index.tsx               # composes scenes with <Sequence>
    constants.ts            # timeline constants for this film
    scenes/*.tsx            # one file per scene
    components/*.tsx        # reusable primitives
```

Build **reusable primitives first** (before any scene): `KineticTitle`, `MaskReveal`,
`SoftGradientBackground`, `GlassPanel`, `DeviceMockup`, `CameraMove`, `SpecText`, `SceneTransition`.
Never duplicate animation logic across scenes.

## Design system — `src/design.ts`

All color, font-size, spacing, radius, easing, and duration values come from `design.ts` unless
there is a clear reason not to. Keep the palette tiny and the type scale large.

## Tooling & commands (this repo uses BUN, not npm)

- Preview studio:  `bun run preview`  (→ `bunx remotion studio src/Root.tsx`)
- Render a still:  `bunx remotion still src/Root.tsx <CompId> out/frame.png --frame=N`
- Render a video:  `bunx remotion render src/Root.tsx <CompId> out/<name>.mp4 --codec=h264 --crf=18`
- Always use `bun` / `bunx` (never `npm` / `npx`). Bun auto-loads `.env`.
- **Debug by rendering stills or short ranges**, never the whole film, until the look is locked.

## Quality bar — check before a scene is "done"

- Does a **still** frame look premium and expensive?
- Is the typography aligned, balanced, on the 8pt grid?
- Is there enough negative space?
- Is the motion slow and intentional? Are ≤ 2 things moving at once?
- Are all timings named constants? Is the code reusable / prop-driven?

If any answer is no, fix it before moving on.

## Brand & legal

- Use the real CROW logo (`public/logo.png`) and brand voice.
- **Apple-INSPIRED, never Apple impersonation**: no Apple logos, product names, or marketing copy.
- Do not invent external assets. If something is missing, use clean procedural visuals
  (typography, SVG, gradients, geometry, simple device mockups).

## References (consult — do not copy blindly)

- `remotion-dev/skills` → Remotion best practices (`useCurrentFrame`, `interpolate`, `Easing.bezier`).
- `remotion-dev/template-prompt-to-motion-graphics-saas` → constants-first design, spring physics,
  crossfade patterns, aesthetic defaults.
- Remotion docs: https://www.remotion.dev/docs

## Note on existing compositions

`CrowBoothLoop` / `CrowReel_*` / `CrowAd_*` are the **old maximalist** style and are kept only for
reference. New work targets the Apple-inspired system above; build a fresh composition rather than
extending the old ones.
