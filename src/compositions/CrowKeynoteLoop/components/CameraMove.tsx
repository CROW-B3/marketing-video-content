import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { EASE } from '../../../design';
import { CAM } from '../constants';

// THE camera. One continuous move shared by the whole film, so both bookends
// terminate at scale 1.000 / zero velocity = the loop rest state.
//   push-in (EASE.inOut) → apex hold → decelerating pull-back (EASE.out) → stop.
// Capped at 1.025 so the 160px safe margin is never cropped.
export function cameraScale(frame: number): number {
  if (frame <= CAM.pushStart) return CAM.rest;
  if (frame <= CAM.apexAt) {
    return interpolate(frame, [CAM.pushStart, CAM.apexAt], [CAM.rest, CAM.apex], {
      easing: EASE.inOut,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }
  if (frame <= CAM.holdUntil) return CAM.apex;
  if (frame <= CAM.pullDoneAt) {
    return interpolate(frame, [CAM.holdUntil, CAM.pullDoneAt], [CAM.apex, CAM.rest], {
      easing: EASE.out,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }
  return CAM.rest;
}

export const CameraMove: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const scale = cameraScale(frame);
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: '50% 46%' }}>
      {children}
    </AbsoluteFill>
  );
};
