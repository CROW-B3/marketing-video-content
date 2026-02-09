import { spring, interpolate } from 'remotion';

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
};

const FPS = 30;

/**
 * Returns opacity from 0 to 1 over the given duration starting at `start`.
 */
export function fadeIn(
  frame: number,
  start: number,
  duration: number,
): number {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

/**
 * Returns opacity from 1 to 0 over the given duration starting at `start`.
 */
export function fadeOut(
  frame: number,
  start: number,
  duration: number,
): number {
  return interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

/**
 * Returns a Y offset from 60 to 0 using a spring animation,
 * creating a slide-up entrance effect.
 */
export function slideUp(
  frame: number,
  start: number,
  duration: number,
): number {
  const progress = spring({
    frame: frame - start,
    fps: FPS,
    config: SPRING_CONFIG,
    durationInFrames: duration,
  });

  return interpolate(progress, [0, 1], [60, 0]);
}

/**
 * Returns an X offset using a spring animation,
 * sliding in from the left (negative) or right (positive).
 */
export function slideIn(
  frame: number,
  start: number,
  duration: number,
  direction: 'left' | 'right',
): number {
  const progress = spring({
    frame: frame - start,
    fps: FPS,
    config: SPRING_CONFIG,
    durationInFrames: duration,
  });

  const startOffset = direction === 'left' ? -60 : 60;
  return interpolate(progress, [0, 1], [startOffset, 0]);
}

/**
 * Returns a scale value from 0.8 to 1 using a spring animation,
 * creating a scale-in entrance effect.
 */
export function scaleIn(
  frame: number,
  start: number,
  duration: number,
): number {
  const progress = spring({
    frame: frame - start,
    fps: FPS,
    config: SPRING_CONFIG,
    durationInFrames: duration,
  });

  return interpolate(progress, [0, 1], [0.8, 1]);
}
