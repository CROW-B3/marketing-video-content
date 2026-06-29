import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { DUR, EASE } from '../../../design';

// The ONLY transition in the film. Opacity overlap between idea-cards — never a
// hard cut or wipe. 18f between interior beats, longer into the final lockup.
interface CrossDissolveProps {
  inAt: number;
  outAt: number;
  inLen?: number;
  outLen?: number;
  children: React.ReactNode;
}

export const CrossDissolve: React.FC<CrossDissolveProps> = ({
  inAt,
  outAt,
  inLen = DUR.sceneCross,
  outLen = DUR.sceneCross,
  children,
}) => {
  const frame = useCurrentFrame();
  const op
    = interpolate(frame, [inAt, inAt + inLen], [0, 1], { easing: EASE.out, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    * interpolate(frame, [outAt, outAt + outLen], [1, 0], { easing: EASE.in, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (op <= 0.001) return null;
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};
