// Timeline constants for CrowKeynoteLoop — NO magic numbers in scenes.
// 1920×1080 @ 30fps, exactly 1440 frames = 48.000s. Opens and closes on the
// identical motionless lockup so the loop seam is invisible. A product-demo act
// (app → type → click → behind-the-scenes data flow → answer) sits at the centre.

export const DURATION = 1500;
export const W = 1920;
export const H = 1080;

// Both ends are dead-still and pixel-identical for this many frames.
export const SEAM_HOLD = 24;

// One continuous camera for the VOID (keynote) scenes: imperceptible push-in,
// hold through the demo + watcher, decelerating pull-back to a dead stop.
// (The demo act renders above this with its own internal camera.)
export const CAM = {
  rest: 1.0,
  apex: 1.025,
  pushStart: 24,
  apexAt: 528,
  holdUntil: 1314,
  pullDoneAt: 1476,
} as const;

// Optical-center node + the three scattered signal positions (Scenes 2–3).
export const NODE = { x: 960, y: 497 } as const;
export const SIGNAL_POS = [
  { label: 'Online', x: 520, y: 372 },
  { label: 'In-store', x: 960, y: 568 },
  { label: 'Social', x: 1400, y: 744 },
] as const;

// Scene windows (global frames). Overlaps are the cross-dissolves.
export const SCENE = {
  lockupOpen: { in: 0, out: 60 },
  world: { in: 54, out: 210 },
  oneIdea: { in: 198, out: 360 },
  model: { in: 348, out: 528 },
  demo: { in: 516, len: 690, out: 1206 }, // self-contained Sequence (local frame)
  watcher: { in: 1194, out: 1326 },
  lockupClose: { in: 1314, out: 1500 },
} as const;
