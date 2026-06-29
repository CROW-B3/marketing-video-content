import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLOR, FONT, SPACE } from '../../../design';

// A quiet, frozen crowai.dev at the bottom margin so a passerby catching any
// mid-loop frame can still recover the name. Faded OUT across the lockup
// bookends so the end-card stays pure (its own url carries those frames).
export const PersistentFooter: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [60, 120, 470, 510], [0, 0.5, 0.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (opacity <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        bottom: SPACE.xl,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: FONT.family,
        fontSize: 17,
        fontWeight: 500,
        letterSpacing: 5,
        textTransform: 'uppercase',
        color: COLOR.textTertiary,
        opacity,
      }}
    >
      crowai.dev
    </div>
  );
};
